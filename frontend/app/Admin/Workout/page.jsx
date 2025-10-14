"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new workout management page
    router.push("/Admin/WorkoutManagement");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to Workout Management...</p>
      </div>
    </div>
  );
}