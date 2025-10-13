import { useFormik } from "formik";
import { clientFormSchema } from "@/lib/models/client";
import { updateClient } from "@/api/master/clients";
import { toast } from "react-toastify";
import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { Location } from "@/lib/definitions";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";

export default function ClientInfoUpdateForm({
  currentClient,
  id,
  autoClose,
}: {
  currentClient: any;
  id: number;
  autoClose: () => void;
}) {
  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const formik = useFormik({
    initialValues: currentClient,
    validationSchema: clientFormSchema,
    onSubmit: (values) => {
      const updatedFields = getUpdatedFields(currentClient, values);
      console.log(updatedFields);
      try {
        updateClient(id, updatedFields).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Client updated successfully", {
              position: "top-right",
            });
            autoClose();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 mt-8">
      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-2">
          <svg
            className="w-6 h-6 mr-2 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">Update</h1>
        </div>

        <form className="p-6" onSubmit={formik.handleSubmit}>
          {/* Contact Details Section */}

          <div>
            <label
              htmlFor="clientName"
              className="block font-semibold text-gray-700 mb-2"
            >
              Client Name
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              placeholder="56P-XXX-XXXX"
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
                <span>{formik.errors.clientName.toString()}</span>
              </div>
            ) : null}
          </div>

          {/* Billing Details Section */}
          <div className="my-6">
            <h2 className="text-lg font-semibold text-cyan-500 mb-4">
              Billing Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span>{formik.errors.cinnumber.toString()}</span>
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
                    <span>{formik.errors.pannumber.toString()}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-end">
            <CancelButton executable={autoClose}></CancelButton>
            <SubmitButton label="Submit"></SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
