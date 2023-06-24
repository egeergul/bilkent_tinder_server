import mongoose from "mongoose";

const verificationSchema = mongoose.Schema({
  id: { type: String },
  email: { type: String, required: true,  unique: true  },
  verificationNumber: { type: String, required: true },
});

export default mongoose.model("Verification", verificationSchema);
