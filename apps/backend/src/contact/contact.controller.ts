import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactMessage } from './contact-message.entity';
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  createMessage(@Body() body: Partial<ContactMessage>) {
    return this.contactService.createMessage(body);
  }

  @Get()
  getMessages(@Query('sort') sort?: 'asc' | 'desc') {
    return this.contactService.getMessages(sort);
  }

  @Patch(':id/unread')
  markAsUnread(@Param('id') id: string) {
    return this.contactService.markAsUnread(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  deleteMessage(@Param('id') id: string) {
    return this.contactService.deleteMessage(id);
  }

  @Get('count/unread')
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }
}
