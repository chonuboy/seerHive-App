import { ClientInfo, clientLocationFormValues } from "@/lib/models/client";
import { useEffect, useState } from "react";
import AddNewJob from "../Forms/jobs/AddNewJob";
import AddClientLocation from "../Forms/clients/addClientLocation";
import ClientInfoUpdateForm from "../Forms/clients/updateClientInfo";
import { Popup } from "../Elements/cards/popup";
import { Location } from "@/lib/definitions";
import { useRouter } from "next/router";
import { fetchAllClientLocations } from "@/api/client/locations";
import { Building2 } from "lucide-react";

const ClientGrid: React.FC<{
  clients: ClientInfo[];
  onUpdate: () => void;
  locations: Location[];
}> = ({ clients, onUpdate, locations }) => {
  const [allClientLocations, setAllClientLocations] = useState<
    clientLocationFormValues[]
  >([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isClientUpdated, setIsClientUpdated] = useState(false);
  const [isBranchAdded, setIsBranchAdded] = useState(false);
  const [isJobAdded, setIsJobAdded] = useState(false);
  const router = useRouter();
  const [activeClientId, setActiveClientId] = useState<number | null>(null);
  const [isHqAlreadyAvailable,setIsHqAlreadyAvailable] = useState(false);

  // Fetch all client locations on component mount
  useEffect(() => {
    fetchAllClientLocations().then((data) => {
      setAllClientLocations(data);
    });
  }, []);

  // Get headquarters location for a specific client
  const getHeadquarterLocation = (clientId: number) => {
    return allClientLocations.find(
      (location) =>
        location.client.clientId === clientId && location.isHeadQuarter
    );
  };

  const getHqStatus = (clientId: number) => {
    return allClientLocations.some(
      (location) =>
        location.client.clientId === clientId && location.isHeadQuarter
    );
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const navToClient = (clientId: number) => {
    router.push(`/clients/${clientId}`);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  if (clients.length === 0) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-10 h-10 text-teal-500">
              <Building2 className="w-10 h-10"></Building2>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Clients Added Yet!
          </h2>

          <p className="text-gray-500 mb-8">
            Create Client and it will show up here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isBranchAdded && (
        <Popup>
          <AddClientLocation
            masterLocations={locations}
            clientId={activeClientId || 1}
            autoClose={() => {
              setIsBranchAdded(false);
              onUpdate();
              setOpenDropdown(null);
            }}
            isHqAvailable={isHqAlreadyAvailable}
          />
        </Popup>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client, index) => {
          const hqLocation = getHeadquarterLocation(client.clientId);

          return (
            <div
              key={index}
              className="bg-white rounded-lg border-2 dark:bg-black  border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow"
            >
              {/* Header with person icon and name */}
              <div className="flex justify-end">
                <div
                  className="w-5 h-5 hover:text-gray-600 text-gray-400 cursor-pointer relative"
                  onClick={() => toggleDropdown(index)}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  {/* Dropdown Menu */}
                  {openDropdown === index && (
                    <div
                      className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveClientId(client.clientId)
                            setIsBranchAdded(true);
                            setOpenDropdown(null)
                            getHqStatus(client.clientId) ? setIsHqAlreadyAvailable(true) : setIsHqAlreadyAvailable(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="w-4 h-4 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>Add New Branch</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Client name with HQ location */}
              <div
                className="text-center cursor-pointer mb-4 border-0 border-b border-gray-300 pb-4"
                onClick={() => navToClient(client.clientId)}
              >
                <h3 className="text-xl font-semibold text-blue-500">
                  {client.clientName}
                </h3>
                {hqLocation ? (
                  <div className="text-sm flex items-center gap-2 justify-center text-gray-500 mt-2">
                    <div className="w-4 h-4 text-gray-400 ">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p>
                      {hqLocation.state.locationDetails}
                      {" , "}
                      {hqLocation.country.locationDetails}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">NA</p>
                )}
              </div>

              {/* Contact information */}
              <div className="space-y-3 mt-2">
                {hqLocation ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      {hqLocation.hrContactPersonEmail}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">NA</span>
                  </div>
                )}

                {hqLocation ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      {hqLocation.hrMobileNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">NA</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientGrid;
