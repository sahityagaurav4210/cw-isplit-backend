interface IDbId {
  _id: string;
}

interface IDbTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IDbId, IDbTimestamps {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  photoUri?: string;
}
