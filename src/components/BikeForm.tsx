"use client";

import { useFormStatus } from "react-dom";

interface BikeFormProps {
  bike: {
    id: number;
    status: "Active" | "Inactive";
    user: string;
  };
  handleUpdateBike: (formData: FormData) => Promise<void>;
}

function SubmitButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();

  if (isActive) {
    return (
      <button
        type="submit"
        disabled={pending}
        className={`font-semibold py-3 px-8 rounded-lg transition-colors ${
          pending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 hover:cursor-pointer"
        } text-white`}
      >
        {pending ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Returning Bike...
          </span>
        ) : (
          "Set Inactive (Return Bike)"
        )}
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`font-semibold py-3 px-8 rounded-lg transition-colors ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 hover:cursor-pointer"
      } text-white`}
    >
      {pending ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Assigning Bike...
        </span>
      ) : (
        "Set Active (Assign Bike)"
      )}
    </button>
  );
}

export default function BikeForm({ bike, handleUpdateBike }: BikeFormProps) {
  const isActive = bike.status === "Active";

  return (
    <form action={handleUpdateBike} className="space-y-6">
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
              required
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
