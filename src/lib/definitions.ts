// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

export type Candidate = {
	contactId?:number,
	firstName: string;
	lastName: string;
	dob: string|null;
	primaryNumber: string;
	secondaryNumber?: string|null;
	emailId: string;
	designation: string;
	companyName: string|null;
	totalExperience: number|null;
	isActive: boolean;
	candidateStatus: string;
	currentSalary: number |null;
	expectedSalary?: number;
	highestEducation: string;
	gender: string;
	hiringType?: string;
	pinCode: number|null;
	maritalStatus: string;
	techRole: string;
	noticePeriod: number|null;
	currentLocation: Location;
	differentlyAbled: boolean;
	isDifferentlyAbled: string;
	address1: string|null;
	addressLocality: string|null;
	differentlyAbledType: string|null;
	preferredJobType?: string;
	image?:string
	resume?:string | undefined;
	relavantExperience?: string;
	isExpectedCtcNegotiable?:boolean;
	linkedin?:string;
	github?:string;
	twitter?:string;
	blog?:string;
};

export type Location = {
	locationId?: number|null
	locationDetails?: string
	insertedOn?: string
}

export type Columns ={
	Header: string;
	accessor: string;
	hiddenOnSmall?: boolean;
}[];
