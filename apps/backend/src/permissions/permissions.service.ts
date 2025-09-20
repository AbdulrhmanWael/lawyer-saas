import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

export const DEFAULT_PERMISSIONS: string[] = [
  // Blogs
  'view_blog',
  'create_blog',
  'update_blog',
  'delete_blog',
  'publish_blog',
  'unpublish_blog',

  // Carousel
  'view_carousel_item',
  'create_carousel_item',
  'update_carousel_item',
  'delete_carousel_item',

  // Categories
  'view_category',
  'create_category',
  'update_category',
  'delete_category',

  // Client Logos
  'view_client_logo',
  'create_client_logo',
  'update_client_logo',
  'delete_client_logo',

  // Contact Messages
  'view_contact_message',
  'delete_contact_message',
  'mark_contact_message_read',

  // FAQ Groups
  'view_faq_group',
  'create_faq_group',
  'update_faq_group',
  'delete_faq_group',

  // FAQs
  'view_faq',
  'create_faq',
  'update_faq',
  'delete_faq',

  // Newsletter
  'subscribe_newsletter',
  'view_subscribers',
  'unsubscribe_newsletter',
  'send_newsletter',
  'update_newsletter_settings',
  'view_newsletter_settings',

  // Pages
  'view_page',
  'create_page',
  'update_page',
  'delete_page',

  // Page Views
  'track_page_view',
  'view_traffic_summary',
  'stream_traffic',

  // Permissions
  'view_permission',
  'create_permission',

  // Practice Areas
  'view_practice_area',
  'create_practice_area',
  'update_practice_area',
  'delete_practice_area',

  // Roles
  'view_role',
  'create_role',
  'update_role_permissions',

  // Search
  'search',

  // Site Settings
  'view_site_settings',
  'update_site_settings',

  // Staff Members
  'view_staff_member',
  'create_staff_member',
  'update_staff_member',
  'delete_staff_member',
  'reorder_staff_member',

  // Testimonials
  'view_testimonial',
  'create_testimonial',
  'update_testimonial',
  'delete_testimonial',

  // Users
  'view_user',
  'create_user',
  'update_user',
  'delete_user',
  'update_password',

  // Why Us
  'view_why_us',
  'create_why_us',
  'update_why_us',
  'delete_why_us',
];

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepo: Repository<Permission>,
  ) {}

  async create(name: string): Promise<Permission> {
    const perm = this.permissionsRepo.create({ name });
    return this.permissionsRepo.save(perm);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepo.find();
  }

  async findOne(id: string): Promise<Permission> {
    const perm = await this.permissionsRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    return perm;
  }

  async seedPermissions(): Promise<void> {
    for (const name of DEFAULT_PERMISSIONS) {
      const exists = await this.permissionsRepo.findOne({ where: { name } });
      if (!exists) {
        await this.create(name);
        console.log(`Seeded permission: ${name}`);
      }
    }
  }
}
