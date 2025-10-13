import type React from "react";

import { useState, useEffect } from "react";
import { X, Plus, Check, ChevronDown, GraduationCap } from "lucide-react";

import { createContactTechnology } from "@/api/candidates/candidateTech";
import { createContactCertification } from "@/api/candidates/certification";
import { createContactCompany } from "@/api/candidates/companies";
import { createContactPreferredLocation } from "@/api/candidates/preferredLocation";
import { createContactPreferredJobType } from "@/api/candidates/preferredJob";
import { createContactHiringType } from "@/api/candidates/hiringType";
import { createEducation } from "@/api/candidates/education";
import { createUniversity } from "@/api/candidates/university";
import { createCourse } from "@/api/candidates/courses";
import { Technology } from "@/lib/models/candidate";
import { toast } from "react-toastify";
import { createContactDomain } from "@/api/candidates/domains";
import { useSelector } from "react-redux";

type ProfessionalFormProps = {
  masterSkills: Technology[];
  masterCertifications: any;
  masterCompanies: any;
  masterlocations: any;
  masterDomains: any;
  masterEducations: any;
};

type FormData = {
  skills: string[];
  certifications: string[];
  previousCompanies: string[];
  preferredLocations: string[];
  preferredJobModes: string[];
  hiringTypes: string[];
  domains: string[];
};

type Education = {
  educationId?: number;
  university: {
    universityId: number;
    universityName: string;
    insertedOn?: string;
  };
  course: {
    courseId: number;
    courseName: string;
    level: string;
    insertedOn?: string;
  };
  specialization: string;
  courseType: string;
  startYear: number;
  endYear: number;
  gradingSystem: string;
  marks: number;
  insertedOn?: string | null;
};

// ComboBox Component
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

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

