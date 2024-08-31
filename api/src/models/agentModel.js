import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true, unique: true },
  agentEmail: { type: String, required: true, unique: true },
  agentPassword: { type: String, required: true },
  agentAgency: { type: String, required: true },
  agentWorkStation: { type: String, required: true },
});

const Agent = mongoose.model('Agents', agentSchema);

export default Agent;
