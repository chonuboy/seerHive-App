import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  ChevronDown,
  CreditCard,
  Edit3,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import JobCard from "@/components/Elements/cards/jobCard";
import ClientCard from "@/components/Elements/cards/clientCard";
import { fetchJobsByClient } from "@/api/client/clientJob";
import { Popup } from "@/components/Elements/cards/popup";
import { AddJob } from "@/components/Forms/jobs/addJob";
import { fetchClient } from "@/api/master/clients";
import { fetchAllClientLocations } from "@/api/client/locations";
import AddClientLocation from "@/components/Forms/clients/addClientLocation";
import UpdateClientLocation from "@/components/Forms/clients/updateClientBranch";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { Location } from "@/lib/definitions";
import AddNewJob from "@/components/Forms/jobs/AddNewJob";
import { clientLocationFormValues } from "@/lib/models/client";

export default function Client() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState([]);
  const [isAddJob, setIsAddJob] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [newJobId, setNewJobId] = useState(0);
  const [currentClientLocations, setCurrentClientLocations] = useState<any[]>(
    []
  );
  const [isJobUpdated, setIsJobUpdated] = useState(false);
  const [masterLocations, setMasterLocations] = useState<Location[]>([]);
  const [expandedLocation, setExpandedLocation] = useState<number | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isBranch, setIsBranch] = useState(false);
  const [hqInfo, setHqInfo] = useState([]);
  const [activeTab, setActiveTab] = useState("branches");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null
  );
  const [isHqPresented, setHqPresented] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const id = Number(router.query.id);
      fetchJobsByClient(id).then((data) => {
        console.log(data);
        setAllJobs(data);
        if (data.length > 0) {
          setNewJobId(data[data.length - 1].jobId + 1);
        }
      });
      const user = localStorage.getItem("user");
      setUser(user);

      fetchClient(id).then((data) => {
        setCurrentClient(data);
      });

      fetchAllClientLocations().then((data) => {
        if (data.length > 0 && data[0].client.clientId) {
          const filteredLocations = data.filter(
            (location: any) => location.client.clientId === id
          );
          console.log(filteredLocations);
          const filteredHq = filteredLocations.filter(
            (location: any) => location.isHeadQuarter
          );
          const hqAvailable = filteredLocations.some(
            (location: any) => location.isHeadQuarter
          );
          setHqPresented(hqAvailable);
          setHqInfo(filteredHq);
          setCurrentClientLocations(filteredLocations);
        }
      });
      fetchAllLocations().then((data) => {
        setMasterLocations(data);
      });
    }
  }, [
    router.isReady,
    isAddJob,
    isBranch,
    isJobUpdated,
    isAddJob,
    editingLocationId,
  ]);

  const fetchJobs = async () => {
    try {
      if (router.isReady) {
        fetchJobsByClient(Number(router.query.id)).then((data) => {
          setAllJobs(data);
          if (data.length > 0) {
            setNewJobId(data[data.length - 1].jobId + 1);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout>
      <div className="space-y-2">
        {router.isReady && (
          <ClientCard hqInfo={hqInfo} id={Number(router.query.id)} />
        )}

        <div className="bg-white border border-gray-200">
          <div className="">
            <nav className="flex space-x-8">
              <button
                onClick={() => onTabChange("branches")}
                className={`py-2 px-1 border-b-4 font-medium text-sm ${
                  activeTab === "branches"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Branches
              </button>
              <button
                onClick={() => onTabChange("jobs")}
                className={`py-2 px-1 border-b-4 font-medium text-sm ${
                  activeTab === "jobs"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Jobs
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "branches" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Branches</h2>
                <button
                  className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap"
                  onClick={() => setIsBranch(true)}
                >
                  Add Branch
                </button>
              </div>
              {isBranch && (
                <AddClientLocation
                  isHqAvailable = {isHqPresented}
                  masterLocations={masterLocations}
                  autoClose={() => setIsBranch(false)}
                  clientId={Number(router.query.id)}
                ></AddClientLocation>
              )}
              <div className="space-y-2 text-xs md:text-base">
                {currentClientLocations && currentClientLocations.length > 0 ? (
                  currentClientLocations
                    .sort((a, b) => {
                      // Put HQ locations first (sort in descending order of isHeadQuarter)
                      return b.isHeadQuarter - a.isHeadQuarter;
                    })
                    .map((city: any, index: number) => (
                      <div
                        key={index}
                        className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-lg bg-white"
                      >
                        {/* Card Header with blue gradient */}
                        <div className="bg-cyan-500 text-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-white/20 p-3 rounded-full">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <div className="flex items-center text-white">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span className="text-xl font-semibold">
                                      {city.address1}
                                    </span>
                                  </div>
                                  {city.isHeadQuarter && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                                      HQ
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-blue-100">
                                  {city.state.locationDetails ?? "No Data"},{" "}
                                  {city?.country?.locationDetails ?? "No Data"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                className="inline-flex items-center px-3 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-offset-2 transition-colors duration-200"
                                onClick={() =>
                                  setEditingLocationId(city.clientLocationId)
                                }
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-offset-2 transition-colors duration-200"
                                onClick={() =>
                                  setExpandedLocation(
                                    expandedLocation === city.clientLocationId
                                      ? null
                                      : city.clientLocationId
                                  )
                                }
                              >
                                <ChevronDown
                                  className={`h-5 w-5 transition-transform duration-200 ${
                                    expandedLocation === city.clientLocationId
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            expandedLocation === city.clientLocationId
                              ? "max-h-96"
                              : "max-h-0"
                          }`}
                        >
                          <div className="p-6 bg-white">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* HR Information */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center">
                                  <User className="h-4 w-4 mr-2 text-green-600" />
                                  HR Department
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <User className="h-3 w-3 mr-2" />
                                    {city.hrContactPerson}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Mail className="h-3 w-3 mr-2" />
                                    {city.hrContactPersonEmail}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Phone className="h-3 w-3 mr-2" />
                                    {city.hrMobileNumber}
                                  </div>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                      <Phone className="h-3 w-3 mr-2" />
                                      {city.companyLandline}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Finance Information */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                                  Finance Department
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {city.financePocName && (
                                    <div className="flex items-center text-gray-600">
                                      <User className="h-3 w-3 mr-2" />
                                      {city.financePocName}
                                    </div>
                                  )}
                                  {city.financeEmail && (
                                    <div className="flex items-center text-gray-600">
                                      <Mail className="h-3 w-3 mr-2" />
                                      {city.financeEmail}
                                    </div>
                                  )}
                                  {city.financeNumber && (
                                    <div className="flex items-center text-gray-600">
                                      <Phone className="h-3 w-3 mr-2" />
                                      {city.financeNumber}
                                    </div>
                                  )}
                                  {city.gstnumber && (
                                    <div className="flex items-center text-gray-600">
                                      <CreditCard className="h-3 w-3 mr-2" />
                                      {city.gstnumber}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Edit Popup */}
                        {editingLocationId === city.clientLocationId && (
                          <Popup>
                            <UpdateClientLocation
                              currentClientLocation={city}
                              masterLocations={masterLocations}
                              autoClose={() => setEditingLocationId(null)}
                              locationId={city.clientLocationId}
                            />
                          </Popup>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                    <div className="mb-6">
                      <MapPin className="w-20 h-20 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                      No Branches Added Yet !
                    </h2>
                    <p className="text-base text-[#888888] text-center">
                      Create New branches and they will show up here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div>
            <div className="flex items-center justify-between text-xs md:text-base">
              <h3 className="text-lg font-semibold">Active Jobs</h3>
              <button
                className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap"
                onClick={() => setIsAddJob(true)}
              >
                Add Job
              </button>
              {isAddJob && (
                <Popup>
                  <AddNewJob
                    client={currentClient}
                    autoClose={() => setIsAddJob(false)}
                  ></AddNewJob>
                </Popup>
              )}
            </div>

            <div
              className={
                allJobs?.length > 0
                  ? "grid grid-cols-1 text-xs md:text-base md:grid-cols-3 gap-6 mt-4"
                  : "py-2"
              }
            >
              {allJobs && allJobs?.length > 0 ? (
                allJobs.map((job, index) => (
                  <JobCard onUpdate={fetchJobs} job={job} key={index} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center my-4">
                    <div className="rounded-full flex items-center justify-center">
                      <Briefcase className="w-20 h-20 text-cyan-500 font-semibold" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    No Jobs Found
                  </h2>
                  <p className="text-gray-500 text-center mb-8 max-w-sm">
                    Create a job, and it will show up here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
