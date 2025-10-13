import MainLayout from "@/components/Layouts/layout";
import AddButton from "@/components/Elements/utils/add-button";
import ContentHeader from "@/components/Layouts/content-header";
import { useEffect, useState } from "react";
import { fetchCandidates } from "@/api/candidates/candidates";
import { contactSearchByKeyword } from "@/api/candidates/candidates";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Popup } from "@/components/Elements/cards/popup";
import CandidateGrid from "@/components/Grids/CandidateGrid";
import { User, UserPlus } from "lucide-react";
import AddNewCandidate from "@/components/Forms/candidates/AddNewCandidate";

export default function Candidates() {
  const [allCandidates, setAllCandidates] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const [query, setQuery] = useState<any>(null);
  const [jobId, setJobId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageElements, setPageElements] = useState(0);
  const [resetEntries, setResetEntries] = useState(12);
  const [isCandidateAdded, setIsCandidateAdded] = useState(false);

  const fetchCandidatesData = async (page: number, entries: number) => {
    setIsLoading(true);
    try {
      const data = await fetchCandidates(page, entries);
      if (data) {
        setAllCandidates(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPageElements(data.content?.length || 0);
      } else {
        setAllCandidates([]);
        setTotalPages(0);
        setTotalElements(0);
        setPageElements(0);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setAllCandidates([]);
      setTotalPages(0);
      setTotalElements(0);
      setPageElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate = () => {
    fetchCandidatesData(currentPage, resetEntries);
  };

  useEffect(() => {
    if (router.isReady) {
      if (router.query.jobId && router.query.assignInterview) {
        setJobId(router.query.jobId);
        setQuery(router.query.assignInterview);
        localStorage.setItem(
          "assignInterview",
          JSON.stringify(router.query.assignInterview)
        );
        localStorage.setItem("jobId", JSON.stringify(router.query.jobId));
      }
    }

    if (!isSearchMode && router.isReady) {
      fetchCandidatesData(currentPage, resetEntries);
    }
  }, [currentPage, router.isReady, isSearchMode, resetEntries]);

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      toast.error("Please Enter a Keyword", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    setIsSearchMode(true);
    setCurrentPage(0);

    contactSearchByKeyword(searchKeyword, 0, resetEntries)
      .then((data) => {
        setIsLoading(false);
        if (data.status === "NOT_FOUND") {
          toast.error(
            `Candidate Not Found for this keyword: ${searchKeyword}`,
            {
              position: "top-center",
            }
          );
          setIsSearchMode(false);
          fetchCandidatesData(0, resetEntries);
        } else {
          setAllCandidates(data.content);
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements);
          setPageElements(data.content.length);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.", {
          position: "top-center",
        });
      });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (isSearchMode && searchKeyword.trim()) {
      setIsLoading(true);
      contactSearchByKeyword(searchKeyword, newPage, resetEntries)
        .then((data) => {
          setIsLoading(false);
          if (data.status === "NOT_FOUND") {
            toast.error("No more candidates found", {
              position: "top-center",
            });
          } else {
            setAllCandidates(data.content);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements);
            setPageElements(data.content.length);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Page change error:", error);
        });
    } else {
      fetchCandidatesData(newPage, resetEntries);
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setIsSearchMode(false);
    setCurrentPage(0);
    fetchCandidatesData(0, resetEntries);
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
      if (resetEntries > totalElements) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }

      if (!isSearchMode) {
        fetchCandidatesData(0, resetEntries);
      } else {
        setIsLoading(true);
        contactSearchByKeyword(searchKeyword, 0, resetEntries)
          .then((data) => {
            setIsLoading(false);
            if (data.status === "NOT_FOUND") {
              toast.error("No more candidates found", {
                position: "top-center",
              });
            } else {
              setAllCandidates(data.content);
              setTotalPages(data.totalPages || 1);
              setTotalElements(data.totalElements);
              setPageElements(data.content.length);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("Entries change error:", error);
          });
      }
    }
  };

  // Rest of your component remains the same...
  if (isLoading) {
    return (
      <MainLayout>
        <ContentHeader title="All Candidates" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!allCandidates) {
    return (
      <MainLayout>
        <ContentHeader title="All Candidates"></ContentHeader>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Candidates Found
          </h2>

          <p className="text-gray-500 text-center mb-8 max-w-sm">
            {allCandidates === null
              ? "Loading candidates..."
              : "Create Candidate and it will show up here"}
          </p>

          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
            onClick={() => setIsCandidateAdded(true)}
          >
            <UserPlus className="w-5 h-5" />
            Add Candidate
          </button>
        </div>
        {isCandidateAdded && (
          <AddNewCandidate
            autoClose={() => setIsCandidateAdded(false)}
          ></AddNewCandidate>
        )}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        <ContentHeader title="All Candidates" />
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <input
              type="text"
              className="text-sm py-2 border bg-white w-6/12 rounded-md font-sans focus:border-1 box-border focus:border-cyan-500 dark:text-black px-2"
              placeholder="Search Candidates By Name or Email or Phone or Company or Designation or Tech Role"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSearch();
              }}
            />
            <div className="flex justify-end">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                onClick={() => setIsCandidateAdded(true)}
              >
                <UserPlus className="w-5 h-5" />
                Add Candidate
              </button>
            </div>
          </div>
          {isSearchMode && (
            <button
              className="bg-gray-500 text-white px-4 py-1 rounded-md border-2 border-gray-500 hover:bg-white hover:text-gray-500 hover:shadow-lg transition duration-200 box-border"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </div>

        {isLoading && (
          <Popup onClose={() => setIsLoading(false)}>
            <div className="flex mx-auto items-center justify-center flex-col my-80">
              <div>
                <div className="ml-4 w-10 h-10 rounded-full border-white border-4 border-t-blue-600 animate-spin" />
                <span className="text-white">Searching</span>
              </div>
            </div>
          </Popup>
        )}

        {isCandidateAdded && (
          <AddNewCandidate
            autoClose={() => setIsCandidateAdded(false)}
          ></AddNewCandidate>
        )}

        <div className="">
          <CandidateGrid
            candidates={allCandidates}
            onUpdate={onUpdate}
          ></CandidateGrid>
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

            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {"<"}
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;

                // Calculate start and end page numbers
                let startPage = Math.max(
                  0,
                  currentPage - Math.floor(maxVisiblePages / 2)
                );
                let endPage = Math.min(
                  totalPages - 1,
                  startPage + maxVisiblePages - 1
                );

                // Adjust start page if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(0, endPage - maxVisiblePages + 1);
                }

                // Always show first page
                if (startPage > 0) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(0)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === 0
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      1
                    </button>
                  );

                  // Show ellipsis if there are pages between first page and start page
                  if (startPage > 1) {
                    pages.push(
                      <span
                        key="ellipsis-start"
                        className="px-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                }

                // Show page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === i
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }

                // Always show last page
                if (endPage < totalPages - 1) {
                  // Show ellipsis if there are pages between end page and last page
                  if (endPage < totalPages - 2) {
                    pages.push(
                      <span
                        key="ellipsis-end"
                        className="px-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages - 1)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === totalPages - 1
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages - 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
