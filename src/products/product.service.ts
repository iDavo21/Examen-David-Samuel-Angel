import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manage.error';
import { CategoryService } from 'src/category/category.service';


@Injectable()
export class ProductsService {
  constructor(

    private readonly categoryService: CategoryService

  ){}

 

  Category= [
    {id: 5, name:'Jabones',description:'Jabonoso', isActive:true},
    {id: 6, name:'Aguas',description:'Hidratante', isActive:false},
    {id: 7, name:'Comidas',description:'Sabrosa', isActive:true},
    {id: 8, name:'Gaseosas',description:'Diabetica', isActive:true},
  ]


  private product: ProductEntity[] = [
    {id: 1, name:'Jabon',description:'Pa lava', stock:1, price:3, photo:[], isActive:true, categoryId:5},
    {id: 2, name:'Agua',description:'Pa bebe', stock:1, price:5, photo:[], isActive:false,categoryId:6},
    {id: 3, name:'Comida',description:'Pa come', stock:1, price:7, photo:[], isActive:true,categoryId:7},
    {id: 4, name:'Gaseosa',description:'Pa lo pana', stock:1, price:10, photo:[], isActive:true,categoryId:8},
  ]
  create(createProductDto: CreateProductDto) {
    try {
      const product: ProductEntity = {
        ...createProductDto,
        isActive: true,
        id: this.product.length+1,
      }
      if( !product ){
        throw new BadRequestException("Product not create!");
      }
  
      this.product.push(product); 
      return product
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
    try {

      if( this.product.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "product not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.product.filter((product) => product.isActive===true).length

      const skip = ( page - 1 ) * limit;

      const lastPage = Math.ceil(total / limit);
      
      const data = this.product.slice( skip, limit );
      
      

      return {
        page,
        lastPage,
        total,
        limit,
        data,

      }
      
    } catch (error) {
      ManagerError.createSignatureError( error.message )
    }
  }

  findOne(id: number) {
    try{
      const product = this.product.find(product => product.id === id && product.isActive === true)
      const category =this.categoryService.findOne(product.categoryId) ;

      if(!product) throw new NotFoundException('Product not found');
      return {product, category};
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try { 
      let productDB = this.product.find(product => product.id === id)
      
      this.product = this.product.map(product => {
        if(product.id === id){
          productDB = {
            ...productDB,
            ...updateProductDto
          }
          return productDB
        }
        return product;
      })
  }
  catch{
    throw new InternalServerErrorException('500 Server Error')
  }
}

  delete(id: number) {
    try {
      const productDB = this.product.find(product => product.id === id)
      if(!productDB) throw new NotFoundException('Product not found')
      this.product = this.product.filter(product => product.id !== id)

      return 'Producto Eliminado'
    } catch (error) {
      throw new InternalServerErrorException('500 Server Error')
    }
  }
}
