"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { CustomerData } from "@/types/customer";

interface CustomerTableProps {
  data: CustomerData[];
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function CustomerTable({ data }: CustomerTableProps) {
  const [search, setSearch] = useState("");
  const [rslFilter, setRslFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(data.map((d) => d.city).filter(Boolean))];
    return uniqueCities.sort();
  }, [data]);

  const rslCategories = useMemo(() => {
    return ["Normal", "High", "Loss", "No Monitor"];
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((customer) => {
      const matchesSearch =
        search === "" ||
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.sn.toLowerCase().includes(search.toLowerCase()) ||
        customer.olt.toLowerCase().includes(search.toLowerCase()) ||
        customer.ponId.toLowerCase().includes(search.toLowerCase());

      const valStr = String(customer.rslOnt ?? "").trim();
      const statusLower = (customer.status || "").toLowerCase();
      let category = "No Monitor";
      
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
        }
      }

      const matchesRsl = rslFilter === "all" || category === rslFilter;
      const matchesCity = cityFilter === "all" || customer.city === cityFilter;

      return matchesSearch && matchesRsl && matchesCity;
    });
  }, [data, search, rslFilter, cityFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getRslIndicator = (rsl: number | string, status?: string) => {
    const valStr = String(rsl ?? "").trim();
    const statusLower = (status || "").toLowerCase();
    let category = "No Monitor";

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
        const combinedText = (valStr + " " + statusLower).toLowerCase();
        if (combinedText.includes("high") || combinedText.includes("warning")) category = "High";
        else if (combinedText.includes("normal") || combinedText.includes("success") || combinedText.includes("online")) category = "Normal";
      }
    }

    const displayValue = !isNaN(parseFloat(valStr)) ? `${valStr} dBm` : (valStr || "-");

    switch (category) {
      case "Normal":
        return <span className="font-medium text-emerald-600">{displayValue}</span>;
      case "High":
        return <span className="font-medium text-yellow-500">{displayValue}</span>;
      case "Loss":
        return <span className="font-medium text-black dark:text-zinc-100">{displayValue}</span>;
      default: // No Monitor
        return <span className="font-medium text-red-600">{displayValue}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, SN, OLT, PON ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={rslFilter}
            onValueChange={(value) => {
              setRslFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="RSL ONT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All RSL ONT</SelectItem>
              {rslCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={cityFilter}
            onValueChange={(value) => {
              setCityFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="whitespace-nowrap">OLT</TableHead>
                <TableHead className="whitespace-nowrap">PON ID</TableHead>
                <TableHead className="whitespace-nowrap">ONU ID</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">SN</TableHead>
                <TableHead className="whitespace-nowrap">RSL</TableHead>
                <TableHead className="whitespace-nowrap">RSL ONT</TableHead>
                <TableHead className="whitespace-nowrap">Vendor</TableHead>
                <TableHead className="whitespace-nowrap">City</TableHead>
                <TableHead className="whitespace-nowrap">Active Date</TableHead>
                <TableHead className="whitespace-nowrap">TT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{customer.olt}</TableCell>
                    <TableCell>{customer.ponId}</TableCell>
                    <TableCell>{customer.onuId}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={customer.name}>
                      {customer.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{customer.sn}</TableCell>
                    <TableCell>{getRslIndicator(customer.rsl, customer.status)}</TableCell>
                    <TableCell>{getRslIndicator(customer.rslOnt, customer.status)}</TableCell>
                    <TableCell>{customer.vendor}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell className="whitespace-nowrap">{customer.activeDate}</TableCell>
                    <TableCell>
                      {customer.tt ? (
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {customer.tt}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>
            of {filteredData.length.toLocaleString()} entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
