import { PlatformType, DeviceType, DeviceOsType, DeviceModelType } from '../constants/sessions.constants';

export interface ICreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
  platform: PlatformType;
  deviceType: DeviceType;
  deviceOs: DeviceOsType;
  deviceModel?: DeviceModelType;
}

export interface IEditUserProfileDto extends ICreateUserDto {
  photo?: Express.Multer.File;
}
