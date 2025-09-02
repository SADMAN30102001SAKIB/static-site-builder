"use client";

export default function PlanBadge({ plan, className = "" }) {
  const getBadgeStyles = plan => {
    switch (plan) {
      case "PRO":
        return "bg-gradient-to-r from-purple-500 to-blue-500 text-white";
      case "FREE":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPlanLabel = plan => {
    switch (plan) {
      case "PRO":
        return "Pro";
      case "FREE":
      default:
        return "Free";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(
        plan,
      )} ${className}`}>
      {getPlanLabel(plan)}
      {plan === "PRO" && (
        <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </span>
  );
}
