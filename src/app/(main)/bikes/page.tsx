import Link from "next/link";
import { getAllBikes } from "@/actions/google";
import { Bike } from "@/types/bike";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle } from "@fortawesome/free-solid-svg-icons";

export default async function BikesPage() {
  const bikesResponse = await getAllBikes();

  if (!bikesResponse.success) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          <span className="text-lime-800">
            <FontAwesomeIcon icon={faBicycle} />
          </span>{" "}
          All Bikes
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Error loading bikes</p>
          <p className="text-sm">{bikesResponse.error.message}</p>
        </div>
      </div>
    );
  }

  const bikes = bikesResponse.data;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        <span className="text-lime-800">
          <FontAwesomeIcon icon={faBicycle} />
        </span>{" "}
        All Bikes
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
                  <div className="text-4xl mb-3 text-lime-800">
                    <FontAwesomeIcon icon={faBicycle} />
                  </div>
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
                    <p className="text-sm text-gray-500">User: {bike.user}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
