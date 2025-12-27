export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  RESTUAURANT_OWNER = 'restaurant_owner',
  DELIVERY_PERSON = 'delivery_person',

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

export enum OnboardingStep {
  REGISTERED = "REGISTERED",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",

  USER_PROFILE = "USER_PROFILE",          // address, lat/lng
  OWNER_PROFILE = "OWNER_PROFILE",        // restaurant
  DRIVER_PROFILE = "DRIVER_PROFILE",

  COMPLETED = "COMPLETED"
}


