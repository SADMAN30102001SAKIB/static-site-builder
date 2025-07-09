import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl text-[rgb(var(--primary))]">
            WebsiteBuilder
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-gray-600 dark:text-gray-300 hover:text-[rgb(var(--primary))]">
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-[rgb(var(--primary))]">
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-gray-600 dark:text-gray-300 hover:text-[rgb(var(--primary))]">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-[rgb(var(--primary))] font-medium hover:text-[rgb(var(--primary-light))]">
                Dashboard
              </Link>
              <Link
                href="/dashboard/websites/new"
                className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-4 py-2 rounded-md font-medium transition-colors">
                Create Website
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[rgb(var(--primary))] font-medium hover:text-[rgb(var(--primary-light))]">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-4 py-2 rounded-md font-medium transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-28 px-6 md:px-12 bg-gradient-to-b from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Create beautiful websites{" "}
              <span className="text-[rgb(var(--primary))]">without code</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Our drag-and-drop website builder makes it easy for anyone to
              create professional-looking websites in minutes, no technical
              skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-6 py-3 rounded-md font-medium text-center transition-colors">
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/dashboard/websites/new"
                    className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-md font-medium text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Create New Website
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-6 py-3 rounded-md font-medium text-center transition-colors">
                    Start Building For Free
                  </Link>
                  <Link
                    href="#features"
                    className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-md font-medium text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <div className="relative w-full aspect-[16/10]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg w-11/12">
                  <div className="bg-gray-100 dark:bg-gray-700 h-8 w-full rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-200 dark:bg-gray-600 h-32 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-600 h-32 rounded"></div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-600 h-24 w-full rounded mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to build beautiful websites without any
              technical knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[rgb(var(--primary))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Drag-and-Drop Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create websites visually by dragging and dropping components
                exactly where you want them.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Styling</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Customize colors, fonts, and layouts with an intuitive interface
                designed for non-designers.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[rgb(var(--secondary))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Form Builder</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create custom forms to collect information, feedback, or leads
                from your website visitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 px-6 md:px-12 bg-[rgb(var(--primary))] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {session
              ? "Ready to create your next website?"
              : "Ready to build your website?"}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {session
              ? "Continue building amazing websites with our powerful drag-and-drop editor."
              : "Join thousands of users creating beautiful websites without writing a single line of code."}
          </p>
          <Link
            href={session ? "/dashboard/websites/new" : "/register"}
            className="bg-white text-[rgb(var(--primary))] hover:bg-gray-100 px-8 py-3 rounded-md font-semibold inline-block transition-colors">
            {session ? "Create New Website" : "Get Started For Free"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 bg-gray-100 dark:bg-gray-900 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-xl text-[rgb(var(--primary))] mb-4">
              WebsiteBuilder
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              The easiest way to build professional websites without code.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Templates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          {new Date().getFullYear()} WebsiteBuilder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
