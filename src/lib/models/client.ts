import { Candidate, Columns } from "../definitions";
import * as yup from "yup";
import { Location as location } from "../definitions";

export interface Client {
  jobId: number;
  jobCode: string;
  jd: string;
  jobDescription: string;
  salaryInCtc: number;
  experience: number;
  jobTitle: string;
  createdOn: string;
  isJobActive: string;
  jobPostType: string;
  postCreatedOn: Date;
  insertedBy: string;
  client: {
    clientId: number;
    clientName: string;
    clientHo: string;
    financePocName: string;
    financeEmail: string;
    financeNumber: string;
    insertedOn: string;
    gstnumber: string;
    cinnumber: string;
    pannumber: string;
  };
  clientJob?: any;
  jobLocations: string[];
  hiringType?: string;
  preferredJobMode?: string;
}

export interface ClientInfo {
  clientId: number;
  clientName: string;
  clientHeadQuarterCountry?: location;
  clientHeadQuarterState?: location;
  financePocName?: string;
  financeEmail?: string;
  financeNumber?: string;
  gstnumber?: string;
  cinnumber: string;
  pannumber: string;
  insertedOn: string;
}

export interface Company {
  companyId?: number;
  companyName: string;
}

export interface Companies {
  contactCompanyId: number;
  contactDetails: Candidate;
  company: Company;
  joiningDate: string | null;
  isCurrentCompany: boolean | null;
  leavingDate: string | null;
}

export interface Job {
  jobId: number;
  isClient?: boolean;
  techRole: string;
  companyName?: string;
  experience: string;
  status: string;
  budget: string;
  jobCode: string;
  postedOn: Date;
  insertedBy: string;
}

export const ClientTableColumn: Columns = [
  {
    Header: "Name",
    accessor: "clientName",
  },
  {
    Header: "Head Office",
    accessor: "clientHeadQuarterState.locationDetails",
    hiddenOnSmall: true,
  },
  {
    Header: "Email",
    accessor: "financeEmail",
    hiddenOnSmall: true,
  },
  {
    Header: "Finance Number",
    accessor: "financeNumber",
  },
  {
    Header: "Finance Poc",
    accessor: "financePocName",
  },
];

export const RecruitmentColumn = [
  {
    Header: "Candidate Name",
    accessor: "candidateName",
  },
  {
    Header: "Contact Number",
    accessor: "contactNumber",
    hiddenOnSmall: true,
  },
  {
    Header: "Email",
    accessor: "emailID",
    hiddenOnSmall: true,
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "",
  },
];

export const jobFormSchema = yup.object().shape({
  jobCode: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .nullable()
    .max(30, "Must be 30 characters or less"),
  jobTitle: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .required("Job title is required"),
  jobDescription: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Job description is required"),
  salaryInCtc: yup.number().required("Salary is required"),
  jd: yup.string().required("JD is required"),
  experience: yup.string().required("Experience is required"),
  isJobActive: yup.string().required("Select status"),
  jobPostType: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Job type is required"),
  insertedBy: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Inserted by is required")
    .max(50, "Must be 50 characters or less"),
  client: yup.object().shape({
    clientId: yup.number(),
  }),
});

export const step1Schema = yup.object().shape({
  jobCode: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .nullable(),
  jobTitle: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .required("Job title is required"),
  isJobActive: yup.string().required("Select status"),
  locations: yup
    .array()
    .min(1, "At least one location is required")
    .required("Locations are required"),
});

export const step2Schema = yup.object().shape({
  preferredJobMode: yup.string().required("Preferred Job Mode is required"),
  salaryInCtc: yup.number().required("Salary is required"),
  noOfOpenings: yup.number().required("Number of openings is required"),
  minimumExperience: yup.string().required("Minimum Experience is required"),
  maximumExperience: yup.string().nullable(),
  hiringType: yup.string().required("Hiring Type is required"),
  jobPostType: yup.string().required("Job type is required"),
});

export const step3Schema = yup.object().shape({
  jd: yup.string().nullable(),
  jobDescription: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Job description is required"),
});

export const fullSchema = yup.object().shape({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
});

export const clientFormSchema = yup.object().shape({
  cinnumber: yup
    .string()
    .nullable()
    .matches(
      /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i,
      "Invalid CIN format"
    )
    .length(21, "CIN must be exactly 21 characters"),

  pannumber: yup
    .string()
    .nullable()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format")
    .length(10, "PAN must be exactly 10 characters"),
});

export const clientValidationSchema = yup.object().shape({
  clientName: yup
    .string()
    .required("Client Name is required")
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less"),
  cinnumber: yup
    .string()
    .nullable()
    .matches(
      /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i,
      "Invalid CIN format"
    )
    .length(21, "CIN must be exactly 21 characters"),

  pannumber: yup
    .string()
    .nullable()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format")
    .length(10, "PAN must be exactly 10 characters"),
});

