"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wifi, WifiOff, AlertTriangle, Ticket } from "lucide-react";
import type { CustomerStats } from "@/types/customer";

interface StatsCardsProps {
  stats: CustomerStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Customers",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Normal",
      value: stats.online,
      icon: Wifi,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      percentage: stats.total > 0 ? ((stats.online / stats.total) * 100).toFixed(1) : 0,
    },
    {
      title: "High",
      value: stats.offline,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      percentage: stats.total > 0 ? ((stats.offline / stats.total) * 100).toFixed(1) : 0,
    },
    {
      title: "No Monitor",
      value: stats.warning,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      percentage: stats.total > 0 ? ((stats.warning / stats.total) * 100).toFixed(1) : 0,
    },
    {
      title: "Loss",
      value: stats.loss,
      icon: WifiOff,
      color: "text-red-600",
      bgColor: "bg-red-50",
      percentage: stats.total > 0 ? ((stats.loss / stats.total) * 100).toFixed(1) : 0,
    },
    {
      title: "Active Trouble Tickets",
      value: stats.withTT,
      icon: Ticket,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            {card.percentage !== undefined && (
              <p className="text-xs text-muted-foreground">
                {card.percentage}% of total
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
