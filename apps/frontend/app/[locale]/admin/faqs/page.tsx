import { faqService, FaqGroup } from "@/services/faq";
import FaqManager from './FaqManager';

export default async function FaqsPage() {
  const groups: FaqGroup[] = await faqService.getGroups();

  return <FaqManager initialGroups={groups} />;
}
