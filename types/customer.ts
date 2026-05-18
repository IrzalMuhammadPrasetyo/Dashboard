export interface CustomerData {
  id: string;
  olt: string;
  ponId: string;
  onuId: string;
  name: string;
  status: string;
  sn: string;
  rsl: number | string;
  rslOnt: number | string;
  vendor: string;
  city: string;
  activeDate: string;
  tt: string;
}

export interface CustomerStats {
  total: number;
  online: number;
  offline: number;
  loss: number;
  warning: number;
  byCity: Record<string, number>;
  byVendor: Record<string, number>;
  byOlt: Record<string, number>;
  avgRsl: number;
  withTT: number;
}
