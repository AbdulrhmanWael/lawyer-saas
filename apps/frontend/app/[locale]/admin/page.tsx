import React from "react";
import TopBlogsChart from "./components/TopBlogsChart";
import TrafficChart from "./components/TrafficChart";
import ContactOverviewCard from "./components/ContactOverView";
const page = () => {
  return (
    <div>
      <div className="flex-col flex w-full md:flex-row gap-5">
        <TrafficChart />
        <ContactOverviewCard />
      </div>
      <TopBlogsChart />
    </div>
  );
};

export default page;
