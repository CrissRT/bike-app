"use client";

import {
  faBicycle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6 text-red-600">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Something went wrong!
              </h1>

              <p className="text-gray-600 mb-6">
                An unexpected error occurred in the bike rental system. Don't
                worry, we're working to fix it.
              </p>

              {error.digest && (
                <div className="bg-gray-100 p-3 rounded-lg mb-6 text-sm text-gray-700">
                  <strong>Error ID:</strong> {error.digest}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>

                <a
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors block"
                >
                  <FontAwesomeIcon icon={faBicycle} className="mr-2" />
                  Go to Home Page
                </a>

                <a
                  href="/bikes"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors block"
                >
                  View All Bikes
                </a>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>If this problem persists, please contact support.</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
