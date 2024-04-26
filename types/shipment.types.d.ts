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
  delivery: boolean;
  isPaid: boolean;
}

interface ShipmentKeys {
  [key: string]: number;
}
