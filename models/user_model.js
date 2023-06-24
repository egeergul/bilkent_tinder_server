import mongoose from "mongoose";
import { gender, interestedInSeeing, interests, lookingFor, orientations } from "./enums.js";

const userSchema = mongoose.Schema({
  id: { type: String },
  firstName: { type: String, required: true },
  email: { type: String, required: true,  unique: true  },
  sexualOrientation: { type: [String], required: true, enum: orientations},
  showOrientation: {type: Boolean, default: false},
  gender: {type: String, enum : gender},
  showGender: {type: Boolean, default: false},
  birthDay: {type: Date, required: true},
  interests: {type: [String], required: true,  enum: interests},
  lookingFor: {type: String, required: true, enum: lookingFor},
  interestedInSeeing : {type: String, required: true, enum: interestedInSeeing}

});

export default mongoose.model("User", userSchema);
