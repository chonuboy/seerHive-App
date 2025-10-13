// Components
import MainLayout from "@/components/Layouts/layout";
import { Popup } from "@/components/Elements/cards/popup";
import ProfileUpdateForm from "@/components/Forms/candidates/updateProfile";
import PdfViewer from "@/components/Elements/utils/pdfViewer";

// Next.js and React Imports
import { useRouter } from "next/router";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Award,
  Building2,
  CalendarCheck,
  Edit3,
  Github,
  Globe,
  GraduationCap,
  IndianRupee,
  Lightbulb,
  Link2,
  Mail,
  MapPin,
  Phone,
  Route,
  Twitter,
  User,
  ChevronDown,
  Plus,
  Trash2,
  ArrowBigLeftDashIcon,
  Camera,
} from "lucide-react";
// External Libraries
import { toast } from "react-toastify";
import axios from "axios";

// Models and Definitions
import type { Companies, Company } from "@/lib/models/client";
import type {
  Certificates,
  allTechs,
  Domains,
  Interview,
  Technology,
} from "@/lib/models/candidate";
import type { Candidate } from "@/lib/definitions";
import type { ReqData } from "@/lib/models/candidate";

// API Calls
import {
  fetchCandidate,
  getContactImage,
  uploadCandidateImage,
  uploadImage,
} from "@/api/candidates/candidates";
import { fetchAllContactDomains } from "@/api/candidates/domains";
import { fetchAllContactCompanies } from "@/api/candidates/companies";
import { fetchContactCertificationsByContact } from "@/api/candidates/certification";
import { fetchAllCertifications } from "@/api/master/certification";

import {
  updateContactTechnology,
  fetchAllContactTechnologies,
} from "@/api/candidates/candidateTech";
import type { contactCertificate } from "@/lib/models/candidate";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import type { domainDetails } from "@/lib/models/candidate";
import { fetchAllDomains } from "@/api/master/domain";
import { fetchAllCompanies } from "@/api/master/masterCompany";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { getContactPreferredJobTypeByContact } from "@/api/candidates/preferredJob";
import { fetchInterviewsByContact } from "@/api/candidates/interviews";
import { fetchAllContactPreferredLocations } from "@/api/candidates/preferredLocation";
import { getContactHiringTypeByContactId } from "@/api/candidates/hiringType";
import AddCandidateDomain from "@/components/Forms/candidates/addCandidateDomain";
import AddCandidateCompany from "@/components/Forms/candidates/addCandidateCompany";
import AddCandidateCertificate from "@/components/Forms/candidates/addCandidateCertificate";
import AddSkillsForm from "@/components/Forms/candidates/addSkill";
import UpdateCandidateCertificate from "@/components/Forms/candidates/updateCandidateCert";
import {
  createEducation,
  fetchEducationsByContact,
  updateEducation,
  deleteEducation,
} from "@/api/candidates/education";
import { fetchAllCourses } from "@/api/candidates/courses";
import { fetchAllUniversities } from "@/api/candidates/university";
import { createCourse } from "@/api/candidates/courses";
import { createUniversity } from "@/api/candidates/university";

