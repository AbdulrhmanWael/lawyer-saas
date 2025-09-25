import { Controller, Get, Put, Body } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy-policy.service';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly service: PrivacyPolicyService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  update(@Body() dto: UpdatePrivacyPolicyDto) {
    return this.service.update(dto);
  }
}
