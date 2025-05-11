export interface Product {
  id: number;
  code: string;
  name: string;
  size: string;
  packagingType: string;
  unit: string;
  variety: string;
  imageBase64: string;
  data1: string;
  data2: string;
  registrationDate: string; // DateTime en C# se convierte a string en TypeScript
  isActive: boolean;
} 

export interface CreateProductData {
  Code: string;
  Name: string;
  Variety: string;
  Size?: string;
  PackagingType?: string;
  Unit?: string;
  Data1?: string;
  Data2?: string;
  Image?: File;
}
