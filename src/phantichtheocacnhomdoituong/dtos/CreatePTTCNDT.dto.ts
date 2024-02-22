import { IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { CreatePTTCNDTDetails } from 'src/utils/types';

export class CreatePTTCNDTDto {
  date: Date;
  createDetails: CreatePTTCNDTDetails[];
}
