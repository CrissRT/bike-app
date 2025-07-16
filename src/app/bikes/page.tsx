import Link from "next/link";
import { getAllBikes } from "@/actions/google";
import { Bike } from "@/types/bike";

export default async function BikesPage() {
  const bikes = await getAllBikes();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🚲 All Bikes
          </h1>

          {bikes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bikes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bikes.map((bike: Bike) => (
                <Link key={bike.id} href={`/bike/${bike.id}`} className="group">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🚲</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Bike #{bike.id}
                      </h3>
                      <p className="text-gray-600 mb-3">Brand: {bike.brand}</p>
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            bike.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {bike.status}
                        </span>
                      </div>
                      {bike.status === "Active" && bike.user && (
                        <p className="text-sm text-gray-500">
                          User: {bike.user}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
