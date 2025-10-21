import { ObjectId } from 'mongodb';

export type entityDB = {
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
  devices?: {
    deviceId: string;
    date: Date;
  }[];
};

export type inputCreateDto = {
  email: string;
  login: string;
  password: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
};
