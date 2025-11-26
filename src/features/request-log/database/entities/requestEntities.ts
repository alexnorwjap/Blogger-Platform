import mongoose from 'mongoose';

type RequestLogEntity = {
  _id: string;
  ip: string;
  url: string;
  date: Date;
};

const requestLogSchema = new mongoose.Schema<RequestLogEntity>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true, expires: 30 },
});

export { RequestLogEntity, requestLogSchema };
