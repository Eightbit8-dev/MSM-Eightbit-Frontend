// emplyee types

import type { EntityTuple } from "./types";

export interface Employee {
  code: string;
  name: string;
  branch: EntityTuple;
  department: EntityTuple;
  designation: EntityTuple;
  doj: string;
  mobile1: string;
  biometricNo: string;
  shift: EntityTuple;
}
export interface EmployeeListResponse {
  data: Employee[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

// types/EmployeePrimaryProfile.ts
export interface EmployeePrimaryProfile {
  id: number;
  branch: [number, string];
  code: string;
  name: string;
  doj: string;
  designation: [number, string];
  department: [number, string];
  shift: [number, string];
  gender: string;
  dob: string;
  age: number;
  confirmationDate: string;
  maritalStatus: string;
  status: string;
  guardianName: string;
  addressLine1: string;
  addressLine2: string;
  location: string;
  city: string;
  biometricNo: string;
  salaryType: string;
  aadharNo: string;
  mobile1: string;
  mobileOfficial: string;
  bloodGroup: [number, string];
}

export type EmployeeContactProfile = {
  id: number;
  presentAddress: string;
  permanentAddress: string;
  email: string;
  community: string;
  caste: string;
  religion: string;
};
export interface EmployeeEducationProfile {
  id?: number;
  degreeOrDiplomaObtained: string;
  specialization: string;
  institutionOrUniversity: string;
  yearOfPassing: number;
  percentageOfMarks: number;
  additionalNotes: string;
}
export interface EmployeeExperience {
  id?: number;
  organization: string;
  designation: string;
  numberOfYears: number;
  place: string;
  additionalNotes: string;
}



export type EmployeeRejoin = {
employeeCode: string;
rejoinDate: string;
refDate:string;
};

