import * as Yup from "yup"
export interface RecruitCandidateData {
  id?:number;
  date: string;
  recruiterName: string;
  portal: string;
  candidateName: string;
  role: string;
  primarySkill: string;
  secondarySkill: string;
  contactNumber: string;
  emailID: string;
  totalExperience: number;
  relevantExperience: number;
  currentCTC: number;
  expectedCTC: number;
  noticePeriod: number;
  currentLocation: string;
  preferredLocation: string;
  qualification: string;
  communicationSkillsRating: number;
  technicalSkillsRating: number;
  remarks: string;
  resumeLink: string;
  sourcingStatus: string;
  preferredRoles: string[];
}
// Define the user type based on the provided JSON structure
export interface RecruitmentSearch {
  role: string;
  skills: string[];
  currentLocation: string;
  preferredLocations: string[];
  totalExperience: number;
  relevantExperience: number;
  communicationSkillsRating: number;
  technicalSkillsRating: number;
  noticePeriod: number;
  currentCTC: number;
  expectedCTC: number;
};

// Define the search form values type
export type recruitmentSearchFormValues = {
  role: string;
  skills: string[];
  currentLocation: string;
  preferredLocations: string[];
  totalExperience: number |null;
  relevantExperience: number |null;
  communicationSkillsRating: number|null;
  technicalSkillsRating: number|null;
  noticePeriod: number|null;
  currentCTC: number|null;
  expectedCTC: number|null;
};

export const recruitmentSearchSchema = Yup.object().shape({
  role: Yup.string().required("Role is required"),
  skills: Yup.array().required("At least one skill is required"),
  currentLocation: Yup.string().required("Current location is required"),
  preferredLocations: Yup.array().required("At least one preferred location is required"),
  totalExperience: Yup.number().required("Total experience is required"),
  relevantExperience: Yup.number().required("Relevant experience is required"),
  communicationSkillsRating: Yup.number().required("Communication skills rating is required"),
  technicalSkillsRating: Yup.number().required("Technical skills rating is required"),
  noticePeriod: Yup.number().required("Notice period is required"),
  currentCTC: Yup.number().required("Current CTC is required"),
  expectedCTC: Yup.number().required("Expected CTC is required"),
});


const RecruitmentCandidateSchema = Yup.object().shape({
  // Basic Information
  recruiterName: Yup.string()
    .required('Recruiter name is required')
    .min(2, 'Recruiter name must be at least 2 characters'),
  portal: Yup.string()
    .required('Portal is required')
    .oneOf(['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Other'], 'Invalid portal selected'),
  candidateName: Yup.string()
    .required('Candidate name is required')
    .min(3, 'Candidate name must be at least 3 characters').max(30, 'Candidate name should not exceed 30 characters'),
  role: Yup.string()
    .required('Role is required')
    .min(3, 'Role must be at least 3 characters').max(30, 'Role should not exceed 30 characters'),
  qualification: Yup.string()
    .required('Qualification is required')
    .min(2, 'Qualification must be at least 2 characters'),

  // Skills & Experience
  primarySkill: Yup.string()
    .required('Primary skill is required')
    .min(3, 'Primary skill must be at least 3 characters').max(30, 'Primary skill should not exceed 30 characters'),
  secondarySkill: Yup.string()
    .required('Secondary skill is required')
    .min(3, 'Secondary skill must be at least 2 characters').max(30, 'Secondary skill should not exceed 30 characters'),
  totalExperience: Yup.number()
    .required('Total experience is required')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high'),
  relevantExperience: Yup.number()
    .required('Relevant experience is required')
    .min(0, 'Experience cannot be negative')
    .max(Yup.ref('totalExperience'), 'Relevant experience cannot exceed total experience'),
  communicationSkillsRating: Yup.number()
    .required('Communication rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  technicalSkillsRating: Yup.number()
    .required('Technical rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  // Contact Information
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/, 'Phone number must be 10 digits'),
  emailID: Yup.string()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/, 'Invalid email format'),
  currentLocation: Yup.string()
    .required('Current location is required')
    .min(2, 'Location must be at least 2 characters'),
  preferredLocation: Yup.string()
    .required('Preferred location is required')
    .min(2, 'Location must be at least 2 characters'),

  // Compensation & Notice Period
  currentCTC: Yup.number()
    .required('Current CTC is required')
    .min(0, 'CTC cannot be negative'),
  expectedCTC: Yup.number()
    .required('Expected CTC is required')
    .min(Yup.ref('currentCTC'), 'Expected CTC should be ≥ current CTC'),
  noticePeriod: Yup.number()
    .required('Notice period is required')
    .min(0, 'Notice period cannot be negative')
    .max(90, 'Notice period seems too long'),

  // Preferred Roles
  preferredRoles: Yup.array()
    .of(Yup.string().min(2, 'Role must be at least 2 characters'))
    .min(1, 'At least one preferred role is required'),

  // Additional Information
  sourcingStatus: Yup.string()
    .required('Sourcing status is required')
    .oneOf(['Active', 'Passive', 'On Hold', 'Hired'], 'Invalid status selected'),
  remarks: Yup.string()
    .required('Remarks are required')
    .max(500, 'Remarks should not exceed 500 characters'),
});

