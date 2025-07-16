import { faBicycle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function BikeNotFound() {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6 text-lime-800">
        <FontAwesomeIcon icon={faBicycle} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Bike Not Found</h1>
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
  );
}
