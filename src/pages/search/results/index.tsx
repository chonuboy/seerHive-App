import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { ResultCard } from "@/components/Elements/cards/resultCard";
import { useEffect, useState } from "react";
import { store } from "@/Features/Store";
import { searchCandidates, getContactImage } from "@/api/candidates/candidates";
import { Candidate } from "@/lib/definitions";
import { ArrowBigLeftDashIcon, UserPlus } from "lucide-react";
import AddNewCandidate from "@/components/Forms/candidates/AddNewCandidate";
import { useRouter } from "next/router";

export default function SearchResults() {
  const [results, setResults] = useState<any>();
  const [pageNo, setpageNo] = useState(0);
  const [allPages, setAllPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageElements, setPageElements] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isCandidateAdded, setIsCandidateAdded] = useState(false);
  const [images, setImages] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const currentQueries = store.getState().search;
    try {
      searchCandidates(currentQueries, pageNo)
        .then((data) => {
          if (!Array.isArray(data)) {
            setResults(data.content);
            setAllPages(data.totalPages);
            setCurrentPage(data.pageNumber);
            setTotalElements(data.totalElements);
            setPageElements(data.content.length);
            
            // Fetch images for the candidates
            fetchImages(data.content);
          } else {
            console.log(data);
          }
        })
        .catch((err) => {
          setResults(null);
          setAllPages(0);
          setCurrentPage(0);
          setTotalElements(0);
          setPageElements(0);
        });
    } catch (err) {
      console.log(err);
    }
  }, [pageNo]);

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
    
    setImages(imageMap);
    setImageErrors(errorMap);
  };

  const handleImageError = (contactId: number) => {
    setImageErrors(prev => ({...prev, [contactId]: true}));
  };

  const handlePageChange = (newPage: number) => {
    setpageNo(newPage);
  };

  return (
    <MainLayout>
      <div
        className="flex items-center gap-2 pb-4 text-xl text-cyan-500 cursor-pointer hover:text-cyan-600"
        onClick={() => router.back()}
      >
        <ArrowBigLeftDashIcon className="w-6 h-6" />
        <button>Back to Previous Page</button>
      </div>
      
      <div className="flex items-center justify-between">
        <ContentHeader title="Search Results" />
        
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-1 rounded-lg flex items-center transition-colors duration-200 flex-grow"
          onClick={() => setIsCandidateAdded(true)}
        >
          <UserPlus className="w-5 h-5" />
          Add Candidate
        </button>
      </div>

      <ResultCard 
        candidateData={results} 
        images={images}
        imageErrors={imageErrors}
        onImageError={handleImageError}
      ></ResultCard>
      
      {/* Pagination */}
      {results && (
        <div className="flex justify-center gap-4 items-center mt-4 pr-4">
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500">
              Showing {pageElements < 12 ? totalElements : 12} of{" "}
              {totalElements}
            </div>
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => {
                  handlePageChange(currentPage - 1);
                }}
                disabled={currentPage === 0}
                className={`px-3 py-1 text-sm ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {"<"}
              </button>

              {/* Page Numbers */}
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

              {/* Ellipsis for many pages */}
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

              {/* Next Button */}
              <button
                onClick={() => {
                  handlePageChange(currentPage + 1);
                }}
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
        </div>
      )}
      
      {isCandidateAdded && (
        <AddNewCandidate
          autoClose={() => setIsCandidateAdded(false)}
        ></AddNewCandidate>
      )}
    </MainLayout>
  );
}