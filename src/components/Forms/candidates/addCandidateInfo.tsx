import type React from "react";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";

import { createContactTechnology } from "@/api/candidates/candidateTech";
import { createContactCertification } from "@/api/candidates/certification";
import { createContactCompany } from "@/api/candidates/companies";
import { createContactPreferredLocation } from "@/api/candidates/preferredLocation";
import { createContactPreferredJobType } from "@/api/candidates/preferredJob";
import { createContactHiringType } from "@/api/candidates/hiringType";
import { Technology } from "@/lib/models/candidate";
import { toast } from "react-toastify";
import { createContactDomain } from "@/api/candidates/domains";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";

// This would be provided by the parent component
type ProfessionalFormProps = {
  candidateId: number;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  onSkip: () => void;
  masterSkills: Technology[];
  masterCertifications: any;
  masterCompanies: any;
  masterlocations: any;
  masterDomains: any;
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

export default function ProfessionalForm({
  candidateId,
  onClose,
  onSubmit,
  onSkip,
  masterSkills,
  masterCertifications,
  masterCompanies,
  masterlocations,
  masterDomains,
}: ProfessionalFormProps) {
  const [formData, setFormData] = useState<FormData>({
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

  const jobModes = ["Remote", "Onsite", "Hybrid", "Flexible"];
  const hiringTypes = ["Full Time", "Part Time", "Contract", "Flexible"];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (field: keyof FormData, value: string) => {
    if (!value.trim()) return;

    if (formData[field].includes(value)) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-xs md:text-base mt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto dark:text-black">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Professional Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex gap-2">
              <select
                name=""
                id=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400"
                onChange={(e) => setNewSkill(e.target.value)}
                value={newSkill}
              >
                <option value="">Select a Skill</option>
                {masterSkills?.map((skill: any, index: number) => (
                  <option
                    key={index}
                    value={skill.technology}
                    className="hover:text-white text-black"
                  >
                    {skill.technology}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  addItem("skills", newSkill);
                  try {
                    createContactTechnology({
                      contactDetails: {
                        contactId: candidateId,
                      },
                      technology: {
                        techId: masterSkills?.find(
                          (skill: any) => skill.technology === newSkill
                        )?.techId,
                        technology: newSkill,
                      },
                    }).then((data) => {
                      console.log(data);
                      setNewSkill("");
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-6 my-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-300 py-0.5 px-3  rounded-full relative mt-2"
                >
                  <span className="text-sm">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("skills", index)}
                    className="bg-red-500 text-white rounded-full ml-2 p-1 hover:bg-red-600 absolute -top-2 -right-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications
            </label>

            <div className="flex gap-2">
              <select
                name=""
                id=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400"
                onChange={(e) => setNewCertification(e.target.value)}
                value={newCertification}
              >
                <option value="">Select a Certification</option>
                {masterCertifications?.map((cert: any, index: number) => (
                  <option
                    className="text-black"
                    value={cert.certificationName}
                    key={index}
                  >
                    {cert.certificationName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  addItem("certifications", newCertification);
                  try {
                    createContactCertification({
                      contactDetails: { contactId: candidateId },
                      certification: {
                        certificationId: masterCertifications?.find(
                          (cert: any) =>
                            cert.certificationName === newCertification
                        ).certificationId,
                        certificationName: newCertification,
                      },
                    }).then((data) => {
                      setNewCertification("");
                    });
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-4 my-2">
              {formData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-300 py-0.5 px-3  rounded-full relative mt-2"
                >
                  <span className="text-sm">{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("certifications", index)}
                    className="bg-red-500 text-white rounded-full ml-2 p-1 hover:bg-red-600 absolute -top-2 -right-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Companies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous Companies
            </label>

            <div className="flex gap-2">
              <select
                name=""
                id=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400"
                onChange={(e) => setNewCompany(e.target.value)}
                value={newCompany}
              >
                <option value="">Select a Company</option>
                {masterCompanies?.map((company: any, index: number) => (
                  <option
                    className="text-black"
                    value={company.companyName}
                    key={index}
                  >
                    {company.companyName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  addItem("previousCompanies", newCompany);
                  createContactCompany({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    company: {
                      companyId: masterCompanies?.find(
                        (company: any) =>
                          company.companyName.toLowerCase() ===
                          newCompany.toLowerCase()
                      )?.companyId,
                    },
                  }).then((data) => {
                    setNewCompany("");
                    console.log(data);
                  });
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 my-2">
              {formData.previousCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-gray-300 py-0.5 px-3 rounded-full relative mt-2"
                >
                  <span className="text-sm">{company}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("previousCompanies", index)}
                    className="bg-red-500 text-white rounded-full ml-2 p-1 hover:bg-red-600 absolute -top-2 -right-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Locations
            </label>

            <div className="flex gap-2">
              <select
                name=""
                id=""
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400"
                onChange={(e) => setNewLocation(e.target.value)}
                value={newLocation}
              >
                <option value="">Select a Location</option>
                {masterlocations?.map((location: any, index: number) => (
                  <option
                    className="text-black"
                    value={location.locationDetails}
                    key={index}
                  >
                    {location.locationDetails}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  addItem("preferredLocations", newLocation);
                  createContactPreferredLocation({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    location: {
                      locationId: masterlocations?.find(
                        (location: any) =>
                          location.locationDetails === newLocation
                      ).locationId,
                    },
                  }).then((data) => {
                    setNewLocation("");
                  });
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 my-2">
              {formData.preferredLocations.map((location, index) => (
                <div
                  key={index}
                  className="bg-gray-300 py-0.5 px-3 rounded-full relative mt-2"
                >
                  <span className="text-sm">{location}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("preferredLocations", index)}
                    className="bg-red-500 text-white rounded-full ml-2 p-1 hover:bg-red-600 absolute -top-2 -right-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Domains */}

          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Domain
            </label>

            <div className="flex gap-2">
              <select
                id="domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400"
              >
                <option value="">Select a domain</option>
                {masterDomains?.map((domain: any) => (
                  <option
                    key={domain}
                    value={domain.domainDetails}
                    className="text-black"
                  >
                    {domain.domainDetails}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  addItem("domains", newDomain);
                  createContactDomain({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    domain: {
                      domainId: masterDomains?.find(
                        (domain: any) => domain.domainDetails === newDomain
                      ).domainId,
                    },
                  }).then((data) => {
                    setNewDomain("");
                  });
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 my-2">
              {formData.domains.map((domain, index) => (
                <div
                  key={index}
                  className="bg-gray-300 py-0.5 px-3 rounded-full relative mt-2"
                >
                  <span className="text-sm">{domain}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("domains", index)}
                    className="bg-red-500 text-white rounded-full ml-2 p-1 hover:bg-red-600 absolute -top-2 -right-3"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Job Mode (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Job Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {jobModes.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 border rounded flex items-center justify-center ${
                      formData.preferredJobModes.includes(mode)
                        ? "bg-blue-700 border-blue-700"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
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
                  >
                    {formData.preferredJobModes.includes(mode) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hiring Type (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiring Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {hiringTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 border rounded flex items-center justify-center ${
                      formData.hiringTypes.includes(type)
                        ? "bg-blue-700 border-blue-700"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
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
                  >
                    {formData.hiringTypes.includes(type) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <CancelButton executable={onSkip}></CancelButton>
            <CancelButton executable={onClose}></CancelButton>
            <SubmitButton label="Save"></SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
