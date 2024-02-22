import { CreateDSHGDHLDetails } from 'src/utils/types';

export class CreateDSHGDHLDto {
  DonViID: number;
  KhuVucRaSoatID: number;
  dotRaSoatID: number;
  createDetails: CreateDSHGDHLDetails[];
}
