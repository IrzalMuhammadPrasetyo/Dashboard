"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CustomerStats } from "@/types/customer";

interface ChartsProps {
  stats: CustomerStats;
}

const STATUS_COLORS = {
  Normal: "#10b981",
  "Loss": "#ef4444",
  "No Monitor": "#f97316",
  High: "#f59e0b",
};

const CITY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function Charts({ stats }: ChartsProps) {
  const statusData = [
    { name: "Normal", value: stats.online, color: STATUS_COLORS.Normal },
    { name: "High", value: stats.offline, color: STATUS_COLORS.High },
    { name: "No Monitor", value: stats.warning, color: STATUS_COLORS["No Monitor"] },
    { name: "Loss", value: stats.loss, color: STATUS_COLORS.Loss },
  ].filter((d) => d.value > 0);

  const cityData = Object.entries(stats.byCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value], index) => ({
      name: name.length > 12 ? name.slice(0, 12) + "..." : name,
      fullName: name,
      value,
      color: CITY_COLORS[index % CITY_COLORS.length],
    }));

  const vendorData = Object.entries(stats.byVendor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const oltData = Object.entries(stats.byOlt)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name: name.length > 15 ? name.slice(0, 15) + "..." : name,
      fullName: name,
      value,
    }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Status Distribution */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Customers"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customers by City */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Customers by City</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Customers"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName || ""
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customers by Vendor */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Customers by Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Customers"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customers by OLT */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Customers by OLT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oltData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), "Customers"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName || ""
                  }
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
