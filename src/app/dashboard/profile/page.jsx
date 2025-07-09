"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Container from "@/components/ui/Container";
import { useForm } from "@/hooks/useForm";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userProfile, setUserProfile] = useState(null);

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

  const validateForm = values => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = "Name is required";
    }

    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (
      values.image &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        values.image,
      )
    ) {
      errors.image = "Image URL is invalid";
    }

    return errors;
  };

  const handleSubmit = async values => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
          image: values.image,
          bio: values.bio,
        },
      });

      // Update local user profile state
      const updatedProfile = {
        ...userProfile,
        name: values.name,
        email: values.email,
        image: values.image,
        bio: values.bio,
      };

      setUserProfile(updatedProfile);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
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
  } = useForm(initialValues, handleSubmit, validateForm);

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
                  helperText="Leave blank to use your initials"
                />
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
                  disabled={isLoading}>
                  Save Changes
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
