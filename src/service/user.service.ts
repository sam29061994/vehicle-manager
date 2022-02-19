import { DocumentDefinition, Error, FilterQuery } from "mongoose";
import log from "../logger";
import User, { UserDocument } from "../model/user.model";

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
  try {
    const newUser = await User.create(input);
    return newUser;
  } catch (e) {
    log.error((e as Error).message);
    throw new Error((e as Error).message);
  }
};

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const deleteUser = async (query: FilterQuery<UserDocument>) => {
  return User.deleteOne(query);
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
  return User.findOne(query).lean();
};

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password, user.password);

  if (!isValid) {
    return false;
  }

  return true;
}
