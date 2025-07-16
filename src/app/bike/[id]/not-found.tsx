import Link from "next/link";

export default function BikeNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/bikes"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to All Bikes
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">🚲</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bike Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, the bike you're looking for doesn't exist or may have been
            removed.
          </p>

          <div className="space-y-4">
            <Link
              href="/bikes"
              className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              View All Bikes
            </Link>

            <div className="mt-4">
              <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Go to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
