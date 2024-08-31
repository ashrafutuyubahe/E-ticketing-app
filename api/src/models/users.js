import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userPhoneNumber: { type: Number, required: true },
  userEmail: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
