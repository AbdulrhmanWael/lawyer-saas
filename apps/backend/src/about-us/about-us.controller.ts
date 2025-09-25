import { Controller, Get, Put, Body } from '@nestjs/common';
import { AboutService } from './about-us.service';
import { UpdateAboutDto } from './dto/update-about-us.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly service: AboutService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  update(@Body() dto: UpdateAboutDto) {
    return this.service.update(dto);
  }
}
