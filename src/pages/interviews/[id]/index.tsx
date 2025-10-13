import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/Elements/cards/Card";
import { Badge } from "@/components/Elements/utils/Badge";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CandidateCard } from "@/components/Elements/cards/candidateCard";
import MainLayout from "@/components/Layouts/layout";
import { Popup } from "@/components/Elements/cards/popup";
import { Round } from "@/lib/models/candidate";
import InterviewForm from "@/components/Forms/jobs/updateInterview";
import AddRound from "@/components/Forms/jobs/addInterview";
import { Candidate } from "@/lib/definitions";
import { fetchCandidate } from "@/api/candidates/candidates";
import {
  fetchContactInterview,
  fetchInterviewsByContact,
} from "@/api/candidates/interviews";
import {
  fetchInterviewRoundsByContact,
  fetchInterviewRoundsByContactAndJob,
} from "@/api/interviews/InterviewRounds";
import { fetchInterviewRound } from "@/api/interviews/InterviewRounds";
import { Interview } from "@/lib/models/candidate";
import { fetchAllTechnologies } from "@/api/master/masterTech";

export default function CandidateAssignedInterviews() {
  const router = useRouter();
  const Id = Number(router.query.interviewid);
  const candidateId = Number(router.query.id);
  const [addRoundEnabled, setAddRoundEnabled] = useState(false);
  const [updateRoundEnabled, setUpdateRoundEnabled] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );
  const [currentJobData, setCurrentJobData] = useState<Interview[] | null>(
    null
  );
  const [allRounds, setAllRounds] = useState<Round[] | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null); // Track the selected round
  const [masterTech, setMasterTech] = useState<any[] | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const Id = Number(router.query.interviewid);

      const candidateId = Number(router.query.id);
      fetchCandidate(candidateId)
        .then((data) => {
          setCurrentCandidate(data);
        })
        .catch((err) => {
          console.log(err);
        });

      fetchInterviewRoundsByContactAndJob(candidateId, Id).then((data) => {
        setAllRounds(data);
      });

      fetchInterviewsByContact(candidateId).then((data) => {
        setCurrentJobData(data);
        console.log(data);
      });

      fetchAllTechnologies().then((data) => {
        setMasterTech(data);
      });
    }
  }, [candidateId, Id, updateRoundEnabled, addRoundEnabled, router.isReady]);

  const handleUpdateRound = (round: Round) => {
    console.log(round);
    setSelectedRound(round); // Set the selected round
    setUpdateRoundEnabled(true); // Show the update form
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Info Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
          <CandidateCard candidateData={currentCandidate} />
        </section>

        {/* Job Info Section */}
        {/* <section className="space-y-4">
          <h3 className="text-xl font-semibold">Job Info</h3>
          <JobCard jobData={currentJobData?.clientJob ?? null} isClient={false} />
        </section> */}

        {/* Interviews Section */}
        <section className="space-y-8">
          <h2 className="text-xl font-semibold">Interviews</h2>
          {allRounds && allRounds.length > 0 ? (
            allRounds?.map((round) => (
              <div key={round.roundId}>
                <Card className="p-4 dark:bg-black">
                  <CardHeader className="mb-4">
                    <h3 className="font-semibold text-lg">
                      Round {round.roundNumber}
                    </h3>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-base"
                      onClick={() => handleUpdateRound(round)} // Pass the round to the handler
                    >
                      Update
                    </button>
                  </CardHeader>
                  <CardContent className="bg-white border shadow-sm p-4 dark:bg-black dark:text-white">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-12">
                        <div>
                          <div className="font-semibold text-lg flex items-center gap-2">
                            <span className="text-green-500">
                              {round.interview?.clientJob?.jobTitle}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {round.roundDate}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={
                          round.interviewStatus === "Passed"
                            ? "success"
                            : round.interviewStatus === "On-Hold"
                            ? "secondary"
                            : "rejected"
                        }
                      >
                        {round.interviewStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-black dark:text-white font-semibold">
                          Interviewer Name
                        </p>
                        <p className="text-gray-700 dark:text-gray-200">
                          {round.interviewerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-black dark:text-white font-semibold">
                          Technology Interviewed
                        </p>
                        <p className="text-gray-700 dark:text-gray-200">
                          {round.technologyInterviewed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-black dark:text-white font-semibold">
                          Tech Rating
                        </p>
                        <p className="text-gray-700 dark:text-gray-200">
                          {round.techRating}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-black dark:text-white font-semibold">
                          Soft skill Rating
                        </p>
                        <p className="text-gray-700 dark:text-gray-200">
                          {round.softskillsRating}/10
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-black dark:text-white font-semibold">
                        Remarks
                      </p>
                      <p className="text-gray-700 dark:text-gray-200">
                        {round.remarks}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div>
              <p>No interview Rounds found for this candidate.</p>
            </div>
          )}

          {/* Render the Update Form Popup */}
          {updateRoundEnabled && selectedRound && (
            <Popup onClose={() => setUpdateRoundEnabled(false)}>
              <InterviewForm
                masterTechnologies={masterTech}
                initialValues={selectedRound} // Pass the selected round
                id={selectedRound.roundId ?? 0}
                autoClose={() => setUpdateRoundEnabled(false)}
              />
            </Popup>
          )}

          <div className="flex justify-end mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setAddRoundEnabled(true)}
            >
              Add New Round
            </button>
          </div>
        </section>

        {/* Render the Add Round Popup */}
        {addRoundEnabled && currentJobData && (
          <Popup onClose={() => setAddRoundEnabled(false)}>
            <AddRound
              className="mt-10 rounded-md bg-white m-8"
              interviewId={Id}
              onclose={() => setAddRoundEnabled(false)}
              roundNumber={allRounds?.[allRounds?.length - 1]?.roundNumber ?? 0}
            />
          </Popup>
        )}
      </div>
    </MainLayout>
  );
}
