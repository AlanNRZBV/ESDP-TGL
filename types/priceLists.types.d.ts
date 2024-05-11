export interface PriceListsData {
  name: string;
  ranges: Range[];
}

export interface Range {
  range: string;
  value: number;
}
