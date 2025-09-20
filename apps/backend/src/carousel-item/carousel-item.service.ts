import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselItem } from './carousel-item.entity';
import { ImageService } from 'src/utils/image.service';

@Injectable()
export class CarouselItemService {
  constructor(
    @InjectRepository(CarouselItem)
    private readonly repo: Repository<CarouselItem>,
    private readonly imageService: ImageService,
  ) {}

  findAll(): Promise<CarouselItem[]> {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async create(
    data: Partial<CarouselItem> & { imageFile?: Buffer },
  ): Promise<CarouselItem> {
    try {
      if (data.imageFile) {
        data.imageUrl = await this.imageService.saveImage(data.imageFile);
      }
      const item = this.repo.create(data);
      return this.repo.save(item);
    } catch (err) {
      console.error('Error creating carousel item', err);
      throw new InternalServerErrorException('Failed to create carousel item');
    }
  }

  async update(
    id: number,
    data: Partial<CarouselItem> & { imageFile?: Buffer },
  ): Promise<CarouselItem> {
    try {
      if (data.imageFile) {
        data.imageUrl = await this.imageService.saveImage(data.imageFile);
      }
      await this.repo.update(id, data);
      return this.repo.findOneOrFail({ where: { id } });
    } catch (err) {
      console.error('Error updating carousel item', err);
      throw new InternalServerErrorException('Failed to update carousel item');
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.repo.delete(id);
      return true;
    } catch (err) {
      console.error('Error deleting carousel item', err);
      throw new InternalServerErrorException('Failed to delete carousel item');
    }
  }
}
