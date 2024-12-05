import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
  labNumber: { type: String, required: true },
  qrValue: { type: String, required: true },
  status: { type: String, default: 'closed' },
  instructor: { type: String, default: null },
  timeIn: { type: Date, default: null },
});

const Lab = mongoose.models.Lab || mongoose.model('Lab', labSchema);

export default Lab;
