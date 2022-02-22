import { object, string, ref } from "yup";
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("Password is required")
      .min(8, "Password is too short - should be 6 chars minimum.")
      .matches(passwordRegex, "Password is not valid."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const deleteUserSchema = object({
  params: object({
    id: string().required("Id is required"),
  }),
});

export const findUserByEmailSchema = object({
  body: object({
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required"),

    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
