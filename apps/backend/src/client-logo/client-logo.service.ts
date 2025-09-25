import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientLogo } from './client-logo.entity';
import { ImageService } from 'src/utils/image.service';

@Injectable()
export class ClientLogoService {
  constructor(
    @InjectRepository(ClientLogo) private readonly repo: Repository<ClientLogo>,
    private readonly imageService: ImageService,
  ) {}

  findAll(): Promise<ClientLogo[]> {
    return this.repo.find();
  }

  async create(
    data: Partial<ClientLogo> & { imageFile?: Buffer },
  ): Promise<ClientLogo> {
    try {
      if (data.imageFile) {
        data.imageUrl = await this.imageService.saveImage(data.imageFile);
      }
      data.isActive = this.parseBoolean(data.isActive);
      const logo = this.repo.create(data);
      return this.repo.save(logo);
    } catch (err) {
      console.error('Error creating client logo', err);
      throw new InternalServerErrorException('Failed to create client logo');
    }
  }

  async update(
    id: number,
    data: Partial<ClientLogo> & { imageFile?: Buffer },
  ): Promise<ClientLogo> {
    try {
      if (data.imageFile) {
        data.imageUrl = await this.imageService.saveImage(data.imageFile);
      }
      data.isActive = this.parseBoolean(data.isActive);
      const { imageUrl, name, isActive } = data;
      await this.repo.update(id, { imageUrl, name, isActive });
      return this.repo.findOneOrFail({ where: { id } });
    } catch (err) {
      console.error('Error updating client logo', err);
      throw new InternalServerErrorException('Failed to update client logo');
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.repo.delete(id);
      return true;
    } catch (err) {
      console.error('Error deleting client logo', err);
      throw new InternalServerErrorException('Failed to delete client logo');
    }
  }
  private parseBoolean(value: boolean | string | undefined): boolean {
    if (value === undefined) return false; // or preserve existing value
    return value === true || value === 'true';
  }
}
