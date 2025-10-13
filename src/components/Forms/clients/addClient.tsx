import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { Location } from "@/lib/definitions";
import { toast } from "react-toastify";
import { useState } from "react";
import { countryCodes } from "@/api/countryCodes";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";
import { Location as locations } from "@/lib/definitions";
import { useFormik } from "formik";
import {
  addClientFormValues,
  addClientLocationSchema,
} from "@/lib/models/client";
import { createClientLocation } from "@/api/client/locations";
import { createClient } from "@/api/master/clients";

const AddClient = ({
  formik,
  autoClose,
  masterLocations,
}: {
  formik: any;
  autoClose: () => void;
  masterLocations: locations[];
}) => {
  const addNewState = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik1.setFieldValue("state", { locationId: location.locationId });
  };

  const onChangeState = (location: locations) => {
    formik1.setFieldValue("state", { locationId: location.locationId });
  };

  const onChangeCity = (location: locations) => {
    formik1.setFieldValue("cityId", { locationId: location.locationId });
  };

  const onChangeCountry = (location: locations) => {
    formik1.setFieldValue("country", { locationId: location.locationId });
  };

  const addNewCity = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik1.setFieldValue("cityId", location);
  };

  const addnewCountry = (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik1.setFieldValue("country", location);
  };

  const formik1 = useFormik<addClientFormValues>({
    initialValues: {
      pincode: null,
      address1: null,
      hrContactPerson: null,
      hrMobileNumber: null,
      companyLandline: null,
      hrContactPersonEmail: null,
      state: { locationId: 0 },
      cityId: { locationId: 0 },
      country: { locationId: 0 },
      client: { clientId: 0 },
      isBillingStateTamilNadu: false,
      isHeadQuarter: false,
    },
    validationSchema: addClientLocationSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const [clientCreated, setClientCreated] = useState(false);
  const [clientId, setClientId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClientSubmit = async () => {
    // Trigger Formik validation
    await formik.validateForm();

    if (Object.keys(formik.errors).length > 0) {
      formik.setTouched({
        clientName: true,
        cinnumber: true,
        pannumber: true,
        // Add other fields as needed
      });
      toast.error("Please fill in all required fields", {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createClient(formik.values);

      if (response.status === 200) {
        formik1.setFieldValue("client", { clientId: response.data.clientId });
        setClientCreated(true);
        toast.success("Client created successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(response.message || "Failed to create client", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Client creation error", error);
      toast.error("An error occurred while creating client", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSubmit = async () => {
    await formik1.validateForm();

    console.log(formik1.errors);

    if (Object.keys(formik1.errors).length > 0) {
      formik1.setTouched({
        address1: true,
        pincode: true,
        hrContactPerson: true,
        hrMobileNumber: true,
        hrContactPersonEmail: true,
        companyLandline: true,
        client: { clientId: true },
        state: { locationId: true },
        cityId: { locationId: true },
        country: { locationId: true },
      });
      toast.error("Please fill in all required fields", {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting location with clientId:", clientId);
      console.log("Formik1 values:", formik1.values);

      const response = await createClientLocation(formik1.values);

      if (response.status === 201) {
        toast.success("Location added successfully!", {
          position: "top-center",
        });
        autoClose();
      } else {
        toast.error(response.message || "Failed to add location", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Location creation error", error);
      toast.error("An error occurred while adding location", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    if (formik1) formik1.resetForm();
    autoClose();
  };

  return (
    <div className="min-h-screen mt-16">
      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">
            {clientCreated ? "Add Client Location" : "Add New Client"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!clientCreated ? (
            <form className="p-6" onSubmit={(e) => e.preventDefault()}>
              {/* Basic Details Section */}
              <div className="mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-4">
                  {/* Client Name */}
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="clientName"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      Client Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="clientName"
                      name="clientName"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="Enter client name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.clientName}
                    />
                    {formik.touched.clientName && formik.errors.clientName ? (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.clientName}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Billing Details Section */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-cyan-500 mb-4">
                  Billing Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* CIN Number */}
                  <div>
                    <label
                      htmlFor="cinnumber"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      CIN Number
                    </label>
                    <input
                      id="cinnumber"
                      name="cinnumber"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="56P-XXX-XXXX"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cinnumber}
                    />
                    {formik.touched.cinnumber && formik.errors.cinnumber ? (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.cinnumber}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label
                      htmlFor="pannumber"
                      className="block font-semibold text-gray-700 mb-2"
                    >
                      PAN Number
                    </label>
                    <input
                      id="pannumber"
                      name="pannumber"
                      type="text"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      placeholder="AQYXXX9O"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pannumber}
                    />
                    {formik.touched.pannumber && formik.errors.pannumber ? (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.pannumber}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                  disabled={isSubmitting}
                  onClick={handleClientSubmit}
                >
                  Create Client
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="p-6">
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
                      onChange={formik1.handleChange}
                      value={formik1.values.address1}
                    />
                    {formik1.touched.address1 && formik1.errors.address1 && (
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
                        <span>{formik1.errors.address1}</span>
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
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      value={formik1.values.pincode}
                    />
                    {formik1.errors.pincode && (
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
                        <span>{formik1.errors.pincode.toString()}</span>
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
                      value={formik1.values.state.locationDetails ?? ""}
                      onChange={onChangeState}
                      options={masterLocations}
                      onAdd={addNewState}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="isBillingStateTamilNadu"
                        name="isBillingStateTamilNadu"
                        onChange={formik1.handleChange}
                      />
                      <label
                        htmlFor="isBillingStateTamilNadu"
                        className="text-gray-400 text-sm"
                      >
                        Billing State : Tamil Nadu
                      </label>
                    </div>

                    {formik1.touched.state?.locationId &&
                      formik1.errors.state?.locationId && (
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
                          <span>{formik1.errors.state?.locationId}</span>
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
                      value={formik1.values.cityId.locationDetails ?? ""}
                      onChange={onChangeCity}
                      options={masterLocations}
                      onAdd={addNewCity}
                    />
                    {formik1.touched.cityId?.locationId &&
                      formik1.errors.cityId?.locationId && (
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
                          <span>{formik1.errors.cityId?.locationId}</span>
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
                      value={formik1.values.country.locationDetails ?? ""}
                      onChange={onChangeCountry}
                      options={masterLocations}
                      onAdd={addnewCountry}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="isHeadQuarter"
                        name="isHeadQuarter"
                        onChange={formik1.handleChange}
                        onBlur={formik1.handleBlur}
                      />
                      <label
                        htmlFor="isHeadQuarter"
                        className="text-gray-400 text-sm"
                      >
                        This is HeadQuarters
                      </label>
                      {formik1.touched.isHeadQuarter &&
                        formik1.errors.isHeadQuarter && (
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
                            <span>{formik1.errors.isHeadQuarter}</span>
                          </div>
                        )}
                    </div>
                    {formik1.touched.country?.locationId &&
                      formik1.errors.country?.locationId && (
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
                          <span>{formik1.errors.country?.locationId}</span>
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
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      // value={formik.values.hrContactPerson}
                    />
                    {formik1.touched.hrContactPerson &&
                      formik1.errors.hrContactPerson && (
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
                          <span>{formik1.errors.hrContactPerson}</span>
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
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      value={formik.values.hrMobileNumber}
                    />
                    {formik1.touched.hrMobileNumber &&
                      formik1.errors.hrMobileNumber && (
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
                          <span>{formik1.errors.hrMobileNumber}</span>
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
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      // value={formik.values.companyLandline}
                    />
                    {formik1.touched.companyLandline &&
                      formik1.errors.companyLandline && (
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
                          <span>{formik1.errors.companyLandline}</span>
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
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                      // value={formik.values.hrContactPersonEmail}
                    />
                    {formik1.touched.hrContactPersonEmail &&
                      formik1.errors.hrContactPersonEmail && (
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
                          <span>{formik1.errors.hrContactPersonEmail}</span>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleLocationSubmit}
                  >
                    Add Location
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClient;
