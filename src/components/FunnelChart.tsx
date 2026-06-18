"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

export interface FunnelEntry {
  stage: string;
  label: string;
  count: number;
  conversionRate: number;
  color: string;
}

interface FunnelChartProps {
  data: FunnelEntry[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#102542",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#ecebf3",
};

export default function FunnelChart({ data }: FunnelChartProps) {
  const barData = data.map((entry, i) => ({
    name: entry.label,
    count: entry.count,
    rateLabel: i === 0 ? "baseline" : `${entry.conversionRate}%`,
    color: entry.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={barData}
        layout="vertical"
        margin={{ top: 0, right: 80, bottom: 0, left: 120 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#1a3a5c"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "#8fa3b8", fontSize: 11 }}
          axisLine={{ stroke: "#1a3a5c" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#ecebf3", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={116}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: "#ecebf3", fontWeight: 600 }}
          itemStyle={{ color: "#8fa3b8" }}
          formatter={(value, _name, props) => {
            const rateLabel = (
              props as { payload?: { rateLabel?: string } }
            ).payload?.rateLabel;
            const count = typeof value === "number" ? value : Number(value);
            return [
              `${count.toLocaleString()} events${rateLabel ? ` (${rateLabel})` : ""}`,
              "Count",
            ];
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList
            dataKey="rateLabel"
            position="right"
            style={{ fill: "#8fa3b8", fontSize: 11 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
