import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useEffect, useState } from "react";
import { fetchContactsByJob } from "@/api/candidates/interviews";
import { useRouter } from "next/router";
import { ResultCard } from "@/components/Elements/cards/resultCard";
import { Interview, Interviews } from "@/lib/models/candidate";
import { Candidate } from "@/lib/definitions";
import { AppliedCandidates } from "@/components/Elements/cards/appliedCandidate";

export default function InterviewCandidates() {
  const router = useRouter();
  const id = Number(router.query.id);
  const [interviews, SetInterviews] = useState<Interviews[] | null>(null);
  useEffect(() => {
    fetchContactsByJob(id).then((data) => {
      if (data.length > 0) {
        SetInterviews(data);
      }
    });
  }, []);
  return (
    <MainLayout>
      <ContentHeader title="Shortlisted Candidates" />
      {interviews && interviews.length > 0 ? (
        <div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-md"
              onClick={() =>
                router.push({
                  pathname: `/candidates`,
                  query: { jobId: id, assignInterview: true },
                })
              }
            >
              Add New Candidate
            </button>
          </div>
          <AppliedCandidates interviews={interviews}></AppliedCandidates>
        </div>
      ) : (
        <h1 className="p-4">No Candidates Found</h1>
      )}
    </MainLayout>
  );
}
