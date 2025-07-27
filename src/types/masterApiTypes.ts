// Master types
export interface VendorDetails {
  id: number; 
  vendorName: string;
  contactPerson: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  gstNumber: string;
}

export interface ClientDetails {
  id: number;
  clientName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  address: string;
  gstNumber: string;
}

export interface ProductDetails {
  id: number;
  machineType: string;
  brand: string;
  modelNumber: string;
  description: string;
}



//-------------old remove this later ------------

export interface BloodDetails {
  id: number;
  name: string;
  remarks: string;
}



export interface SpareDetails {
  id: number;
  spareName: string;
  partNumber: string;
}


export interface LoanDetails {
  id: number;
  name: string;
  maxEligibilityAmount: number;
  loanRepaymentPeriod: number;
  employeeWorkedMonths: number;
  remarks: string;
}
