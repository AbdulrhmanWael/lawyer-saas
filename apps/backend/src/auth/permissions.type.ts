export type Permission =
  // Blogs
  | 'view_blog'
  | 'create_blog'
  | 'update_blog'
  | 'delete_blog'
  | 'publish_blog'
  | 'unpublish_blog'

  // Carousel
  | 'view_carousel_item'
  | 'create_carousel_item'
  | 'update_carousel_item'
  | 'delete_carousel_item'

  // Categories
  | 'view_category'
  | 'create_category'
  | 'update_category'
  | 'delete_category'

  // Client Logos
  | 'view_client_logo'
  | 'create_client_logo'
  | 'update_client_logo'
  | 'delete_client_logo'

  // Contact Messages
  | 'view_contact_message'
  | 'delete_contact_message'
  | 'mark_contact_message_read'

  // FAQs
  | 'view_faq'
  | 'create_faq'
  | 'update_faq'
  | 'delete_faq'

  // FAQ Groups
  | 'view_faq_group'
  | 'create_faq_group'
  | 'update_faq_group'
  | 'delete_faq_group'

  // Newsletter
  | 'subscribe_newsletter'
  | 'unsubscribe_newsletter'
  | 'view_subscribers'
  | 'send_newsletter'
  | 'update_newsletter_settings'
  | 'view_newsletter_settings'

  // Pages
  | 'view_page'
  | 'create_page'
  | 'update_page'
  | 'delete_page'

  // Page Views / Traffic
  | 'track_page_view'
  | 'view_traffic_summary'
  | 'stream_traffic'

  // Permissions entity
  | 'view_permission'
  | 'create_permission'

  // Practice Areas
  | 'view_practice_area'
  | 'create_practice_area'
  | 'update_practice_area'
  | 'delete_practice_area'

  // Roles
  | 'view_role'
  | 'create_role'
  | 'update_role_permissions'

  // Search
  | 'search'

  // Site Settings
  | 'view_site_settings'
  | 'update_site_settings'

  // Staff Members
  | 'view_staff_member'
  | 'create_staff_member'
  | 'update_staff_member'
  | 'delete_staff_member'
  | 'reorder_staff_member'

  // Testimonials
  | 'view_testimonial'
  | 'create_testimonial'
  | 'update_testimonial'
  | 'delete_testimonial'

  // Users
  | 'view_user'
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'update_password'

  // Why Us
  | 'view_why_us'
  | 'create_why_us'
  | 'update_why_us'
  | 'delete_why_us';
