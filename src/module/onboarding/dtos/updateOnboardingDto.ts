export interface UpdateOnboardingDto {
  step?: number;
  serviceType?: "delivery_dining" | "delivery_only" | "dining_only";

  restaurantDetails?: {
    restaurantName?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    cuisines?: string[];
    gstNumber?: string;
    fssaiNumber?: string;
    images?: string[];
  };

  serviceAvailability?: {
    day: string;
    openTime?: string;
    closeTime?: string;
    isOpen: boolean;
  }[];

  paymentDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}