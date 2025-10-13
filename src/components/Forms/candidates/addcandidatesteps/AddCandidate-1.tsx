"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateCandidateFormData } from "@/Features/candidateSlice";
import { useField } from "formik";
import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function Step1BasicDetails({
  User,
  locations,
}: {
  User: string;
  locations: any;
}) {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.candidate.formData);

  // Formik field hooks
  const [firstNameField, firstNameMeta] = useField("firstName");
  const [lastNameField, lastNameMeta] = useField("lastName");
  const [middleNameField, middleNameMeta] = useField("middleName");
  const [dobField, dobMeta] = useField("dob");
  const [emailField, emailMeta] = useField("emailId");
  const [primaryNumberField, primaryNumberMeta] = useField("primaryNumber");
  const [secondaryNumberField, secondaryNumberMeta] =
    useField("secondaryNumber");
  const [genderField, genderMeta] = useField("gender");
  const [maritalStatusField, maritalStatusMeta] = useField("maritalStatus");
  const [currentLocationField, currentLocationMeta] =
    useField("currentLocation");
  const [pinCodeField, pinCodeMeta] = useField("pinCode");
  const [addressField, addressMeta] = useField("address");
  const [addressLocalityField, addressLocalityMeta] =
    useField("addressLocality");
  const [candidateStatusField, candidateStatusMeta] =
    useField("candidateStatus");
  const [differentlyAbledField, differentlyAbledMeta] =
    useField("differentlyAbled");
  const [differentlyAbledTypeField, differentlyAbledTypeMeta] = useField(
    "differentlyAbledType"
  );

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateCandidateFormData({ [field]: value }));
  };

  const handleRadioChange = (field: string, value: any) => {
    dispatch(updateCandidateFormData({ [field]: value }));
  };

  const addNewLocation = async (value: any) => {
    if (locations.includes(value)) {
      toast.error("Location already exists");
      return;
    }
    handleInputChange("currentLocation", { locationId: value.locationId });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium text-cyan-500 mb-8">Basic Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...firstNameField}
              value={formData.firstName}
              onChange={(e) => {
                firstNameField.onChange(e);
                handleInputChange("firstName", e.target.value);
              }}
              onBlur={firstNameField.onBlur}
              placeholder="Enter first name"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {firstNameMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{firstNameMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Middle Name
          </label>
          <div className="relative">
            <input
              type="text"
              {...middleNameField}
              value={formData.middleName}
              onChange={(e) => {
                middleNameField.onChange(e);
                handleInputChange("middleName", e.target.value);
              }}
              onBlur={firstNameField.onBlur}
              placeholder="Enter middle name"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {middleNameMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{middleNameMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...lastNameField}
              value={formData.lastName}
              onChange={(e) => {
                lastNameField.onChange(e);
                handleInputChange("lastName", e.target.value);
              }}
              onBlur={lastNameField.onBlur}
              placeholder="Enter last name"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {lastNameMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{lastNameMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <label className="block font-semibold mb-1">
            Date Of Birth <span className="text-red-500">*</span>
          </label>
          <DatePicker
            {...dobField}
            id="dob"
            name="dob"
            selected={formData.dob ? parseISO(formData.dob) : null}
            onChange={(date: Date | null) => {
              if (date) {
                // Store in ISO format
                handleInputChange("dob", format(date, "yyyy-MM-dd"));
              } else {
                handleInputChange("dob", null);
              }
            }}
            dateFormat="dd-MM-yyyy"
            placeholderText="dd-mm-yyyy"
            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          {dobMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{dobMeta.error}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              {...emailField}
              value={formData.emailId}
              onChange={(e) => {
                emailField.onChange(e);
                handleInputChange("emailId", e.target.value);
              }}
              onBlur={emailField.onBlur}
              placeholder="xyz@abc.com"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {emailMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{emailMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">
            Contact No <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              {...primaryNumberField}
              value={formData.primaryNumber}
              onChange={(e) => {
                primaryNumberField.onChange(e);
                handleInputChange("primaryNumber", e.target.value);
              }}
              onBlur={primaryNumberField.onBlur}
              placeholder="+91 1234567890"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {primaryNumberMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{primaryNumberMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Alternate Contact No
          </label>
          <div className="relative">
            <input
              type="tel"
              {...secondaryNumberField}
              value={formData.secondaryNumber}
              onChange={(e) => {
                secondaryNumberField.onChange(e);
                handleInputChange("secondaryNumber", e.target.value);
              }}
              onBlur={secondaryNumberField.onBlur}
              placeholder="+91 1234567890"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {secondaryNumberMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{secondaryNumberMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-4">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {["Male", "Female", "Others"].map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={genderField.name}
                  value={gender}
                  onChange={(e) => {
                    genderField.onChange(e);
                    handleRadioChange("gender", e.target.value);
                  }}
                  onBlur={genderField.onBlur}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.gender === gender
                      ? "border-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.gender === gender && (
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  )}
                </div>
                <span className="text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
          {genderMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{genderMeta.error}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-4">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {["Married", "Unmarried"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={maritalStatusField.name}
                  value={status}
                  onChange={(e) => {
                    maritalStatusField.onChange(e);
                    handleRadioChange("maritalStatus", e.target.value);
                  }}
                  onBlur={maritalStatusField.onBlur}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.maritalStatus === status
                      ? "border-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.maritalStatus === status && (
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  )}
                </div>
                <span className="text-gray-700">{status}</span>
              </label>
            ))}
          </div>
          {maritalStatusMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{maritalStatusMeta.error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">
            Current Location <span className="text-red-500">*</span>
          </label>
          <LocationAutocomplete
            {...currentLocationField}
            name="currentLocation"
            placeholder="Enter Current Location"
            value={formData.currentLocation.locationDetails || ""}
            onAdd={addNewLocation}
            options={locations}
            id="currentLocation"
            onChange={(e: any) => {
              handleInputChange("currentLocation", {
                locationId: e.locationId,
                locationDetails: e.locationDetails,
              });
            }}
            styleMod="p-0"
          ></LocationAutocomplete>
          {currentLocationMeta.error && (
            <div className="flex flex-col mt-4 gap-1 text-red-600 font-medium">
              {Object.values(currentLocationMeta.error).map((err: any, i) => (
                <div key={i} className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Pincode</label>
          <div className="relative">
            <input
              type="text"
              {...pinCodeField}
              value={formData.pinCode}
              onChange={(e) => {
                pinCodeField.onChange(e);
                handleInputChange("pinCode", e.target.value);
              }}
              onBlur={pinCodeField.onBlur}
              placeholder="400987"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {pinCodeMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{pinCodeMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <div className="relative">
            <textarea
              {...addressField}
              value={formData.address}
              onChange={(e) => {
                addressField.onChange(e);
                handleInputChange("address", e.target.value);
              }}
              onBlur={addressField.onBlur}
              placeholder="Enter address here..."
              rows={3}
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors resize-none focus:outline-none"
            />
            {addressMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{addressMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Address Locality</label>
          <div className="relative">
            <textarea
              {...addressLocalityField}
              value={formData.addressLocality}
              onChange={(e) => {
                addressLocalityField.onChange(e);
                handleInputChange("addressLocality", e.target.value);
              }}
              onBlur={addressLocalityField.onBlur}
              placeholder="Enter address here..."
              rows={3}
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors resize-none focus:outline-none"
            />
            {addressLocalityMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{addressLocalityMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-4">
            Candidate Status <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {["Active", "Inactive"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={candidateStatusField.name}
                  value={status}
                  onChange={(e) => {
                    candidateStatusField.onChange(e);
                    handleRadioChange("candidateStatus", e.target.value);
                  }}
                  onBlur={candidateStatusField.onBlur}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.candidateStatus === status
                      ? "border-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.candidateStatus === status && (
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  )}
                </div>
                <span className="text-gray-700">{status}</span>
              </label>
            ))}
          </div>
          {candidateStatusMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{candidateStatusMeta.error}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-4">Differently Abled ?</label>
          <div className="flex flex-wrap gap-6">
            {[true, false].map((option, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={differentlyAbledField.name}
                  value={formData.isDifferentlyAbled}
                  onChange={(e) => {
                    differentlyAbledField.onChange(e);
                    handleRadioChange("differentlyAbled", option);
                  }}
                  onBlur={differentlyAbledField.onBlur}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.isDifferentlyAbled === option
                      ? "border-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.differentlyAbled === option && (
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  )}
                </div>
                <span className="text-gray-700">
                  {option === true ? "Yes" : "No"}
                </span>
              </label>
            ))}
          </div>
          {differentlyAbledMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{differentlyAbledMeta.error}</span>
            </div>
          )}
        </div>
      </div>

      {formData.differentlyAbled === true && (
        <div>
          <label className="block font-semibold mb-4">
            Differently Abled Type
          </label>
          <div className="relative">
            <input
              type="text"
              {...differentlyAbledTypeField}
              value={formData.differentlyAbledType}
              onChange={(e) => {
                differentlyAbledTypeField.onChange(e);
                handleInputChange("differentlyAbledType", e.target.value);
              }}
              onBlur={differentlyAbledTypeField.onBlur}
              placeholder="Describe in brief..."
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {differentlyAbledTypeMeta.error && (
              <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{differentlyAbledTypeMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
