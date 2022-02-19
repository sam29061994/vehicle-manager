import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  findUser,
  getAllUsers,
} from "../service/user.service";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(409).send((e as Error).message);
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser({ _id: id });
    res.status(200).json({
      status: "succes",
    });
  } catch (e) {
    res.status(409).send((e as Error).message);
  }
};

export const findUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await findUser({ _id: id });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(409).send((e as Error).message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (e) {
    res.status(409).send((e as Error).message);
  }
};
