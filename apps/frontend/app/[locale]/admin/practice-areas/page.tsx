import {
  practiceAreaService,
  PracticeArea,
} from "@/services/practiceAreaService";
import PracticeAreasTable from "./PracticeAreasTable";

export default async function PracticeAreasPage() {
  const practiceAreas: PracticeArea[] = await practiceAreaService.getAll();

  return (
    <div className="p-6">
      <PracticeAreasTable practiceAreas={practiceAreas} />
    </div>
  );
}
