import * as yup from "yup";
import { Candidate, Columns } from "@/lib/definitions";
import { Client } from "./client";
import { Location } from "@/lib/definitions";
import {
  CandidateStatus,
  Gender,
  HiringType,
  MaritalStatus,
  DifferentlyAbled,
  PreferredJobType,
} from "../constants";

const phoneRegExp = /^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/;

export const CandidateModel: Candidate = {
  firstName: "",
  lastName: "",
  dob: null,
  primaryNumber: "",
  secondaryNumber: null,
  emailId: "",
  designation: "",
  companyName: null,
  totalExperience: null,
  isActive: true,
  candidateStatus: CandidateStatus.ACTIVE,
  isExpectedCtcNegotiable: false,
  currentSalary: null,
  highestEducation: "",
  gender: Gender.MALE,
  pinCode: null,
  maritalStatus: MaritalStatus.MARRIED,
  techRole: "",
  noticePeriod: null,
  currentLocation: { locationId: 0, locationDetails: "", insertedOn: "" },
  differentlyAbled: false,
  isDifferentlyAbled: DifferentlyAbled.NO,
  address1: null,
  addressLocality: null,
  differentlyAbledType: null,
};

export const CandidateSchema = yup.object({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(20, "Must be 15 characters or less")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(1, "Must be at least 3 characters")
    .max(20, "Must be 20 characters or less")
    .required("Last name is required"),
  dob: yup.date().nullable(),
  primaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile number is required")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters"),
  secondaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters")
    .nullable(),
  emailId: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .email("Invalid email address")
    .required("Email address is required"),
  designation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .required("Designation is required"),
  companyName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .nullable(),
  totalExperience: yup.number().required("Experience is required"),
  candidateStatus: yup.string().required("Select status"),
  currentSalary: yup.number().required("Current salary is required"),
  expectedSalary: yup.number().required("Expected salary is required"),
  highestEducation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 50 characters or less")
    .required("Highest education is required"),
  gender: yup.string().required("Select gender"),
  pinCode: yup
    .string()
    .nullable()
    .min(6, "Must be at least 6 characters")
    .max(8, "Must be 8 characters or less"),
  maritalStatus: yup.string().required("Select marital status"),
  techRole: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Tech role is required")
    .max(100, "Must be 100 Characters or less"),
  noticePeriod: yup
    .number()
    .required("Notice period is required")
    .max(150, "Must be less than 150 Days"),
  currentLocation: yup.object().required("Current location is required"),
  isDifferentlyAbled: yup.string().required("Select your preference"),
  address: yup.string().min(3, "Must be Greater than 3 Characters").nullable(),
  addressLocality: yup
    .string()
    .min(3, "Must be Greater than 3 Characters")
    .nullable(),
  differentlyAbledType: yup.string().nullable(),
});

export const candidateSearchSchema = yup.object().shape({
  minExperience: yup.number().nullable(),
  maxExperience: yup.number().nullable(),
  currentLocation: yup.string().nullable(),
  minSalary: yup.number().nullable(),
  maxSalary: yup.number().nullable(),
  noticePeriod: yup.number().nullable(),
  preferredJobType: yup.string().nullable(),
  highestEducation: yup.string().nullable(),
  preferredLocation: yup.array().nullable(),
  domain: yup.array().nullable(),
  mustHaveTechnologies: yup.array().nullable(),
  goodToHaveTechnologies: yup.array().nullable().of(yup.string()).nullable(),
  companies: yup.array().nullable().of(yup.string()).nullable(),
  universities: yup.array().nullable().of(yup.string()).nullable(),
  courses: yup.array().nullable().of(yup.string()).nullable(),
  levels: yup.array().nullable().of(yup.string()).nullable(),
});

export interface Resume {
  doc?: string;
}

export const candidateTableColumns: Columns = [
  {
    Header: "Name",
    accessor: "fullName",
  },
  {
    Header: "Tech Role",
    accessor: "techRole",
  },
  {
    Header: "Email Id",
    accessor: "emailId",
    hiddenOnSmall: true,
  },
  {
    Header: "Primary Number",
    accessor: "primaryNumber",
    hiddenOnSmall: true,
  },
  {
    Header: "Status",
    accessor: "isActive",
  },
];

