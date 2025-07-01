import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SocialDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUrl()
  facebook: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUrl()
  x: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUrl()
  instagram: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUrl()
  linkedin: string;
}
