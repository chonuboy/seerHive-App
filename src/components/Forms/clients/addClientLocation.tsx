import React from "react";
import { useFormik } from "formik";
import { clientLocationFormValues } from "@/lib/models/client";
import { clientLocationSchema } from "@/lib/models/client";
import { Popup } from "../../Elements/cards/popup";
import { createClientLocation } from "@/api/client/locations";
import LocationAutocomplete from "../../Elements/utils/location-autocomplete";
import { Location as locations } from "@/lib/definitions";
import { toast } from "react-toastify";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CloseButton from "@/components/Elements/utils/CloseButton";

const AddClientLocation = ({
  masterLocations,
  clientId,
  autoClose,
  isHqAvailable,
}: {
  clientId: number;
  autoClose: () => void;
  masterLocations: locations[];
  isHqAvailable?: boolean;
}) => {
  const formik = useFormik<clientLocationFormValues>({
    initialValues: {
      pincode: null,
      address1: null,
      hrContactPerson: null,
      hrMobileNumber: null,
      companyLandline: null,
      hrContactPersonEmail: null,
      state: { locationId: 0 },
      client: { clientId: clientId },
      cityId: { locationId: 0 },
      country: { locationId: 0 },
      financePocName: null,
      financeEmail: null,
      financeNumber: null,
      isBillingStateTamilNadu: false,
      isHeadQuarter: false,
      gstnumber: null,
    },
    validationSchema: clientLocationSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        createClientLocation(values)
          .then((data) => {
            console.log(data);
            if (data.status === 201) {
              toast.success("Branch added successfully", {
                position: "top-center",
              });
              autoClose();
            }
            if (data.message) {
              toast.error(data.message, {
                position: "top-right",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        // Handle success (show toast, redirect, etc.)
      } catch (error) {
        console.error("Form submission error", error);
        // Handle error (show error message)
      }
      console.log(values);
    },
  });
  const onChangeState = (location: locations) => {
    formik.setFieldValue("state", { locationId: location.locationId });
  };

  const handleCancel = () => {
    formik.resetForm();
    autoClose();
  };

  const addNewState = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("state", { locationId: location.locationId });
  };

  const onChangeCity = (location: locations) => {
    formik.setFieldValue("cityId", { locationId: location.locationId });
  };

  const onChangeCountry = (location: locations) => {
    formik.setFieldValue("country", { locationId: location.locationId });
  };

  const addNewCity = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("cityId", location);
  };

  const addnewCountry = (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("country", location);
  };

  return (
    <Popup>
      <div className="min-h-screen my-8">
        <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 className="text-2xl font-bold">Add New Branch</h3>
            <div className="flex justify-end">
              <CloseButton
                onClose={handleCancel}
                hasUnsavedChanges
                confirmationMessage="Are you sure you want to cancel? The candidate information will not be saved."
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <form className="p-8" onSubmit={formik.handleSubmit}>
              {/* Address Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                  Address Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  {/* Address Line 1 */}
                  <div className="col-span-2">
                    <label
                      htmlFor="address1"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address1"
                      name="address1"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter Address"
                      onChange={formik.handleChange}
                      // value={formik.values.address1}
                    />
                    {formik.touched.address1 && formik.errors.address1 && (
                      <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.address1}</span>
                      </div>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="col-span-2">
                    <label
                      htmlFor="pincode"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter Pincode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.pincode}
                    />
                    {formik.errors.pincode && (
                      <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.pincode.toString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <LocationAutocomplete
                      name="country"
                      id="country"
                      placeholder="Select Country"
                      styleMod="w-full px-0 py-1 border-0 border-b border-gray-300 focus:ring-0 text-sm placeholder-gray-400 rounded-none"
                      value={formik.values.country.locationDetails ?? ""}
                      onChange={onChangeCountry}
                      options={masterLocations}
                      onAdd={addnewCountry}
                    />
                    {!isHqAvailable && (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="isHeadQuarter"
                          name="isHeadQuarter"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label
                          htmlFor="isHeadQuarter"
                          className="text-gray-400 text-sm"
                        >
                          This is HeadQuarters
                        </label>
                        {formik.touched.isHeadQuarter &&
                          formik.errors.isHeadQuarter && (
                            <div className="flex items-center text-sm text-center gap-1 text-red-600 font-medium">
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
                              <span>{formik.errors.isHeadQuarter}</span>
                            </div>
                          )}
                      </div>
                    )}

                    {formik.touched.country?.locationId &&
                      formik.errors.country?.locationId && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.country?.locationId}</span>
                        </div>
                      )}
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      aria-labelledby="state"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <LocationAutocomplete
                      id="state"
                      name="state"
                      placeholder="Select State"
                      styleMod="w-full px-0 py-1 border-0 border-b border-gray-300 focus:ring-0 text-sm placeholder-gray-400 rounded-none"
                      value={formik.values.state.locationDetails ?? ""}
                      onChange={onChangeState}
                      options={masterLocations}
                      onAdd={addNewState}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="isBillingStateTamilNadu"
                        name="isBillingStateTamilNadu"
                        onChange={formik.handleChange}
                      />
                      <label
                        htmlFor="isBillingStateTamilNadu"
                        className="text-gray-400 text-sm"
                      >
                        Billing State : Tamil Nadu
                      </label>
                    </div>

                    {formik.touched.state?.locationId &&
                      formik.errors.state?.locationId && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.state?.locationId}</span>
                        </div>
                      )}
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <LocationAutocomplete
                      name="city"
                      id="city"
                      placeholder="Select City"
                      styleMod="w-full px-0 py-1 border-0 border-b border-gray-300 focus:ring-0 text-sm placeholder-gray-400 rounded-none"
                      value={formik.values.cityId.locationDetails ?? ""}
                      onChange={onChangeCity}
                      options={masterLocations}
                      onAdd={addNewCity}
                    />
                    {formik.touched.cityId?.locationId &&
                      formik.errors.cityId?.locationId && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.cityId?.locationId}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                  Contact Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                  {/* HR Contact Person */}
                  <div className="col-span-2">
                    <label
                      htmlFor="hrContactPerson"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      HR Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hrContactPerson"
                      name="hrContactPerson"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter HR Contact Person Name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.hrContactPerson}
                    />
                    {formik.touched.hrContactPerson &&
                      formik.errors.hrContactPerson && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.hrContactPerson}</span>
                        </div>
                      )}
                  </div>

                  {/* HR Mobile Number */}
                  <div>
                    <label
                      htmlFor="hrMobileNumber"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      HR Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hrMobileNumber"
                      name="hrMobileNumber"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter HR Mobile Number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.hrMobileNumber}
                    />
                    {formik.touched.hrMobileNumber &&
                      formik.errors.hrMobileNumber && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.hrMobileNumber}</span>
                        </div>
                      )}
                  </div>

                  {/* Company Landline */}
                  <div>
                    <label
                      htmlFor="companyLandline"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Company Landline <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="companyLandline"
                      name="companyLandline"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter Company Landline"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.companyLandline}
                    />
                    {formik.touched.companyLandline &&
                      formik.errors.companyLandline && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.companyLandline}</span>
                        </div>
                      )}
                  </div>

                  {/* HR Contact Email */}
                  <div>
                    <label
                      htmlFor="hrContactPersonEmail"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      HR Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hrContactPersonEmail"
                      name="hrContactPersonEmail"
                      type="email"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter HR Contact Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.hrContactPersonEmail}
                    />
                    {formik.touched.hrContactPersonEmail &&
                      formik.errors.hrContactPersonEmail && (
                        <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                          <span>{formik.errors.hrContactPersonEmail}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Finance Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                  Finance Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Finance Person Name */}
                  <div>
                    <label
                      htmlFor="financePocName"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Finance Person Name
                    </label>
                    <input
                      id="financePocName"
                      name="financePocName"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter full name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.financePocName}
                    />
                    {formik.touched.financePocName &&
                    formik.errors.financePocName ? (
                      <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.financePocName.toString()}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="financeEmail"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Finance Email
                    </label>
                    <input
                      id="financeEmail"
                      name="financeEmail"
                      type="email"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="abc@acme.com"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.financeEmail}
                    />
                    {formik.touched.financeEmail &&
                    formik.errors.financeEmail ? (
                      <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.financeEmail.toString()}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label
                      htmlFor="financeNumber"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Contact Number
                    </label>
                    <input
                      id="financeNumber"
                      name="financeNumber"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="9876543340"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.financeNumber}
                    />
                    {formik.touched.financeNumber &&
                    formik.errors.financeNumber ? (
                      <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.financeNumber.toString()}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* GST number */}
                  <div>
                    <label
                      htmlFor="gstnumber"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      GST Number
                    </label>
                    <input
                      id="gstnumber"
                      name="gstnumber"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="22AAAAA0000A1Z5"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // value={formik.values.gstnumber}
                    />
                    {formik.touched.gstnumber && formik.errors.gstnumber ? (
                      <div className="flex items-center text-sm mt-4 text-center text-red-600 font-medium">
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
                        <span>{formik.errors.gstnumber?.toString()}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
                <CancelButton executable={handleCancel}></CancelButton>
                <SubmitButton label="Submit"></SubmitButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default AddClientLocation;
