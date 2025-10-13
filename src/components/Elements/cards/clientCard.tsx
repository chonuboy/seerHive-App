import type { ClientInfo } from "@/lib/models/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Popup } from "./popup";
import { fetchClient } from "@/api/master/clients";
import ClientInfoUpdateForm from "@/components/Forms/clients/updateClientInfo";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { Location } from "@/lib/definitions";
import { ArrowBigLeftDashIcon } from "lucide-react";

export default function ClientCard({
  id,
  hqInfo,
}: {
  id: number;
  hqInfo?: any;
}) {
  const router = useRouter();
  const [currentClient, setCurrentClient] = useState<ClientInfo | null>(null);
  const [isclientUpdated, setIsClientUpdated] = useState(false);
  const [masterLocations, setMasterLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchClient(id).then((res) => {
      setCurrentClient(res);
    });
    fetchAllLocations().then((data) => {
      setMasterLocations(data);
    });
  }, [isclientUpdated]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-2 py-6 shadow-sm">
      <div
        className="flex items-center gap-2 pb-6 text-xl text-cyan-500 cursor-pointer hover:text-cyan-600"
        onClick={() => router.back()}
      >
        <ArrowBigLeftDashIcon className="w-6 h-6" />
        <button className="border-b">Back to Previous Page</button>
      </div>
      {/* Header Section */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentClient?.clientName}
          </h1>
          {hqInfo && hqInfo.length > 0 && (
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">
                {hqInfo[0].state.locationDetails}
                {" , "}
                {hqInfo[0].country.locationDetails}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsClientUpdated(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md w-36 h-10 font-medium flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 ml-7 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>

        {isclientUpdated && (
          <Popup>
            <ClientInfoUpdateForm
              currentClient={currentClient}
              id={id}
              autoClose={() => setIsClientUpdated(false)}
            />
          </Popup>
        )}
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Billing Details */}
        <div>
          <h3 className="text-md font-semibold text-cyan-500 mb-4">
            Billing Details
          </h3>
          <div className="space-y-3">
            {currentClient?.cinnumber && (
              <div className="flex items-center text-gray-700">
                <span className="text-sm font-semibold w-10">CIN :</span>
                <span className="text-sm ml-2">{currentClient?.cinnumber}</span>
              </div>
            )}
            {currentClient?.pannumber && (
              <div className="flex items-center text-gray-700">
                <span className="text-sm font-semibold w-10">PAN :</span>
                <span className="text-sm ml-2">{currentClient?.pannumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
