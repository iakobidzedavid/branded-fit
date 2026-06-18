"use client";

import { useState } from "react";
import TimeSeriesChart, { HourlyDataPoint, EventSeries } from "./TimeSeriesChart";

export type RawAnalyticsEvent = {
  event_name: string | null;
  domain: string | null;
  created_at: string | null;
};

type DateRange = "7d" | "30d" | "all";

interface Props {
  events: RawAnalyticsEvent[];
  series: EventSeries[];
  domains: string[];
  nowISO: string;
}

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

function buildDayKeys(count: number, nowISO: string): string[] {
  const keys: string[] = [];
  const now = new Date(nowISO);
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function computeChartData(
  events: RawAnalyticsEvent[],
  series: EventSeries[],
  range: DateRange,
  domain: string | null,
  nowISO: string
): HourlyDataPoint[] {
  const filtered = domain ? events.filter((e) => e.domain === domain) : events;

  let dayKeys: string[];
  if (range === "7d") {
    dayKeys = buildDayKeys(7, nowISO);
  } else if (range === "30d") {
    dayKeys = buildDayKeys(30, nowISO);
  } else {
    const dates = new Set<string>();
    filtered.forEach((e) => {
      if (e.created_at) dates.add(e.created_at.slice(0, 10));
    });
    dayKeys = Array.from(dates).sort();
    if (dayKeys.length === 0) dayKeys = buildDayKeys(7, nowISO);
  }

  const cutoff = range !== "all" ? dayKeys[0] : null;
  const inRange = cutoff
    ? filtered.filter((e) => (e.created_at?.slice(0, 10) ?? "") >= cutoff)
    : filtered;

  return dayKeys.map((key) => {
    const dayEvents = inRange.filter((e) => e.created_at?.slice(0, 10) === key);
    const row: HourlyDataPoint = { hour: key.slice(5) };
    series.forEach((s) => {
      row[s.key] = dayEvents.filter((e) => e.event_name === s.key).length;
    });
    return row;
  });
}

export default function TimeSeriesFilterPanel({ events, series, domains, nowISO }: Props) {
  const [range, setRange] = useState<DateRange>("7d");
  const [domain, setDomain] = useState<string | null>(null);

  const chartData = computeChartData(events, series, range, domain, nowISO);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-bg rounded-lg border border-border">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                range === opt.value
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {domains.length > 0 && (
          <select
            value={domain ?? ""}
            onChange={(e) => setDomain(e.target.value || null)}
            className="bg-bg border border-border text-sm text-text rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
          >
            <option value="">All domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      <TimeSeriesChart data={chartData} series={series} />
    </div>
  );
}
