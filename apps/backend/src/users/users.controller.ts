import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatarUrl'))
  async create(
    @Body() dto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto, file?.buffer ?? undefined);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.usersService['usersRepo'].find({
      relations: ['role'],
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      role: u.role.name,
      createdAt: u.createdAt,
    }));
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatarUrl'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto, file?.buffer);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  @Post('update-password')
  async updatePassword(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.usersService.updatePassword(email, oldPassword, newPassword);
    return { message: 'Password updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: `User ${id} deleted successfully` };
  }
}
