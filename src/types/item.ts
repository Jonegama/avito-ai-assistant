export type Category = 'auto' | 'real_estate' | 'electronics';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type ItemParams =
  | AutoItemParams
  | RealEstateItemParams
  | ElectronicsItemParams;

export type Item = {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  params: ItemParams;
  needsRevision: boolean;
};

export type ItemDetail = Item & {
  missingFields?: string[];
};

export type ItemsResponse = {
  items: Item[];
  total: number;
};

export type ItemResponse = {
  items: ItemDetail[];
  total: number;
};

export type UpdateItemPayload = {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
};

export type GetItemsParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
};