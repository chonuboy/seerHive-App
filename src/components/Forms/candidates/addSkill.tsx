import { useState } from "react";
import { BookOpen, Briefcase, ChevronDown } from "lucide-react";
import { allTechs, Technology } from "@/lib/models/candidate";
import { toast } from "react-toastify";
import { createTechnology } from "@/api/master/masterTech";
import { createContactTechnology } from "@/api/candidates/candidateTech";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";

export default function AddSkillsForm({
  technologis,
  Id,
  autoClose,
  candidateTechs,
}: {
  technologis?: Technology[];
  Id: any;
  autoClose: () => void;
  candidateTechs?: allTechs[];
}) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [expertise, setExpertise] = useState(0);
  const [expertiseLevel, setExpertiseLevel] = useState("Beginner");
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [isYearsDropdownOpen, setIsYearsDropdownOpen] = useState(false);
  const [allTech, setAllTech] = useState(technologis);


  const yearOptions = Array.from({ length: 25 }, (_, i) => 
  i === 24 ? "25+" : `${i + 1}`
);

  const getExpertiseLabel = (value: number) => {
    if (value == 0) return "Beginner";
    if (value == 1) return "Intermediate";
    return "Advance";
  };

  const postSkill = async () => {
    try {
    //   Check if a skill is selected
        if (selectedSkill.length === 0) {
          toast.error("Please select a skill", {
            position: "top-center",
          });
          return;
        }
        if (selectedSkill.length > 30) {
          toast.error("Please select a skill with less than 30 characters", {
            position: "top-center",
          });
        }

        // Check if if the selected skill exist in the candidate's technologies array
        if (
          candidateTechs?.some(
            (tech) =>
              tech.technology.technology.toLowerCase() ===
              selectedSkill.toLowerCase()
          )
        ) {
          toast.error("Skill already added", {
            position: "top-center",
          });
          setSelectedSkill("");
          setExpertiseLevel("");
          setExperienceYears("");
          return;
        }

        // Check if the skill exists in masterTech
        const skillExists = allTech?.some(
          (tech) => tech.technology.toLowerCase() === selectedSkill.toLowerCase()
        );

        let tempId;
        if (skillExists) {
          // If the skill exists, find its ID
          tempId = allTech?.find(
            (tech) =>
              tech.technology.toLowerCase() === selectedSkill.toLowerCase()
          );
        } else {
          // If the skill doesn't exist, create it
          const newSkill = {
            technology: selectedSkill,

            //  fields for the createTechnology API
          };

          // Create the new technology
          const createdSkill = await createTechnology(newSkill);

          // Update masterTech with the new skill
          setAllTech((prev) => (prev ? [...prev, createdSkill] : [createdSkill]));

          // Use the newly created skill's ID
          tempId = createdSkill;
        }

        // Add the skill to technologies

        // Associate the skill with the candidate
        if (tempId && experienceYears && expertiseLevel) {
          const result = await createContactTechnology({
            contactDetails: {
              contactId: Id,
            },
            technology: tempId,
            experience: experienceYears,
            expertiseLevel: expertiseLevel,
          });
          console.log("Skill added to candidate:", result.technology.technology);
          autoClose();
        } else if (tempId) {
          const result = await createContactTechnology({
            contactDetails: {
              contactId: Id,
            },
            technology: tempId,
          });
          autoClose();
          console.log("Skill added to candidate:", result.technology.technology);
        }

        // Reset form fields
        setSelectedSkill("");
        setExpertiseLevel("");
        setExperienceYears("");
        setTimeout(() => {
          autoClose();
        }, 1000);

        // Show success message
        toast.success("Skill added successfully", {
          position: "top-center",
        });
        autoClose();
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200 mt-14">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Skills</h1>

      <div className="space-y-8">
        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Dropdown */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">
              Skills <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors">
                <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={selectedSkill}
                  onChange={(e) => {
                    setSelectedSkill(e.target.value);
                    setIsSkillDropdownOpen(true);
                  }}
                  onFocus={() => setIsSkillDropdownOpen(true)}
                  placeholder="Type or select a skill..."
                  className="w-full outline-none text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                  className="text-gray-400 focus:outline-none"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {isSkillDropdownOpen && (
                <div className="absolute top-full left-0 right-0 -mt-0 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {/* Filter options based on input */}
                  {allTech && allTech
                    .filter((skill) =>
                      skill.technology
                        .toLowerCase()
                        .includes(selectedSkill.toLowerCase())
                    )
                    .map((skill) => (
                      <button
                        key={skill.techId}
                        type="button"
                        onClick={() => {
                          setSelectedSkill(skill.technology);
                          setIsSkillDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        {skill.technology}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Experience Years Dropdown */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">
              Experience In Years
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsYearsDropdownOpen(!isYearsDropdownOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white border-b-2 border-gray-300 focus:border-cyan-500 focus:outline-none transition-colors"
              >
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{experienceYears}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 ml-auto" />
              </button>

              {isYearsDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setExperienceYears(year);
                        setIsYearsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Slider */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700">
            Expertise
          </label>

          <div className="relative">
            <input
              type="range"
              min="0"
              step="1"
              max="2"
              value={expertise}
              onChange={(e) =>{ 
                setExpertise(Number(e.target.value))
                let label = getExpertiseLabel(Number(e.target.value))
                setExpertiseLevel(label)
              }}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
                  expertise * 50
                }%, #d1d5db ${expertise * 50}%, #d1d5db 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advance</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 justify-end">
          <CancelButton executable={autoClose}></CancelButton>
          <button
            type="button"
            className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
            onClick={postSkill}
          >
            Add Skill
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #06b6d4;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #06b6d4;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
