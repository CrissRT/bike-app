import { getBikeById, updateBikeStatus } from "@/actions/google";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import BikeForm from "@/components/BikeForm";

interface BikePageProps {
  params: Promise<{ id: string }>;
}

async function handleUpdateBike(formData: FormData) {
  "use server";

  const bikeId = Number(formData.get("bikeId"));
  const currentStatus = String(formData.get("currentStatus"));
  const userName = String(formData.get("userName"));

  if (currentStatus === "Active") {
    await updateBikeStatus(bikeId, "Inactive", "");
  } else {
    const trimmedUserName = userName.trim();
    if (!trimmedUserName)
      throw new Error("User name is required to activate bike");

    await updateBikeStatus(bikeId, "Active", trimmedUserName);
  }

  // Revalidate the current page to refresh the data
  revalidatePath(`/bike/${bikeId}`);
}

export default async function BikePage({ params }: BikePageProps) {
  const { id } = await params;
  const bikeId = Number(id);
  const bike = await getBikeById(bikeId);

  if (!bike) notFound();

  const isActive = bike.status === "Active";

  return (
    <>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🚲</div>
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

      <BikeForm bike={bike} handleUpdateBike={handleUpdateBike} />
    </>
  );
}
