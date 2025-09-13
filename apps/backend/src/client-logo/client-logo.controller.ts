import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
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
  create(@Body() data: Partial<ClientLogo>) {
    return this.logoService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<ClientLogo>) {
    return this.logoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.logoService.remove(id);
  }
}
