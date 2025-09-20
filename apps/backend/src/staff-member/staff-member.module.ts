import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMember } from './staff-member.entity';
import { StaffMemberService } from './staff-member.service';
import { StaffMemberController } from './staff-member.controller';
import { ImageService } from 'src/utils/image.service';
import { PracticeArea } from 'src/practice-areas/practice-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffMember, PracticeArea])],
  providers: [StaffMemberService, ImageService],
  controllers: [StaffMemberController],
})
export class StaffMemberModule {}
