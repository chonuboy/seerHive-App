import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Location } from "@/lib/definitions";

export interface CandidateFormData {
  contactId: number | null;
  // Basic Details
  firstName: string;
  lastName: string;
  middleName: string | null;
  dob: string;
  emailId: string;
  primaryNumber: string;
  secondaryNumber: string | null;
  gender: string;
  maritalStatus: string;
  currentLocation: any;
  pinCode: string | null;
  address1: string | null;
  addressLocality: string | null;
  isActive: boolean;
  differentlyAbled: boolean;
  differentlyAbledType: string | null;

  // Professional Details
  highestEducation: string;
  totalExperience: number | string;
  noticePeriod: number | string;
  designation: string | null;

  techRole: string | null;
  //   relevantExperience: number | string
  isExpectedCtcNegotiable: boolean;

  // Preferences
  currentSalary: number | string;
  expectedSalary: number | string;
  resume: string;
  image: string | null;
}

interface CandidateState {
  currentStep: number;
  formData: CandidateFormData;
}

const initialFormData: CandidateFormData = {
  contactId: null,
  firstName: "",
  middleName: null,
  lastName: "",
  dob: "",
  emailId: "",
  primaryNumber: "",
  secondaryNumber: null,
  gender: "",
  maritalStatus: "",
  currentLocation: { locationId: 0, locationDetails: "", insertedOn: "" },
  pinCode: null,
  address1: null,
  addressLocality: null,
  isActive: true,
  differentlyAbled: false,
  differentlyAbledType: null,
  highestEducation: "",
  totalExperience: "",
  noticePeriod: "",
  designation: null,
  image: null,
  currentSalary: "",
  techRole: null,
  expectedSalary: "",
  isExpectedCtcNegotiable: false,
  resume: "",
};

const initialState: CandidateState = {
  currentStep: 1,
  formData: initialFormData,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    updateCandidateFormData: (
      state,
      action: PayloadAction<Partial<CandidateFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetCandidateForm: (state) => {
      state.currentStep = 1;
      state.formData = initialFormData;
    },
  },
});

export const {
  nextStep,
  prevStep,
  updateCandidateFormData,
  resetCandidateForm,
} = candidateSlice.actions;
export default candidateSlice.reducer;
