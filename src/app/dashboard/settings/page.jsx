"use client";

import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const { data: session } = useSession();

  const settingsCategories = [
    {
      title: "Account Security",
      description: "Manage your password and security settings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m0 0v2m0-2h2m-2 0h-2m-2-7a2 2 0 11-4 0 2 2 0 014 0zM6 15a2 2 0 104 0 2 2 0 00-4 0z"
          />
        </svg>
      ),
      items: [
        {
          title: "Change Password",
          description: "Update your account password",
          href: "/dashboard/settings/password",
          action: "Manage",
        },
      ],
    },
    {
      title: "Profile & Preferences",
      description: "Customize your profile and platform preferences",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      items: [
        {
          title: "Profile Information",
          description: "Update your name, bio, and profile picture",
          href: "/dashboard/profile",
          action: "Edit",
        },
      ],
    },
    {
      title: "Templates & Privacy",
      description: "Manage your template sharing and privacy settings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
      items: [
        {
          title: "My Templates",
          description: "Manage your shared templates and their visibility",
          href: "/dashboard/templates?tab=my-templates",
          action: "View",
        },
      ],
    },
    {
      title: "Account Management",
      description: "Advanced account options and data management",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      items: [
        {
          title: "Account Overview",
          description: "View account statistics and usage",
          action: "Coming Soon",
          disabled: true,
        },
        {
          title: "Export Data",
          description: "Download your websites and data",
          action: "Coming Soon",
          disabled: true,
        },
      ],
    },
  ];

  return (
    <Container maxWidth="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Info Summary */}
      {session && (
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {session.user.email}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {session.user.name || "Not set"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Account Type:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">Free</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Member Since:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(
                    session.user.createdAt || Date.now(),
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-8">
        {settingsCategories.map((category, index) => (
          <Card key={index}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-[rgb(var(--primary))] mr-3">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <div>
                      {item.href ? (
                        <Button href={item.href} variant="outline" size="sm">
                          {item.action}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={item.disabled}>
                          {item.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
