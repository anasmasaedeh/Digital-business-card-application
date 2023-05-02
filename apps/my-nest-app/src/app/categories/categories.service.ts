import { Category } from "@my-proj/shared-data";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];

  create(category: Category): Category {
    category.id = this.categories.length + 1;
    this.categories.push(category);
    return category;
  }

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category {
    return this.categories.find(category => category.id === id);
  }

  update(id: number, category: Category): Category {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    this.categories[index] = { ...category, id };
    return this.categories[index];
  }

  delete(id: number): void {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    this.categories.splice(index, 1);
  }
}
