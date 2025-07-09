"use client";

import { useState, useCallback, useEffect } from "react";

export function useForm(initialValues = {}, onSubmit, validateForm) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update values when initialValues change
  useEffect(() => {
    // Only update if initialValues is not empty and actually different
    const hasInitialValues = Object.values(initialValues).some(
      value => value !== "",
    );
    if (hasInitialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === "checkbox" ? checked : value;

      setValues(prev => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(e => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateField = useCallback(
    (name, value) => {
      if (!validateForm) return "";

      const validationErrors = validateForm({
        ...values,
        [name]: value,
      });

      return validationErrors[name] || "";
    },
    [validateForm, values],
  );

  const handleSubmit = useCallback(
    async e => {
      e?.preventDefault();

      // If we have a validation function, run it
      let formErrors = {};
      if (validateForm) {
        formErrors = validateForm(values);
      }

      setErrors(formErrors);

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});

      setTouched(allTouched);

      // If we have errors, don't submit
      if (Object.keys(formErrors).length > 0) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit],
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
  };
}