//   Contact Details for Profile Page Demo Data

export interface Certificates {
  certificationId?: number;
  certificationName: string;
  insertedOn?: string;
}

export interface contactCertificate {
  contactCertificationId?: number;
  contactDetails?: Candidate | null;
  certification?: Certificates | null;
  validFrom: string | null;
  hasExpiry: true;
  validTill: string | null;
}

export interface Interview {
  interviewId: number;
  interviewDate: string;
  interviewStatus: string;
  clientJob?: Client | null;
  contactDetails?: Candidate | null;
}

export interface Round {
  roundId?: number;
  interviewTime?: string;
  roundNumber: number;
  roundName?: string;
  roundDate: string;
  interviewerName: string;
  technologyInterviewed?: string | string[];
  techRating?: number;
  softskillsRating?: number;
  interviewStatus: string;
  remarks: string;
  interview: Interview | null;
  contactDetails?: Candidate;
  clientJob?: Client;
  interviewImageSnapshot?: string | null;
}

export interface Interviews {
  interviewId?: number;
  interview: Interview;
  interviewStatus?: string;
  contactDetails?: Candidate | null;
  clientJob?: Client;
}

export interface Technology {
  techId?: number;
  technology: string;
  insertedOn?: string;
}

export interface allTechs {
  contactTechId?: number;
  experience?: string;
  expertiseLevel?: string;
  contactDetails?: Candidate | null;
  technology: Technology;
}

export interface domainDetails {
  domainId?: number;
  domainDetails: string;
  insertedOn?: string;
}

export interface Domains {
  contactDomainId: number;
  contactDetails: Candidate | null;
  domain: domainDetails;
}

export interface SearchQueries {
  minExperience?: number | null;
  maxExperience?: number | null;
  currentLocation?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  noticePeriod?: number | null;
  preferredJobMode?: string[] | null;
  highestEducation?: string | null;
  preferredLocation?: string[] | null;
  domain?: string[] | null;
  contactHiringType?: string[] | null | undefined;
  mustHaveTechnologies?: string[] | null;
  goodToHaveTechnologies?: string[] | null;
  companies?: string[] | null;
  universities?: string[] | null;
  courses?: string[] | null;
  levels?: string[] | null;
}

export interface ReqData {
  contactId?: number;
  firstName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  address1?: string | null;
  secondaryNumber?: string | null;
  designation?: string | null;
  totalExperience?: number | null;
  image?: string | null;
  isActive?: boolean | null;
  highestEducation?: string | null;
  primaryNumber?: string | null;
  emailId?: string | null;
  hiringType?: string | null;
  pincode?: number | null;
  techRole?: string | null;
  currentSalary?: number | null;
  preferredJobType?: string | null;
  gender?: string | null;
  noticePeriod?: number | null;
  maritalStatus?: string | null;
  currentLocation?: Location | null;
  differentlyAbled?: boolean | null;
  differentlyAbledType?: string | null;
  linkedin?: string | null;
  addressLocality?: string | null;
}

export const profileUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .nullable()
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
  lastName: yup
    .string()
    .min(1, "Must be at least 3 characters")
    .nullable()
    .max(30, "Must be 30 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
  isActive: yup.boolean().nullable(),
  designation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .nullable(),
  techRole: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less"), // Added techRole which was missing
  totalExperience: yup
    .number()
    .typeError("Total Experience must be a number")
    .max(100, "Must be 100 years or less")
    .nullable(),
  highestEducation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .matches(/^[a-zA-Z. ]+$/, "Only alphabets are allowed")
    .nullable(),
  primaryNumber: yup
    .string()
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/, "Mobile Number is invalid")
    .nullable(),
  secondaryNumber: yup
    .string()
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/, "Mobile Number is invalid")
    .nullable(),
  emailId: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .nullable(),
  currentSalary: yup
    .number()
    .typeError("Current Salary must be a number")
    .nullable(),
  expectedSalary: yup
    .number()
    .typeError("Expected Salary must be a number")
    .nullable(),
  isExpectedCtcNegotiable: yup.boolean().nullable(), // Added this field
  gender: yup.string().nullable(),
  noticePeriod: yup
    .number()
    .typeError("Notice Period must be a number")
    .nullable(),
  maritalStatus: yup.string().nullable(),
  address1: yup.string().nullable(),
  addressLocality: yup.string().nullable(),
  pinCode: yup
    .string()
    .typeError("Pincode must be a number")
    .matches(/^[0-9\s-]{3,10}$/, "Invalid pincode format")
    .nullable(),
  companyName: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less"), // Added companyName
  differentlyAbled: yup.boolean().nullable(), // Added differentlyAbled
  differentlyAbledType: yup.string().nullable(),
  linkedin: yup.string().nullable(),
  dob: yup
    .date()
    .nullable()
    .max(new Date(), "Date of birth cannot be in the future"),
  currentLocation: yup
    .object()
    .shape({
      locationId: yup.number().required(),
      locationDetails: yup.string().nullable(),
    })
    .nullable(),
  preferredJobModes: yup.array().nullable(),
  hiringTypes: yup.array().nullable(),
  contactId: yup.number().nullable(),
});

