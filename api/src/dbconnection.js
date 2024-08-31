import 'dotenv/config';
import mongoose from 'mongoose';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

const uri =
  'mongodb+srv://tuyubaheashrafu2023:easy0321@eticketproject.jzbseef.mongodb.net/?retryWrites=true&w=majority&appName=EticketProject';

export const connection = mongoose
  .connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));
