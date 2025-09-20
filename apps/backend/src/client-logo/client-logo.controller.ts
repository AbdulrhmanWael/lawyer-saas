import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientLogoService } from './client-logo.service';
import { ClientLogo } from './client-logo.entity';

@Controller('client-logos')
export class ClientLogoController {
  constructor(private readonly logoService: ClientLogoService) {}

  @Get()
  findAll(): Promise<ClientLogo[]> {
    return this.logoService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  create(
    @Body() data: Partial<ClientLogo>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.logoService.create({ ...data, imageFile: file?.buffer });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imageFile'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ClientLogo>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.logoService.update(id, { ...data, imageFile: file?.buffer });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logoService.remove(id);
  }
}
