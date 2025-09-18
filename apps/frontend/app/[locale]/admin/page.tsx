import TopBlogsChart from "./components/TopBlogsChart";
import TrafficChart from "./components/TrafficChart";
import ContactOverviewCard from "./components/ContactOverView";
import { getTraffic } from "@/services/overview";
import { getBlogs } from "@/services/blogs";

export default async function OverviewPage() {
  const [traffic, blogs] = await Promise.all([
    getTraffic("7days"),
    getBlogs({ page: 1, limit: 50 }),
  ]);

  return (
    <div>
      <div className="flex-col flex w-full md:flex-row gap-5">
        <TrafficChart initialData={traffic} />
        <ContactOverviewCard />
      </div>
      <TopBlogsChart initialData={blogs.response} />
    </div>
  );
}
