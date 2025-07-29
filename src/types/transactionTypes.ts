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