export const clientLocationSchema = yup.object().shape({
  pincode: yup
    .string()
    .typeError("Pincode must be a number")
    .matches(/^[0-9\s-]{3,10}$/, "Invalid pincode format")
    .required("Pincode is required"),
  address1: yup
    .string()
    .required("Address is required")
    .min(3, "Must be at least 3 characters")
    .max(250, "Must be 250 characters or less"),
  hrContactPerson: yup
    .string()
    .required("HR Contact Person is required")
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 50 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),

  hrMobileNumber: yup
    .string()
    .required("HR Mobile Number is required")
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/i, "Invalid Mobile number format"),
  companyLandline: yup
    .string()
    .required("Company Landline is required")
    .matches(
      /^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/i,
      "Invalid landline number format"
    ),
  hrContactPersonEmail: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .required("Email is required"),
  state: yup
    .object()
    .shape({
      locationId: yup.number().min(1, "Select a state"),
    })
    .required("State is required"),
  client: yup
    .object()
    .shape({
      clientId: yup
        .number()
        .required("Client is required")
        .min(1, "Select a client"),
    })
    .required("Client is required"),
  country: yup
    .object()
    .shape({
      locationId: yup
        .number()
        .required("Select a Country")
        .min(1, "Select a Country"),
    })
    .required("Country is required"),
  cityId: yup.object().shape({
    locationId: yup
      .number()
      .required("City is required")
      .min(1, "Select a city"),
  }),
  isHeadQuarter: yup.boolean().required("Is This HQ ?"),
  gstnumber: yup
    .string()
    .nullable()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/i,
      "Invalid GST format Example Format : 22AAAAA0000A1Z5"
    )
    .length(15, "GST must be exactly 15 characters"),
});

export const jobUpdateSchema = yup.object().shape({
  jobCode: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .nullable(),
  jobTitle: yup
    .string()
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .nullable(),
  jobDescription: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .nullable(),
  salaryInCtc: yup.number().nullable(),
  noOfOpenings: yup.number().nullable(),
  experience: yup.string().nullable(),
  isJobActive: yup.string().nullable(),
  jobPostType: yup.string().min(3, "Must be at least 3 characters").nullable(),
  insertedBy: yup
    .string()
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .nullable(),
  client: yup.object().shape({
    clientId: yup.number(),
  }),
});

export interface clientLocationFormValues {
  isHeadQuarter: boolean;
  clientLocationId?: number;
  pincode: string | null;
  address1: string | null;
  hrContactPerson: string | null;
  hrMobileNumber: string | null;
  companyLandline: string | null;
  hrContactPersonEmail: string | null;
  state: location;
  client: {
    clientId: number;
  };
  cityId: location;
  gstnumber: string | null;
  country: location;
  financePocName: string | null;
  financeEmail: string | null;
  financeNumber: string | null;
  isBillingStateTamilNadu: boolean;
}

export interface addClientFormValues {
  isHeadQuarter: boolean;
  clientLocationId?: number;
  pincode: string | null;
  address1: string | null;
  hrContactPerson: string | null;
  hrMobileNumber: string | null;
  companyLandline: string | null;
  hrContactPersonEmail: string | null;
  client: {
    clientId: number;
  };
  state: location;
  cityId: location;
  country: location;
  isBillingStateTamilNadu: boolean;
}

export const addClientLocationSchema = yup.object().shape({
  pincode: yup
    .string()
    .typeError("Pincode must be a number")
    .matches(/^[0-9\s-]{3,10}$/, "Invalid pincode format")
    .required("Pincode is required"),
  address1: yup
    .string()
    .required("Address is required")
    .min(3, "Must be at least 3 characters")
    .max(250, "Must be 250 characters or less"),
  hrContactPerson: yup
    .string()
    .required("HR Contact Person is required")
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 50 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),

  hrMobileNumber: yup
    .string()
    .required("HR Mobile Number is required")
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/i, "Invalid Mobile number format"),
  companyLandline: yup
    .string()
    .required("Company Landline is required")
    .matches(
      /^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/i,
      "Invalid landline number format"
    ),
  hrContactPersonEmail: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .required("Email is required"),
  state: yup
    .object()
    .shape({
      locationId: yup.number().min(1, "Select a state"),
    })
    .required("State is required"),
  client: yup
    .object()
    .shape({
      clientId: yup
        .number()
        .required("Client is required")
        .min(1, "Select a client"),
    })
    .required("Client is required"),
  country: yup
    .object()
    .shape({
      locationId: yup
        .number()
        .required("Select a Country")
        .min(1, "Select a Country"),
    })
    .required("Country is required"),
  cityId: yup.object().shape({
    locationId: yup
      .number()
      .required("City is required")
      .min(1, "Select a city"),
  }),
  isHeadQuarter: yup.boolean().required("Is This HQ ?"),
});
