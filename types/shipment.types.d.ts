import mongoose from 'mongoose';

export interface ShipmentData {
  userId: mongoose.Types.ObjectId;
  userMarketId: number;
  pupId: mongoose.Types.ObjectId;
  status: string;
  dimensions: ShipmentKeys;
  weight: number;
  price: ShipmentKeys;
  trackerNumber: number;
  isPaid: boolean;
}

interface ShipmentKeys {
  [key: string]: number;
}
