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
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
