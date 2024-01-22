import mongoose from 'mongoose';

const medRecordSchema = new mongoose.Schema();

export const MedRecord = mongoose.model('MedRecord', medRecordSchema);
