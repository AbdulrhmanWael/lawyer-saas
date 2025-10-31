import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SeedService } from './seed/seed.service';
import cookieParser from 'cookie-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.get(SeedService).run();
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL2,
      'http://192.168.43.240:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().catch((err) => console.error(err));
