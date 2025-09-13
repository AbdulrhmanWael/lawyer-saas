import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMember } from './staff-member.entity';
import { StaffMemberService } from './staff-member.service';
import { StaffMemberController } from './staff-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StaffMember])],
  providers: [StaffMemberService],
  controllers: [StaffMemberController],
})
export class StaffMemberModule {}
