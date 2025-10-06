import { ObjectId } from 'mongodb';

export type entityDB = {
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
};
