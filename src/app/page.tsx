import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4 text-lime-800">
              <FontAwesomeIcon icon={faBicycle} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bike Rental System
            </h1>
            <p className="text-gray-600">
              Manage your bike rental operations with ease
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/bikes"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors block"
            >
              View All Bikes
            </Link>

            <div className="text-sm text-gray-500">
              Click above to see all bikes and manage their status
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
