export interface ProviderItem {
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
  uid: string;
}

export interface Metadata {
  creationTime: string;
  lastRefreshTime: string;
  lastSignInTime: string;
}

export interface FirebaseUser {
  uid: string;
  disabled: boolean;
  displayName: string;
  email: string;
  emailVerified: boolean;
  metadata: Metadata;
  photoURL: string;
  providerData: ProviderItem[];
  tokensValidAfterTime: string;
  phoneNumber: string;
  localUser?: StrapiUser;
}

export interface StrapiUser {
  strapiId: string;
  id: string;
  username: string;
  email: string;
  password: string | null;
  passwordHash: string;
  passwordSalt: string;
  provider: string[] | null;
  resetPasswordToken: string | null;
  updatedAt: string;
  confirmed: boolean;
  confirmationToken: boolean;
  blocked: boolean;
  appleEmail: string | null;
  createdAt: string;
  firebaseUserID: string;
}

export type User = FirebaseUser & StrapiUser;
