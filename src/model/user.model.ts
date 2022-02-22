import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
      maxLength: [12, "A name should not be longer than 12 characters"],
      minlength: [3, "A name should be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 8,
      maxLength: 24,
      select: false,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password") || user.isNew) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  try {
    await bcrypt.compare(candidatePassword, userPassword);
    return true;
  } catch (e) {
    return false;
  }
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
