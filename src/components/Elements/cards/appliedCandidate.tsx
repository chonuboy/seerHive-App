import { useState, useEffect } from "react";
import { Candidate } from "@/lib/definitions";
import { fetchCandidateResume } from "@/api/candidates/candidates";
import Link from "next/link";
import { useRouter } from "next/router";
import mammoth from "mammoth";
import { Popup } from "./popup";
import { Interview, Interviews } from "@/lib/models/candidate";

export const AppliedCandidates = ({
  interviews,
}: {
  interviews?: Interviews[] | null;
}) => {
  const [currentInterview, setCurrentInterview] = useState<Interviews[] | null>(
    null
  );

  const [technologies, setTechnologies] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (interviews) setCurrentInterview(interviews);
  });

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

  return (
    <div className="grid md:grid-cols-2 gap-8 grid-cols-1 p-4">
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
      {currentInterview ? (
        currentInterview?.map((candidate, index) => (
          <div className="space-y-4">
            {/* <CandidateCard candidateData={candidate.contactDetails}>
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Interview Status</h3>
                  <p
                    className={`${
                      candidate.interviewStatus == "Scheduled"
                        ? "text-white py-0.5 px-2 bg-yellow-500 rounded-md"
                        : candidate.interviewStatus == "Rejected" ? "text-white py-0.5 px-2 bg-red-500 rounded-md": candidate.interviewStatus == "Done" ? "text-white py-0.5 px-2 bg-blue-500 rounded-md" : candidate.interviewStatus == "Passed" ? "text-white py-0.5 px-2 bg-green-500 rounded-md" : "text-white py-0.5 px-2 bg-gray-500 rounded-md"
                    }`}
                  >
                    {candidate.interviewStatus}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold">Action</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        loadPdf(
                          candidate?.contactDetails?.resume,
                          candidate.contactDetails?.contactId
                        );
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      View Resume
                    </button>
                    <Link
                      href={`/candidates/${candidate.contactDetails?.contactId}`}
                    >
                      <button className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-700">
                        View Profile
                      </button>
                    </Link>
                    <Link
                      href={{
                        pathname: `/candidates/${candidate?.contactDetails?.contactId}/interviews/${candidate?.clientJob?.jobId}`,
                        query: { contactInterViewId: candidate?.interviewId },
                      }}
                    >
                      <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-gray-700">
                        View Rounds
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </CandidateCard> */}
          </div>
        ))
      ) : (
        <p>No Relevant candidates Found</p>
      )}
    </div>
  );
};
