import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RecruitmentSearch, recruitmentSearchFormValues } from "@/lib/models/recruitmentCandidate";

const initialState: RecruitmentSearch = {
    role: "",
    skills: [],
    currentLocation: "",
    preferredLocations: [],
    totalExperience: 0,
    relevantExperience: 0,
    communicationSkillsRating: 0,
    technicalSkillsRating: 0,
    noticePeriod: 0,
    currentCTC: 0,
    expectedCTC: 0,
};

const recruitSearchSlice = createSlice({
    name: "recruitSearch",
    initialState,
    reducers: {
        setRecruitmentSearchQuery: (state, action: PayloadAction<recruitmentSearchFormValues>) => {
            Object.assign(state, action.payload);
        },
        clearRecruitmentSearchQuery: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const { setRecruitmentSearchQuery, clearRecruitmentSearchQuery } = recruitSearchSlice.actions;
export default recruitSearchSlice.reducer;