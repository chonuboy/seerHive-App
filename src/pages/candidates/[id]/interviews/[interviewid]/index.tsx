import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "@/components/Layouts/layout";
import { Popup } from "@/components/Elements/cards/popup";
import DOMPurify from "dompurify";
import type { Round, Technology } from "@/lib/models/candidate";
import InterviewForm from "@/components/Forms/jobs/updateInterview";
import AddRound from "@/components/Forms/jobs/addInterview";
import type { Candidate } from "@/lib/definitions";
import { fetchCandidate } from "@/api/candidates/candidates";
import {
  fetchContactInterview,
  fetchInterviewsByContact,
} from "@/api/candidates/interviews";
import {
  fetchInterviewRoundsByContactAndJob,
  getRoundImage,
} from "@/api/interviews/InterviewRounds";
import type { Interview } from "@/lib/models/candidate";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import {
  ArrowBigLeftDashIcon,
  Building2,
  Calendar,
  CalendarCheck,
  Clock,
  Edit3,
  Github,
  Globe,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
  Star,
  Twitter,
  User,
  X,
  ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  createInterviewTech,
  fetchAllInterviewTechs,
} from "@/api/interviews/interviewRoundTech";
import PdfViewer from "@/components/Elements/utils/pdfViewer";

export default function CandidateInterviews() {
  const router = useRouter();
  const { contactInterViewId } = router.query;
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
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [masterTech, setMasterTech] = useState<any[] | null>(null);
  const [job, setJob] = useState<any | null>(null);
  const [overAllStatus, setOverAllStatus] = useState<string | null>(null);
  const [currentJobInfo, setCurrentJobInfo] = useState<any | null>(null);
  const [technologyInterviewed, setTechnologyInterviewed] = useState<
    Technology[]
  >([]);
  const [isTechAdded, setIsTechAdded] = useState(false);
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [techInputValue, setTechInputValue] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState(0);
  const [allTech, setAllTech] = useState<any | null>(null);
  const [existing, setExisting] = useState<any | null>();
  const [activeTab, setActiveTab] = useState("rounds");
  // Add state for selected round technologies
  const [selectedRoundTechnologies, setSelectedRoundTechnologies] = useState<
    any[]
  >([]);
  const [roundImages, setRoundImages] = useState<Record<number, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors duration-200 ${
          i < rating ? "text-amber-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredTechSuggestions =
    masterTech?.filter((tech) =>
      tech.technology.toLowerCase().includes(techInputValue.toLowerCase())
    ) || [];

  // Updated compact technology display function
  const getRoundTechs = (roundId: number) => {
    const filteredTechs = allTech?.filter(
      (tech: any) => tech.interviewRound.roundId === roundId
    );

    if (!filteredTechs || filteredTechs.length === 0) {
      return (
        <div className="flex items-center justify-center py-4 text-gray-500">
          <span className="text-sm">No technologies added yet</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {filteredTechs.map((tech: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-cyan-500 rounded-md hover:bg-cyan-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">
              {tech.technology.technology}
            </span>
            {tech.techRating && (
              <span className="flex items-center gap-1 px-2 py-1 bg-cyan-500 text-white rounded-full text-xs font-medium">
                ★ {tech.techRating}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSanitizedHtml = (htmlString: string) => {
    return { __html: DOMPurify.sanitize(htmlString) };
  };

  useEffect(() => {
    if (router.isReady) {
      const Id = Number(router.query.interviewid);
      const candidateId = Number(router.query.id);
      const interViewId = Number(contactInterViewId);

      console.log(Id,candidateId,interViewId)

      fetchCandidate(candidateId)
        .then((data) => {
          setCurrentCandidate(data);
        })
        .catch((err) => {
          console.log(err);
        });

      fetchInterviewRoundsByContactAndJob(candidateId, Id).then((data) => {
        setAllRounds(data);
        console.log(data);
      });

      fetchInterviewsByContact(candidateId).then((data) => {
        setCurrentJobData(data);
      });

      fetchContactInterview(interViewId).then((data) => {
        setOverAllStatus(data.interviewStatus);
        setCurrentJobInfo(data);
      });

      fetchAllTechnologies().then((data) => {
        setMasterTech(data);
      });

      fetchAllInterviewTechs().then((data) => {
        setAllTech(data);
      });
      if (allRounds && allRounds.length > 0) {
        fetchRoundImages();
      }
    }
  }, [
    candidateId,
    contactInterViewId,
    updateRoundEnabled,
    addRoundEnabled,
    router.isReady,
    isTechAdded,
  ]);

  const getExistingTech = (roundId: number) => {
    const filteredTechs = allTech?.filter(
      (tech: any) => tech.interviewRound.roundId === roundId
    );
    return filteredTechs || [];
  };

  // Updated handleUpdateRound function
  const handleUpdateRound = (round: Round) => {
    console.log(round);
    setSelectedRound(round);
    // Get existing technologies for this round
    const existingTechs = getExistingTech(round.roundId || 1);
    setSelectedRoundTechnologies(existingTechs);
    setUpdateRoundEnabled(true);
  };

  const fetchRoundImages = async () => {
    if (!allRounds) return; // Add null check

    const imageMap: Record<number, string> = {};
    await Promise.all(
      allRounds.map(async (round) => {
        if (round.roundId && round.interviewImageSnapshot) {
          try {
            const img = await getRoundImage(round.roundId).then((data) => data);
            imageMap[round.roundId] = img;
          } catch (err) {
            console.error("Image fetch failed for round", round.roundId, err);
            // setImageErrors((prev) => ({ ...prev, [round.roundId]: true }));
          }
        }
      })
    );
    setRoundImages(imageMap);
  };

  const handleViewImage = async (roundId: number) => {
    try {
      // If image is already fetched, use it
      if (roundImages[roundId]) {
        setSelectedImage(roundImages[roundId]);
        setShowImageModal(true);
      } else {
        // Fetch the image if not already loaded
        const img = await getRoundImage(roundId);
        setRoundImages((prev) => ({ ...prev, [roundId]: img }));
        setSelectedImage(img);
        setShowImageModal(true);
      }
    } catch (err) {
      console.error("Failed to load image for round", roundId, err);
      setImageErrors((prev) => ({ ...prev, [roundId]: true }));
      toast.error("Failed to load image", { position: "top-right" });
    }
  };

  return (
    <MainLayout>
      <div className="bg-white">
        <div
          className="flex items-center gap-2 px-8 pt-4 text-xl text-cyan-500 cursor-pointer hover:text-cyan-600"
          onClick={() => router.back()}
        >
          <ArrowBigLeftDashIcon className="w-6 h-6" />
          <button className="border-b">Back to Previous Page</button>
        </div>
        <div className="flex items-start justify-between  p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="flex justify-center mr-2">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                <span className="text-white font-semibold text-xl">
                  {currentCandidate?.firstName.charAt(0)}
                  {currentCandidate?.lastName.charAt(0)}
                </span>
              </div>
            </div>
            {/* Name and Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mt-1 mb-2">
                <h1 className="text-3xl font-semibold text-gray-900 relative">
                  {currentCandidate?.firstName} {currentCandidate?.lastName}
                  <span
                    className={`w-4 h-4 ${
                      currentCandidate?.isActive ? "bg-green-500" : "bg-red-500"
                    } rounded-full absolute -right-6 top-0`}
                  ></span>
                </h1>
              </div>
              {/* Personal Details Grid */}
              <div className="grid mt-4 grid-cols-2 gap-x-40 gap-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>{currentCandidate?.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>
                    {currentCandidate?.highestEducation}(
                    {currentCandidate?.designation})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>{currentCandidate?.twitter ?? "NA"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>
                    {currentCandidate?.currentLocation.locationDetails}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link2 className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span className="text-blue-600">
                    {currentCandidate?.linkedin ?? "NA"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>{currentCandidate?.emailId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span className="text-blue-600">
                    {currentCandidate?.github ?? "NA"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span>+91 {currentCandidate?.primaryNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-600 font-semibold" />
                  <span className="text-blue-600">
                    {currentCandidate?.blog ?? "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 gap-4">
            <span className="font-medium text-gray-700">
              Overall Interview Status :
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  overAllStatus === "SELECTED"
                    ? "bg-green-500"
                    : overAllStatus === "IN_PROGRESS"
                    ? "bg-yellow-500"
                    : overAllStatus === "REJECTED"
                    ? "bg-red-500"
                    : overAllStatus === "CANCELLED"
                    ? "bg-gray-500"
                    : overAllStatus === "NOT_YET_SCHEDULED"
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span
                className={`capitalize font-medium ${
                  overAllStatus === "SELECTED"
                    ? "text-green-600"
                    : overAllStatus === "IN_PROGRESS"
                    ? "text-yellow-600"
                    : overAllStatus === "REJECTED"
                    ? "text-red-600"
                    : overAllStatus === "CANCELLED"
                    ? "text-gray-600"
                    : overAllStatus === "NOT_YET_SCHEDULED"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {overAllStatus?.toLowerCase().replace(/_/g, " ") || "unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-white">
          <nav className="flex space-x-8">
            <button
              onClick={() => onTabChange("job")}
              className={`py-2 px-4 border-b-4 font-medium text-sm ${
                activeTab === "job"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Job Info
            </button>
            <button
              onClick={() => onTabChange("jd")}
              className={`py-2 px-4 border-b-4 font-medium text-sm ${
                activeTab === "jd"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              JD Document
            </button>
            <button
              onClick={() => onTabChange("rounds")}
              className={`py-2 px-4 border-b-4 font-medium text-sm ${
                activeTab === "rounds"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Interview Rounds
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "rounds" && (
        <div className="my-6">
          {/* Interviews Section */}
          <section className="space-y-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Interview Rounds</h2>
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded"
                onClick={() => setAddRoundEnabled(true)}
              >
                Add New Round
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 items-start">
              {allRounds && allRounds.length > 0 ? (
                allRounds?.map((round) => (
                  <div
                    className="bg-white border border-gray-300 rounded-md h-full"
                    key={round.roundId}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="p-5">
                        <div className="flex items-start flex-wrap justify-between mb-4">
                          <div className="flex-1">
                            <div className="">
                              <span className="text-xl font-semibold">
                                Round {round.roundNumber}
                              </span>
                              <span
                                className={`py-1 rounded-full font-medium flex items-center gap-2`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full ${
                                    round.interviewStatus === "PASSED"
                                      ? "bg-green-500"
                                      : round.interviewStatus === "ON_HOLD"
                                      ? "bg-yellow-500"
                                      : round.interviewStatus === "REJECTED"
                                      ? "bg-red-500"
                                      : round.interviewStatus === "CANCELLED"
                                      ? "bg-gray-500"
                                      : "bg-blue-500"
                                  }`}
                                ></div>
                                <span
                                  className={`capitalize ${
                                    round.interviewStatus === "PASSED"
                                      ? "text-green-600"
                                      : round.interviewStatus === "ON_HOLD"
                                      ? "text-yellow-600"
                                      : round.interviewStatus === "REJECTED"
                                      ? "text-red-600"
                                      : round.interviewStatus === "CANCELLED"
                                      ? "text-gray-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {round.interviewStatus
                                    ?.toLowerCase()
                                    .replace("_", " ") || "unknown"}
                                </span>
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                              {round.clientJob?.jobTitle}
                            </h3>
                          </div>
                          {/* Action Buttons - Hide Edit button when status is CANCELLED */}
                          {round.interviewStatus !== "CANCELLED" && (
                            <div className="flex gap-2">
                              <button
                                className="flex items-center gap-2 bg-cyan-500 px-4 py-1 text-white rounded-md hover:bg-cyan-600 transition-colors"
                                onClick={() => handleUpdateRound(round)}
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Info Grid */}
                        <div className="bg-white rounded-lg mb-6">
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                            <div className="grid grid-cols-3 p-3 mb-4 gap-4">
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-400 text-white p-3 rounded-full">
                                  <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-sm">Date</p>
                                  <p className="font-semibold text-base">
                                    {new Date(
                                      round.roundDate
                                    ).toLocaleDateString("en-GB")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-400 text-white p-3 rounded-full">
                                  <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-sm opacity-80">Time</p>
                                  <p className="font-semibold text-base">
                                    {new Date(
                                      `2000-01-01T${round.interviewTime}`
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-400 text-white p-3 rounded-full">
                                  <User className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-sm opacity-80">
                                    Interviewer
                                  </p>
                                  <p className="font-semibold text-base">
                                    {round.interviewerName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image Snapshot Section */}
                        { round.interviewImageSnapshot && (
                          <div className="mb-4">
                            <div className="border border-gray-300 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-slate-700">
                                  Interview Snapshot
                                </h4>
                                <button
                                  onClick={() =>
                                    handleViewImage(round.roundId || 1)
                                  }
                                  className="flex items-center gap-2 bg-cyan-500 px-3 py-1 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                  <span>View Image</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Ratings - Only show if status is not "SCHEDULED" or "CANCELLED" */}
                        {round.interviewStatus !== "SCHEDULED" &&
                          round.interviewStatus !== "CANCELLED" && (
                            <>
                              {round.techRating && round.techRating > 0 && (
                                <div className="border-b border-gray-200 pb-2 mb-6">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">
                                      Technical Rating
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-1">
                                        {getRatingStars(round.techRating)}
                                      </div>
                                      <span className="font-semibold text-slate-800 ml-2">
                                        {Math.round(round.techRating)}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {round.softskillsRating &&
                                round.softskillsRating > 0 && (
                                  <div className="border-b border-gray-200 pb-2 mb-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-slate-600">
                                        Soft Skills Rating
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                          {getRatingStars(
                                            round.softskillsRating
                                          )}
                                        </div>
                                        <span className="font-semibold text-slate-800 ml-2">
                                          {round.softskillsRating}/5
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </>
                          )}

                        {/* Technologies Section - Only show if status is not "SCHEDULED" or "CANCELLED" */}
                        {round.interviewStatus !== "SCHEDULED" &&
                          round.interviewStatus !== "CANCELLED" && (
                            <div className="mb-4 space-y-4">
                              <div className="border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-slate-700">
                                    Technologies Interviewed
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {getExistingTech(round.roundId ?? 1).length}{" "}
                                    technologies
                                  </span>
                                </div>
                                <div className="min-h-[60px] max-h-24 overflow-y-auto">
                                  {getRoundTechs(round.roundId ?? 1)}
                                </div>
                              </div>
                              {/* Remarks */}
                              <div className="mb-4">
                                <div className="border border-gray-300 rounded-lg p-4">
                                  <h4 className="font-semibold text-slate-700 mb-2">
                                    Remarks
                                  </h4>
                                  <div className="text-sm text-slate-600 max-h-16 overflow-y-auto">
                                    {round.remarks || "No remarks provided"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex col-span-2 flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                  <div className="mb-6">
                    <CalendarCheck className="w-20 h-20 text-[#00bcd4]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                    No Interview Rounds Scheduled Yet !
                  </h2>
                  <p className="text-base text-[#888888] text-center">
                    Schedule New interview Rounds and they will show up here
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Render the Update Form Popup - Fixed with proper props */}
          {updateRoundEnabled && selectedRound && (
            <Popup>
              <InterviewForm
                masterTechnologies={masterTech || []}
                initialValues={selectedRound}
                id={selectedRound.roundId ?? 0}
                autoClose={() => setUpdateRoundEnabled(false)}
                technologiesData={selectedRoundTechnologies} // Pass existing technologies
              />
            </Popup>
          )}

          {/* Render the Add Round Popup */}
          {addRoundEnabled && currentJobData && (
            <Popup>
              <AddRound
                className="rounded-md bg-white"
                interviewId={contactInterViewId}
                onclose={() => setAddRoundEnabled(false)}
                roundNumber={
                  allRounds?.[allRounds?.length - 1]?.roundNumber ?? 0
                }
                masterTechnologies={masterTech}
              />
            </Popup>
          )}
        </div>
      )}

      {activeTab === "job" && currentJobInfo && (
        <div className="bg-white">
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Client Name</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.client.clientName}
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Job Title</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.jobTitle}
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Job Locations</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.locations.length > 0
                    ? currentJobInfo.clientJob.locations
                        .map((location: any) => location.locationDetails)
                        .join(" | ")
                    : "No Data"}
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Salary</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.salaryInCtc} LPA
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Experience Required</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.experience} YRS
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Job type</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.preferredJobMode}
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Hiring Type</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.hiringType}
                </div>
              </div>
              <div className="p-4 border border-gray-300">
                <div className="text-gray-600 mb-1">Placement Type</div>
                <div className="font-semibold">
                  {currentJobInfo.clientJob.jobPostType}
                </div>
              </div>
            </div>
            {/* Job Description */}
            <div>
              <h2 className="text-xl font-bold text-blue-600">
                Job Description
              </h2>
              <div className="space-y-2">
                {currentJobInfo.clientJob.jobDescription && (
                  <div className="text-sm">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={renderSanitizedHtml(
                        currentJobInfo.clientJob.jobDescription
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "jd" && currentJobInfo && (
        <section id="jd" className="rounded-lg shadow-sm space-y-4 mt-6">
          <PdfViewer
            isJd
            candidateId={currentJobInfo.clientJob.jobId}
            resume={
              currentJobInfo.clientJob.jd ? currentJobInfo.clientJob.jd : ""
            }
          ></PdfViewer>
        </section>
      )}

      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Interview Snapshot</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImage(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Interview Snapshot"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
