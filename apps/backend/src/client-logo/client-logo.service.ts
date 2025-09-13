import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientLogo } from './client-logo.entity';

@Injectable()
export class ClientLogoService {
  constructor(
    @InjectRepository(ClientLogo) private readonly repo: Repository<ClientLogo>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<ClientLogo>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, data: Partial<ClientLogo>) {
    return this.repo.update(id, data);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return true;
  }
}
