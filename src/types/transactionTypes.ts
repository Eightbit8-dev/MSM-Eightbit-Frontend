export interface MachineDetails {
  id: number;
  slNo: string;
  serialNumber: string;
  referenceNumber: string;
  installationDate: string;
  installedBy: string;
  machinePhotos: string[];
  clientName: string;
  machineType: string;
  brand: string;
  modelNumber: string;
  productId: number;
}

export interface MachineResponse {
  data: MachineDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

// export interface ServiceRequest {
//   referenceNumber: string;
//   requestDate: string;
//   complaintDetailsId: number;
//   otherComplaintDetails?: string;
//   clientId: number;
//   machineEntryId: number;
// }

export interface ServiceRequest {
  id: number;
  referenceNumber: string;
  requestDate: string;
  complaintDetails: string;
  otherComplaintDetails?: string;
  clientName: string;
  machineType: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  status?: string;
  machineEntryId?: number;
}
export interface ServiceRequestResponse {
  data: ServiceRequest[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ServiceRequestPayload {
  referenceNumber: string;
  requestDate: string;
  complaintDetailsId?: number;
  otherComplaintDetails?: string;
  clientId: number;
  machineEntryId: number;
}

// --- service entry ----
export interface ServiceEntryRequest {
  id?: number; // remove this later
  refNumber: string;
  serviceDate: string;
  maintenanceType: string;
  maintenanceSubType: string;
  serviceRequestId: number;
  vendorId: number;
  engineerId: number;
  engineerDiagnostics: string;
  serviceStatus: string;
  remarks: string;
  complaintSparePhotoUrl: string;
  spareParts: [];
}
