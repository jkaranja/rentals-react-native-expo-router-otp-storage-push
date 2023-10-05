import { Control, UseFormRegister, UseFormReset } from "react-hook-form";

export type TBasicInfoInputs = {
  bedrooms: string;
  bathrooms: string;
  kitchen: string;
  price: string;
  management: string;
  brokerFee: string;
  policies: string[];
  keywords: string[];
  listedBy: string;
};

export type TAmenitiesInputs = {
  parking: boolean;
  wifi: boolean;
  gym: boolean;
  pool: boolean;
  watchman: boolean;
  cctv: boolean;
  securityLights: boolean;
  water: boolean;
  borehole: boolean;
};

export type TRegister = UseFormRegister<TBasicInfoInputs>;

export type TControl = Control<TBasicInfoInputs>;

export type TReset = UseFormReset<TBasicInfoInputs>;
