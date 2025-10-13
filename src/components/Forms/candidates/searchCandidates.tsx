import type React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { TagInput } from "./inputs";
import { SingleInput } from "./inputs";
import { candidateSearchSchema } from "@/lib/models/candidate";
import type { SearchQueries } from "@/lib/models/candidate";
import { ChevronDown, X } from "lucide-react";
import { setSearchQuery } from "@/Features/candidateSearchSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import { fetchAllDomains } from "@/api/master/domain";
import { fetchAllCompanies } from "@/api/master/masterCompany";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { fetchAllCourses } from "@/api/candidates/courses";
import { fetchAllUniversities } from "@/api/candidates/university";

const SearchForm: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [allTech, setAllTech] = useState([]);
  const [allDomain, setAllDomain] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allUniversity, setAllUniversity] = useState([]);
  const [allLevels, setAllLevels] = useState<string[] | null>([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  const handleJobModeChange = (value: string, checked: boolean) => {
    if (checked) {
      formik.setFieldValue("preferredJobMode", [
        ...(formik.values.preferredJobMode || []),
        value,
      ]);
    } else {
      formik.setFieldValue(
        "preferredJobMode",
        formik.values.preferredJobMode?.filter((mode) => mode !== value) || []
      );
    }
  };
  const handleHiringTypeChange = (value: string, checked: boolean) => {
    if (checked) {
      formik.setFieldValue("contactHiringType", [
        ...(formik.values.contactHiringType || []),
        value,
      ]);
    } else {
      formik.setFieldValue(
        "contactHiringType",
        formik.values.contactHiringType?.filter((type) => type !== value) || []
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentLocation(value);
    formik.setFieldValue("currentLocation", value);

    const filteredSuggestions = allLocations.filter((option: string) =>
      option?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredLocations(filteredSuggestions);
    setShowLocationSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setCurrentLocation(suggestion);
    formik.setFieldValue("currentLocation", suggestion);
    setShowLocationSuggestions(false);
  };

  const handleInputBlur = (e: any) => {
    // Use setTimeout to allow click event on suggestions to fire first
    setTimeout(() => {
      setShowLocationSuggestions(false);
    }, 200);
    formik.handleBlur(e);
  };

  const formik = useFormik<SearchQueries>({
    initialValues: {
      minExperience: null,
      maxExperience: null,
      currentLocation: null,
      minSalary: null,
      maxSalary: null,
      noticePeriod: null,
      highestEducation: null,
      preferredLocation: [],
      domain: [],
      preferredJobMode: [],
      contactHiringType: [],
      mustHaveTechnologies: null,
      goodToHaveTechnologies: null,
      companies: [],
      universities: [],
      courses: [],
      levels: [],
    },
    validationSchema: candidateSearchSchema,
    onSubmit: (values) => {
      if (values.companies?.length === 0) {
        values.companies = null;
      }
      if (values.preferredLocation?.length === 0) {
        values.preferredLocation = null;
      }
      if (values.domain?.length === 0) {
        values.domain = null;
      }
      if (values.universities?.length === 0) {
        values.universities = null;
      }
      if (values.courses?.length === 0) {
        values.courses = null;
      }
      if (values.levels?.length === 0) {
        values.levels = null;
      }
      if (values.preferredJobMode?.length === 0) {
        values.preferredJobMode = null;
      }
      if (values.contactHiringType?.length === 0) {
        values.contactHiringType = null;
      }

      const payload = Object.entries(values).reduce(
        (acc: any, [key, value]) => {
          if (
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      console.log(payload);

      if (Object.keys(payload).length === 0) {
        toast.error("Please enter at least one search criteria.", {
          position: "top-center",
        });
      } else {
        dispatch(setSearchQuery(payload));
        setTimeout(() => {
          router.push("/search/results");
        }, 2000);
      }
    },
  });

  useEffect(() => {
    console.log(formik.values);
    console.log(formik.errors);
    fetchAllTechnologies().then((res) => {
      setAllTech(res);
    });
    fetchAllDomains().then((res) => {
      const domainArray = res.map((item: any) => item.domainDetails);
      setAllDomain(domainArray);
    });
    fetchAllCompanies().then((res) => {
      const companyArray = res.map((item: any) => item.companyName);
      setAllCompanies(companyArray);
    });
    fetchAllLocations().then((res) => {
      const locationArray = res.map((item: any) => item.locationDetails);
      setAllLocations(locationArray);
      setFilteredLocations(locationArray);
    });
    fetchAllCourses().then((res) => {
      const courseArray = res.map((item: any) => item.courseName);
      const levelArray: string[] = [
        ...new Set(res.map((item: any) => item.level) as string[]),
      ];
      setAllCourses(courseArray);
      setAllLevels(levelArray);
    });
    fetchAllUniversities().then((res) => {
      const universityArray = res.map((item: any) => item.universityName);
      setAllUniversity(universityArray);
    });
  }, []);

  const handleAddGoodToHave = () => {
    if (
      formik.values.goodToHaveTechnologies?.includes(inputValue.trim()) ||
      formik.values.mustHaveTechnologies?.includes(inputValue.trim())
    ) {
      toast.error("Technology already added", { position: "top-center" });
      return;
    }
    if (inputValue.trim()) {
      formik.setFieldValue("goodToHaveTechnologies", [
        ...(formik.values.goodToHaveTechnologies?.length
          ? formik.values.goodToHaveTechnologies
          : []),
        inputValue.trim(),
      ]);
      setInputValue("");
    }
  };

  const handleAddMustHave = () => {
    if (
      formik.values.goodToHaveTechnologies?.includes(inputValue.trim()) ||
      formik.values.mustHaveTechnologies?.includes(inputValue.trim())
    ) {
      toast.error("Technology already added", { position: "top-center" });
      return;
    }
    if (inputValue.trim()) {
      formik.setFieldValue("mustHaveTechnologies", [
        ...(formik.values.mustHaveTechnologies?.length
          ? formik.values.mustHaveTechnologies
          : []),
        inputValue.trim(),
      ]);
      setInputValue("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    formik.setFieldValue(
      "goodToHaveTechnologies",
      formik.values.goodToHaveTechnologies?.filter((t) => t !== tech)
    );
    formik.setFieldValue(
      "mustHaveTechnologies",
      formik.values.mustHaveTechnologies?.filter((t) => t !== tech)
    );
  };

  const handleAddTag = (field: keyof SearchQueries, tag: string) => {
    if (
      Array.isArray(formik.values[field]) &&
      formik.values[field].includes(tag)
    ) {
      toast.error(`${tag} already added`, { position: "top-center" });
      return;
    }
    if (
      Array.isArray(formik.values[field]) &&
      formik.values[field].includes(tag)
    ) {
      return;
    }

    Array.isArray(formik.values[field]) &&
      formik.setFieldValue(field, [...formik.values[field], tag]);
  };

  const handleRemoveTag = (field: keyof SearchQueries, tag: string) => {
    formik.setFieldValue(
      field,
      Array.isArray(formik.values[field])
        ? formik.values[field].filter((t: string) => t !== tag)
        : formik.values[field]
    );
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="rounded-xl space-y-10"
    >
      {/* Technical Skills Section */}
      <div className="bg-white p-4 rounded-lg">
        <h2 className="font-bold text-2xl mb-8 text-cyan-500 border-b-2 border-blue-500 pb-2">
          Technical
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Technologies */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-xl mb-4">Technologies</h3>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsSkillDropdownOpen(true);
                }}
                onFocus={() => setIsSkillDropdownOpen(true)}
                placeholder="Type or select a skill..."
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />

              {isSkillDropdownOpen && (
                <div className="absolute top-full left-0 right-0 -mt-0 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {/* Filter options based on input */}
                  {allTech &&
                    allTech
                      .filter((skill: any) =>
                        skill.technology
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      )
                      .map((skill: any) => (
                        <button
                          key={skill.techId}
                          type="button"
                          onClick={() => {
                            setInputValue(skill.technology);
                            setIsSkillDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          {skill.technology}
                        </button>
                      ))}
                </div>
              )}
              <div className="md:absolute inset-y-0 right-0 flex items-center gap-3 pr-3 mt-3 md:mt-0">
                <button
                  type="button"
                  onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                  className="text-gray-400 focus:outline-none"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleAddGoodToHave}
                  className="flex-1 sm:flex-none px-4 py-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={handleAddMustHave}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md font-medium"
                >
                  Mandatory
                </button>
              </div>
            </div>
            {/* Technology Tags */}
            <div className="flex flex-wrap gap-3 mt-4">
              {formik.values.goodToHaveTechnologies?.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                >
                  <span>
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="absolute -right-2 -top-2"
                    >
                      <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                    </button>
                  </span>
                </div>
              ))}
              {formik.values.mustHaveTechnologies?.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-white font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-md"
                >
                  <span>
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="absolute -right-2 -top-2"
                    >
                      <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role & Experience Section */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="font-bold text-2xl mb-12 text-cyan-500 border-b-2 border-green-500 pb-2">
          Role & Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <SingleInput
            name="minExperience"
            title="Min Experience (years)"
            placeholder="0"
            value={formik.values.minExperience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.minExperience ? formik.errors.minExperience : null
            }
          />

          <SingleInput
            name="maxExperience"
            title="Max Experience (years)"
            placeholder="10"
            value={formik.values.maxExperience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maxExperience ? formik.errors.maxExperience : null
            }
          />
          <SingleInput
            name="highestEducation"
            title="Qualification"
            placeholder="Enter qualification..."
            value={formik.values.highestEducation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.highestEducation
                ? formik.errors.highestEducation
                : null
            }
          />
        </div>
      </div>

      {/* Compensation & Notice Section */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="font-bold text-2xl mb-12 text-cyan-500 border-b-2 border-orange-500 pb-2">
          Compensation & Notice Period
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <SingleInput
            name="minSalary"
            title="Min CTC (LPA)"
            placeholder="0"
            value={formik.values.minSalary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.minSalary ? formik.errors.minSalary : null}
          />

          <SingleInput
            name="maxSalary"
            title="Max CTC (LPA)"
            placeholder="50"
            value={formik.values.maxSalary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.maxSalary ? formik.errors.maxSalary : null}
          />

          <SingleInput
            name="noticePeriod"
            title="Notice Period (days)"
            placeholder="30"
            value={formik.values.noticePeriod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.noticePeriod ? formik.errors.noticePeriod : null
            }
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="font-bold text-2xl mb-12 text-cyan-500 border-b-2 border-green-500 pb-2">
          Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <TagInput
            name="Graduation Levels"
            title="Graduation Levels"
            placeholder="Enter graduation levels..."
            tags={formik.values.levels ?? []}
            onAddTag={(tag) => handleAddTag("levels", tag)}
            onRemoveTag={(tag) => handleRemoveTag("levels", tag)}
            masterProps={allLevels}
          />
          <TagInput
            name="Preferred Courses"
            title="Preferred Courses"
            placeholder="Enter preferred courses..."
            tags={formik.values.courses ?? []}
            onAddTag={(tag) => handleAddTag("courses", tag)}
            onRemoveTag={(tag) => handleRemoveTag("courses", tag)}
            masterProps={allCourses}
          />
          <TagInput
            name="Preferred Universities"
            title="Preferred Universities"
            placeholder="Enter preferred universities..."
            tags={formik.values.universities ?? []}
            onAddTag={(tag) => handleAddTag("universities", tag)}
            onRemoveTag={(tag) => handleRemoveTag("universities", tag)}
            masterProps={allUniversity}
          />
        </div>
      </div>

      {/* Location & Job Preferences Section */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="font-bold text-2xl mb-12 text-cyan-500 border-b-2 border-purple-500 pb-2">
          Location & Job Preferences
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative w-full">
            <label className="font-semibold text-xl">Current Location</label>
            <input
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              type="text"
              name="currentLocation"
              placeholder="Enter Current Location"
              value={currentLocation}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />

            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 z-10 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-2 text-base text-gray-700">
                  {filteredLocations.map((suggestion, index) => (
                    <li
                      key={index}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <TagInput
            name="preferredLocations"
            title="Preferred Locations"
            placeholder="Enter locations..."
            tags={formik.values.preferredLocation ?? []}
            onAddTag={(tag) => handleAddTag("preferredLocation", tag)}
            onRemoveTag={(tag) => handleRemoveTag("preferredLocation", tag)}
            masterProps={allLocations}
          />

          {/* Domain */}
          <TagInput
            name="domains"
            title="Domain Expertise"
            placeholder="Enter domains..."
            tags={formik.values.domain ?? []}
            onAddTag={(tag) => handleAddTag("domain", tag)}
            onRemoveTag={(tag) => handleRemoveTag("domain", tag)}
            error={formik.touched.domain ? formik.errors.domain : null}
            masterProps={allDomain}
          />

          {/* Companies */}
          <TagInput
            name="companies"
            title="Previous Companies"
            placeholder="Enter companies..."
            tags={formik.values.companies ?? []}
            onAddTag={(tag) => handleAddTag("companies", tag)}
            onRemoveTag={(tag) => handleRemoveTag("companies", tag)}
            masterProps={allCompanies}
          />

          {/* Job Mode Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Preferred Job Types</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Remote", "Onsite", "Hybrid", "Flexible"].map((mode) => (
                <div key={mode} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`jobMode_${mode}`}
                    checked={
                      formik.values.preferredJobMode?.includes(mode) || false
                    }
                    onChange={(e) =>
                      handleJobModeChange(mode, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`jobMode_${mode}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {mode}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Types */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Hiring Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Full Time", "Part Time", "Contract", "Flexible"].map(
                (type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`hiringType_${type.replace(" ", "")}`}
                      checked={
                        formik.values.contactHiringType?.includes(type) || false
                      }
                      onChange={(e) =>
                        handleHiringTypeChange(type, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`hiringType_${type.replace(" ", "")}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {type}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
        >
          Search Candidates
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
