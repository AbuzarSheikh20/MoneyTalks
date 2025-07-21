import mongoose from "mongoose";

const userSchema = new mongoose.Schema (
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOTP: {type: String, default: ''},
    verifyOTPExpireAT: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOTP: {type: String, default: ''},
    resetOTPExpireAt: {type: Number, default: 0},
    income: { type: Number, default: 0 },
    categories: { type: [String], default: [] },
  }
)


// mongoose.models.user --> searches if any mode with the name 'user' is present then add new userModel in it.
const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel