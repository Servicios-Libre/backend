import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsString()
  @Length(20, 400)
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;

  @IsNotEmpty()
  @IsString()
  contractId: string;
}
