"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Container from "@/components/ui/Container";
import { useForm } from "@/hooks/useForm";
import useUserStore from "@/store/useUserStore";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { updateUserProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userProfile, setUserProfile] = useState(null);
  const [imageValidationError, setImageValidationError] = useState("");
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  // Debounced image validation
  const validateImageUrl = useCallback(async imageUrl => {
    if (!imageUrl || !imageUrl.trim()) {
      setImageValidationError("");
      setIsValidatingImage(false);
      return;
    }

    setIsValidatingImage(true);
    setImageValidationError("");

    try {
      // Quick URL format check
      const url = new URL(
        imageUrl.startsWith("http") ? imageUrl : "https://" + imageUrl,
      );

      // For now, just validate URL format and common image patterns
      // Some CDNs block direct JS access but allow img tag access
      const imagePatterns = [
        /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i, // File extensions
        /\/image\//, // CDN image paths
        /f_webp/, // WebP format parameter
        /q_\d+/, // Quality parameter
        /w_\d+/, // Width parameter
        /h_\d+/, // Height parameter
        /r_\d+/, // Resize parameter
        /placeholder/i, // Placeholder services
        /unsplash/i, // Unsplash
        /pexels/i, // Pexels
        /pixabay/i, // Pixabay
        /amazonaws/i, // AWS S3
        /cloudinary/i, // Cloudinary
        /imgur/i, // Imgur
        /gravatar/i, // Gravatar
        /leadconnectorhq/i, // LeadConnector
        /filesafe/i, // FileSafe
        /cdn\./i, // Generic CDN
      ];

      const isValidImageUrl = imagePatterns.some(pattern =>
        pattern.test(imageUrl),
      );

      if (!isValidImageUrl) {
        // Try to load the image as a fallback, but with shorter timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timeoutId);
              reject(new Error("Unable to load image"));
            };
            img.src = imageUrl;

            // Handle abort
            controller.signal.addEventListener("abort", () => {
              clearTimeout(timeoutId);
              reject(new Error("Image validation timeout"));
            });
          });
        } catch (imgError) {
          // If pattern matching failed AND image loading failed, show error
          setImageValidationError("URL doesn't appear to be a valid image");
          setIsValidatingImage(false);
          return;
        }
      }

      // If we reach here, the URL looks valid
      setImageValidationError("");
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Invalid URL")) {
        setImageValidationError("Please enter a valid URL");
      } else {
        // For other errors, just warn but don't block
        setImageValidationError(
          "URL format might be invalid, but we'll try to use it",
        );
      }
    } finally {
      setIsValidatingImage(false);
    }
  }, []);

  // Load user profile data from API
  useEffect(() => {
    async function fetchUserProfile() {
      if (!session) return;

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, [session]);

  const initialValues = useMemo(
    () => ({
      name: userProfile?.name || session?.user?.name || "",
      email: userProfile?.email || session?.user?.email || "",
      image: userProfile?.image || session?.user?.image || "",
      bio: userProfile?.bio || "",
    }),
    [userProfile, session],
  );

  const validateForm = useCallback(
    values => {
      const errors = {};

      if (!values.name.trim()) {
        errors.name = "Name is required";
      }

      if (!values.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
      }

      // Only block submission for critical image validation errors
      if (
        imageValidationError &&
        !imageValidationError.includes("might be invalid, but we'll try")
      ) {
        errors.image = imageValidationError;
      }

      return errors;
    },
    [imageValidationError],
  );

  const handleSubmit = async values => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local user profile state first
      const updatedProfile = {
        ...userProfile,
        name: values.name,
        email: values.email,
        image: values.image,
        bio: values.bio,
      };

      setUserProfile(updatedProfile);

      // Update global user store for immediate UI updates
      updateUserProfile({
        name: values.name,
        email: values.email,
        image: values.image,
        bio: values.bio,
      });

      // Update the session with the new data
      const sessionUpdateResult = await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
          image: values.image,
          bio: values.bio,
        },
      });

      // Force a session refetch to ensure consistency
      setTimeout(async () => {
        await update();
      }, 100);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.name === "AbortError") {
        setMessage({
          type: "error",
          text: "Request timeout - please try again",
        });
      } else {
        setMessage({
          type: "error",
          text: error.message || "Failed to update profile",
        });
      }
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
  } = useForm(initialValues, handleSubmit, validateForm);

  // Debounce image validation - moved after useForm to access values
  useEffect(() => {
    const timer = setTimeout(() => {
      if (values?.image && values.image !== userProfile?.image) {
        validateImageUrl(values.image);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [values?.image, userProfile?.image, validateImageUrl]);

  // Redirect to login if no session
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Container
      maxWidth="max-w-4xl"
      key={userProfile?.id || session?.user?.id || "profile"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and how it appears across the website
          builder.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
                {values.image ? (
                  <img
                    src={values.image}
                    alt={values.name || "User"}
                    className="object-cover w-full h-full"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/128?text=User";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 text-4xl font-medium">
                    {values.name ? values.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {values.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {values.email}
              </p>

              {values.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 px-6">
                  {values.bio}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Personal Information">
            {!userProfile && (
              <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                Loading profile data...
              </div>
            )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Profile Image URL"
                  name="image"
                  value={values.image}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.image && errors.image}
                  placeholder="https://example.com/your-image.jpg"
                  helperText={
                    isValidatingImage
                      ? "Validating image..."
                      : imageValidationError
                      ? imageValidationError
                      : "Leave blank to use your initials"
                  }
                />
                {isValidatingImage && (
                  <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Checking image URL...
                  </div>
                )}
                {imageValidationError &&
                  imageValidationError.includes(
                    "might be invalid, but we'll try",
                  ) && (
                    <div className="mt-2 flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Warning: {imageValidationError}
                    </div>
                  )}
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write a short bio about yourself"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading || isValidatingImage}>
                  {isValidatingImage ? "Validating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>

          <Card
            className="mt-6"
            title="Account Settings"
            description="Manage your account security settings">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Change Password
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Update your password for enhanced security
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  href="/dashboard/settings/password">
                  Change
                </Button>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  href="/dashboard/settings/2fa">
                  Setup
                </Button>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Account Data
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Download or delete your account data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  href="/dashboard/settings/data">
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
