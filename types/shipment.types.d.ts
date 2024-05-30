import mongoose from 'mongoose';

export interface ShipmentData {
  userId: mongoose.Types.ObjectId;
  userMarketId: number;
  pupId: mongoose.Types.ObjectId;
  status: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
  weight: number;
  price: ShipmentKeys;
  trackerNumber: number;
  delivery: {
    status: boolean;
    date: string;
    address: string;
    phoneNumber: string;
  };
  isPaid: boolean;
  datetime: Date;
}

interface ShipmentKeys {
  [key: string]: number;
}

export interface DeliveryData {
  address: string;
  phoneNumber: string;
  date: string;
}

export interface ShipmentStatusData {
  _id: string;
  status: string;
  isPaid: boolean;
}
