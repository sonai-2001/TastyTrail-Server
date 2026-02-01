export interface BankDetailsDto {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledChequeDoc: string;
}

export interface CreateOutletDTO  {
  name: string;
  serviceType: string;
  address: {
    line1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  contact: {
    phone: string;
    email?: string;
  };
  gstNumber?: string;
  fssaiLicenseNumber: string;
  fssaiLicenseDoc: string;
  panNumber: string;
  panDoc: string;
  bankDetails: BankDetailsDto;
}