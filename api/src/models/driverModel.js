import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  driverName: { type: String, required: true, unique: true },
  driverPassword: { type: String, required: true },
  driverCar: { type: String, required: true },
  driverAgency: { type: String, required: true },
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
