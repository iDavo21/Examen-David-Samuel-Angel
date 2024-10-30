import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/product.module';
import { CommonModule } from './common/common.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.development`,
      isGlobal: true,
    }),

    ProductsModule,
    CommonModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
