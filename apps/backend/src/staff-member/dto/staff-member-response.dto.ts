import { Expose, Transform } from 'class-transformer';
import { PracticeArea } from 'src/practice-areas/practice-area.entity';

export class StaffMemberResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  position: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  bio?: Record<string, string>;

  @Expose()
  order: number;

  @Expose()
  @Transform(({ obj }) => {
    const staff = obj as { practiceArea?: PracticeArea };
    return staff.practiceArea?.id ?? null;
  })
  practiceAreaId: string | null;

  @Expose()
  @Transform(({ obj }) => {
    const staff = obj as { practiceArea?: PracticeArea };
    return staff.practiceArea?.title ?? null;
  })
  practiceAreaTitle: Record<string, string> | null;
}