export const candidateGridUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .nullable()
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
  lastName: yup
    .string()
    .min(1, "Must be at least 3 characters")
    .nullable()
    .max(30, "Must be 30 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
  isActive: yup.boolean().nullable(),
  designation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .nullable(),
  techRole: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less"),
  totalExperience: yup
    .number()
    .typeError("Total Experience must be a number")
    .max(100, "Must be 100 years or less")
    .nullable(),
  currentSalary: yup
    .number()
    .typeError("Current Salary must be a number")
    .nullable(),
  expectedSalary: yup
    .number()
    .typeError("Expected Salary must be a number")
    .nullable(),
  primaryNumber: yup
    .string()
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/, "Mobile Number is invalid")
    .nullable(),
  emailId: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .nullable(),
  currentLocation: yup
    .object()
    .shape({
      locationId: yup.number().required(),
      locationDetails: yup.string().nullable(),
    })
    .nullable(),
  noticePeriod: yup
    .number()
    .typeError("Notice Period must be a number")
    .nullable(),
  companyName: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less"),
});

export const interviewFormSchema = yup.object().shape({
  roundDate: yup
    .date()
    .nullable()
    .typeError("Interview Date must be a valid date"), // Validate date format
  interviewerName: yup
    .string()
    .min(3, "Interviewer Name must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .nullable(),
  status: yup
    .string()
    .oneOf(
      ["SCHEDULED", "PASSED", "REJECTED", "ON_HOLD", "CANCELLED"],
      "Invalid status"
    ) // Validate status
    .nullable(),
  remarks: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(100, "Must be 100 characters or less"),
  techRating: yup
    .number()
    .typeError("Tech Rating must be a number") // Ensure it's a number
    .min(1, "Tech Rating must be at least 1") // Minimum value
    .max(10, "Tech Rating cannot exceed 10") // Maximum value
    .nullable(),
  softskillsRating: yup
    .number()
    .typeError("Soft Skills Rating must be a number") // Ensure it's a number
    .min(1, "Soft Skills Rating must be at least 1") // Minimum value
    .max(10, "Soft Skills Rating cannot exceed 10") // Maximum value
    .nullable(),
  technologiesInterviewed: yup
    .string()
    .nullable()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less"),
  interviewImageSnapshot: yup.string().nullable(),
});

export const interviewRoundSchema = yup.object().shape({
  roundDate: yup.date().required("Interview date is required"),
  interviewerName: yup
    .string()
    .required("Interviewer name is required")
    .min(3, "Interviewer name must be at least 3 characters")
    .max(50, "Must be 50 characters or less"),
  interviewStatus: yup
    .string()
    .oneOf(
      ["SCHEDULED", "PASSED", "REJECTED", "ON_HOLD", "CANCELLED"],
      "Invalid status"
    ),
  technologies: yup
    .array()
    .of(
      yup.object().shape({
        technology: yup.string().required(),
      })
    )
    .min(1, "At least one technology is required"),
  softskillsRating: yup
    .number()
    .nullable()
    .typeError("Soft skills rating must be a number")
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"), // Changed from 10 to 5 to match your rating buttons
  remarks: yup
    .string()
    .required("Remarks are required")
    .min(3, "Must be at least 3 characters")
    .max(900, "Must be 900 characters or less"),
  interviewTime: yup.string().required("Interview Time Required"),
  interviewImageSnapshot: yup.string().nullable(),
});

export const step1Schema = yup.object({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less")
    .required("First name is required").matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
  middleName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 30 characters or less").matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .nullable(),
  lastName: yup
    .string()
    .min(1, "Must be at least 1 character")
    .max(30, "Must be 30 characters or less").matches(/^[a-zA-Z ]+$/, "Only alphabets are allowed")
    .required("Last name is required"),
  emailId: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .email("Invalid email address")
    .required("Email address is required"),
  dob: yup
    .date()
    .required("Date of birth is required")
    .max(
      new Date(Date.now() - 86400000),
      "Date must be in the past (not today or future)"
    ),
  primaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile number is required")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters"),
  secondaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters")
    .nullable(),
  gender: yup.string().required("Select gender"),
  maritalStatus: yup.string().required("Select marital status"),
  candidateStatus: yup.string().required("Select status"),
  differentlyAbled: yup.string().required("Select your preference"),
  currentLocation: yup.object().shape({
    locationId: yup.number().min(1, "Current Location is required").required(),
    insertedOn: yup.string().nullable(),
  }),
  pinCode: yup
    .string()
    .typeError("Pincode must be a number")
    .matches(/^[0-9\s-]{3,10}$/, "Invalid pincode format")
    .nullable(),
  address: yup
    .string()
    .min(3, "Must be Greater than 3 Characters")
    .nullable()
    .max(250, "Must be 250 characters or less"),
  addressLocality: yup
    .string()
    .min(3, "Must be Greater than 3 Characters")
    .nullable()
    .max(250, "Must be 250 characters or less"),
});

