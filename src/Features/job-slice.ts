import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Location } from "@/lib/definitions";

interface ClientLocationDto {
  clientLocationId?: number;
  state: Location;
  country: Location;
}

export interface JobFormData {
  // Step 1 - Basic Details
  jobTitle: string | null;
  jobCode: string | null;

  // Step 2 - Preferences
  minimumExperience: string | null;
  maximumExperience: string | null;
  salaryInCtc: string | null;
  noOfOpenings: number | null;
  preferredJobMode: string | null;
  hiringType: string | null;
  jobPostType: string | null;

  // Step 3 - Job Description
  jobDescription: string | null;
  jd: File | null;

  // Common fields
  isJobActive: string | null;
  client: { clientId: number | null | undefined };
  locations: Location[] | null;
}

interface JobFormState {
  currentStep: number;
  formData: JobFormData;
}

const initialState: JobFormState = {
  currentStep: 1,
  formData: {
    jobTitle: null,
    jobCode: null,
    // jobLocation: "India, MH, Mumbai",
    noOfOpenings: null,
    minimumExperience: null,
    maximumExperience: null,
    salaryInCtc: null,
    preferredJobMode: null,
    jobDescription: null,
    hiringType: null,
    jobPostType: null,
    jd: null,
    isJobActive: null,
    client: {
      clientId: null,
    },
    locations: null,
  },
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateAddJobFormData: (
      state,
      action: PayloadAction<Partial<JobFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    nextStep: (state) => {
      if (state.currentStep < 4) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    resetForm: (state) => {
      state.currentStep = 1;
      state.formData = initialState.formData;
    },
  },
});

export const {
  setCurrentStep,
  updateAddJobFormData,
  nextStep,
  prevStep,
  resetForm,
} = jobSlice.actions;
export default jobSlice.reducer;
