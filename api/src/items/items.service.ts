import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = plainToClass(Item, createItemDto);
    return await this.itemRepository.save(item);
  }

  async findAll(
    minLatitude: number,
    minLongitude: number,
    maxLatitude: number,
    maxLongitude: number,
  ): Promise<Item[]> {
    if (minLatitude && minLongitude && maxLatitude && maxLongitude) {
      const items = await this.itemRepository
        .createQueryBuilder('item')
        .where(
          'ST_Intersects(ST_MakeEnvelope(:minLongitude, :minLatitude, :maxLongitude, :maxLatitude, :srid), item.point)',
          {
            minLongitude: minLongitude,
            minLatitude: minLatitude,
            maxLongitude: maxLongitude,
            maxLatitude: maxLatitude,
            srid: 4326,
          },
        )
        .getMany();
      return items;
    }

    return this.itemRepository.find();
  }

  async findOne(id: number): Promise<Item> {
    return await this.itemRepository.findOne({ where: { id } });
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    return this.itemRepository.save({
      id: id,
      ...updateItemDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.itemRepository.delete({ id });
  }
}