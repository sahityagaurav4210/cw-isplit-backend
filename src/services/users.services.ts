import AppConstants from '../constants';
import { UserModel } from '../db';
import { CWISplitAppException } from '../exceptions';
import type { ICreateUserDto } from '../interfaces';

export async function createUser(payload: ICreateUserDto) {
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      'Please provide necessary details',
      HttpCodes.BAD_REQUEST,
      createUser.name
    );
  }

  const user = await UserModel.findOne({ email });

  if (user) {
    throw new CWISplitAppException(ApiStatus.BAD_REQUEST, 'User already exists', HttpCodes.BAD_REQUEST, createUser.name);
  }

  const newUser = new UserModel(payload);
  await newUser.save();

  return newUser.toJSON();
}
