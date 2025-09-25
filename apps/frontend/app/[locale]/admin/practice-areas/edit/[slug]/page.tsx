import PracticeAreaForm from "./PracticeAreaForm";
import { practiceAreaService } from "@/services/practiceAreaService";

export default async function Page({ params }: { params: { slug: string } }) {

  const practiceArea = await practiceAreaService.getBySlug(params.slug);

  if (!practiceArea) {
    return (
      <p className="p-6 text-red-500">
        Practice area not found for slug: {params.slug}
      </p>
    );
  }

  return <PracticeAreaForm initialData={practiceArea} />;
}
