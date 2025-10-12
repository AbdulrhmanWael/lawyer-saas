import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  async saveImage(fileBuffer: Buffer, folder = 'uploads'): Promise<string> {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const dir = path.join(process.cwd(), folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filepath = path.join(dir, filename);
    await sharp(fileBuffer).webp().toFile(filepath);
    return `/${folder}/${filename}`;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteImage(filePath: string) {
    if (!filePath) return;

    try {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ''));

      const stats = await fs.promises.stat(fullPath).catch(() => null);
      if (!stats?.isFile()) return;

      await fs.promises.unlink(fullPath);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }
}
