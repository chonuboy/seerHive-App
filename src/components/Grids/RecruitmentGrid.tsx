import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Popup } from "../Elements/cards/popup";
import { EyeIcon } from "lucide-react";
import mammoth from "mammoth";
import {
  fetchAllRecruitmentData,
  fetchRecruitmentResume,
} from "@/api/recruitment/recruitmentData";
import { RecruitCandidateData } from "@/lib/models/recruitmentCandidate";

const RecruitmentGrid: React.FC<{
  recruitmentCandidate: RecruitCandidateData[];
}> = ({
  recruitmentCandidate,
}: {
  recruitmentCandidate: RecruitCandidateData[];
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<RecruitCandidateData | null>(null);
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState("");
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const loadPdf = async (resume: any, candidateId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;
    setIsResumeOpen(true);
    setOpenDropdown(null);
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
    router.push(`/recruitments/${contactId}`);
  };

  //   if (recruitmentCandidate.length === 0) {
  //     return (
  //       <div className="p-4 min-h-screen">
  //         <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-sm mx-auto text-center">
  //           <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
  //             <div className="w-8 h-8 text-blue-500">
  //               <svg fill="currentColor" viewBox="0 0 24 24">
  //                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  //               </svg>
  //             </div>
  //           </div>
  //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
  //             No recruitmentCandidate Yet!
  //           </h2>
  //           <p className="text-gray-500 text-sm mb-6">
  //             Add recruitmentCandidate to get started
  //           </p>
  //           <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
  //             <div className="w-4 h-4">
  //               <svg fill="currentColor" viewBox="0 0 24 24">
  //                 <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  //               </svg>
  //             </div>
  //             <span>Add Candidate</span>
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        {recruitmentCandidate &&
          recruitmentCandidate.length > 0 &&
          recruitmentCandidate.map((candidate, index) => {
            return (
              <div
                key={index}
                className="bg-white dark:bg-black rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow relative"
              >
                
                <div className="flex justify-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                    <span className="text-white font-semibold text-xl">
                      {candidate.candidateName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name and Title */}
                <div
                  className="text-center my-4 pb-4 border-b border-gray-300 cursor-pointer"
                  onClick={() => navToCandidate(candidate.id ?? 0)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {candidate.candidateName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {candidate.role}
                    <span className="text-blue-500 text-sm font-semibold">
                      {" "}
                      ({candidate.totalExperience ?? 0} YRS)
                    </span>
                  </p>
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
                      {candidate.qualification ?? "NA"}
                    </span>
                  </div>

                  {/* Location */}
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
                      {candidate.currentLocation ?? "NA"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 break-all">
                      {candidate.emailID ?? "NA"}
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
                      {candidate.contactNumber ?? "NA"}
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

export default RecruitmentGrid;
