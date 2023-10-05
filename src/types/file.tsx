//for FormData interface->value must be File|Blob|string. File must contain uri, type and name
export interface ListingImage {
  uri: string;
  type: string;
  name: string;
  filename?: string; //fetched file
  // size?: number;
}


export interface IFile {
  uri: string;
  type: string;
  name: string;
  path: string;
  filename: string; //fetched file
}