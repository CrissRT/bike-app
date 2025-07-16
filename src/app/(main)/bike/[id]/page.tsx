import { getBikeById, updateBikeStatus } from "@/actions/google";
import { notFound } from "next/navigation";
import BikeForm from "@/components/BikeForm";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle } from "@fortawesome/free-solid-svg-icons";

interface BikePageProps {
  params: Promise<{ id: string }>;
}

export default async function BikePage({ params }: BikePageProps) {
  const { id } = await params;
  const bikeId = Number(id);
  const bikeResponse = await getBikeById(bikeId);

  if (!bikeResponse.success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 text-lime-800">
          <FontAwesomeIcon icon={faBicycle} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Error Loading Bike
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Failed to load bike</p>
          <p className="text-sm">{bikeResponse.error.message}</p>
        </div>
      </div>
    );
  }

  if (!bikeResponse.data) notFound();

  const bike = bikeResponse.data;
  const isActive = bike.status === "Active";

  return (
    <>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 text-lime-800">
          <FontAwesomeIcon icon={faBicycle} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bike #{bike.id}
        </h1>
        <p className="text-gray-600 mb-4">Brand: {bike.brand}</p>
        <div className="mb-6">
          <span
            className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Status: {bike.status}
          </span>
        </div>
        {isActive && bike.user && (
          <p className="text-lg text-gray-700 mb-6">
            Current User: <span className="font-semibold">{bike.user}</span>
          </p>
        )}
      </div>

      <BikeForm bike={bike} />
    </>
  );
}
