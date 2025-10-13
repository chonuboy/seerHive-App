import { useState, useEffect } from "react";
import { Candidate } from "@/lib/definitions";
import { fetchCandidateResume, getContactImage } from "@/api/candidates/candidates";
import Link from "next/link";
import { useRouter } from "next/router";
import mammoth from "mammoth";
import { Popup } from "./popup";
import CandidateGridUpdate from "@/components/Forms/candidates/candidateGridUpdate";
import { EyeIcon, User } from "lucide-react";
import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { CandidateEducation } from "./candidateEducation";

interface ResultCardProps {
  candidateData?: any[];
  images?: Record<number, string>;
  imageErrors?: Record<number, boolean>;
  onImageError?: (contactId: number) => void;
}

export const ResultCard = ({ 
  candidateData, 
  images = {}, 
  imageErrors = {}, 
  onImageError 
}: ResultCardProps) => {
  const [currentCandidate, setCurrentCandidate] = useState<any[] | null>(null);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(0);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [candidateImages, setCandidateImages] = useState<Record<number, string>>({});
  const [candidateImageErrors, setCandidateImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoading(true);
    if (candidateData) {
      setCurrentCandidate(candidateData);
      console.log(candidateData);
      
      // If images are provided via props, use them
      if (Object.keys(images).length > 0) {
        setCandidateImages(images);
      }
      
      // If image errors are provided via props, use them
      if (Object.keys(imageErrors).length > 0) {
        setCandidateImageErrors(imageErrors);
      }
      
      setLoading(false);
    } else if (candidateData === null) {
      setLoading(false);
    }
  }, [candidateData, images, imageErrors]);

  // Fallback function to fetch images if not provided via props
  const fetchImages = async (candidates: Candidate[]) => {
    const imageMap: Record<number, string> = {};
    const errorMap: Record<number, boolean> = {};
    
    await Promise.all(
      candidates.map(async (candidate) => {
        if (candidate.contactId) {
          try {
            const img = await getContactImage(candidate.contactId);
            imageMap[candidate.contactId] = img;
          } catch (err) {
            console.error("Image fetch failed for", candidate.contactId, err);
            errorMap[candidate.contactId] = true;
          }
        }
      })
    );
    
    setCandidateImages(imageMap);
    setCandidateImageErrors(errorMap);
  };

  const handleImageError = (contactId: number) => {
    setCandidateImageErrors(prev => ({...prev, [contactId]: true}));
    // Also call the parent handler if provided
    if (onImageError) {
      onImageError(contactId);
    }
  };

  const loadPdf = async (resume: any, candidateId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;
    setIsResumeOpen(true);
    setOpenDropdown(null);
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
    router.push(`/candidates/${contactId}`);
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">Loading</span>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(currentCandidate)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Candidates Found For Search Queries!
        </h2>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 grid-cols-1">
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
              marginTop: "60px",
            }}
            title="Candidate Resume"
          />
        </Popup>
      )}
      {currentCandidate && Array.isArray(currentCandidate) &&
        currentCandidate?.map((candidate, index) => {
          const contactId = candidate.contactId ?? 0;
          return (
            <div className="space-y-2" key={index}>
              <div
                className="bg-white dark:bg-black rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow relative space-y-6"
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
                      {candidateImages[contactId] && !candidateImageErrors[contactId] ? (
                        <img
                          src={candidateImages[contactId]}
                          alt={`${candidate.firstName} ${candidate.lastName}`}
                          className="w-full h-full object-cover rounded-full"
                          onError={() => handleImageError(contactId)}
                        />
                      ) : (
                        <span className="text-white font-semibold text-xl">
                          {candidate.firstName?.charAt(0)}
                          {candidate.lastName?.charAt(0)}
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
                    className="text-center mb-4 border-b border-gray-300 cursor-pointer"
                    onClick={() => navToCandidate(contactId)}
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
                  {/* Education/Tech Role */}
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      <CandidateEducation contactId={contactId} />
                    </span>
                  </div>

                  {/* Location */}
                  {candidate.currentLocation && (
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
                        {candidate.currentLocation.locationDetails ?? candidate.currentLocation}
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
                <div className="flex justify-end">
                  <button
                    className="px-2 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                    onClick={() => {
                      router.push(`/jobs/${candidate.contactId}/alljobs/`);
                      localStorage.setItem(
                        "interviewCandidateId",
                        JSON.stringify(candidate.contactId)
                      );
                    }}
                  >
                    Shortlist Candidate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};