import { useEffect, useState } from "react";
import {
  Calendar,
  Briefcase,
  User,
  DollarSign,
  FileText,
  Tag,
  Clock,
  IndianRupee,
  Ribbon,
  Route,
  CalendarClock,
  Timer,
} from "lucide-react";
import JobInfoUpdateForm from "@/components/Forms/jobs/updateJobInfo";
import { Popup } from "./popup";
import { useRouter } from "next/router";
import { fetchAllJobs, fetchJobDescription } from "@/api/client/clientJob";
import mammoth from "mammoth";
import { fetchCandidateResume } from "@/api/candidates/candidates";
import JobDescriptionUploader from "@/components/Forms/jobs/jdUploader";
import { JobDescription } from "./jobDescription";
import { createContactInterview } from "@/api/candidates/interviews";
import { toast } from "react-toastify";

interface Job {
  client?: any;
  createdOn: string;
  maximumExperience: number;
  minimumExperience: number;
  insertedBy: string;
  isJobActive: string;
  preferredJobMode: string;
  jd: string;
  jobCode: string;
  jobDescription: string | null;
  jobId: number;
  jobPostType: string;
  jobTitle: string;
  postCreatedOn: string | null;
  salaryInCtc: number;
  locations: string[];
}

export default function JobCard({
  job,
  onUpdate,
  isClient,
}: {
  job: Job;
  onUpdate?: () => void;
  isClient?: boolean;
}) {
  const [showJdModal, setShowJdModal] = useState(false);
  const [isJobUpdated, setIsJobUpdated] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isJdUpdated, setJdUpdated] = useState(false);
  const [isJdopen, setIsJdopen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [contactId, setContactId] = useState(0);
  const [showUpdateJd, setShowUpdateJd] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      fetchAllJobs(0, 12).then((data) => {
        setAllJobs(data.content);
      });
      const candidateId = localStorage.getItem("interviewCandidateId");
      setContactId(Number(candidateId));
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
      });
    }
  }, []);

  const handleAssignJob = (jobId: number) => {
    try {
      createContactInterview({
        clientJob: {
          jobId: jobId,
        },
        contactDetails: {
          contactId: contactId,
        },
        interviewDate: new Date().toISOString().split("T")[0],
      }).then((data) => {
        if (
          data.message ===
          "The combination of contact ID and jobId ID already exists."
        ) {
          toast.error("Candidate already shortlisted for this Job", {
            position: "top-right",
          });
        } else {
          console.log(data);
          toast.success("Candidate Shortlisted successfully", {
            position: "top-right",
          });
          setTimeout(() => {
            router.push({
              pathname: `/candidates/${contactId}/interviews/${jobId}`,
              query: { contactInterViewId: data.interviewId },
            });
          }, 1000);
        }
      });
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
      });
    }
  };

  const loadPdf = async (jd: any, jobId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;

    setShowJdModal(true);
    try {
      pdfData = await fetchJobDescription(jobId)
        .then((response) => response)
        .catch((error) => console.error(error));

      if (jd.includes("pdf")) {
        const blob = new Blob([pdfData], { type: "application/pdf" });

        // Create a URL for the Blob
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setError(null);
      } else if (jd.includes("docx")) {
        setPdfData(pdfData);
        mammoth
          .convertToHtml({ arrayBuffer: pdfData })
          .then((result) => {
            // Create HTML from the DOCX content
            const html = result.value;
            const blob = new Blob([html], { type: "text/html" });
            objectUrl = URL.createObjectURL(blob);
            setPdfUrl(objectUrl);
          })
          .catch((err) => {
            setError("Failed to render DOCX file");
          });
      }
    } catch (err) {
      console.error("Failed to load PDF:", err);
      setError("Failed to load resume. Please try again.");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500";
      case "closed":
        return "text-red-500";
      case "onhold":
        return "text-yellow-400";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleJdUpdateSuccess = () => {
    setShowUpdateJd(false);
    setShowJdModal(false);
    setPdfUrl(""); // Clear the current PDF URL to force reload
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className="bg-white dark:bg-black dark:text-white rounded-lg">
      <div className="bg-white border border-gray-400 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-200 w-full">
        {/* Header with status and menu */}
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full bg-${
                job.isJobActive === "Active"
                  ? "green-500"
                  : job.isJobActive === "OnHold"
                  ? "yellow-400"
                  : "red-500"
              }`}
            ></div>

            <span
              className={`px-3 py-1 rounded-md font-medium ${getStatusBadgeColor(
                job.isJobActive
              )}`}
            >
              {job.isJobActive}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  {!isClient && (
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsJobUpdated(true)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400"
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
                  )}

                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      loadPdf(job.jd, job.jobId);
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Job description
                  </button>
                  {isJdopen && !isClient && (
                    <Popup
                      onClose={() => setIsJdopen(false)}
                      styleMod="-left-4"
                    >
                      <div className="mt-20 mr-4">
                        <JobDescription currentJob={job} />
                      </div>
                    </Popup>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Type (Part-Time/Full-Time) - only show if different from jobPostType */}
        {job.jobPostType === "Part Time" && (
          <div className="text-sm text-gray-500 mb-2">Part-Time</div>
        )}

        {/* Job Code */}
        <div className="text-md text-blue-500 my-3">#{job.jobCode}</div>

        {/* Job Title */}
        <h3
          className="text-2xl block font-semibold text-gray-900 mb-2 cursor-pointer leading-tight"
          onClick={() => {
            router.push(`/jobs/${job.jobId}`);
          }}
        >
          {job.jobTitle}
        </h3>

        <span className="mb-4 text-cyan-500 font-semibold">
          {job.client?.clientName}
        </span>

        {/* Salary */}
        <div
          className="text-md font-medium my-2 flex items-center cursor-pointer"
          onClick={() => {
            router.push(`/jobs/${job.jobId}`);
          }}
        >
          <IndianRupee className="h-5 w-5 mr-1 -ml-1 dark:text-white" />
          {job.salaryInCtc} LPA
        </div>

        {/* Job Details */}
        <div
          className="flex items-center gap-1 text-md cursor-pointer mb-6"
          onClick={() => {
            router.push(`/jobs/${job.jobId}`);
          }}
        >
          <div className="flex items-center">
            <Route className="w-4 h-4 mr-1 text-gray-400"></Route>
            <span>{job.jobPostType}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center">
            <CalendarClock className="w-4 h-4 mr-1 text-gray-400"></CalendarClock>
            <span>{job.preferredJobMode ?? "NA"}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center">
            <Timer className="w-4 h-4 mr-1 text-gray-400"></Timer>
            <span>
              {job.minimumExperience} - {job.maximumExperience} Yrs
            </span>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push(`/jobs/${job.jobId}`);
          }}
        >
          <div className="text-sm text-gray-800 border-b pb-3 border-gray-300">
            Posted by {job.insertedBy} · {formatDate(job.createdOn)}
          </div>
          <div className="text-base text-gray-900 mt-2 flex items-center font-medium">
            <svg
              className="w-4 h-4 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {job.locations && job.locations.length > 0
              ? job.locations
                  .map((location: any) => location.locationDetails)
                  .join(" , ")
              : "No Data"}
          </div>
        </div>
        {isClient && (
          <div className="flex mt-4 justify-end">
            <button
              className="bg-cyan-500 text-white px-4 py-1 rounded-md"
              onClick={() => {
                handleAssignJob(job.jobId);
              }}
            >
              Shortlist
            </button>
          </div>
        )}
      </div>

      {isJdUpdated && (
        <Popup onClose={() => setJdUpdated(false)}>
          <JobDescriptionUploader jobId={Number(router.query.id)} />
        </Popup>
      )}

      {isJobUpdated && (
        <Popup>
          <JobInfoUpdateForm
            currentJob={job}
            id={job.jobId}
            autoClose={() => {
              setIsJobUpdated(false);
              if (onUpdate) {
                onUpdate();
              }
            }}
          />
        </Popup>
      )}

      {/* JD Modal */}
      {showJdModal && (
        <Popup onClose={() => setShowJdModal(false)}>
          <div className="relative w-full h-full">
            {/* Header with Update Button */}
            <div className="absolute top-4 right-4 z-10">
              {!isClient && (
                <button
                  onClick={() => setShowUpdateJd(true)}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
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
                  Update JD
                </button>
              )}
            </div>
            
            {/* PDF Content */}
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  backgroundColor: "white",
                  overflow: "auto",
                  padding: "20px",
                  marginTop: "60px",
                }}
                title="jd"
              />
            )}
            
            {!pdfUrl && (
              <div className="mt-20 text-center text-gray-500">
                No Job Description available
              </div>
            )}
          </div>
        </Popup>
      )}

      {/* Update JD Modal */}
      {showUpdateJd && (
        <Popup onClose={() => setShowUpdateJd(false)}>
          <div className="mt-20">
            <JobDescriptionUploader
              autoClose={handleJdUpdateSuccess}
              jobId={job.jobId}
            />
          </div>
        </Popup>
      )}
    </div>
  );
}