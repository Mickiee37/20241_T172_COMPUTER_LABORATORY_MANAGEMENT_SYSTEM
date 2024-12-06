import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
  labNumber: { type: String, required: true },
  labName: { type: String, required: true },
  status: { type: String, default: 'closed' },
  instructor: { type: String, default: null },
  qrValue: { type: String, required: true },
});

const Lab = mongoose.models.Lab || mongoose.model('Lab', labSchema);
export default Lab;
