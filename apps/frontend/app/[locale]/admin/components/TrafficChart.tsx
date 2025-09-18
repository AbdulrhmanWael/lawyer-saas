"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTranslations } from "next-intl";

type Traffic = { day: string; count: number };

export default function TrafficChart() {
  const t = useTranslations("Dashboard.Overview");
  const [traffic, setTraffic] = useState<Traffic[]>([]);
  const [period, setPeriod] = useState("7days");
  const [loading, setLoading] = useState(true);

  const fetchTraffic = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/traffic/summary?period=${period}`
      );
      const data: Traffic[] = await res.json();
      setTraffic(data);
    } catch (err) {
      console.error(err);
      setTraffic([]);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchTraffic();
  }, [period, fetchTraffic]);

  if (loading) return <p className="text-gray-400">{t("loadingTraffic")}</p>;

  if (!traffic.length || Math.max(...traffic.map((t) => t.count)) === 0)
    return (
      <div className="p-6 bg-[var(--color-bg)] rounded-2xl shadow-lg w-full flex items-center justify-center h-[300px]">
        <p className="text-gray-400 text-center">{t("noTraffic")}</p>
      </div>
    );

  return (
    <div className="p-6 my-4 w-full bg-[var(--color-bg)] rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          {t("traffic")}
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="today">{t("periodToday")}</option>
          <option value="3days">{t("period3Days")}</option>
          <option value="7days">{t("period7Days")}</option>
          <option value="month">{t("periodMonth")}</option>
          <option value="year">{t("periodYear")}</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={traffic}
          margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-accent)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-accent)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="day" tick={{ fill: "var(--color-text)" }} />
          <YAxis tick={{ fill: "var(--color-text)" }} />
          <Tooltip
            formatter={(value: number) => [
              `${value} ${t("views")}`,
              t("views"),
            ]}
            labelFormatter={(label) => label}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-accent)"
            strokeWidth={3}
            fill="url(#trafficGradient)"
            fillOpacity={1}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
