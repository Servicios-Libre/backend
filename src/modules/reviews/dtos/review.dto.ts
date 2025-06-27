import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  worker: string;

  @IsNotEmpty()
  @IsString()
  @Length(20, 400)
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;
}
