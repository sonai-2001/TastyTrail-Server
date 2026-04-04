export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
  RES_PARTNER = "res_partner",
  DRIVER = "driver",
}
// "user" | "res_partner" | "driver" | "admin";

export enum RoleEnum {
  ADMIN = "admin",
  USER = "user",
  RESTAURANT_OWNER = "restaurant_owner",
  OUTLET_STAFF = "outlet_staff",
  DELIVERY_PARTNER = "delivery_partner"
}

export enum UserEnum{
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING= 'pending',
};

export enum statusEnum {
  ACTIVE='active',
  INACTIVE='inactive'
}

/*
export enum OnboardingStep {
  REGISTERED = "REGISTERED",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",

  USER_PROFILE = "USER_PROFILE",          // address, lat/lng
  OWNER_PROFILE = "OWNER_PROFILE",        // restaurant
  DRIVER_PROFILE = "DRIVER_PROFILE",

  COMPLETED = "COMPLETED"
}
*/

export enum OnboardingStep {
  REGISTERED = "REGISTERED",        
  EMAIL_VERIFIED = "EMAIL_VERIFIED",
  MERCHANT_CREATED='MERCHANT_CREATED',
  PROFILE_INCOMPLETE = "PROFILE_INCOMPLETE",
  DOCUMENTS_PENDING = "DOCUMENTS_PENDING",
  REVIEW_PENDING = "REVIEW_PENDING",
  APPROVED = "APPROVED",          
  COMPLETED = "COMPLETED"
}

export enum ServiceTypeEnum {
  DELIVERY_ONLY = "DELIVERY_ONLY",
  DINE_IN_ONLY = "DINE_IN_ONLY",
  DELIVERY_AND_DINE_IN = "DELIVERY_AND_DINE_IN"
}

export enum MerchantApprovalStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum MerchantOperationalStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

export enum OutletApprovalStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum OutletOperationalStatusEnum {
  ONLINE='online',
  OFFLINE='offline',
  ACTIVE = "active",
  INACTIVE = "inactive",     // closed by owner
}

export enum OutletUserRoleEnum {
  OWNER = "OWNER",         // Full access — usually the merchant themselves
  MANAGER = "MANAGER",     // Day-to-day outlet management (future use)
  STAFF = "STAFF"          // Limited access — e.g., orders, kitchen tasks
}

export enum BankStatusEnum {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

// enums/onboarding.enum.ts
export enum OutletOnboardingStep {
  BASIC_INFO = "BASIC_INFO",
  ADDRESS = "ADDRESS",
  CONTACT_POINT = "CONTACT_POINT",
  DOCUMENTS = "DOCUMENTS",
  MENU = "MENU",
  REVIEW = "REVIEW"
}