// Education Form Component
const EducationForm = ({
  education,
  onSave,
  onCancel,
  isEdit = false,
  candidateId,
  universities,
  courses,
  setUniversities,
  setCourses,
}: any) => {
  const [formData, setFormData] = useState({
    contactDetails: {
      contactId: candidateId,
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
        universityId: result.universityId || Date.now(),
        universityName: name,
        insertedOn: new Date().toISOString().split("T")[0],
      };
      setUniversities((prev: any) => [...prev, newUni]);
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
        courseId: result.courseId || Date.now(),
        courseName: name,
        level: level,
      };
      setCourses((prev: any) => [...prev, newCourseObj]);

      setSelectedCourseName(name);
      setFormData({ ...formData, courseId: newCourseObj.courseId });
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
      (u: any) => u.universityName === universityName
    );
    if (university) {
      setFormData({ ...formData, universityId: university.universityId });
    }
  };

  const handleCourseChange = (courseName: string) => {
    setSelectedCourseName(courseName);
    const course = courses.find((c: any) => c.courseName === courseName);

    if (course) {
      setFormData({ ...formData, courseId: course.courseId });
      setSelectedLevel(course.level);
      setIsNewCourse(false);
    } else {
      setFormData({ ...formData, courseId: 0 });
      setIsNewCourse(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedUniversity = universities.find(
      (u: any) => u.universityId === formData.universityId
    );
    const selectedCourse = courses.find(
      (c: any) => c.courseId === formData.courseId
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
      contactDetails: { contactId: candidateId },
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
                options={universities.map((uni: any) => ({
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
                options={courses.map((course: any) => ({
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

export default function ProfessionalForm({
  masterSkills,
  masterCertifications,
  masterCompanies,
  masterlocations,
  masterDomains,
  masterEducations
}: ProfessionalFormProps) {
  const [candidateFormData, setFormData] = useState<FormData>({
    skills: [],
    certifications: [],
    previousCompanies: [],
    preferredLocations: [],
    preferredJobModes: [],
    hiringTypes: [],
    domains: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCertificationDropdownOpen, setIsCertificationDropdownOpen] =
    useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  
  // Education states
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const { currentStep, formData } = useSelector(
    (state: any) => state.candidate
  );

  const [candidateId, setCandidateId] = useState<number>(formData.contactId);

  const jobModes = ["Remote", "Onsite", "Hybrid", "Flexible"];
  const hiringTypes = ["Full Time", "Part Time", "Contract", "Flexible"];

  // Initialize with existing form data
  useEffect(() => {
    if (formData.contactId) {
      setCandidateId(formData.contactId);
    }

    // Extract universities and courses from masterEducations
    if (masterEducations && masterEducations.length > 0) {
      const uniqueUniversities = Array.from(new Map(
        masterEducations.map((edu: any) => [edu.university.universityId, edu.university])
      ).values());
      
      const uniqueCourses = Array.from(new Map(
        masterEducations.map((edu: any) => [edu.course.courseId, edu.course])
      ).values());

      setUniversities(uniqueUniversities);
      setCourses(uniqueCourses);
    }
  }, [formData, masterEducations]);

  const addItem = (field: keyof FormData, value: string) => {
    if (!value.trim()) return;

    if (candidateFormData[field].includes(value)) {
      toast.error(`${value} already added`, { position: "top-center" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field as keyof typeof prev] as string[]),
        value.trim(),
      ],
    }));
  };

  // Remove item from array fields
  const removeItem = (field: keyof FormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  // Toggle checkbox values
  const toggleCheckbox = (
    field: "preferredJobModes" | "hiringTypes",
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      return {
        ...prev,
        [field]: (currentValues as string[]).includes(value)
          ? (currentValues as string[]).filter((item) => item !== value)
          : [...(currentValues as string[]), value],
      };
    });
  };

  // Handle adding skill from dropdown or Enter key
  const handleAddSkill = (skillValue?: string) => {
    const valueToAdd = skillValue || newSkill;
    if (!valueToAdd.trim()) {
      toast.error("Please enter a skill", { position: "top-center" });
      return;
    }

    addItem("skills", valueToAdd);
    try {
      createContactTechnology({
        contactDetails: {
          contactId: candidateId,
        },
        technology: {
          techId: masterSkills?.find(
            (skill: any) => skill.technology === valueToAdd
          )?.techId,
          technology: valueToAdd,
        },
      }).then((data) => {
        setNewSkill("");
        setIsDropdownOpen(false);
        console.log(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle adding certification from dropdown or Enter key
  const handleAddCertification = (certValue?: string) => {
    const valueToAdd = certValue || newCertification;
    if (!valueToAdd.trim()) {
      toast.error("Please enter a certification", { position: "top-center" });
      return;
    }

    addItem("certifications", valueToAdd);
    try {
      createContactCertification({
        contactDetails: { contactId: candidateId },
        certification: {
          certificationId: masterCertifications?.find(
            (cert: any) => cert.certificationName === valueToAdd
          )?.certificationId,
          certificationName: valueToAdd,
        },
      }).then((data) => {
        setNewCertification("");
        setIsCertificationDropdownOpen(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle adding company from dropdown or Enter key
  const handleAddCompany = (companyValue?: string) => {
    const valueToAdd = companyValue || newCompany;
    if (!valueToAdd.trim()) {
      toast.error("Please enter a company", { position: "top-center" });
      return;
    }

    addItem("previousCompanies", valueToAdd);
    createContactCompany({
      contactDetails: {
        contactId: candidateId,
      },
      company: {
        companyId: masterCompanies?.find(
          (company: any) =>
            company.companyName.toLowerCase() === valueToAdd.toLowerCase()
        )?.companyId,
      },
    }).then((data) => {
      setNewCompany("");
      setIsCompanyDropdownOpen(false);
    });
  };

  // Handle adding location from dropdown or Enter key
  const handleAddLocation = (locationValue?: string) => {
    const valueToAdd = locationValue || newLocation;
    if (!valueToAdd.trim()) {
      toast.error("Please enter a location", { position: "top-center" });
      return;
    }

    addItem("preferredLocations", valueToAdd);
    createContactPreferredLocation({
      contactDetails: {
        contactId: candidateId,
      },
      location: {
        locationId: masterlocations?.find(
          (location: any) => location.locationDetails === valueToAdd
        )?.locationId,
      },
    }).then((data) => {
      setNewLocation("");
      setIsLocationDropdownOpen(false);
    });
  };

  // Handle adding domain from dropdown or Enter key
  const handleAddDomain = (domainValue?: string) => {
    const valueToAdd = domainValue || newDomain;
    if (!valueToAdd.trim()) {
      toast.error("Please enter a domain", { position: "top-center" });
      return;
    }

    addItem("domains", valueToAdd);
    createContactDomain({
      contactDetails: {
        contactId: candidateId,
      },
      domain: {
        domainId: masterDomains?.find(
          (domain: any) => domain.domainDetails === valueToAdd
        )?.domainId,
      },
    }).then((data) => {
      setNewDomain("");
      setIsDomainDropdownOpen(false);
    });
  };

  // Handle Enter key press for all input fields
  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (field) {
        case 'skills':
          handleAddSkill();
          break;
        case 'certifications':
          handleAddCertification();
          break;
        case 'previousCompanies':
          handleAddCompany();
          break;
        case 'preferredLocations':
          handleAddLocation();
          break;
        case 'domains':
          handleAddDomain();
          break;
      }
    }
  };

  // Education functions
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
      setEditingEducation(null);
    } catch (error) {
      console.error("Error creating education:", error);
      const newEducation = {
        ...educationData,
        educationId: Date.now(),
      };
      setEducations([...educations, newEducation]);
      setShowEducationForm(false);
      setEditingEducation(null);
    }
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setShowEducationForm(true);
  };

  const handleDeleteEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div>
        <div className="flex justify-between items-center px-6">
          <h2 className="text-xl font-medium text-cyan-500">
            Professional Information
          </h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Education Section */}
          <div className="border-b pb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Education
              </h3>
              <button
                type="button"
                onClick={() => setShowEducationForm(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {educations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No education details added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {educations.map((education, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {education.course.courseName} - {education.specialization}
                        </h4>
                        <p className="text-gray-600">{education.university.universityName}</p>
                        <p className="text-sm text-gray-500">
                          {education.startYear} - {education.endYear} | {education.courseType} | {education.gradingSystem}: {education.marks}
                          {education.gradingSystem === "Percentage" ? "%" : ""}
                        </p>
                      </div>
                      {/* <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditEducation(education)}
                          className="text-cyan-600 hover:text-cyan-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rest of the form sections (Skills, Certifications, etc.) remain the same */}
          {/* Skills */}
          <div className="relative">
            <label className="block text-lg font-semibold">Skills</label>
            <div className="flex gap-2 mt-2">
              <input
                name="skills"
                id="skills"
                placeholder="Enter a skill"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0 placeholder-gray-400 rounded-none"
                onClick={() => setIsDropdownOpen(true)}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'skills')}
                value={newSkill}
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterSkills.length > 0 ? (
                    masterSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          handleAddSkill(skill.technology);
                        }}
                      >
                        {skill.technology}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Skills found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("skills", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="relative">
            <label className="block text-lg font-semibold">Certifications</label>
            <div className="flex gap-2 mt-2">
              <input
                name="certifications"
                id="certifications"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0 placeholder-gray-400 rounded-none"
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'certifications')}
                value={newCertification}
                placeholder="Enter certification"
                onClick={() => setIsCertificationDropdownOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsCertificationDropdownOpen(!isCertificationDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              {isCertificationDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterCertifications.length > 0 ? (
                    masterCertifications.map((cert: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          handleAddCertification(cert.certificationName);
                        }}
                      >
                        {cert.certificationName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Certifications found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("certifications", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Companies */}
          <div className="relative">
            <label className="block text-lg font-semibold">Previous Companies</label>
            <div className="flex gap-2 mt-2">
              <input
                name="previousCompanies"
                id="previousCompanies"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0 placeholder-gray-400 rounded-none"
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'previousCompanies')}
                value={newCompany}
                placeholder="Enter company name"
                onClick={() => setIsCompanyDropdownOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              {isCompanyDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterCompanies.length > 0 ? (
                    masterCompanies.map((company: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          handleAddCompany(company.companyName);
                        }}
                      >
                        {company.companyName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Companies found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.previousCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{company}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("previousCompanies", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="relative">
            <label className="block text-lg font-semibold">Preferred Locations</label>
            <div className="flex gap-2 mt-2">
              <input
                name="preferredLocations"
                id="preferredLocations"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0 placeholder-gray-400 rounded-none"
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'preferredLocations')}
                value={newLocation}
                onClick={() => setIsLocationDropdownOpen(true)}
                placeholder="Enter location"
              />
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              {isLocationDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterlocations.length > 0 ? (
                    masterlocations.map((location: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          handleAddLocation(location.locationDetails);
                        }}
                      >
                        {location.locationDetails}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.preferredLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{location}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("preferredLocations", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Domains */}
          <div className="relative">
            <label className="block text-lg font-semibold">Domains</label>
            <div className="flex gap-2 mt-2">
              <input
                name="domains"
                id="domains"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0 placeholder-gray-400 rounded-none"
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'domains')}
                value={newDomain}
                onClick={() => setIsDomainDropdownOpen(true)}
                placeholder="Enter domain"
              />
              <button
                type="button"
                onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              {isDomainDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterDomains.length > 0 ? (
                    masterDomains.map((domain: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          handleAddDomain(domain.domainDetails);
                        }}
                      >
                        {domain.domainDetails}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Domains found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.domains.map((domain, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{domain}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("domains", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Job Mode (Checkboxes) */}
          <div>
            <label className="block text-lg font-semibold mb-6">
              Preferred Job Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {jobModes.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={candidateFormData.preferredJobModes.includes(mode)}
                    onChange={() => {
                      toggleCheckbox("preferredJobModes", mode);
                      createContactPreferredJobType({
                        contactDetails: {
                          contactId: candidateId,
                        },
                        preferredJobMode: mode,
                      }).then((data) => {
                        if (mode === "Flexible") {
                          toggleCheckbox("preferredJobModes", "Remote");
                          toggleCheckbox("preferredJobModes", "Onsite");
                          toggleCheckbox("preferredJobModes", "Hybrid");
                          createContactPreferredJobType({
                            contactDetails: {
                              contactId: candidateId,
                            },
                            preferredJobMode: "Remote",
                          }).then((data) => {
                            createContactPreferredJobType({
                              contactDetails: {
                                contactId: candidateId,
                              },
                              preferredJobMode: "Onsite",
                            }).then((data) => {
                              createContactPreferredJobType({
                                contactDetails: {
                                  contactId: candidateId,
                                },
                                preferredJobMode: "Hybrid",
                              }).then((data) => {});
                            });
                          });
                        }
                      });
                    }}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      candidateFormData.preferredJobModes.includes(mode)
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {candidateFormData.preferredJobModes.includes(mode) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hiring Type (Checkboxes) */}
          <div>
            <label className="block text-lg font-semibold mb-6">Hiring Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hiringTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={candidateFormData.hiringTypes.includes(type)}
                    onChange={() => {
                      toggleCheckbox("hiringTypes", type);
                      createContactHiringType({
                        hiringType: type,
                        contactDetails: {
                          contactId: candidateId,
                        },
                      }).then((data) => {
                        if (type == "Flexible") {
                          toggleCheckbox("hiringTypes", "Full Time");
                          toggleCheckbox("hiringTypes", "Part Time");
                          toggleCheckbox("hiringTypes", "Contract");
                          createContactHiringType({
                            hiringType: "Full Time",
                            contactDetails: {
                              contactId: candidateId,
                            },
                          }).then((data) => {
                            createContactHiringType({
                              hiringType: "Part Time",
                              contactDetails: {
                                contactId: candidateId,
                              },
                            }).then((data) => {
                              createContactHiringType({
                                hiringType: "Contract",
                                contactDetails: {
                                  contactId: candidateId,
                                },
                              }).then((data) => {});
                            });
                          });
                        }
                      });
                    }}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      candidateFormData.hiringTypes.includes(type)
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {candidateFormData.hiringTypes.includes(type) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education Form Modal */}
      {showEducationForm && (
        <EducationForm
          education={editingEducation}
          onSave={handleAddEducation}
          onCancel={() => {
            setShowEducationForm(false);
            setEditingEducation(null);
          }}
          isEdit={!!editingEducation}
          candidateId={candidateId}
          universities={universities}
          courses={courses}
          setUniversities={setUniversities}
          setCourses={setCourses}
        />
      )}
    </div>
  );
}