import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InputAddRequestLogDto } from '../../service/RequestLogService';

type RequestLog = {
  _id: ObjectId;
  ip: string;
  url: string;
  date: Date;
};

interface RequestStaticsMethods {
  createRequest(dto: InputAddRequestLogDto): RequestDocument;
}
type RequestDocument = HydratedDocument<RequestLog>;
type RequestModel = Model<RequestLog> & RequestStaticsMethods;

const requestLogSchema = new mongoose.Schema<RequestLog>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true, expires: 30, default: () => new Date() },
});

class RequestEntity {
  declare ip: string;
  declare url: string;
  declare date: Date;

  static createRequest(dto: InputAddRequestLogDto): RequestDocument {
    return new RequestLogModel({
      ip: dto.ip,
      url: dto.url,
    });
  }
}

requestLogSchema.loadClass(RequestEntity);

const RequestLogModel = model<RequestLog, RequestModel>('Request', requestLogSchema);

export { RequestLog, RequestLogModel, RequestDocument };