export default RecruitmentCandidateSchema;

export const RecruitmentCandidateUpdateSchema = Yup.object().shape({
  // Basic Information
  recruiterName: Yup.string()
    .min(2, 'Recruiter name must be at least 2 characters')
    .nullable(),
  portal: Yup.string()
    .oneOf(['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Other'], 'Invalid portal selected')
    .nullable(),
  candidateName: Yup.string()
    .min(3, 'Candidate name must be at least 3 characters')
    .max(30, 'Candidate name should not exceed 30 characters')
    .nullable(),
  role: Yup.string()
    .min(3, 'Role must be at least 3 characters')
    .max(30, 'Role should not exceed 30 characters')
    .nullable(),
  qualification: Yup.string()
    .min(2, 'Qualification must be at least 2 characters')
    .nullable(),

  // Skills & Experience
  primarySkill: Yup.string()
    .min(3, 'Primary skill must be at least 3 characters')
    .max(30, 'Primary skill should not exceed 30 characters')
    .nullable(),
  secondarySkill: Yup.string()
    .min(2, 'Secondary skill must be at least 2 characters')
    .max(30, 'Secondary skill should not exceed 30 characters')
    .nullable(),
  totalExperience: Yup.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high')
    .nullable(),
  relevantExperience: Yup.number()
    .min(0, 'Experience cannot be negative')
    .max(Yup.ref('totalExperience'), 'Relevant experience cannot exceed total experience')
    .nullable(),
  communicationSkillsRating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .nullable(),
  technicalSkillsRating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .nullable(),

  // Contact Information
  contactNumber: Yup.string()
    .matches(/^(?:\+?\d{1,3}[- ]?)?\d{8,12}$/, 'Phone number must be 10 digits')
    .nullable(),
  emailID: Yup.string()
    .matches(/^[a-zA-Z0-9][-a-zA-Z0-9._]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,4}$/, 'Invalid email format')
    .nullable(),
  currentLocation: Yup.string()
    .min(2, 'Location must be at least 2 characters')
    .nullable(),
  preferredLocation: Yup.string()
    .min(2, 'Location must be at least 2 characters')
    .nullable(),

  // Compensation & Notice Period
  currentCTC: Yup.number()
    .min(0, 'CTC cannot be negative')
    .nullable(),
  expectedCTC: Yup.number()
    .min(Yup.ref('currentCTC'), 'Expected CTC should be ≥ current CTC')
    .nullable(),
  noticePeriod: Yup.number()
    .min(0, 'Notice period cannot be negative')
    .max(90, 'Notice period seems too long')
    .nullable(),

  // Preferred Roles
  preferredRoles: Yup.array()
    .of(Yup.string().min(2, 'Role must be at least 2 characters'))
    .nullable(),

  // Additional Information
  sourcingStatus: Yup.string()
    .oneOf(['Active', 'Passive', 'On Hold', 'Hired'], 'Invalid status selected')
    .nullable(),
  remarks: Yup.string()
    .max(500, 'Remarks should not exceed 500 characters')
    .nullable(),
});