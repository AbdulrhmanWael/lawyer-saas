import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepo: Repository<Permission>,
  ) {}

  async create(name: string, permissionIds: string[]): Promise<Role> {
    const permissions = await this.permissionsRepo.find({
      where: { id: In(permissionIds) },
    });
    const role = this.rolesRepo.create({ name, permissions });
    return this.rolesRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updatePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.findOne(roleId);
    const permissions = await this.permissionsRepo.find({
      where: { id: In(permissionIds) },
    });
    role.permissions = permissions;
    return this.rolesRepo.save(role);
  }

  async seedRoles(forceUpdateExisting = false): Promise<void> {
    const allPermissions = await this.permissionsRepo.find();

    const blogPermissions = allPermissions.filter((p) =>
      [
        'view_blog',
        'create_blog',
        'update_blog',
        'delete_blog',
        'publish_blog',
        'unpublish_blog',
      ].includes(p.name),
    );

    const categoryPermissions = allPermissions.filter((p) =>
      [
        'view_category',
        'create_category',
        'update_category',
        'delete_category',
      ].includes(p.name),
    );

    const pagePermissions = allPermissions.filter((p) =>
      ['view_page', 'create_page', 'update_page', 'delete_page'].includes(
        p.name,
      ),
    );

    const newsletterPermissions = allPermissions.filter((p) =>
      [
        'subscribe_newsletter',
        'view_subscribers',
        'unsubscribe_newsletter',
        'send_newsletter',
        'update_newsletter_settings',
        'view_newsletter_settings',
      ].includes(p.name),
    );

    const carouselPermissions = allPermissions.filter((p) =>
      [
        'view_carousel_item',
        'create_carousel_item',
        'update_carousel_item',
        'delete_carousel_item',
      ].includes(p.name),
    );

    const clientLogoPermissions = allPermissions.filter((p) =>
      [
        'view_client_logo',
        'create_client_logo',
        'update_client_logo',
        'delete_client_logo',
      ].includes(p.name),
    );

    const contactMessagePermissions = allPermissions.filter((p) =>
      [
        'view_contact_message',
        'delete_contact_message',
        'mark_contact_message_read',
      ].includes(p.name),
    );

    const testimonialPermissions = allPermissions.filter((p) =>
      [
        'view_testimonial',
        'create_testimonial',
        'update_testimonial',
        'delete_testimonial',
      ].includes(p.name),
    );

    const faqPermissions = allPermissions.filter((p) =>
      [
        'view_faq',
        'create_faq',
        'update_faq',
        'delete_faq',
        'view_faq_group',
        'create_faq_group',
        'update_faq_group',
        'delete_faq_group',
      ].includes(p.name),
    );

    const practiceAreaPermissions = allPermissions.filter((p) =>
      [
        'view_practice_area',
        'create_practice_area',
        'update_practice_area',
        'delete_practice_area',
      ].includes(p.name),
    );

    const userPermissions = allPermissions.filter((p) =>
      ['view_user', 'create_user', 'update_user', 'delete_user'].includes(
        p.name,
      ),
    );

    const rolePermissions = allPermissions.filter((p) =>
      ['view_role', 'create_role', 'update_role_permissions'].includes(p.name),
    );

    const permissionEntityPermissions = allPermissions.filter((p) =>
      ['view_permission', 'create_permission'].includes(p.name),
    );

    const siteSettingsPermissions = allPermissions.filter((p) =>
      ['view_site_settings', 'update_site_settings'].includes(p.name),
    );

    const pageViewPermissions = allPermissions.filter((p) =>
      ['track_page_view', 'view_traffic_summary', 'stream_traffic'].includes(
        p.name,
      ),
    );

    const staffPermissions = allPermissions.filter((p) =>
      [
        'view_staff_member',
        'create_staff_member',
        'update_staff_member',
        'delete_staff_member',
        'reorder_staff_member',
      ].includes(p.name),
    );

    const whyUsPermissions = allPermissions.filter((p) =>
      [
        'view_why_us',
        'create_why_us',
        'update_why_us',
        'delete_why_us',
      ].includes(p.name),
    );

    // role definitions (sensible defaults)
    const roles = [
      {
        name: 'admin',
        permissions: allPermissions,
      },
      {
        name: 'editor',
        permissions: [
          ...blogPermissions,
          ...categoryPermissions,
          ...pagePermissions,
          ...testimonialPermissions,
          ...faqPermissions,
          ...practiceAreaPermissions,
          ...carouselPermissions,
          ...clientLogoPermissions,
          ...whyUsPermissions,
        ],
      },
      {
        name: 'moderator',
        permissions: [
          ...blogPermissions.filter((p) =>
            ['view_blog', 'publish_blog', 'unpublish_blog'].includes(p.name),
          ),
          ...contactMessagePermissions.filter((p) =>
            ['view_contact_message', 'mark_contact_message_read'].includes(
              p.name,
            ),
          ),
          // moderators can view but not manage users/roles
        ],
      },
      {
        name: 'manager',
        permissions: [
          ...userPermissions,
          ...rolePermissions,
          ...permissionEntityPermissions,
          ...siteSettingsPermissions,
          ...staffPermissions,
          ...pageViewPermissions,
        ],
      },
      {
        name: 'contributor',
        permissions: [
          ...blogPermissions.filter((p) =>
            ['view_blog', 'create_blog', 'update_blog'].includes(p.name),
          ),
          ...pagePermissions.filter((p) =>
            ['view_page', 'create_page', 'update_page'].includes(p.name),
          ),
          ...testimonialPermissions.filter((p) =>
            ['view_testimonial', 'create_testimonial'].includes(p.name),
          ),
        ],
      },
      {
        name: 'marketing',
        permissions: [
          ...newsletterPermissions.filter((p) =>
            [
              'view_subscribers',
              'send_newsletter',
              'update_newsletter_settings',
              'view_newsletter_settings',
            ].includes(p.name),
          ),
        ],
      },
      {
        name: 'support',
        permissions: [
          ...contactMessagePermissions,
          ...pageViewPermissions.filter((p) =>
            ['track_page_view', 'view_traffic_summary'].includes(p.name),
          ),
        ],
      },
      {
        name: 'guest',
        permissions: allPermissions.filter((p) => p.name.startsWith('view_')),
      },
    ];

    // create (or optionally update) roles in DB
    for (const r of roles) {
      let role = await this.rolesRepo.findOne({
        where: { name: r.name },
        relations: ['permissions'],
      });

      if (!role) {
        role = this.rolesRepo.create({
          name: r.name,
          permissions: r.permissions,
        });
        await this.rolesRepo.save(role);
        console.log(`Seeded role: ${r.name}`);
      } else if (forceUpdateExisting) {
        role.permissions = r.permissions;
        await this.rolesRepo.save(role);
        console.log(`Updated role permissions: ${r.name}`);
      }
    }
  }
}
