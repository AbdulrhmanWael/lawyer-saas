import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(SeedService).run();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

dotenv.config();
