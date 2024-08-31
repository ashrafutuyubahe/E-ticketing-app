import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Admin from '../models/adminModel';

const Router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

Router.post('/adminRegister', async (req, res) => {
  try {
    const { adminEmail, adminPassword, adminAgency } = req.body;

    const existingadmin = await Admin.findOne({ adminEmail });

    if (existingadmin) {
      return res.status(400).json({
        error: 'admin already exists. please Register with other credentials',
      });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = new Admin({
      adminEmail,
      adminPassword: hashedPassword,
      adminAgency,
    });

    const saveAdmin = await newAdmin.save();

    if (saveAdmin) {
      return res.status(201).json({ message: 'admin registered successfully' });
    }
    return res.status(404).json({ message: 'admin registration failed' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

Router.post('/adminLogin', async (req, res) => {
  try {
    const { adminEmail, adminPassword, adminAgency } = req.body;

    if (!adminEmail || !adminPassword || !adminAgency) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const AdminInstance = await Admin.findOne({ adminEmail });

    if (!AdminInstance) {
      return res
        .status(400)
        .json({ error: 'Invalid Email, Agency, or Password...' });
    }

    const validPassword = await bcrypt.compare(
      adminPassword,
      AdminInstance.adminPassword
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ error: 'Invalid Email, Agency, or Password' });
    }

    const token = jwt.sign({ adminId: AdminInstance._id }, SECRET_KEY, {
      expiresIn: '4h',
    });

    return res.json({ message: 'Logged in successfully', token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const blacklist = new Set();

Router.post('/logout', (req, res) => {
  const token = req.header.authorization.replace('Bearer ', '');
  if (token) {
    blacklist.add(token);
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(400).json({ error: 'No token provided' });
  }
});

Router.post('/verifyToken', (req, res) => {
  const token = req.header.authorization.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  return jwt.verify(token, SECRET_KEY, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid or expired' });
    }
    return res.status(200).json({ message: 'Token is valid' });
  });
});

export default Router;
