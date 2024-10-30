import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [CategoryModule]
})
export class ProductsModule {}
