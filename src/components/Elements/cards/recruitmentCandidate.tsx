import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  X,
  Award,
  ArrowBigLeftDashIcon,
} from "lucide-react";
import { RecruitCandidateData } from "@/lib/models/recruitmentCandidate";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { RecruitmentCandidateUpdateSchema } from "@/lib/models/recruitmentCandidate";
import { Popup } from "./popup";
import {
  fetchRecruitmentResume,
  updateRecruitmentData,
  uploadRecruitmentResume,
} from "@/api/recruitment/recruitmentData";
import { toast } from "react-toastify";
import mammoth from "mammoth";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { useRouter } from "next/router";

export default function RecruitmentCandidateCard({
  candidate,
}: {
  candidate: RecruitCandidateData;
}) {
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [currentPreferredRole, setCurrentPreferredRole] = useState("");
  const [currentPrimarySkill, setCurrentPrimarySkill] = useState("");
  const [currentSecondarySkill, setCurrentSecondarySkill] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResumeuploaded, setIsResumeUploaded] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updatedFileName, setUpdatedFileName] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleChooseFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    fileInputRef?.current?.click();
  };

  const handleFileClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const target = event.target;
    if (target && target.type === "file") {
      setFile(target?.files?.[0]);
      setUpdatedFileName(target?.files?.[0]?.name);
      console.log(target?.files?.[0]);
    }
  };

  const handleUpload = async (event: any) => {
    event.stopPropagation();
    if (!file) return;
    try {
      uploadRecruitmentResume(Number(candidate.id), file).then((data) => {
        toast.success("Resume Uploaded Succesfully", {
          position: "top-right",
        });
        setIsResumeOpen(false);
      });
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
    }
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

  const formik = useFormik({
    initialValues: {
      recruiterName: candidate?.recruiterName || "",
      portal: candidate?.portal || "",
      candidateName: candidate?.candidateName || "",
      role: candidate?.role || "",
      qualification: candidate?.qualification || "",
      primarySkill: candidate?.primarySkill || "",
      secondarySkill: candidate?.secondarySkill || "",
      totalExperience: candidate?.totalExperience || 0,
      relevantExperience: candidate?.relevantExperience || 0,
      communicationSkillsRating: candidate?.communicationSkillsRating || 0,
      technicalSkillsRating: candidate?.technicalSkillsRating || 0,
      contactNumber: candidate?.contactNumber || "",
      emailID: candidate?.emailID || "",
      currentLocation: candidate?.currentLocation || "",
      preferredLocation: candidate?.preferredLocation || "",
      currentCTC: candidate?.currentCTC || 0,
      expectedCTC: candidate?.expectedCTC || 0,
      noticePeriod: candidate?.noticePeriod || 0,
      preferredRoles: candidate?.preferredRoles || [],
      sourcingStatus: candidate?.sourcingStatus || "Active",
      remarks: candidate?.remarks || "",
    },
    // validationSchema: RecruitmentCandidateUpdateSchema,
    onSubmit: (values) => {
      const updatedFields = getUpdatedFields(candidate, values);
      console.log("Fields to update:", updatedFields);
      try {
        updateRecruitmentData(candidate.id ?? 1, updatedFields).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Profile updated successfully", {
              position: "top-right",
            });
            setIsProfileUpdated(false);
            window.location.reload();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
        });
      }
    },
  });

  const addPrimarySkill = () => {
    if (currentPrimarySkill.trim()) {
      const updatedSkills = formik.values.primarySkill
        ? `${formik.values.primarySkill},${currentPrimarySkill}`
        : currentPrimarySkill;
      formik.setFieldValue("primarySkill", updatedSkills);
      setCurrentPrimarySkill("");
    }
  };

  const addSecondarySkill = () => {
    if (currentSecondarySkill.trim()) {
      const updatedSkills = formik.values.secondarySkill
        ? `${formik.values.secondarySkill},${currentSecondarySkill}`
        : currentSecondarySkill;
      formik.setFieldValue("secondarySkill", updatedSkills);
      setCurrentSecondarySkill("");
    }
  };

  const removePrimarySkill = (index: number) => {
    const skills = formik.values.primarySkill.split(",");
    skills.splice(index, 1);
    formik.setFieldValue("primarySkill", skills.join(","));
  };

  const removeSecondarySkill = (index: number) => {
    const skills = formik.values.secondarySkill.split(",");
    skills.splice(index, 1);
    formik.setFieldValue("secondarySkill", skills.join(","));
  };
  const loadPdf = async (resume: any, candidateId: any) => {
    let objectUrl: string | null = null;
    let pdfData: any;
    setIsResumeOpen(true);
    try {
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

  useEffect(() => {
    if (candidate) {
      formik.setValues({
        ...candidate,
        preferredRoles: candidate.preferredRoles || [],
      });
    }
  }, [candidate]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div
        className="flex items-center gap-2 px-8 pt-6 pb-2 text-xl text-cyan-500 cursor-pointer hover:text-cyan-600"
        onClick={() => router.back()}
      >
        <ArrowBigLeftDashIcon className="w-6 h-6" />
        <button className="border-b">Back to Previous Page</button>
      </div>
      <main className="">
        <section className="space-y-10 relative md:text-base text-xs">
          <div className="pb-24 rounded">
            {/* Header Section */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex justify-center mr-2">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                    <span className="text-white font-semibold text-xl">P</span>
                  </div>
                </div>
                {/* Name and Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mt-1 mb-2">
                    <h1 className="text-3xl font-semibold text-gray-900 relative">
                      {candidate.candidateName}
                      <span className="w-4 h-4 bg-green-500 rounded-full absolute -right-6 top-0"></span>
                    </h1>
                  </div>
                  <p className="text-lg text-blue-600 mb-4">{candidate.role}</p>
                  {/* Personal Details Grid */}
                  <div className="grid mt-4 grid-cols-2 gap-x-40 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📧</span>
                      <span>{candidate.emailID}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🏢</span>
                      <span>{candidate.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🎓</span>
                      <span>{candidate.qualification}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">💼</span>
                      <span>{candidate.totalExperience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📍</span>
                      <span>{candidate.currentLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🔗</span>
                      <span className="text-blue-600">LinkedIn Profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📞</span>
                      <span>{candidate.contactNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🌐</span>
                      <span className="text-blue-600">Portfolio URL</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Edit Button */}

              <div className="flex gap-4">
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={() => setIsProfileUpdated(true)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit</span>
                </button>
                {((candidate?.resumeLink &&
                  candidate?.resumeLink.includes("pdf")) ||
                  (candidate?.resumeLink &&
                    candidate?.resumeLink.includes("docx"))) && (
                  <button
                    onClick={() => {
                      loadPdf(candidate?.resumeLink, Number(candidate.id));
                    }}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    View Resume
                  </button>
                )}
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
                        marginTop: "40px",
                        marginBottom: "40px",
                      }}
                      title="Candidate Resume"
                    />
                  </Popup>
                )}

                <button
                  onClick={() => setIsResumeUploaded(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  Upload Resume
                </button>
              </div>
              {isResumeuploaded && (
                <Popup onClose={() => setIsResumeUploaded(false)}>
                  <div className="text-sm md:text-base mt-28">
                    <div className="space-y-3 rounded-lg">
                      <div
                        className="mt-2 flex flex-col items-center justify-center w-full p-4 h-30 rounded-lg border border-dashed border-gray-900/25 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <div className="mb-4 flex text-sm/6 text-gray-500">
                          <button
                            className="border border-dashed  border-gray-900 px-2 font-semibold"
                            type="button"
                            onClick={handleChooseFile}
                          >
                            Choose a File
                          </button>
                          <input
                            type="file"
                            name="resume"
                            ref={fileInputRef}
                            accept=".pdf, .doc, .docx"
                            style={{ display: "none" }}
                            onClick={handleFileClick}
                            onChange={handleFileChange}
                          />
                          <p className="pl-2">or drag and drop</p>
                        </div>
                        <p className="text-xs/4 text-gray-500">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                        {file && (
                          <p className="mt-4 text-green-500">File Selected</p>
                        )}
                        <button
                          className="bg-[var(--button-background)] text-white py-2 px-4 rounded mt-4 hover:bg-[var(--hover-button-background)] hover:text-[var(--hover-button-foreground)]  disabled:[var(--disabled-button-background)] "
                          type="button"
                          onClick={handleUpload}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`py-2 px-4 border-b-4 font-medium text-sm ${
                    activeTab === "basic"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Basic Details
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`py-2 px-4 border-b-4 font-medium text-sm ${
                    activeTab === "skills"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Skills & Others
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "basic" && (
              <div className="bg-gray-100">
                <div className="bg-white">
                  {/* Main content grid */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Contact Info */}
                    <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Mail className="mt-1 mr-3 text-blue-600" size={18} />
                          <div>
                            <p className="text-sm opacity-70">Email</p>
                            <p className="font-medium">{candidate.emailID}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone
                            className="mt-1 mr-3 text-blue-600"
                            size={18}
                          />
                          <div>
                            <p className="text-sm opacity-70">Phone</p>
                            <p className="font-medium">
                              {candidate.contactNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin
                            className="mt-1 mr-3 text-blue-600"
                            size={18}
                          />
                          <div>
                            <p className="text-sm opacity-70">
                              Current Location
                            </p>
                            <p className="font-medium">
                              {candidate.currentLocation}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin
                            className="mt-1 mr-3 text-blue-600"
                            size={18}
                          />
                          <div>
                            <p className="text-sm opacity-70">
                              Preferred Location
                            </p>
                            <p className="font-medium">
                              {candidate.preferredLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Professional Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Role
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            {candidate.role}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Total Experience
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            {candidate.totalExperience} years
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Relevant Experience
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            {candidate.relevantExperience} years
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compensation */}
                    <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Compensation
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Current CTC
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            ₹{candidate.currentCTC} LPA
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Expected CTC
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            ₹{candidate.expectedCTC} LPA
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold mb-1 block">
                            Notice Period
                          </span>
                          <span className="text-lg font-medium text-cyan-500">
                            {candidate.noticePeriod} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Skills */}
                <div className="bg-white rounded-lg p-6 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-500">
                    <Award size={18} className="mr-2" /> Skills
                  </h3>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Primary Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.primarySkill &&
                      candidate.primarySkill.length > 0
                        ? candidate.primarySkill.split(",").map(
                            (skill, index) =>
                              skill.trim() && (
                                <div className="flex items-center gap-2 px-4 py-0 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium">
                                  <span key={index} className="">
                                    {skill.trim()}
                                  </span>
                                </div>
                              )
                          )
                        : null}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secondary Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.secondarySkill &&
                      candidate.secondarySkill.length > 0
                        ? candidate.secondarySkill.split(",").map(
                            (skill, index) =>
                              skill.trim() && (
                                <div className="flex items-center gap-2 px-4 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium">
                                  <span key={index} className="">
                                    {skill.trim()}
                                  </span>
                                </div>
                              )
                          )
                        : null}
                    </div>
                  </div>
                </div>

                {/* Skill Ratings */}
                <div className="bg-white rounded-lg p-6 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-500">
                    <Star size={18} className="mr-2" /> Skill Ratings
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Communication Skills</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {getRatingStars(
                              candidate.communicationSkillsRating
                            )}
                          </div>
                          <span className="font-semibold text-slate-800 ml-2">
                            {candidate.communicationSkillsRating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Technical Skills</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {getRatingStars(candidate.technicalSkillsRating)}
                          </div>
                          <span className="font-semibold text-slate-800 ml-2">
                            {candidate.technicalSkillsRating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferred Roles */}
                <div className="bg-white rounded-lg p-6 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-500">
                    <Briefcase size={18} className="mr-2" /> Preferred Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.preferredRoles &&
                      candidate.preferredRoles.map((role, index) => (
                        <div className="flex items-center gap-2 px-4 py-0 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium">
                          <span key={index} className=" ">
                            {role.trim()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recruiter Notes */}
                <div className="bg-white rounded-lg p-6 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-500">
                    Recruiter Notes
                  </h3>
                  <div className="p-4 rounded bg-gray-100 italic">
                    <p>{candidate.remarks}</p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-purple-500 text-white mr-3">
                      {candidate.recruiterName &&
                        candidate.recruiterName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{candidate.recruiterName}</p>
                      <p className="text-sm opacity-70">
                        Recruiter • {candidate.portal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Update Profile Popup */}
        {isProfileUpdated && (
          <Popup onClose={() => setIsProfileUpdated(false)}>
            <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl my-8">
              {/* Header */}
              <div className="px-8 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Update Profile
                </h1>
              </div>

              <form onSubmit={formik.handleSubmit} className="p-8">
                {/* Basic Information */}
                <div className="space-y-8 pb-6 mb-6">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="recruiterName"
                        className="block font-semibold mb-2"
                      >
                        Recruiter Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="recruiterName"
                        name="recruiterName"
                        value={formik.values.recruiterName}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="portal"
                        className="block font-semibold mb-2"
                      >
                        Portal <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="portal"
                        name="portal"
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                        value={formik.values.portal}
                        onChange={formik.handleChange}
                      >
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Referral">Referral</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="candidateName"
                        className="block font-semibold mb-2"
                      >
                        Candidate Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="candidateName"
                        type="text"
                        name="candidateName"
                        value={formik.values.candidateName}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block font-semibold mb-2"
                      >
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="role"
                        type="text"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="qualification"
                        className="block font-semibold mb-2"
                      >
                        Qualification <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="qualification"
                        type="text"
                        name="qualification"
                        value={formik.values.qualification}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Experience */}
                <div className="space-y-8 pb-6 mb-6">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-4">
                    Skills & Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label
                        htmlFor="primarySkill"
                        className="block font-semibold mb-2"
                      >
                        Primary Skill <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="primarySkillInput"
                          value={currentPrimarySkill}
                          onChange={(e) =>
                            setCurrentPrimarySkill(e.target.value)
                          }
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                          placeholder="Add primary skill Comma Seperated"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addPrimarySkill();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addPrimarySkill}
                          className="absolute right-0 top-4 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formik.values.primarySkill &&
                          formik.values.primarySkill.split(",").map(
                            (skill, index) =>
                              skill.trim() && (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center"
                                >
                                  {skill.trim()}
                                  <X
                                    onClick={() => removePrimarySkill(index)}
                                    className="ml-1 w-3 h-3 cursor-pointer hover:text-red-500"
                                  />
                                </span>
                              )
                          )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="secondarySkill"
                        className="block font-semibold mb-2"
                      >
                        Secondary Skill <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="secondarySkillInput"
                          value={currentSecondarySkill}
                          onChange={(e) =>
                            setCurrentSecondarySkill(e.target.value)
                          }
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                          placeholder="Add secondary skill Comma Seperated"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSecondarySkill();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addSecondarySkill}
                          className="absolute right-0 top-4 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formik.values.secondarySkill &&
                          formik.values.secondarySkill.split(",").map(
                            (skill, index) =>
                              skill.trim() && (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800 flex items-center"
                                >
                                  {skill.trim()}
                                  <X
                                    onClick={() => removeSecondarySkill(index)}
                                    className="ml-1 w-3 h-3 cursor-pointer hover:text-red-500"
                                  />
                                </span>
                              )
                          )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="totalExperience"
                        className="block font-semibold mb-2"
                      >
                        Total Experience (Years){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="totalExperience"
                        type="number"
                        name="totalExperience"
                        value={formik.values.totalExperience}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="relevantExperience"
                        className="block font-semibold mb-2"
                      >
                        Relevant Experience (Years){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="relevantExperience"
                        type="number"
                        name="relevantExperience"
                        value={formik.values.relevantExperience}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="communicationSkillsRating"
                        className="block font-semibold mb-2"
                      >
                        Communication Skills Rating (1-5){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="communicationSkillsRating"
                        type="number"
                        name="communicationSkillsRating"
                        value={formik.values.communicationSkillsRating}
                        onChange={formik.handleChange}
                        min={0}
                        max={5}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="technicalSkillsRating"
                        className="block font-semibold mb-2"
                      >
                        Technical Skills Rating (1-5){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="technicalSkillsRating"
                        type="number"
                        name="technicalSkillsRating"
                        min={0}
                        max={5}
                        value={formik.values.technicalSkillsRating}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-8 pb-6 mb-4">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contactNumber"
                        className="block font-semibold mb-2"
                      >
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactNumber"
                        type="tel"
                        name="contactNumber"
                        value={formik.values.contactNumber}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="emailID"
                        className="block font-semibold mb-2"
                      >
                        Email ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="emailID"
                        type="email"
                        name="emailID"
                        value={formik.values.emailID}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="currentLocation"
                        className="block font-semibold mb-2"
                      >
                        Current Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="currentLocation"
                        type="text"
                        name="currentLocation"
                        value={formik.values.currentLocation}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preferredLocation"
                        className="block font-semibold mb-2"
                      >
                        Preferred Location{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="preferredLocation"
                        type="text"
                        name="preferredLocation"
                        value={formik.values.preferredLocation}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Compensation & Notice Period */}
                <div className="pb-6 mb-6 space-y-8">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-4">
                    Compensation & Availability
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="currentCTC"
                        className="block font-semibold mb-2"
                      >
                        Current CTC (₹) LPA{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="currentCTC"
                        type="number"
                        name="currentCTC"
                        min="0"
                        value={formik.values.currentCTC}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expectedCTC"
                        className="block font-semibold mb-2"
                      >
                        Expected CTC (₹) LPA{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="expectedCTC"
                        type="number"
                        name="expectedCTC"
                        min="0"
                        value={formik.values.expectedCTC}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="noticePeriod"
                        className="block font-semibold mb-2"
                      >
                        Notice Period (Days){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="noticePeriod"
                        type="number"
                        name="noticePeriod"
                        min="0"
                        value={formik.values.noticePeriod}
                        onChange={formik.handleChange}
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Roles */}
                <div className="pb-6 mb-6 space-y-2">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-2">
                    Preferred Roles
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentPreferredRole}
                      placeholder="Enter preferred roles"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                      onChange={(e) => setCurrentPreferredRole(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (currentPreferredRole.trim()) {
                            formik.setFieldValue("preferredRoles", [
                              ...formik.values.preferredRoles,
                              currentPreferredRole,
                            ]);
                            setCurrentPreferredRole("");
                          }
                        }
                      }}
                    />
                    <button
                      className="absolute right-0 top-4 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                      type="button"
                      onClick={() => {
                        if (currentPreferredRole.trim()) {
                          formik.setFieldValue("preferredRoles", [
                            ...formik.values.preferredRoles,
                            currentPreferredRole,
                          ]);
                          setCurrentPreferredRole("");
                        }
                      }}
                    >
                      Add
                    </button>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formik.values.preferredRoles.map((role, index) => (
                        <div key={index} className="relative">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {role.trim()}
                            <X
                              onClick={() => {
                                const updatedRoles =
                                  formik.values.preferredRoles.filter(
                                    (_, i) => i !== index
                                  );
                                formik.setFieldValue(
                                  "preferredRoles",
                                  updatedRoles
                                );
                              }}
                              className="inline-block ml-1 w-3 h-3 cursor-pointer text-blue-800 hover:text-red-500"
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="pb-6 mb-6 space-y-2">
                  <h3 className="text-lg font-semibold text-cyan-500 mb-4">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="sourcingStatus"
                        className="block font-semibold mb-2"
                      >
                        Sourcing Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="sourcingStatus"
                        name="sourcingStatus"
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                        value={formik.values.sourcingStatus}
                        onChange={formik.handleChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Passive">Inactive</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Hired">Hired</option>
                        <option value="Eval">Eval</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="remarks"
                        className="block font-semibold mb-2"
                      >
                        Remarks <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="remarks"
                        name="remarks"
                        rows={4}
                        value={formik.values.remarks}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsProfileUpdated(false)}
                    className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </Popup>
        )}

        <footer className=" text-gray-600">
          <div className="container px-4 text-center">
            <p>Last Updated: {candidate.date}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
