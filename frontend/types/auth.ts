export type UserRole = "ATTENDANT" | "DOCTOR";

export type LoginResponse = {
  access_token: string;
  id: string;
  email: string;
  role: UserRole;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