export default function Candidates() {
  // candidate state
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
  // candidate Interviews
  const [candidateInterviews, setCandidateInterviews] = useState<
    Interview[] | []
  >([]);
  // Candidate Technologies
  const [technologies, setTechnologies] = useState<allTechs[] | null>(null);
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [techExp, setTechExp] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [isSkillAdded, setIsSkillAdded] = useState(false);
  const [isSkillUpdated, setIsSkillUpdated] = useState(false);
  const [selectedTech, setSelectedTech] = useState<allTechs | null>(null);
  const [originalTech, setoriginalTech] = useState<allTechs | null>(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isResumeUpoladed, setIsResumeUpladed] = useState(false);
  const experienceOptions = []; // Start with "Less than a year"
  // Add options from 1 year to 10 years
  for (let i = 1; i <= 10; i++) {
    experienceOptions.push(`${i}`); // Add "year" or "years" based on the count
  }
  const [masterTech, setMasterTech] = useState<Technology[] | null>(null);
  const [masterDomains, setMasterDomains] = useState<domainDetails[] | null>(
    null
  );
  // Candidate Domains
  const [candidateDomains, setCandidateDomains] = useState<Domains[] | null>(
    null
  );

  const [masterCompanies, setMasterCompanies] = useState<Company[] | null>(
    null
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [candidateCompanies, setCandidateCompanies] = useState<
    Companies[] | null
  >(null);
  const [masterCertificates, setMasterCertificates] = useState<
    Certificates[] | null
  >(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState<contactCertificate | null>(null);
  const [candidateCertificates, setCandidateCertificates] = useState<
    contactCertificate[] | null
  >(null);
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isCompanyVisible, setIsCompanyVisible] = useState(false);
  const [isDomainVisible, setIsDomainVisible] = useState(false);
  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [isSkillVisible, setIsSkillVisible] = useState(false);

  const [initialData, setInitialData] = useState<ReqData | null>(null);
  const [formData, setFormData] = useState<ReqData | null>(null);
  const [preferredJobType, setPreferredJobType] = useState<any[]>([]);
  const [preferredLocation, setPreferredLocation] = useState<any[]>([]);
  const [hiringTypes, setHiringTypes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isUpdateCertificateVisible, setIsUpdateCertificateVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>("");

  const [educations, setEducations] = useState<any[]>([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [contactId, setContactId] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const ComboBox = ({
    value,
    onChange,
    options,
    placeholder,
    onCreateNew,
    required = false,
    level = "UG",
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { id: number; name: string }[];
    placeholder: string;
    onCreateNew: (name: string, level?: string) => Promise<void>;
    required?: boolean;
    level?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);

      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
    };

    const handleOptionSelect = (option: { id: number; name: string }) => {
      setInputValue(option.name);
      onChange(option.name);
      setIsOpen(false);
    };

    const handleCreateNew = async () => {
      if (
        inputValue.trim() &&
        !options.find(
          (opt) => opt.name.toLowerCase() === inputValue.toLowerCase()
        )
      ) {
        try {
          await onCreateNew(inputValue.trim(), level);
          setIsOpen(false);
        } catch (error) {
          console.error("Failed to create new entry:", error);
        }
      }
    };

    const showCreateOption =
      inputValue.trim() &&
      !options.find(
        (opt) => opt.name.toLowerCase() === inputValue.toLowerCase()
      ) &&
      filteredOptions.length === 0;

    return (
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            placeholder={placeholder}
            required={required}
            minLength={2}
            maxLength={150}
          />
          <ChevronDown
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionSelect(option)}
              >
                {option.name}
              </div>
            ))}
            {showCreateOption && (
              <div
                className="px-3 py-2 hover:bg-cyan-50 cursor-pointer text-cyan-600 border-t border-gray-200"
                onClick={handleCreateNew}
              >
                + Create "{inputValue}"
              </div>
            )}
            {filteredOptions.length === 0 && !showCreateOption && (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const EducationForm = ({
    education,
    onSave,
    onCancel,
    isEdit = false,
  }: any) => {
    const [formData, setFormData] = useState({
      contactDetails: {
        contactId: contactId,
      },
      universityId: education?.university?.universityId || 0,
      courseId: education?.course?.courseId || 0,
      specialization: education?.specialization || "",
      courseType: education?.courseType || "Full Time",
      startYear: education?.startYear || new Date().getFullYear(),
      endYear: education?.endYear || new Date().getFullYear(),
      gradingSystem: education?.gradingSystem || "Percentage",
      marks: education?.marks || 0,
    });

    const [isNewCourse, setIsNewCourse] = useState(false);

    const [selectedUniversityName, setSelectedUniversityName] = useState(
      education?.university?.universityName || ""
    );
    const [selectedCourseName, setSelectedCourseName] = useState(
      education?.course?.courseName || ""
    );
    const [selectedLevel, setSelectedLevel] = useState(
      education?.course?.level || "UG"
    );

    const handleCreateUniversity = async (name: string) => {
      try {
        const newUniversity = { universityName: name };
        const result = await createUniversity(newUniversity);

        const newUni = {
          universityId: Date.now(),
          universityName: name,
          insertedOn: new Date().toISOString().split("T")[0],
        };
        setUniversities((prev) => [...prev, newUni]);
        setFormData({ ...formData, universityId: newUni.universityId });
        setSelectedUniversityName(name);
      } catch (error) {
        console.error("Error creating university:", error);
        toast.error("Failed to create new university. Please try again.", {
          position: "top-center",
        });
      }
    };

    const handleCreateCourse = async (name: string, level: string = "UG") => {
      try {
        const newCourse = { courseName: name, level: level };
        const result = await createCourse(newCourse);

        const newCourseObj = {
          courseId: result.courseId,
          courseName: name,
          level: level,
        };
        setCourses((prev) => [...prev, newCourseObj]);

        setSelectedCourseName(name);
        setFormData({ ...formData, courseId: result.courseId });
        setIsNewCourse(false);
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error("Failed to create new course. Please try again.", {
          position: "top-center",
        });
      }
    };

    const handleUniversityChange = (universityName: string) => {
      setSelectedUniversityName(universityName);
      const university = universities.find(
        (u) => u.universityName === universityName
      );
      if (university) {
        setFormData({ ...formData, universityId: university.universityId });
      }
    };

    const handleCourseChange = (courseName: string) => {
      setSelectedCourseName(courseName);
      const course = courses.find((c) => c.courseName === courseName);

      if (course) {
        // Existing course selected
        setFormData({ ...formData, courseId: course.courseId });
        setSelectedLevel(course.level);
        setIsNewCourse(false);
      } else {
        // New course being entered
        setFormData({ ...formData, courseId: 0 });
        setIsNewCourse(true);
      }
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const selectedUniversity = universities.find(
        (u) => u.universityId === formData.universityId
      );
      const selectedCourse = courses.find(
        (c) => c.courseId === formData.courseId
      );

      if (!selectedUniversity || !selectedCourse) {
        toast.error("Please select both university and course", {
          position: "top-center",
        });
        return;
      }

      if (
        formData.specialization.length < 2 ||
        formData.specialization.length > 150
      ) {
        toast.error("Specialization must be between 2 and 150 characters", {
          position: "top-center",
        });
        return;
      }

      if (formData.startYear < 1900 || formData.endYear < 1900) {
        toast.error("Years must be 1900 or later", { position: "top-center" });
        return;
      }

      if (formData.startYear > formData.endYear) {
        toast.error("Start year cannot be later than end year", {
          position: "top-center",
        });
        return;
      }

      if (
        formData.gradingSystem === "Percentage" &&
        (formData.marks < 0 || formData.marks > 100)
      ) {
        toast.error("Percentage must be between 0 and 100", {
          position: "top-center",
        });
        return;
      }

      if (
        formData.gradingSystem === "CGPA" &&
        (formData.marks < 0 || formData.marks > 10)
      ) {
        toast.error("CGPA must be between 0 and 10", {
          position: "top-center",
        });
        return;
      }

      onSave({
        contactDetails: { contactId: contactId },
        university: {
          universityId: selectedUniversity.universityId,
          universityName: selectedUniversity.universityName,
        },
        course: {
          courseId: selectedCourse.courseId,
          courseName: selectedCourse.courseName,
          level: selectedCourse.level,
        },
        specialization: formData.specialization,
        courseType: formData.courseType,
        startYear: formData.startYear,
        endYear: formData.endYear,
        gradingSystem: formData.gradingSystem,
        marks: formData.marks,
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            {isEdit ? "Update Education" : "Add Education"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  University <span className="text-red-500">*</span>
                </label>
                <ComboBox
                  value={selectedUniversityName}
                  onChange={handleUniversityChange}
                  options={universities.map((uni) => ({
                    id: uni.universityId,
                    name: uni.universityName,
                  }))}
                  placeholder="Select or type university name"
                  onCreateNew={handleCreateUniversity}
                  required={true}
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <ComboBox
                  value={selectedCourseName}
                  onChange={handleCourseChange}
                  options={courses.map((course) => ({
                    id: course.courseId,
                    name: `${course.courseName}`,
                  }))}
                  placeholder="Select or type course name"
                  onCreateNew={(name) =>
                    handleCreateCourse(name, selectedLevel)
                  }
                  required={true}
                  level={selectedLevel}
                />
              </div>

              {/* Show level dropdown only when creating a new course */}
              {isNewCourse && (
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select level for the new course
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Course Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseType}
                  onChange={(e) =>
                    setFormData({ ...formData, courseType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Distance">Distance</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Start Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  value={formData.startYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startYear: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  End Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  value={formData.endYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endYear: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Grading System <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gradingSystem}
                  onChange={(e) =>
                    setFormData({ ...formData, gradingSystem: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="CGPA">CGPA</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {formData.gradingSystem === "Percentage"
                    ? "Percentage"
                    : "CGPA"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step={formData.gradingSystem === "CGPA" ? "0.01" : "1"}
                  min="0"
                  max={formData.gradingSystem === "Percentage" ? "100" : "10"}
                  value={formData.marks}
                  onChange={(e) =>
                    setFormData({ ...formData, marks: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder={
                    formData.gradingSystem === "Percentage" ? "0-100" : "0-10"
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                {isEdit ? "Update" : "Add"} Education
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // API functions
  const handleAddEducation = async (educationData: any) => {
    console.log(educationData);
    try {
      const response = await createEducation(educationData);
      console.log(response);
      if (
        response.message &&
        response.message.includes(
          "Education period overlaps with existing record for contact"
        )
      ) {
        toast.error("Education period overlaps with existing record", {
          position: "top-center",
        });
        return;
      }
      if (response && response.educationId) {
        const newEducation = {
          ...educationData,
          educationId: response.educationId,
        };
        setEducations([...educations, newEducation]);
      } else {
        const newEducation = {
          ...educationData,
          educationId: Date.now(),
        };
        setEducations([...educations, newEducation]);
      }
      setShowEducationForm(false);
    } catch (error) {
      console.error("Error creating education:", error);
      const newEducation = {
        ...educationData,
        educationId: Date.now(),
      };
      setEducations([...educations, newEducation]);
      setShowEducationForm(false);
    }
  };

  const handleUpdateEducation = async (educationData: any) => {
    if (editingEducation) {
      try {
        const updatePayload: any = {
          educationId: editingEducation.educationId,
        };

        if (
          educationData.university?.universityId !==
          editingEducation.university?.universityId
        ) {
          updatePayload.university = educationData.university;
        }

        if (
          educationData.course?.courseId !== editingEducation.course?.courseId
        ) {
          updatePayload.course = educationData.course;
        }

        if (educationData.specialization !== editingEducation.specialization) {
          updatePayload.specialization = educationData.specialization;
        }

        if (educationData.courseType !== editingEducation.courseType) {
          updatePayload.courseType = educationData.courseType;
        }

        if (educationData.startYear !== editingEducation.startYear) {
          updatePayload.startYear = educationData.startYear;
        }

        if (educationData.endYear !== editingEducation.endYear) {
          updatePayload.endYear = educationData.endYear;
        }

        if (educationData.gradingSystem !== editingEducation.gradingSystem) {
          updatePayload.gradingSystem = educationData.gradingSystem;
        }

        if (educationData.marks !== editingEducation.marks) {
          updatePayload.marks = educationData.marks;
        }

        if (Object.keys(updatePayload).length > 1) {
          await updateEducation(editingEducation.educationId, updatePayload);
        }

        setEducations(
          educations.map((edu) =>
            edu.educationId === editingEducation.educationId
              ? { ...educationData, educationId: editingEducation.educationId }
              : edu
          )
        );
        setEditingEducation(null);
        setShowEducationForm(false);
      } catch (error) {
        console.error("Error updating education:", error);
        setEducations(
          educations.map((edu) =>
            edu.educationId === editingEducation.educationId
              ? { ...educationData, educationId: editingEducation.educationId }
              : edu
          )
        );
        setEditingEducation(null);
        setShowEducationForm(false);
      }
    }
  };

  const handleEditEducation = (education: any) => {
    setEditingEducation(education);
    setShowEducationForm(true);
  };

  const handleDeleteEducation = async (educationId: number) => {
    try {
      await deleteEducation(educationId);
      setEducations(
        educations.filter((edu) => edu.educationId !== educationId)
      );
      toast.success("Education record deleted successfully");
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education record");
    }
  };

  const [educationData, setEducationData] = useState<any>(null);

  // Get Operations
  useEffect(() => {
    if (router.isReady) {
      const id = router.query.id;
      setContactId(Number(id));
      fetchCandidate(Number(id))
        .then((data) => {
          setCurrentCandidate(data);
          setInitialData(data);
          setFormData(data);
        })
        .catch((error) => console.log(error));

      fetchAllLocations().then((data) => {
        const allLocatoins = data;
        setLocations(allLocatoins);
      });

      fetchEducationsByContact(Number(id)).then((data) => {
        setEducations(data);
      });

      getContactImage(Number(id)).then((data) => {
        setImgSrc(data);
      });

      fetchEducationsByContact(Number(id)).then((data) => {
        setEducationData(data[0]);
        console.log(data);
      });

      fetchAllContactTechnologies()
        .then((data) => {
          const contactIdToMatch = Number(id);
          // Step 1: Filter objects with the matching contactId
          const filteredData = data.filter(
            (item: any) => item.contactDetails.contactId === contactIdToMatch
          );
          // Step 2: Extract the technology field from the filtered objects
          const technologies = filteredData.map((item: any) => item);
          setTechnologies(technologies);
        })
        .catch((error) => console.log(error));

      fetchAllContactDomains().then((data) => {
        const contactIdToMatch = Number(id);
        // Step 1: Filter objects with the matching contactId
        const filteredData = data.filter(
          (item: any) => item.contactDetails.contactId === contactIdToMatch
        );
        const domains = filteredData.map((item: any) => item);
        setCandidateDomains(domains);
      });

      fetchAllTechnologies()
        .then((data) => {
          setMasterTech(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllDomains()
        .then((data) => {
          setMasterDomains(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllContactCompanies().then((data) => {
        const contactIdToMatch = Number(id);
        // Step 1: Filter objects with the matching contactId
        const filteredData = data.filter(
          (item: any) => item.contactDetails.contactId === contactIdToMatch
        );
        const companies = filteredData.map((item: any) => item);
        setCandidateCompanies(companies);
      });

      fetchContactCertificationsByContact(Number(id)).then((data) => {
        if (data.status === 200) {
          setCandidateCertificates(data.data);
        } else {
          setCandidateCertificates([]);
        }
      });

      fetchAllCompanies()
        .then((data) => {
          setMasterCompanies(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllCertifications().then((data) => {
        setMasterCertificates(data);
      });

      fetchInterviewsByContact(Number(id)).then((data) => {
        if (data.message) {
          setCandidateInterviews([]);
          setIsLoading(false);
        } else {
          setCandidateInterviews(data.content);
          setIsLoading(false);
        }
      });

      getContactPreferredJobTypeByContact(Number(id)).then((data) => {
        let modes;
        if (data.status == "NOT_FOUND") {
          setPreferredJobType([]);
          return;
        }
        if (data.length > 0) {
          modes = data.map((job: any) => ({
            typeId: job.contactPreferredJobModeId,
            jobType: job.preferredJobMode,
          }));
        }
        setPreferredJobType(modes);
      });

      fetchAllContactPreferredLocations().then((data) => {
        if (data.status == "NOT_FOUND") {
          setPreferredLocation([]);
          return;
        } else {
          const filtered = data.filter(
            (item: any) => item.contactDetails.contactId == id
          );
          setPreferredLocation(filtered);
        }
      });

      getContactHiringTypeByContactId(Number(id)).then((data) => {
        let types;
        if (data.status == "NOT_FOUND") {
          setHiringTypes([]);
          return;
        }
        if (data.length > 0) {
          types = data.map((item: any) => ({
            typeId: item.contactHiringTypeId,
            hiringType: item.hiringType,
          }));
        }
        setHiringTypes(types);
      });

      fetchAllUniversities().then((data) => {
        setUniversities(data);
      });

      fetchAllCourses().then((data) => {
        setCourses(data);
      });
    }

    const { mode } = router.query;
    const isEdit = mode ? true : false;
    setIsEdit(isEdit);
  }, [
    isFormVisible,
    isSkillUpdated,
    isSkillAdded,
    isResumeUpoladed,
    router.isReady,
    isDomainVisible,
    isCompanyVisible,
    isCertificateVisible,
    isSkillVisible,
    isUpdateCertificateVisible,
  ]);

  // Put Operation
  const handleUpdateSkill = async (id: number) => {
    setIsSkillUpdated(true);
    const tech = technologies?.[id];
    if (tech) {
      console.log(technologies?.[id]);
      setSelectedTech({
        contactTechId: tech.contactTechId,
        technology: tech.technology,
        experience: tech.experience,
        expertiseLevel: tech.expertiseLevel,
      });
      setoriginalTech({
        contactTechId: tech.contactTechId,
        technology: tech.technology,
        experience: tech.experience,
        expertiseLevel: tech.expertiseLevel,
      });
    } else {
      toast.error("Skill not found.", {
        position: "top-center",
      });
    }
  };

  const handleUpdateContactTechnology = async (event: React.MouseEvent) => {
    event.preventDefault();
    // Check if selectedTech and originalTech are defined
    if (!selectedTech || !originalTech) {
      toast.error("No skill selected for update.", {
        position: "top-center",
      });
      return;
    }

    // Create an object to hold updated fields
    const updatedSkill: any = {};

    // Compare each property with the original value
    if (selectedTech.experience !== originalTech.experience) {
      updatedSkill.experience = selectedTech.experience;
    }
    if (selectedTech.expertiseLevel !== originalTech.expertiseLevel) {
      updatedSkill.expertiseLevel = selectedTech.expertiseLevel;
    }
    updatedSkill.contactDetails = currentCandidate;
    // updatedSkill.technology = selectedTech.technology;
    try {
      // Check if contactTechId is available
      if (selectedTech.contactTechId) {
        // Call the API to update the skill
        const response = await updateContactTechnology(
          selectedTech.contactTechId,
          updatedSkill
        );
        // Update the technologies array in state
        const updatedTechnologies = technologies?.map((tech) =>
          tech.contactTechId === selectedTech.contactTechId
            ? { ...tech, ...updatedSkill } // Merge updated fields
            : tech
        );

        // Update state with the new technologies array
        setTechnologies(updatedTechnologies || []);

        // Reset the update flag and show success message
        setIsSkillUpdated(false);
      } else {
        toast.error("Invalid skill ID. Cannot update.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill. Please try again.", {
        position: "top-center",
      });
    }
  };

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // You'll need to implement this API call
      const response = await uploadCandidateImage(
        file,
        currentCandidate?.contactId
      );
      console.log(response);

      if (response.status === 200) {
        toast.success("Profile image updated successfully");
        // Refresh the image
        if (currentCandidate?.contactId) {
          const newImageUrl = await getContactImage(currentCandidate.contactId);
          setImgSrc(newImageUrl);
        }
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const combinedCandidateData = {
    ...currentCandidate,
    educationId: educationData?.educationId || null,
    courseName: educationData?.course || "",
    university: educationData?.university || "",
    specialization: educationData?.specialization || "",
    courseType: educationData?.courseType || "",
    startYear: educationData?.startYear || "",
    endYear: educationData?.endYear || "",
    gradingSystem: educationData?.gradingSystem || "",
    marks: educationData?.marks || "",
  };

  if (currentCandidate == null) {
    // Static pre-generated HTML
    return (
      <div>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="flex flex-col gap-4 items-center">
              <span className="text-xl font-semibold">Loading</span>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-10 relative md:text-base text-xs">
        <div className="bg-white rounded">
          <div
            className="flex items-center gap-2 px-8 pt-4 text-xl text-cyan-500 cursor-pointer hover:text-cyan-600"
            onClick={() => router.back()}
          >
            <ArrowBigLeftDashIcon className="w-6 h-6" />
            <button className="border-b">Back to Previous Page</button>
          </div>

          {/* Header Section */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              {/* Profile Image */}
              <div className="flex justify-center mr-2 relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100 overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${currentCandidate.firstName} ${currentCandidate.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-white font-semibold text-xl">
                      {currentCandidate.firstName?.charAt(0)}
                      {currentCandidate.lastName?.charAt(0)}
                    </span>
                  )}

                  {/* Upload overlay - only show in edit mode */}
                  {isEdit && (
                    <>
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Camera className="w-6 h-6 ml-3 text-white" />
                          <span className="text-white text-xs block mt-1">
                            Change
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mt-1 mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900 relative">
                    {currentCandidate.firstName} {currentCandidate.lastName}
                    <span
                      className={`w-4 h-4 ${
                        currentCandidate.isActive
                          ? "bg-green-500"
                          : "bg-red-500"
                      } rounded-full absolute -right-6 top-0`}
                    ></span>
                  </h1>
                </div>

                {/* Personal Details Grid */}
                <div className="grid mt-4 grid-cols-2 gap-x-40 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Twitter className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.twitter ?? "NA"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>
                      {currentCandidate.currentLocation?.locationDetails}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>
                      <a
                        href={currentCandidate.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {currentCandidate.linkedin ?? "NA"}
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.emailId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.github ?? "NA"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.primaryNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.blog ?? "NA"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {isEdit && (
              <button
                className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1"
                onClick={() => {
                  setIsFormVisible(true);
                }}
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
                <span className="truncate">Edit</span>
              </button>
            )}
            {!isEdit && (
              <button
                className="px-2 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                onClick={() => {
                  router.push(`/jobs/${currentCandidate.contactId}/alljobs/`);
                  localStorage.setItem(
                    "interviewCandidateId",
                    JSON.stringify(currentCandidate.contactId)
                  );
                }}
              >
                Shortlist Candidate
              </button>
            )}

            {isFormVisible && currentCandidate.contactId && (
              <Popup>
                <div className="my-8">
                  <ProfileUpdateForm
                    autoClose={() => setIsFormVisible(false)}
                    initialValues={combinedCandidateData}
                    masterLocations={locations}
                    preferredJobModes={preferredJobType}
                    hiringTypes={hiringTypes}
                    preferredLocation={preferredLocation}
                    id={currentCandidate.contactId}
                  ></ProfileUpdateForm>
                </div>
              </Popup>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => onTabChange("basic")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Basic Details
              </button>
              <button
                onClick={() => onTabChange("skills")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "skills"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Career & Skills Overview
              </button>
              <button
                onClick={() => onTabChange("resume")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "resume"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => onTabChange("interviews")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "interviews"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Interviews
              </button>
            </nav>
          </div>

          {activeTab === "basic" && (
            <div className="mb-10">
              {currentCandidate && (
                <div className="bg-gray-100 py-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-6">
                      <div className="bg-white p-6 shadow-sm">
                        <div className="border-b-2 border-purple-500 pb-2 mb-4">
                          <h2 className="text-xl font-bold text-gray-900 uppercase">
                            Professional
                          </h2>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Experience
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.totalExperience || "--"} YRS
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Company
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.companyName || "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Role
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.techRole || "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Notice Period
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.noticePeriod || "0"} Days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 shadow-sm">
                      <div className="border-b-2 border-orange-500 pb-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 uppercase">
                          Preferences
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Job Type
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {preferredJobType?.length > 1
                              ? preferredJobType
                                  .map((item) => item["jobType"])
                                  .join(", ")
                              : preferredJobType?.length === 1
                              ? preferredJobType[0].jobType
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Hiring Type
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {hiringTypes?.length > 1
                              ? hiringTypes
                                  .map((item) => item["hiringType"])
                                  .join(", ")
                              : hiringTypes?.length === 1
                              ? hiringTypes[0].hiringType
                              : "-"}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Location
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {preferredLocation?.length > 0
                              ? preferredLocation
                                  .map(
                                    (item) =>
                                      item["location"]["locationDetails"]
                                  )
                                  .join(", ")
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="bg-gradient-to-br bg-white p-6  shadow-sm">
                        <div className="border-b-2 border-pink-500 border-opacity-30 pb-2 mb-6">
                          <h2 className="text-xl font-bold uppercase">
                            Compensation
                          </h2>
                        </div>
                        <div className="space-y-6">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Current Salary
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.currentSalary || "--"} LPA
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Expected Salary
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.expectedSalary || "--"} LPA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" space-y-6">
                      {/* Personal Info Block */}
                      <div className="bg-white p-6 shadow-sm">
                        <div className="border-b-2 border-blue-500 pb-2 mb-4">
                          <h2 className="text-xl font-bold text-gray-900 uppercase">
                            Personal
                          </h2>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Marital Status
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.maritalStatus ?? "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Date of Birth
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.dob &&
                                new Date(
                                  currentCandidate.dob
                                ).toLocaleDateString()}
                              {!currentCandidate?.dob && "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Secondary Number
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.secondaryNumber ?? "NA"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Address
                            </span>
                            <span className="text-sm font-semibold text-gray-900 text-right">
                              {currentCandidate?.addressLocality ?? "NA"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Pincode
                            </span>
                            <span className="text-sm font-semibold text-gray-900 text-right">
                              {currentCandidate?.pinCode ?? "NA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!currentCandidate && (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">Loading</span>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div id="skills" className="p-4 space-y-8">
              {isSkillVisible &&
              masterTech &&
              technologies &&
              masterTech.length > 0 ? (
                <Popup>
                  <AddSkillsForm
                    technologis={masterTech}
                    candidateTechs={technologies}
                    Id={currentCandidate.contactId}
                    autoClose={() => setIsSkillVisible(false)}
                  ></AddSkillsForm>
                </Popup>
              ) : null}

              {technologies && technologies.length > 0 ? (
                <div
                  id="Skills_rating"
                  className="bg-white dark:bg-black dark:text-white rounded-md space-y-4"
                >
                  <div className="flex justify-between mx-1 items-center">
                    <h3 className="text-xl text-cyan-500 font-semibold">
                      Skills
                    </h3>
                    {isEdit && (
                      <button
                        className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center"
                        onClick={() => setIsSkillVisible(true)}
                      >
                        <span className="truncate">Add Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded-md">
                    <table className="min-w-full text-xs md:text-base border border-gray-200">
                      <thead className="bg-gray-100 ">
                        <tr>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Skill
                          </th>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Experience
                          </th>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Expertise Level
                          </th>
                          {isEdit ? (
                            <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                              Actions
                            </th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        {technologies?.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:text-black"
                          >
                            <td className="text-left px-2 py-1 md:px-4 md:py-4 border border-gray-200">
                              {item.technology.technology}
                            </td>
                            <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                              {item.experience ? item.experience : "-"} Yrs
                            </td>
                            <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                              {item.expertiseLevel ? item.expertiseLevel : "-"}
                            </td>
                            {isEdit ? (
                              <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                <button
                                  className="text-cyan-400 hover:text-cyan-600 flex items-center gap-1 focus:outline-none"
                                  onClick={() => {
                                    handleUpdateSkill(index);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4 mt-1" />
                                  Update
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl text-cyan-500 font-semibold">
                    Skills
                  </h3>
                  <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                    <div className="mb-2">
                      <Lightbulb className="w-20 h-20 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                      No Skills Added Yet !
                    </h2>
                    <p className="text-base text-[#888888] text-center">
                      Add New skills and they will show up here
                    </p>
                    {isEdit && (
                      <button
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 mt-4 py-2 rounded"
                        onClick={() => setIsSkillVisible(true)}
                      >
                        Add New Skill
                      </button>
                    )}
                  </div>
                </>
              )}

              <section>
                <div
                  id="domain"
                  className="bg-white dark:bg-black dark:text-white space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-xl text-sm text-cyan-500 font-semibold">
                      Domains
                    </h3>
                    {isEdit &&
                      candidateDomains &&
                      candidateDomains?.length > 0 && (
                        <button
                          onClick={() => setIsDomainVisible(true)}
                          className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center"
                        >
                          <span className="truncate">Add Domain</span>
                        </button>
                      )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-4 w-full">
                      {candidateDomains?.length ? (
                        candidateDomains.map((domain) => (
                          <div
                            key={domain.contactDomainId}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                          >
                            <span>{domain.domain.domainDetails}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg w-full">
                          <div className="mb-6">
                            <Globe className="w-20 h-20 text-[#00bcd4]" />
                          </div>
                          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                            No Domains Added Yet !
                          </h2>
                          <p className="text-base text-[#888888] text-center">
                            Create New domains and they will show up here
                          </p>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 mt-2 rounded"
                              onClick={() => setIsDomainVisible(true)}
                            >
                              Add Domain
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {isDomainVisible && masterDomains && (
                      <Popup>
                        <AddCandidateDomain
                          masterDomains={masterDomains}
                          contactId={currentCandidate.contactId}
                          onCancel={() => setIsDomainVisible(false)}
                          contactDomains={candidateDomains || []}
                        />
                      </Popup>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-white dark:bg-black dark:text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-xl text-cyan-500 text-sm font-semibold">
                      Certificates
                    </h3>
                    {isEdit &&
                      candidateCertificates &&
                      candidateCertificates?.length > 0 && (
                        <button
                          className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                          onClick={() => setIsCertificateVisible(true)}
                        >
                          Add Certificate
                        </button>
                      )}
                  </div>
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {candidateCertificates?.length ? (
                        candidateCertificates.map((certificate) => (
                          <div
                            key={certificate.contactCertificationId}
                            className="bg-white rounded-lg p-4 border-2 border-cyan-400"
                          >
                            {/* Header with title and edit button */}
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-bold text-gray-800 truncate">
                                {certificate.certification?.certificationName}
                              </h2>
                              {isEdit && (
                                <button
                                  className="bg-cyan-500 rounded px-4 py-1 flex items-center text-white justify-between gap-2"
                                  onClick={() => {
                                    setIsUpdateCertificateVisible(true);
                                    setSelectedCertificate(certificate);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                              )}

                              {isUpdateCertificateVisible &&
                                masterCertificates &&
                                selectedCertificate && (
                                  <Popup>
                                    <UpdateCandidateCertificate
                                      onClose={() =>
                                        setIsUpdateCertificateVisible(false)
                                      }
                                      masterCertificates={masterCertificates}
                                      contactCertificate={selectedCertificate}
                                    />
                                  </Popup>
                                )}
                            </div>

                            {/* Validity dates - same flex layout as company dates */}
                            <div className="flex flex-col sm:flex-row justify-between">
                              {certificate.validFrom && (
                                <div className="mb-2 sm:mb-0">
                                  <div className="text-gray-600">
                                    Valid from
                                  </div>
                                  <span className="font-semibold">
                                    {new Date(
                                      certificate.validFrom
                                    ).toLocaleDateString("en-GB")}
                                  </span>
                                </div>
                              )}

                              {certificate.hasExpiry &&
                              certificate.validTill ? (
                                <div>
                                  <div className="text-gray-600">
                                    Valid till
                                  </div>
                                  <span className="font-semibold">
                                    {new Date(
                                      certificate.validTill
                                    ).toLocaleDateString("en-GB")}
                                  </span>
                                </div>
                              ) : !certificate.hasExpiry ? (
                                <div>
                                  <div className="text-gray-600">Expiry</div>
                                  <span className="font-semibold text-green-600">
                                    No expiry
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-gray-600">Validity</div>
                                  <span className="font-semibold text-gray-500">
                                    No validity dates set
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col col-span-3 items-center justify-center rounded-lg w-full max-w-md mx-auto">
                          <div className="mb-6">
                            <Award className="w-20 h-20 text-[#00bcd4]" />
                          </div>
                          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                            No Certificates Added Yet !
                          </h2>
                          <p className="text-base text-[#888888] text-center">
                            Add New certificates and they will show up here
                          </p>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                              onClick={() => setIsCertificateVisible(true)}
                            >
                              Add Certificate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isCertificateVisible && masterCertificates && (
                  <Popup>
                    <AddCandidateCertificate
                      masterCertificates={masterCertificates}
                      onCancel={() => setIsCertificateVisible(false)}
                      contactId={currentCandidate.contactId}
                      contactCertificates={candidateCertificates || []}
                    />
                  </Popup>
                )}
              </section>

              <section className="">
                <div className="flex items-center mb-4 justify-between">
                  <h3 className="md:text-xl text-sm text-cyan-500 font-semibold">
                    Companies
                  </h3>
                  {isEdit &&
                    candidateCompanies &&
                    candidateCompanies?.length > 0 && (
                      <button
                        className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                        onClick={() => setIsCompanyVisible(true)}
                      >
                        Add Company
                      </button>
                    )}
                  {isCompanyVisible &&
                    candidateCompanies &&
                    masterCompanies && (
                      <Popup>
                        <AddCandidateCompany
                          contactId={currentCandidate.contactId}
                          masterCompanies={masterCompanies}
                          onCancel={() => setIsCompanyVisible(false)}
                          contactCompanies={candidateCompanies}
                        ></AddCandidateCompany>
                      </Popup>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {candidateCompanies?.length ? (
                    candidateCompanies?.map((company: any, index) => (
                      <div
                        key={company.contactCompanyId}
                        className=" bg-white rounded-lg p-4 border-2 border-cyan-400"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-800">
                            {company.company.companyName}
                          </h2>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 rounded px-4 py-1 flex items-center text-white justify-between gap-2"
                              onClick={() => {
                                setIsCompanyVisible(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4"></Edit3>
                              Edit
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="">
                            <div className="text-gray-600">Joining Date</div>
                            <span className="font-semibold">
                              {company.joiningDate
                                ? new Date(
                                    company.joiningDate
                                  ).toLocaleDateString("en-GB")
                                : "NA"}
                            </span>
                          </div>

                          <div className="">
                            <div className="text-gray-600">Leaving Date</div>
                            <span className="font-semibold">
                              {company.leavingDate
                                ? new Date(
                                    company.leavingDate
                                  ).toLocaleDateString("en-GB")
                                : "NA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                      <div className="mb-6">
                        <Building2 className="w-20 h-20 text-[#00bcd4]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                        No Companies Added Yet !
                      </h2>
                      <p className="text-base text-[#888888] text-center">
                        Add New companies and they will show up here
                      </p>
                      {isEdit && (
                        <button
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                          onClick={() => setIsCompanyVisible(true)}
                        >
                          Add Company
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center space-x-2">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl text-cyan-500 font-semibold">
                        Education
                      </h3>
                      {isEdit && (
                        <button
                          onClick={() => {
                            setEditingEducation(null);
                            setShowEducationForm(true);
                          }}
                          className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                        >
                          <span className="truncate">Add Education</span>
                        </button>
                      )}
                    </div>

                    {educations.length > 0 ? (
                      <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full text-xs md:text-base border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                University
                              </th>
                              <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                Course
                              </th>
                              <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                Specialization
                              </th>
                              <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                Duration
                              </th>
                              <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                Grade
                              </th>
                              {isEdit && (
                                <th className="font-semibold text-center text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                                  Actions
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {educations.map((education) => (
                              <tr
                                key={education.educationId}
                                className="hover:bg-gray-50 dark:hover:text-black"
                              >
                                <td className="text-left px-2 py-1 md:px-4 md:py-4 border border-gray-200">
                                  {education.university.universityName}
                                </td>
                                <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                  <div>
                                    <div className="font-medium">
                                      {education.course.courseName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {education.course.level} •{" "}
                                      {education.courseType}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                  {education.specialization || "-"}
                                </td>
                                <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                  {education.startYear} - {education.endYear}
                                </td>
                                <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                  {education.marks}{" "}
                                  {education.gradingSystem === "Percentage"
                                    ? "%"
                                    : "CGPA"}
                                </td>
                                {isEdit && (
                                  <td className="text-center px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                    <div className="flex justify-around">
                                      <button
                                        className="text-cyan-600 hover:text-cyan-700 focus:outline-none flex items-center gap-1"
                                        onClick={() =>
                                          handleEditEducation(education)
                                        }
                                      >
                                        <Edit3 className="w-4 h-4" />
                                        Update
                                      </button>
                                      <button
                                        className="text-red-600 hover:text-red-700 focus:outline-none flex items-center gap-1"
                                        onClick={() =>
                                          handleDeleteEducation(
                                            education.educationId
                                          )
                                        }
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto py-12">
                        <div className="mb-6">
                          <GraduationCap className="w-20 h-20 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                          No Education Added Yet!
                        </h2>
                        <p className="text-base text-gray-600 text-center mb-4">
                          Add your educational qualifications and they will show
                          up here
                        </p>
                      </div>
                    )}

                    {showEducationForm && (
                      <EducationForm
                        education={editingEducation || undefined}
                        onSave={
                          editingEducation
                            ? handleUpdateEducation
                            : handleAddEducation
                        }
                        onCancel={() => {
                          setShowEducationForm(false);
                          setEditingEducation(null);
                        }}
                        isEdit={!!editingEducation}
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {isSkillUpdated && selectedTech && (
            <Popup styleMod="h-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">
                  Update Skill
                </h1>

                <div className="space-y-6">
                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Skill <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="skill"
                      disabled
                      type="text"
                      value={selectedTech.technology.technology}
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      onChange={(e) =>
                        setSelectedTech({
                          ...selectedTech,
                          technology: { technology: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Experience (In Years){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="experience"
                      type="text"
                      value={selectedTech.experience}
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      onChange={(e) =>
                        setSelectedTech({
                          ...selectedTech,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Expertise Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="skill"
                      id="skill"
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      value={selectedTech.expertiseLevel}
                      onChange={(e) => {
                        setSelectedTech({
                          ...selectedTech,
                          expertiseLevel: e.target.value,
                        });
                      }}
                    >
                      <option className="text-gray-500" disabled value="">
                        Select level
                      </option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsSkillUpdated(false)}
                    className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleUpdateContactTechnology}
                    className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Popup>
          )}

          {activeTab === "resume" && (
            <section id="resume" className="p-4 rounded-lg shadow-sm space-y-4">
              <h3 className="font-semibold text-cyan-500 text-sm  md:text-xl">
                Resume
              </h3>
              <PdfViewer
                isEdit={isEdit}
                candidateId={Number(router.query.id)}
                autoClose={() => {
                  setIsFormVisible(false);
                }}
                resume={currentCandidate.resume ? currentCandidate.resume : ""}
              ></PdfViewer>
            </section>
          )}

          {activeTab === "interviews" && (
            <section className="p-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="flex flex-col gap-4 items-center">
                    <span className="text-xl font-semibold">Loading</span>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                </div>
              )}

              {/* Error or No Data State */}
              {candidateInterviews &&
                candidateInterviews.length === 0 &&
                !isLoading && (
                  <div className="col-span-2 pb-20 flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                    <div className="mb-6">
                      <CalendarCheck className="w-20 h-20 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                      No Interviews Scheduled Yet!
                    </h2>
                    <p className="text-base text-[#888888] text-center">
                      Schedule new interviews and they will show up here
                    </p>
                    {isEdit && (
                      <button
                        className="px-2 py-1 mt-6 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                        onClick={() => {
                          router.push(
                            `/jobs/${currentCandidate.contactId}/alljobs/`
                          );
                          localStorage.setItem(
                            "interviewCandidateId",
                            JSON.stringify(currentCandidate.contactId)
                          );
                        }}
                      >
                        Shortlist
                      </button>
                    )}
                  </div>
                )}

              {/* Success State */}
              {candidateInterviews && candidateInterviews.length > 0 && (
                <div>
                  <div className="flex justify-end px-6 py-4">
                    {isEdit && (
                      <button
                        className="px-2 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                        onClick={() => {
                          router.push(
                            `/jobs/${currentCandidate.contactId}/alljobs/`
                          );
                          localStorage.setItem(
                            "interviewCandidateId",
                            JSON.stringify(currentCandidate.contactId)
                          );
                        }}
                      >
                        Shortlist
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidateInterviews.map((item, index) => {
                      // Null checks for nested properties
                      const clientName =
                        item.clientJob?.client?.clientName || "Unknown Client";
                      const jobTitle =
                        item.clientJob?.jobTitle || "No Job Title";
                      const salary =
                        item.clientJob?.salaryInCtc || "Not specified";
                      const jobPostType =
                        item.clientJob?.jobPostType || "Not specified";
                      const jobMode =
                        item.clientJob?.clientJob?.preferredJobMode || "Remote";
                      const experience =
                        item.clientJob?.experience || "Not specified";

                      return (
                        <div
                          key={index}
                          className="transform transition-all max-w-2xl duration-300 hover:shadow-xl"
                        >
                          <div className="border border-gray-300 rounded-lg p-6 relative">
                            {/* Header Section */}
                            <div className="flex justify-between flex-wrap mb-4">
                              <h3 className="text-blue-500 font-medium text-lg">
                                {clientName}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-full ${
                                    item.interviewStatus === "SELECTED"
                                      ? "bg-green-500"
                                      : item.interviewStatus === "IN_PROGRESS"
                                      ? "bg-yellow-500"
                                      : item.interviewStatus === "REJECTED"
                                      ? "bg-red-500"
                                      : item.interviewStatus === "CANCELLED"
                                      ? "bg-gray-500"
                                      : "bg-blue-500"
                                  }`}
                                ></div>
                                <div
                                  className={`text-md font-semibold capitalize truncate max-w-32 ${
                                    item.interviewStatus === "SELECTED"
                                      ? "text-green-600"
                                      : item.interviewStatus === "IN_PROGRESS"
                                      ? "text-yellow-600"
                                      : item.interviewStatus === "REJECTED"
                                      ? "text-red-600"
                                      : item.interviewStatus === "CANCELLED"
                                      ? "text-gray-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {item.interviewStatus || "UNKNOWN"}
                                </div>
                              </div>
                            </div>

                            {/* Job Title */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                              {jobTitle}
                            </h2>

                            {/* Salary */}
                            <p className="text-gray-700 mb-4 font-medium flex items-center">
                              <IndianRupee className="w-4 h-4"></IndianRupee>
                              {salary} LPA
                            </p>

                            {/* Job Details and View Rounds Button */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                              {/* Job Details */}
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Route className="w-4 h-4 text-cyan-600 font-semibold"></Route>
                                  <span className="text-sm">{jobPostType}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-cyan-600 font-semibold"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm">{jobMode}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-cyan-600 font-semibold"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2-2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm">{experience}</span>
                                </div>
                              </div>
                            </div>

                            {/* View Rounds Button - Only show if interviewId exists */}
                            {item.interviewId && (
                              <div className="mt-6 flex justify-end">
                                <Link
                                  href={{
                                    pathname: `/candidates/${Number(
                                      router.query.id
                                    )}/interviews/${
                                      item.clientJob?.jobId || "unknown"
                                    }`,
                                    query: {
                                      contactInterViewId: item.interviewId,
                                    },
                                  }}
                                >
                                  <button className="min-w-[120px] h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
                                    View Rounds
                                    <svg
                                      className="w-4 h-4 ml-1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
