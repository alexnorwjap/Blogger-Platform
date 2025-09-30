import { ObjectId } from 'mongodb';

export type EntityFromDb = {
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
};
