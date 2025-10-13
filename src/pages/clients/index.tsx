import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useEffect, useState } from "react";
import { fetchAllClients } from "@/api/master/clients";
import { Popup } from "@/components/Elements/cards/popup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { clientValidationSchema } from "@/lib/models/client";
import { searchClient } from "@/api/master/clients";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { Location } from "@/lib/definitions";
import AddClient from "@/components/Forms/clients/addClient";
import ClientGrid from "@/components/Grids/ClientGrid";
import { Building2 } from "lucide-react";

export default function Clients() {
  const [allClients, setClients] = useState<any[] | null>(null);
  const [isClientAdded, setIsClientAdded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial load
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationAdded, setLocationAdded] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageElements, setPageElements] = useState(0);
  const [changeInClients, setChangeInClients] = useState(false);
  const [resetEntries, setResetEntries] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!isSearchMode) {
          const clientsData = await fetchAllClients(currentPage, resetEntries);
          setClients(clientsData?.content || []);
          setTotalPages(clientsData?.totalPages || 0);
          setTotalElements(clientsData?.totalElements || 0);
          setPageElements(clientsData?.content?.length || 0);
        }

        const locationsData = await fetchAllLocations();
        setLocations(locationsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setClients([]);
        setLocations([]);
        setTotalPages(0);
        setTotalElements(0);
        setPageElements(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, locationAdded, isSearchMode, changeInClients]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (isSearchMode && searchKeyword.trim()) {
      setIsLoading(true);
      searchClient(searchKeyword, newPage - 1, resetEntries).then((data) => {
        setIsLoading(false);
        if (data.status === "NOT_FOUND") {
          toast.error("No more clients found", {
            position: "top-center",
          });
        } else {
          setClients(data);
        }
      });
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setIsSearchMode(false);
    setCurrentPage(0);
    setIsLoading(true);
    fetchAllClients(0, 12).then((data: any) => {
      setClients(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setResetEntries(12);
      setIsLoading(false);
    });
  };

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

    searchClient(searchKeyword, currentPage, 12).then((data) => {
      setIsLoading(false);
      if (data.status === "NOT_FOUND") {
        toast.error(data.message, {
          position: "top-center",
        });
        setIsSearchMode(false);
        setClients([]);
        fetchAllClients(0, 12).then((data: any) => {
          setClients(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
          setResetEntries(12);
          setIsLoading(false);
        });
      } else {
        setClients(data.content);
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
      if (resetEntries > totalElements) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }
      setCurrentPage(0); // Reset to first page when changing entries per page
      if (!isSearchMode) {
        setIsLoading(true);
        fetchAllClients(0, resetEntries).then((data: any) => {
          setClients(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
          setResetEntries(data.content.length);
          setIsLoading(false);
        });
      } else {
        setIsLoading(true);
        searchClient(searchKeyword, currentPage, resetEntries).then((data) => {
          setIsLoading(false);
          if (data.status === "NOT_FOUND") {
            toast.error(data.message, {
              position: "top-center",
            });
            setIsSearchMode(false);
            setClients([]);
          } else {
            setClients(data.content);
          }
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      clientName: null,
      cinnumber: null,
      pannumber: null,
    },
    validationSchema: clientValidationSchema,
    validateOnMount: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <ContentHeader title="All Clients" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!allClients) {
    return (
      <MainLayout>
        <ContentHeader title="All Clients"></ContentHeader>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {allClients === null ? "Loading Clients..." : "No Clients Found"}
          </h2>

          <p className="text-gray-500 text-center mb-8 max-w-sm">
            {allClients === null
              ? "Please wait while we load clients"
              : "Create Client and it will show up here"}
          </p>

          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
            onClick={() => setIsClientAdded(true)}
          >
            <Building2 className="w-5 h-5" />
            Add Client
          </button>
        </div>
        {isClientAdded && (
          <Popup>
            <AddClient
              masterLocations={locations}
              autoClose={() => setIsClientAdded(false)}
              formik={formik}
            ></AddClient>
          </Popup>
        )}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentHeader title="All Clients" />
      <div className="space-y-4 mb-4">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <input
              type="text"
              className="text-sm py-2 border bg-white w-6/12 rounded-md font-sans focus:border-1 box-border focus:border-cyan-500 dark:text-black px-2"
              placeholder="Search Clients By Name or CIN or PAN"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="sm:flex-none bg-cyan-500 text-white px-4 py-1 rounded-md hover:bg-cyan-600 transition duration-200"
              onClick={() => setIsClientAdded(true)}
            >
              Add Client
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {isSearchMode && (
                <button
                  className="bg-gray-500 text-white px-4 py-1 rounded-md border-2 border-gray-500 hover:bg-white hover:text-gray-500 hover:shadow-lg transition duration-200 box-border"
                  onClick={clearSearch}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div>
            <Popup onClose={() => setIsLoading(false)}>
              <div className="flex mx-auto items-center justify-center flex-col my-80">
                <div>
                  <div className="ml-4 w-10 h-10 rounded-full border-white border-4 border-t-blue-600 animate-spin" />
                  <span className="text-white">Searching</span>
                </div>
              </div>
            </Popup>
          </div>
        )}

        {isClientAdded && (
          <Popup>
            <AddClient
              masterLocations={locations}
              autoClose={() => setIsClientAdded(false)}
              formik={formik}
            ></AddClient>
          </Popup>
        )}
      </div>

      <ClientGrid
        clients={allClients}
        onUpdate={() => setChangeInClients(true)}
        locations={locations}
      ></ClientGrid>
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
    </MainLayout>
  );
}
