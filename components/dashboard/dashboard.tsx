"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { StatsCards } from "./stats-cards";
import { CustomerTable } from "./customer-table";
import { Charts } from "./charts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, LayoutDashboard, Table, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { CustomerData, CustomerStats } from "@/types/customer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function calculateStats(data: CustomerData[]): CustomerStats {
  const stats: CustomerStats = {
    total: data.length,
    online: 0,
    offline: 0,
    loss: 0,
    warning: 0,
    byCity: {},
    byVendor: {},
    byOlt: {},
    avgRsl: 0,
    withTT: 0,
  };

  let rslSum = 0;
  let rslCount = 0;

  data.forEach((customer) => {
    // Periksa label status di kolom status atau rslOnt (menggunakan includes agar lebih fleksibel)
    const valStr = String(customer.rslOnt ?? "").trim();
    const statusLower = (customer.status || "").toLowerCase();
    let category = "No Monitor";

    // Prioritas 1: Logika LOSS (Hitam)
    const isNoMonitor = valStr === "" || valStr === "0" || valStr === "0.00" || valStr === "--" || valStr.toLowerCase().includes("no monitor");
    const isLoss = valStr.toLowerCase().includes("loss") || valStr.toLowerCase().includes("los") || 
                   statusLower.includes("loss") || statusLower.includes("los") || statusLower.includes("failed") || 
                   statusLower.includes("dying gasp") || statusLower.includes("offline");

    if (isNoMonitor) {
      category = "No Monitor";
    } else if (isLoss) {
      category = "Loss";
    } else {
      const num = parseFloat(valStr);
      if (!isNaN(num)) {
        if (num >= -24.99) category = "Normal";
        else category = "High";
      } else {
        const combinedText = (valStr + " " + (customer.status || "")).toLowerCase();
        if (combinedText.includes("high") || combinedText.includes("warning")) category = "High";
        else if (combinedText.includes("normal") || combinedText.includes("success") || combinedText.includes("online")) category = "Normal";
        else category = "No Monitor";
      }
    }

    // Update stats berdasarkan kategori
    if (category === "Normal") {
      stats.online++;
    } else if (category === "High") {
      stats.offline++;
    } else if (category === "Loss") {
      stats.loss++;
    } else {
      stats.warning++;
    }

    // Average RSL
    if (typeof customer.rsl === "number") {
      rslSum += customer.rsl;
      rslCount++;
    }

    // By City
    if (customer.city) {
      stats.byCity[customer.city] = (stats.byCity[customer.city] || 0) + 1;
    }

    // By Vendor
    if (customer.vendor) {
      stats.byVendor[customer.vendor] = (stats.byVendor[customer.vendor] || 0) + 1;
    }

    // By OLT
    if (customer.olt) {
      stats.byOlt[customer.olt] = (stats.byOlt[customer.olt] || 0) + 1;
    }

    // Trouble Tickets
    if (customer.tt && customer.tt.trim() !== "") {
      stats.withTT++;
    }
  });

  stats.avgRsl = rslCount > 0 ? rslSum / rslCount : 0;

  return stats;
}

export function Dashboard() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: CustomerData[];
    lastUpdated: string;
    error?: string;
  }>("/api/customers", fetcher, {
    refreshInterval: 60000, // Auto refresh every 60 seconds
    revalidateOnFocus: true,
  });

  const stats = useMemo(() => {
    if (!data?.data) return null;
    return calculateStats(data.data);
  }, [data]);

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Failed to load data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {data?.error || "Unable to connect to Google Sheets"}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const customers = data.data || [];

  const activeDateRange = (() => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    };

    const dates = customers
      .map((customer) => new Date(customer.activeDate))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) {
      return "from unknown to unknown";
    }

    const first = formatDate(dates[0]);
    const last = formatDate(dates[dates.length - 1]);
    return `from ${first} to Now`;
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Monitor RSL One Week Installed
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeDateRange}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data?.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Tabs for Charts and Table */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Table className="h-4 w-4" />
            All Customers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {stats && <Charts stats={stats} />}
        </TabsContent>
        <TabsContent value="customers">
          <CustomerTable data={customers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