export const step2Schema = yup.object({
  // File validations can be added here if needed
  resume: yup.string().required("Resume is required"),
});

export const step3Schema = yup.object({
  totalExperience: yup.number().required("Experience is required"),
  designation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .nullable(),
  currentSalary: yup.number().required("Current salary is required"),
  expectedSalary: yup.number().required("Expected salary is required"),
  techRole: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(100, "Must be 100 Characters or less")
    .nullable(),
  noticePeriod: yup
    .number()
    .required("Notice period is required")
    .max(150, "Must be less than 150 Days"),
});

export const step4Schema = yup.object({
  expectedSalary: yup.string().required("Expected salary is required"),
  // jobType: yup.string().required("Select job type"),
  // workMode: yup.string().required("Select work mode"),
  isExpectedCtcNegotiable: yup.boolean().required("Select Negotiable Status"),
});

export const step5Schema = yup.object({
  // Social links are optional, so no required validations
});

export const AddCandidateSchema = yup.object({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(20, "Must be 15 characters or less")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(1, "Must be at least 3 characters")
    .max(20, "Must be 20 characters or less")
    .required("Last name is required"),
  dob: yup.date().nullable(),
  primaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile number is required")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters"),
  secondaryNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(15, "Must be 15 characters or less")
    .min(10, "Must be at least 10 characters")
    .nullable(),
  emailId: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/i,
      "Invalid email format"
    )
    .email("Invalid email address")
    .required("Email address is required"),
  designation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .required("Designation is required"),
  companyName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .nullable(),
  totalExperience: yup.number().required("Experience is required"),
  candidateStatus: yup.string().required("Select status"),
  currentSalary: yup.number().required("Current salary is required"),
  highestEducation: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be 50 characters or less")
    .required("Highest education is required"),
  gender: yup.string().required("Select gender"),
  pinCode: yup
    .string()
    .nullable()
    .min(6, "Must be at least 6 characters")
    .max(8, "Must be 8 characters or less"),
  maritalStatus: yup.string().required("Select marital status"),
  techRole: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Tech role is required")
    .max(100, "Must be 100 Characters or less"),
  noticePeriod: yup
    .number()
    .required("Notice period is required")
    .max(150, "Must be less than 150 Days"),
  currentLocation: yup.object().required("Current location is required"),
  isDifferentlyAbled: yup.string().required("Select your preference"),
  address: yup.string().min(3, "Must be Greater than 3 Characters").nullable(),
  addressLocality: yup
    .string()
    .min(3, "Must be Greater than 3 Characters")
    .nullable(),
  differentlyAbledType: yup.string().nullable(),
});
