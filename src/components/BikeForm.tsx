"use client";

import { updateBikeStatus } from "@/actions/google";
import { SubmitButton } from "./SubmitButton";
import { toast } from "react-toastify";

interface Props {
  bike: {
    id: number;
    status: "Active" | "Inactive";
    user: string;
  };
}

export default function BikeForm({ bike }: Props) {
  const isActive = bike.status === "Active";

  const handleUpdateBikeStatus = async (formData: FormData) => {
    const response = await updateBikeStatus(formData);

    if (!response.success) {
      toast.error(response.error.message || "Failed to update bike status");
      return;
    }
  };

  return (
    <form action={handleUpdateBikeStatus} className="space-y-6">
      <input type="hidden" name="bikeId" value={bike.id} />
      <input type="hidden" name="currentStatus" value={bike.status} />

      {isActive ? (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            This bike is currently active and assigned to {bike.user}. Click
            below to return the bike and set it as inactive.
          </p>
          <SubmitButton isActive={isActive} />
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
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter user name"
            />
          </div>
          <div className="text-center">
            <SubmitButton isActive={isActive} />
          </div>
        </div>
      )}
    </form>
  );
}
