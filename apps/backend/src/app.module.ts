import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { SeedService } from './seed/seed.service';
import { PageController } from './page/page.controller';
import { PageService } from './page/page.service';
import { PageModule } from './page/page.module';
import { CarouselItemController } from './carousel-item/carousel-item.controller';
import { CarouselItemModule } from './carousel-item/carousel-item.module';
import { ClientLogoService } from './client-logo/client-logo.service';
import { ClientLogoController } from './client-logo/client-logo.controller';
import { ClientLogoModule } from './client-logo/client-logo.module';
import { PracticeAreasModule } from './practice-areas/practice-areas.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { TestimonialService } from './testimonial/testimonial.service';
import { TestimonialController } from './testimonial/testimonial.controller';
import { TestimonialModule } from './testimonial/testimonial.module';
import { StaffMemberController } from './staff-member/staff-member.controller';
import { StaffMemberService } from './staff-member/staff-member.service';
import { StaffMemberModule } from './staff-member/staff-member.module';
import { TranslationService } from './translation/translation.service';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'lawyer_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User],
    }),
    UsersModule,
    CategoriesModule,
    BlogsModule,
    PermissionsModule,
    RolesModule,
    AuthModule,
    PracticeAreasModule,
    SiteSettingsModule,
    PageModule,
    CarouselItemModule,
    ClientLogoModule,
    TestimonialModule,
    StaffMemberModule,
    TranslationModule,
  ],
  controllers: [
    AppController,
    PageController,
    CarouselItemController,
    ClientLogoController,
    TestimonialController,
    StaffMemberController,
  ],
  providers: [
    AppService,
    SeedService,
    PageService,
    ClientLogoService,
    TestimonialService,
    StaffMemberService,
    TranslationService,
  ],
})
export class AppModule {}
