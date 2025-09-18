import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { PageModule } from './page/page.module';
import { CarouselItemModule } from './carousel-item/carousel-item.module';
import { ClientLogoModule } from './client-logo/client-logo.module';
import { PracticeAreasModule } from './practice-areas/practice-areas.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { StaffMemberModule } from './staff-member/staff-member.module';
import { TranslationModule } from './translation/translation.module';
import { SeedService } from './seed/seed.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchModule } from './search/search.module';
import { PageViewModule } from './page-view/page-view.module';
import { ContactModule } from './contact/contact.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
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
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 120,
      isGlobal: true,
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
    SearchModule,
    PageViewModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
