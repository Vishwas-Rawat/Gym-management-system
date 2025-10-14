"use client";

import { useAuth } from "../LoginAndReg/Context/page";

export default function DebugUser() {
  const { userData, isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Is Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
          </div>
          
          <div>
            <strong>User Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Role:</strong> {userData?.role || "Not set"}
          </div>
          
          <div>
            <strong>Role Type:</strong> {typeof userData?.role}
          </div>
          
          <div>
            <strong>Role Check (=== "ADMIN"):</strong> {userData?.role === "ADMIN" ? "True" : "False"}
          </div>
          
          <div>
            <strong>Role Check (=== "USER"):</strong> {userData?.role === "USER" ? "True" : "False"}
          </div>
        </div>
      </div>
    </div>
  );
}
