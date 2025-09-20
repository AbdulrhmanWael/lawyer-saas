import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffMember } from './staff-member.entity';
import { PracticeArea } from 'src/practice-areas/practice-area.entity';
import { ImageService } from 'src/utils/image.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';

@Injectable()
export class StaffMemberService {
  constructor(
    @InjectRepository(StaffMember)
    private readonly repo: Repository<StaffMember>,
    @InjectRepository(PracticeArea)
    private readonly practiceAreaRepo: Repository<PracticeArea>,
    private readonly imageService: ImageService,
  ) {}

  findAll(): Promise<StaffMember[]> {
    return this.repo.find({
      relations: ['practiceArea'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<StaffMember> {
    const member = await this.repo.findOne({
      where: { id },
      relations: ['practiceArea'],
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async create(data: CreateStaffMemberDto, file?: Express.Multer.File) {
    let practiceArea: PracticeArea | null = null;
    if (data.practiceAreaId) {
      practiceArea = await this.practiceAreaRepo.findOne({
        where: { id: data.practiceAreaId },
      });
    }

    const staff = this.repo.create({
      ...data,
      practiceArea,
    });

    if (file) {
      staff.imageUrl = await this.imageService.saveImage(
        file.buffer,
        'uploads/staff',
      );
    }

    return this.repo.save(staff);
  }

  async update(
    id: number,
    data: UpdateStaffMemberDto,
    file?: Express.Multer.File,
  ) {
    const staff = await this.findOne(id);

    if (data.practiceAreaId) {
      staff.practiceArea = await this.practiceAreaRepo.findOne({
        where: { id: data.practiceAreaId },
      });
    }

    if (file) {
      if (staff.imageUrl) {
        await this.imageService.deleteImage(staff.imageUrl);
      }
      staff.imageUrl = await this.imageService.saveImage(
        file.buffer,
        'uploads/staff',
      );
    }

    Object.assign(staff, data);

    return this.repo.save(staff);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    if (staff.imageUrl) {
      await this.imageService.deleteImage(staff.imageUrl);
    }
    await this.repo.delete(id);
  }

  async reorder(orders: { id: number; order: number }[]) {
    for (const { id, order } of orders) {
      await this.repo.update(id, { order });
    }
    return this.findAll();
  }
}
