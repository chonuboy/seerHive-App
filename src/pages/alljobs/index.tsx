import { fetchAllJobs, searchJob } from "@/api/client/clientJob";
import { fetchAllClients } from "@/api/master/clients";
import JobCard from "@/components/Elements/cards/jobCard";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { Briefcase, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddNewJob from "@/components/Forms/jobs/AddNewJob/AddNewJob";
import { Popup } from "@/components/Elements/cards/popup";

const AllJobs = () => {
  const [allJobs, setAllJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetEntries, setResetEntries] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pageElements, setPageElements] = useState(0);
  const [allClients, setAllClients] = useState<any[] | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false); // State for Add Job modal
  const [selectedClient, setSelectedClient] = useState<any>(null); // State for selected client

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
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again.");
        setAllJobs([]);
        setTotalPages(0);
        setTotalElements(0);
        setPageElements(0);
      } finally {
        setLoading(false);
      }
    };

    // Fetch clients for the dropdown
    fetchAllClients().then((data) => {
      setAllClients(data.content || []);
    });

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

  const handleAddJobClick = () => {
    setIsAddJobOpen(true);
    setSelectedClient(null); // Reset selected client when opening modal
  };

  const handleCloseAddJob = () => {
    setIsAddJobOpen(false);
    setSelectedClient(null);
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

  if (!allJobs) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {allJobs === null ? "Loading Jobs..." : "No Jobs Found"}
          </h2>

          <p className="text-gray-500 text-center mb-8 max-w-sm">
            {allJobs === null
              ? "Please wait while we load jobs"
              : "Create a job under a client and it will show up here"}
          </p>

          {/* Add Job Button */}
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
            onClick={handleAddJobClick}
          >
            <Plus className="w-5 h-5" />
            Add New Job
          </button>
        </div>

        {/* Add Job Modal */}
        {isAddJobOpen && (
          <Popup>
            <AddNewJob
              client={selectedClient}
              autoClose={handleCloseAddJob}
              allClients={allClients || []}
              onClientSelect={setSelectedClient}
            />
          </Popup>
        )}
      </MainLayout>
    );
  }

  if (allJobs.length === 0) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />

        {/* Search Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <input
              type="text"
              className="text-sm py-2 border bg-white w-6/12 rounded-md font-sans focus:border-1 box-border focus:border-cyan-500 dark:text-black px-2"
              placeholder="Search Jobs By Name, Description, or Status"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {/* Add Job Button */}
            <button
              className="sm:flex-none bg-cyan-500 text-white px-4 py-1 rounded-md hover:bg-cyan-600 transition duration-200 flex items-center gap-2"
              onClick={handleAddJobClick}
            >
              <Plus className="w-4 h-4" />
              Add Job
            </button>
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

        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isSearchMode ? "No Jobs Found" : "No Jobs Found"}
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-sm">
            {isSearchMode
              ? "No jobs match your search criteria. Try different keywords."
              : "Create a job under a client and it will show up here."}
          </p>
          {isSearchMode ? (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
            >
              View All Jobs
            </button>
          ) : (
            <button
              onClick={handleAddJobClick}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Job
            </button>
          )}
        </div>

        {/* Add Job Modal */}
        {isAddJobOpen && (
          <Popup>
            <AddNewJob
              client={selectedClient}
              autoClose={handleCloseAddJob}
              allClients={allClients || []}
              onClientSelect={setSelectedClient}
            />
          </Popup>
        )}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentHeader title="All Jobs" />

      {/* Search Section */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between">
          <input
            type="text"
            className="text-sm py-2 border bg-white w-6/12 rounded-md font-sans focus:border-1 box-border focus:border-cyan-500 dark:text-black px-2"
            placeholder="Search Jobs By Name, Description, or Status"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {/* Add Job Button */}
          <button
            className="sm:flex-none bg-cyan-500 text-white px-4 py-1 rounded-md hover:bg-cyan-600 transition duration-200 flex items-center gap-2"
            onClick={handleAddJobClick}
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
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

      <div className="grid grid-cols-1 text-xs md:text-base md:grid-cols-3 gap-6 mt-4">
        {allJobs.map((job, index) => (
          <JobCard onUpdate={() => {}} job={job} key={index} />
        ))}
      </div>

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

      {/* Add Job Modal */}
      {isAddJobOpen && (
        <Popup>
          <AddNewJob
            client={selectedClient}
            autoClose={handleCloseAddJob}
            allClients={allClients || []}
            onClientSelect={setSelectedClient}
          />
        </Popup>
      )}
    </MainLayout>
  );
};

export default AllJobs;
