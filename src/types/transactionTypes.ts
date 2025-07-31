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
}

export interface MachineResponse {
  data: MachineDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ServiceRequest {
  referenceNumber: string;
  requestDate: string;
  complaintDetailsId: number;
  otherComplaintDetails?: string;
  clientId: number;
  machineEntryId: number;
}

export interface ServiceRequestItem {
  id: number;
  referenceNumber: string;
  requestDate: string;
  complaintDetails: string | null;
  clientName: string;
  machineType: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
}

export interface ServiceRequestResponse {
  data: ServiceRequestItem[];
  page: number;
  totalPages: number;
  totalRecords: number;
}
