import { Category } from "@my-proj/shared-data";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() category: Category): Category {
    return this.categoriesService.create(category);
  }

  @Get()
  findAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Category {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() category: Category,
  ): Category {
    return this.categoriesService.update(id, category);
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    return this.categoriesService.delete(id);
  }
}
