import { Candidate } from "@/lib/definitions";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Location } from "@/lib/definitions";
import { Popup } from "../Elements/cards/popup";
import CandidateGridUpdate from "../Forms/candidates/candidateGridUpdate";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { EyeIcon } from "lucide-react";
import mammoth from "mammoth";
import {
  fetchCandidateResume,
  getContactImage,
} from "@/api/candidates/candidates";
import { CandidateEducation } from "../Elements/cards/candidateEducation";

const CandidateGrid: React.FC<{
  candidates: Candidate[];
  onUpdate: () => void;
}> = ({ candidates, onUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedContactId, setSelectedContactId] = useState(0);
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [images, setImages] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchAllLocations().then((data) => {
      setLocations(data);
    });
    const fetchImages = async () => {
      const imageMap: Record<number, string> = {};
      await Promise.all(
        candidates.map(async (c) => {
          if (c.contactId) {
            try {
              const img = await getContactImage(c.contactId).then(
                (data) => data
              );
              imageMap[c.contactId] = img;
            } catch (err) {
              console.error("Image fetch failed for", c.contactId, err);
              setImageErrors((prev: any) => ({ ...prev, [c.contactId as number]: true }));
            }
          }
        })
      );
      setImages(imageMap);
    };

    fetchImages();
  }, [isProfileUpdated, candidates]);

  const handleImageError = (contactId: number) => {
    setImageErrors((prev: any) => ({ ...prev, [contactId]: true }));
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleUpdateProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSelectedContactId(candidate.contactId ?? 0);
    setIsProfileUpdated(true);
    setOpenDropdown(null); // Close the dropdown
  };

  const loadPdf = async (resume: any, candidateId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;
    setIsResumeOpen(true);
    try {
      fetchCandidateResume(candidateId).then((data) => {
        console.log(data);
      });
      pdfData = await fetchCandidateResume(candidateId)
        .then((response) => response)
        .catch((error) => console.error(error));

      if (resume.includes("pdf")) {
        const blob = new Blob([pdfData], { type: "application/pdf" });

        // Create a URL for the Blob
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setError(null);
      } else if (resume.includes("docx")) {
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

  const navToCandidate = (contactId: number) => {
    router.push({
      pathname: `/candidates/${contactId}`,
      query: { mode: "edit" },
    });
  };

  if (candidates.length === 0) {
    return (
      <div className="p-4 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-sm mx-auto text-center">
          <div className="w-24 h-24 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
            <div className="w-16 h-16 text-cyan-500">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Candidates Added Yet!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Add candidates to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Update Profile Popup - Rendered outside the dropdown */}
      {isProfileUpdated && selectedContactId > 0 && (
        <Popup>
          <div className="mb-10">
            <CandidateGridUpdate
              initialValues={selectedCandidate}
              id={selectedContactId}
              autoClose={() => {
                setIsProfileUpdated(false);
                onUpdate();
              }}
              masterLocations={locations}
              onClose={() => {
                setIsProfileUpdated(false);
                onUpdate();
              }}
            />
          </div>
        </Popup>
      )}

      {/* Resume Popup */}
      {isResumeOpen && pdfUrl !== "" && (
        <Popup onClose={() => setIsResumeOpen(false)}>
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{
              border: "none",
              backgroundColor: "white",
              overflow: "auto",
              padding: "20px",
              marginTop: "20px",
            }}
            title="Candidate Resume"
          />
        </Popup>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => {
          return (
            <div
              key={index}
              className="bg-white dark:bg-black rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow relative space-y-4"
            >
              {/* Status Badge and Menu */}
              <div className="flex  justify-between">
                <span
                  className={`px-2 py-1 -mr-7 h-6 rounded text-xs font-medium ${
                    candidate.isActive
                      ? "bg-green-300 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {candidate.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100 overflow-hidden">
                    {images[candidate.contactId ?? 0] &&
                    !imageErrors[candidate.contactId ?? 0] ? (
                      <img
                        src={images[candidate.contactId ?? 0]}
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                        className="w-full h-full object-cover rounded-full"
                        onError={() =>
                          handleImageError(candidate.contactId ?? 0)
                        }
                      />
                    ) : (
                      <span className="text-white font-semibold text-xl">
                        {candidate.firstName.charAt(0)}
                        {candidate.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer relative"
                  onClick={() => toggleDropdown(index)}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>

                  {/* Dropdown Menu */}
                  {openDropdown === index && (
                    <div
                      className="absolute right-0 top-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleUpdateProfile(candidate)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="w-4 h-4 text-gray-400">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                        <span>Update Profile</span>
                      </button>

                      {candidate.resume && (
                        <button
                          onClick={() => {
                            loadPdf(candidate.resume, candidate.contactId);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                        >
                          <div className="text-gray-400">
                            <EyeIcon className="w-4 h-4"></EyeIcon>
                          </div>
                          <span>View Resume</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Title */}
              <div>
                <div
                  className="text-center my-4 pb-4 border-b space-y-2 border-gray-300 cursor-pointer"
                  onClick={() => navToCandidate(candidate.contactId ?? 0)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {candidate.designation}
                    <span className="text-blue-500 text-sm font-semibold">
                      {" "}
                      ({candidate.totalExperience} YRS)
                    </span>
                  </p>
                  <h3 className="text-md text-cyan-500 mb-1">
                    {candidate.companyName}
                  </h3>
                </div>
              </div>

              {/* Information List */}
              <div className="space-y-4">
                {/* Education Section */}
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <CandidateEducation contactId={candidate.contactId ?? 0} />
                  </div>
                </div>

                {/* Location */}
                {candidate.currentLocation.locationDetails && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      {candidate.currentLocation.locationDetails}
                    </span>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 break-all">
                    {candidate.emailId}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    {candidate.primaryNumber}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateGrid;