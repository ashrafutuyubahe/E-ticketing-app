import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  adminAgency: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
