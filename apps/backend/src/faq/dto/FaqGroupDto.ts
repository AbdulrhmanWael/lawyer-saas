import { FaqDto } from './FaqDto';

export class FaqGroupDto {
  id: string;
  title: Record<string, string>;
  faqs: FaqDto[];
}
