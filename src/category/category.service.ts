import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { ResponseAllCategorys } from './interfaces/response-category.interface';
import { ManagerError } from 'src/common/errors/manage.error';

@Injectable()
export class CategoryService {

  private category: CategoryEntity[] = [ 
    {id: 5, name:'Jabones',description:'Jabonoso', isActive:true},
    {id: 6, name:'Aguas',description:'Hidratante', isActive:false},
    {id: 7, name:'Comidas',description:'Sabrosa', isActive:true},
    {id: 8, name:'Gaseosas',description:'Diabetica', isActive:true},
  ]
  create(createCategoryDto: CreateCategoryDto) {
    try {
      const category: CategoryEntity = {
        ...createCategoryDto,
        isActive: true,
        id: this.category.length+1,
      }
      if( !category ){
        throw new BadRequestException("Category not create!");
      }
  
      this.category.push(category); 
      return category
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllCategorys > {
    try {

      if( this.category.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Category not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.category.filter((category) => category.isActive===true).length

      const skip = ( page - 1 ) * limit;

      const lastPage = Math.ceil(total / limit);
      
      const data = this.category.slice( skip, limit );

      return {
        page,
        lastPage,
        total,
        limit,
        data
      }
      
    } catch (error) {
      ManagerError.createSignatureError( error.message )
    }
  }

  findOne(id: number) {
    try{
      const category = this.category.find(category => category.id === id && category.isActive === true)
      
      if(!category) throw new NotFoundException('Category not found')
      return category;
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try { 
      let categoryDB = this.category.find(category => category.id === id)
      
      this.category = this.category.map(category => {
        if(category.id === id){
          categoryDB = {
            ...categoryDB,
            ...updateCategoryDto
          }
          return categoryDB
        }
        return category;
      })
  }
  catch{
    throw new InternalServerErrorException('500 Server Error')
  }
}

  delete(id: number) {
    try {
      const categoryDB = this.category.find(category => category.id === id)
      if(!categoryDB) throw new NotFoundException('Category not found')
      this.category = this.category.filter(category => category.id !== id)

      return 'Categoria Eliminada'
    } catch (error) {
      throw new InternalServerErrorException('500 Server Error')
    }
  }
}
