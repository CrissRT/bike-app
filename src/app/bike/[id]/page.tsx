import Link from "next/link";
import { getBikeById, updateBikeStatus } from "@/actions/google";
import { redirect } from "next/navigation";

interface BikePageProps {
  params: { id: string };
}

async function handleUpdateBike(formData: FormData) {
  "use server";

  const bikeId = Number(formData.get("bikeId"));
  const currentStatus = String(formData.get("currentStatus"));
  const userName = String(formData.get("userName"));

  if (currentStatus === "Active")
    await updateBikeStatus(bikeId, "Inactive", "");
  else {
    const trimmedUserName = userName.trim();
    if (!trimmedUserName)
      throw new Error("User name is required to activate bike");

    await updateBikeStatus(bikeId, "Active", trimmedUserName);
  }

  redirect(`/bike/${bikeId}`);
}

export default async function BikePage({ params }: BikePageProps) {
  const bikeId = Number(params.id);
  const bike = await getBikeById(bikeId);

  if (!bike) {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Bike Not Found
            </h1>
            <p className="text-gray-600">
              The bike with ID {bikeId} was not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = bike.status === "Active";

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

        <div className="bg-white rounded-xl shadow-lg p-8">
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

          <form action={handleUpdateBike} className="space-y-6">
            <input type="hidden" name="bikeId" value={bike.id} />
            <input type="hidden" name="currentStatus" value={bike.status} />

            {isActive ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  This bike is currently active and assigned to {bike.user}.
                  Click below to return the bike and set it as inactive.
                </p>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors hover:cursor-pointer"
                >
                  Set Inactive (Return Bike)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter user name"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors hover:cursor-pointer"
                  >
                    Set Active (Assign Bike)
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
