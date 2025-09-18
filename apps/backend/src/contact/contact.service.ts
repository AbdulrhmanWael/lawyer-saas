import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
  ) {}

  async createMessage(data: Partial<ContactMessage>) {
    const message = this.contactRepo.create(data);
    return this.contactRepo.save(message);
  }

  async getMessages(sort?: 'asc' | 'desc') {
    if (sort)
      return await this.contactRepo.find({ order: { createdAt: sort } });
    else return await this.contactRepo.find();
  }

  async markAsUnread(id: string) {
    const message = await this.contactRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    message.unread = true;
    return this.contactRepo.save(message);
  }

  async markAsRead(id: string) {
    const message = await this.contactRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    message.unread = false;
    return this.contactRepo.save(message);
  }

  async deleteMessage(id: string) {
    const message = await this.contactRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    return this.contactRepo.remove(message);
  }

  async getUnreadCount() {
    return this.contactRepo.count({ where: { unread: true } });
  }
}
