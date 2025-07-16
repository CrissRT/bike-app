import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">🚲</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors block"
            >
              Go to Home Page
            </Link>

            <Link
              href="/bikes"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors block"
            >
              View All Bikes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
