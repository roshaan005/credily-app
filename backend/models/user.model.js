import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: false, // Make email optional
      // Remove the index definition here since we'll use schema.index() with sparse option
      trim: true,
      lowercase: true,
      unique: true, 
      validate: {
        validator: function (v) {
          // Only validate if email is provided
          return (
            v === undefined ||
            v === null ||
            v === "" ||
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
          );
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't include password in query results by default
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+\d{1,4}\s\d+$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! Format should be +[country code] [number]`,
      },
    },
    profilePicture: {
      type: String,
      default: "default-profile.png",
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Define the email index with sparse option - this is the only place we define the email index
userSchema.index({ email: 1 }, { sparse: true, unique: true });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
