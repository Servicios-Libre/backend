import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  /**
  @example Categoria1
  */
  @IsString()
  @IsNotEmpty()
  name: string;
}
