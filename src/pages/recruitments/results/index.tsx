import { useEffect, useState } from "react";
import { store } from "@/Features/Store";
import {
  fetchRecruitmentResume,
  searchRecruitmentData,
} from "@/api/recruitment/recruitmentData";
import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { EyeIcon, User } from "lucide-react";
import { Popup } from "@/components/Elements/cards/popup";
import { useRouter } from "next/router";
import mammoth from "mammoth";
import { toast } from "react-toastify";

export default function RecruitmentResults() {
  const [currentPage, setCurrentPage] = useState(0);
  const [allResults, setAllResults] = useState([]);
  const [allPages, setAllPages] = useState(0);
  const [pageNo, setpageNo] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [pageElements, setPageElements] = useState(0);
  const [resetEntries, setResetEntries] = useState(12);
  const [apiError, setApiError] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const searchQueries = store.getState().recruitSearch;
    setLoading(true);
    setApiError(false);

    searchRecruitmentData(searchQueries, pageNo, resetEntries)
      .then((data) => {
        if (data && data.data && data.data.content) {
          setAllResults(data.data.content);
          setAllPages(data.data.totalPages);
          setCurrentPage(data.data.pageNumber);
          setTotalElements(data.data.totalElements);
        } else {
          setAllResults([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setApiError(true);
        setAllResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageNo]);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const loadPdf = async (resume: any, candidateId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;
    setIsResumeOpen(true);
    try {
      fetchRecruitmentResume(candidateId).then((data) => {
        console.log(data);
      });
      pdfData = await fetchRecruitmentResume(candidateId)
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
      pathname: `/recruitments/${contactId}`,
      query: { mode: "edit" },
    });
  };

  const getStatusColor = (status: string) => {
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const numValue =
        value === "" ? 1 : Math.min(100, Math.max(1, parseInt(value, 10)));
      setResetEntries(numValue);
      setCurrentPage(0); // Reset to first page when changing entries per page
    }
  };

  const handleEntriesKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      if (resetEntries > totalElements) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }
      setLoading(true);
      setCurrentPage(0); // Reset to first page when changing entries per page
      const searchQueries = store.getState().recruitSearch;
      searchRecruitmentData(searchQueries, currentPage, resetEntries).then(
        (data) => {
          if (data.status === "NOT_FOUND") {
            toast.error("No more candidates found", {
              position: "top-center",
            });
          } else {
            setAllResults(data.data.content);
            setTotalElements(data.data.totalElements);
            setPageElements(data.data.content.length);
            setLoading(false);
          }
        }
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    const searchQueries = store.getState().recruitSearch;
    setCurrentPage(newPage);
    setLoading(true);

    searchRecruitmentData(searchQueries, newPage, resetEntries).then((data) => {
      if (data.status === "NOT_FOUND") {
        toast.error("No more candidates found", {
          position: "top-center",
        });
      } else {
        setAllResults(data.data.content);
        setTotalElements(data.data.totalElements);
        setPageElements(data.data.content.length);
        setLoading(false);
      }
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <ContentHeader title="Recruitment Search Results"></ContentHeader>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!allResults) {
    return (
      <MainLayout>
        <ContentHeader title="Recruitment Search Results"></ContentHeader>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 rounded-lg w-full max-w-md mx-auto">
          <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#a0d9f7] bg-white">
            <User className="w-12 h-12 text-[#00bcd4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
            {apiError ? "Error Loading Candidates" : "No Candidates Found!"}
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentHeader title="Recruitment Search Results"></ContentHeader>
      {!allResults && <div className="text-center">No results found</div>}
      <div className="min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allResults &&
            allResults.length > 0 &&
            allResults.map((result: any, index: number) => (
              <>
                <div
                  key={index}
                  className="bg-white dark:bg-black rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow relative space-y-4"
                >
                  {/* Status Badge and Menu */}
                  <div className="flex  justify-center">
                    {/* <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      result.sourcingStatus
                    )}`}
                  >
                    {result.sourcingStatus}
                  </div> */}
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                        <span className="text-white font-semibold text-xl">
                          C
                        </span>
                      </div>
                    </div>

                    {/* <div
                    className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer relative"
                    onClick={() => toggleDropdown(index)}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    {openDropdown === index && (
                      <div
                        className="absolute right-0 top-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {}}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="w-4 h-4 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </div>
                          <span>Update Profile</span>
                        </button>
                        {result.resumeLink && (
                          <button
                            onClick={() => {
                              loadPdf(result.resumeLink, result.id);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                          >
                            <div className="text-gray-400">
                              <EyeIcon className="w-4 h-4"></EyeIcon>
                            </div>
                            <span>View Resume</span>
                          </button>
                        )}
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
                      </div>
                    )}
                  </div> */}
                  </div>

                  {/* Name and Title */}
                  <div>
                    <div
                      className="text-center my-4 pb-4 border-b space-y-2 border-gray-300 cursor-pointer"
                      onClick={() => navToCandidate(result.id)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {result.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.role}
                        <span className="text-blue-500 text-sm font-semibold">
                          {" "}
                          ({result.totalExperience} YRS)
                        </span>
                      </p>
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
                        {result.qualification ?? "NA"}
                        {result.sourcingStatus}
                      </span>
                    </div>

                    {/* Location */}
                    {result.currentLocation && (
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
                          {result.currentLocation}
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
                        {result.emailId ?? "NA"}
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
                        {result.contactNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
        {allResults.length > 0 && allResults && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500">
              Showing
              <input
                type="number"
                min={1}
                max={totalElements}
                value={resetEntries}
                onChange={handleEntriesChange}
                onKeyDown={handleEntriesKeyDown}
                className="w-14 px-2 mx-2 py-1 border rounded focus:border-cyan-500"
              />
              of {totalElements} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1 text-sm ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {"<"}
              </button>

              {Array.from({ length: Math.min(5, allPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber - 1)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNumber - 1
                        ? "bg-cyan-500 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {allPages > 5 && (
                <>
                  <span className="px-2 text-sm text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(allPages - 1)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === allPages - 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {allPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === allPages - 1}
                className={`px-3 py-1 text-sm ${
                  currentPage === allPages - 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
