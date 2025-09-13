import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffMember } from './staff-member.entity';

@Injectable()
export class StaffMemberService {
  constructor(
    @InjectRepository(StaffMember)
    private readonly repo: Repository<StaffMember>,
  ) {}

  findAll(): Promise<StaffMember[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<StaffMember> {
    const member = await this.repo.findOne({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  create(data: Partial<StaffMember>): Promise<StaffMember> {
    const staff = this.repo.create(data);
    return this.repo.save(staff);
  }

  async update(id: number, data: Partial<StaffMember>): Promise<StaffMember> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
