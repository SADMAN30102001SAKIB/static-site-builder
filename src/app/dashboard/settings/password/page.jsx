"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Container from "@/components/ui/Container";
import { useForm } from "@/hooks/useForm";

export default function PasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validateForm = values => {
    const errors = {};

    if (!values.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!values.newPassword) {
      errors.newPassword = "New password is required";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters long";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async values => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setMessage({
        type: "success",
        text: "Password updated successfully!",
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    resetForm,
  } = useForm(initialValues, handleSubmit, validateForm);

  return (
    <Container maxWidth="max-w-2xl">
      <div className="mb-8">
        <Button
          href="/dashboard/profile"
          variant="ghost"
          size="sm"
          className="mb-4">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your password to keep your account secure.
        </p>
      </div>

      <Card>
        <form onSubmit={e => submitForm(e)} className="space-y-6">
          {message.text && (
            <div
              className={`rounded-md p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}>
              <p>{message.text}</p>
            </div>
          )}

          <div>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentPassword && errors.currentPassword}
              required
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword && errors.newPassword}
              required
              placeholder="Enter your new password"
              helperText="Password must be at least 6 characters long"
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && errors.confirmPassword}
              required
              placeholder="Confirm your new password"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard/profile")}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
