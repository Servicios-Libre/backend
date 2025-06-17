import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../workerServices/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `La categoría con nombre '${dto.name}' ya existe.`,
      );
    }
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }
}
