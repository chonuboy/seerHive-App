import { createContactInterview } from "@/api/candidates/interviews";
import { fetchAllJobs, searchJob } from "@/api/client/clientJob";
import JobCard from "@/components/Elements/cards/jobCard";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AllJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [contactId, setContactId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetEntries, setResetEntries] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pageElements, setPageElements] = useState(0);
  const router = useRouter();

  const handleAssignJob = (jobId: number) => {
    try {
      createContactInterview({
        interviewStatus: "Scheduled",
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
          toast.error("Interview already scheduled", {
            position: "top-right",
          });
        } else {
          console.log(data);
          toast.success("Interview scheduled successfully", {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!isSearchMode) {
          const jobsData = await fetchAllJobs(currentPage, resetEntries);
          setAllJobs(jobsData?.content || []);
          setTotalPages(jobsData?.totalPages || 0);
          setTotalElements(jobsData?.totalElements || 0);
          setPageElements(jobsData?.content?.length || 0);
        }
        const candidateId = localStorage.getItem("interviewCandidateId");
        setContactId(Number(candidateId));
      } catch (err: any) {
        toast.error(err.message, {
          position: "top-right",
        });
        setAllJobs([]);
        setTotalPages(0);
        setTotalElements(0);
        setPageElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isSearchMode, resetEntries]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (isSearchMode && searchKeyword.trim()) {
      setLoading(true);
      searchJob(searchKeyword, newPage, resetEntries).then((data) => {
        setLoading(false);
        if (data.status === "NOT_FOUND") {
          toast.error("No more jobs found", {
            position: "top-center",
          });
        } else {
          setAllJobs(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
          setPageElements(data.content?.length || 0);
        }
      });
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setIsSearchMode(false);
    setCurrentPage(0);
    setLoading(true);
    fetchAllJobs(0, 12).then((data: any) => {
      setAllJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPageElements(data.content?.length || 0);
      setLoading(false);
    });
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      toast.error("Please Enter a Keyword", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    setIsSearchMode(true);
    setCurrentPage(0);

    searchJob(searchKeyword, 0, resetEntries).then((data) => {
      setLoading(false);
      if (data.status === "NOT_FOUND") {
        toast.error(data.message, {
          position: "top-center",
        });
        setIsSearchMode(false);
        setAllJobs([]);
        fetchAllJobs(0, resetEntries).then((data: any) => {
          setAllJobs(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
          setPageElements(data.content?.length || 0);
        });
      } else {
        setAllJobs(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPageElements(data.content?.length || 0);
      }
    });
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const numValue =
        value === "" ? 1 : Math.min(100, Math.max(1, parseInt(value, 10)));
      setResetEntries(numValue);
    }
  };

  const handleEntriesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (resetEntries > totalElements && !isSearchMode) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }
      setCurrentPage(0);
      if (!isSearchMode) {
        setLoading(true);
        fetchAllJobs(0, resetEntries).then((data: any) => {
          setAllJobs(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
          setPageElements(data.content?.length || 0);
          setLoading(false);
        });
      } else {
        setLoading(true);
        searchJob(searchKeyword, 0, resetEntries).then((data) => {
          setLoading(false);
          if (data.status === "NOT_FOUND") {
            toast.error(data.message, {
              position: "top-center",
            });
            setIsSearchMode(false);
            setAllJobs([]);
          } else {
            setAllJobs(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setPageElements(data.content?.length || 0);
          }
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentHeader title="All Jobs"></ContentHeader>

      {/* Search Section */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between">
          <input
            type="text"
            className="text-sm py-2 border bg-white w-6/12 rounded-md font-sans focus:border-1 box-border focus:border-cyan-500 dark:text-black px-2"
            placeholder="Search Jobs By Name or Client Name"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            {isSearchMode && (
              <button
                className="bg-gray-500 text-white px-4 py-1 rounded-md border-2 border-gray-500 hover:bg-white hover:text-gray-500 hover:shadow-lg transition duration-200 box-border"
                onClick={clearSearch}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div
          className={
            allJobs?.length > 0
              ? "grid grid-cols-1 text-xs md:text-base md:grid-cols-3 gap-6 mt-4"
              : "py-2"
          }
        >
          {allJobs?.length > 0 ? (
            allJobs.map((job: any, index: any) => (
              <JobCard job={job} isClient></JobCard>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSearchMode ? "No Jobs Found" : "No Active Jobs"}
              </h2>
              <p className="text-gray-500 text-center mb-8 max-w-sm">
                {isSearchMode
                  ? "No jobs match your search criteria. Try different keywords."
                  : "There are currently no active jobs available."}
              </p>
              {isSearchMode && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  View All Jobs
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {allJobs?.length > 0 && (
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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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

            {totalPages > 5 && (
              <>
                <span className="px-2 text-sm text-gray-500">...</span>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === totalPages - 1
                      ? "bg-cyan-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 text-sm ${
                currentPage === totalPages - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
