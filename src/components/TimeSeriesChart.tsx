"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface HourlyDataPoint {
  hour: string;
  [key: string]: number | string;
}

export interface EventSeries {
  key: string;
  label: string;
  color: string;
}

interface TimeSeriesChartProps {
  data: HourlyDataPoint[];
  series: EventSeries[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#102542",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#ecebf3",
};

export default function TimeSeriesChart({ data, series }: TimeSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#1a3a5c" />
        <XAxis
          dataKey="hour"
          tick={{ fill: "#8fa3b8", fontSize: 11 }}
          axisLine={{ stroke: "#1a3a5c" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8fa3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: "#8fa3b8", fontSize: 11 }}
          itemStyle={{ fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "#8fa3b8" }}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3, fill: s.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
