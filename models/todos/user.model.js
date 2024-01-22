import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    //  can use this method as well
    // username: String,
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  // mongodb will create created at and updated at
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
