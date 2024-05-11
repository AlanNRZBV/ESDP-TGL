export interface PupData {
  name: string;
  region: string;
  settlement: string;
  address: string;
  phoneNumber: string;
}

export interface PupDataMutation {
  region: string;
  settlement: string;
  address: string;
  phoneNumber: number;
}
