"use client";

import { useEffect, useMemo, useState } from "react";
import {
  File,
  ListFilter,
  PlusCircle,
} from "lucide-react";

import { Button } from "components/ui";
import { Skeleton } from "components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui";

const CONFIG_KEY = "products_demo_config";

const RAW_DATA = [
  { Category: "Office Supplies", "SUM(Profit)": 54070.22919999995, Region: "West", "SUM(Sales)": 226366.89099999997 },
  { Category: "Office Supplies", "SUM(Profit)": 42996.73970000004, Region: "East", "SUM(Sales)": 211658.40099999984 },
  { Category: "Office Supplies", "SUM(Profit)": 19986.392800000012, Region: "South", "SUM(Sales)": 125651.31299999994 },
  { Category: "Furniture", "SUM(Profit)": 6771.206099999995, Region: "South", "SUM(Sales)": 117298.68400000011 },
  { Category: "Technology", "SUM(Profit)": 48441.775799999974, Region: "East", "SUM(Sales)": 267938.07100000005 },
  { Category: "Technology", "SUM(Profit)": 19991.831400000006, Region: "South", "SUM(Sales)": 148771.90799999997 },
  { Category: "Furniture", "SUM(Profit)": 3444.744799999994, Region: "East", "SUM(Sales)": 212231.6960000001 },
  { Category: "Office Supplies", "SUM(Profit)": 8970.081700000013, Region: "Central", "SUM(Sales)": 168216.70900000024 },
  { Category: "Furniture", "SUM(Profit)": -2802.206700000009, Region: "Central", "SUM(Sales)": 164537.65179999988 },
  { Category: "Technology", "SUM(Profit)": 44412.3364, Region: "West", "SUM(Sales)": 252766.988 },
  { Category: "Technology", "SUM(Profit)": 33697.432000000015, Region: "Central", "SUM(Sales)": 170416.31199999983 },
  { Category: "Furniture", "SUM(Profit)": 12316.251399999988, Region: "West", "SUM(Sales)": 260679.72950000022 }
];

const COLUMNS = [
  { key: "Category", label: "Category" },
  { key: "Region", label: "Region" },
  { key: "SUM(Sales)", label: "Sales" },
  { key: "SUM(Profit)", label: "Profit" },
];

function formatCurrency(n) {
  if (n == null || Number.isNaN(n)) return "";
  return Number(n).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export const ProductsTable = () => {
  const [hiddenColumns, setHiddenColumns] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterRegion, setFilterRegion] = useState(null);
  const [dataRows, setDataRows] = useState(RAW_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Load persisted config
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (!raw) return;
      const cfg = JSON.parse(raw);
      setHiddenColumns(new Set(cfg.hiddenColumns || []));
      setFilterCategory(cfg.filterCategory || null);
      setFilterRegion(cfg.filterRegion || null);
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    const cfg = {
      hiddenColumns: Array.from(hiddenColumns),
      filterCategory,
      filterRegion,
    };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    } catch {}
  }, [hiddenColumns, filterCategory, filterRegion]);

  // Fetch from API (fallback to RAW_DATA on error)
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const start = Date.now();
      setLoadError(null);
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (mounted && rows.length) setDataRows(rows);
      } catch (e) {
        if (mounted) setLoadError(e?.message || 'Failed to load');
      } finally {
        const elapsed = Date.now() - start;
        const min = 400; // ensure loading visible for at least 400ms
        const remaining = Math.max(0, min - elapsed);
        if (mounted) setTimeout(() => setIsLoading(false), remaining);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => Array.from(new Set(dataRows.map(r => r.Category))).sort(), [dataRows]);
  const regions = useMemo(() => Array.from(new Set(dataRows.map(r => r.Region))).sort(), [dataRows]);

  const filteredRows = useMemo(() => {
    return dataRows.filter(r => {
      const catOk = filterCategory ? r.Category === filterCategory : true;
      const regOk = filterRegion ? r.Region === filterRegion : true;
      return catOk && regOk;
    });
  }, [filterCategory, filterRegion, dataRows]);

  const visibleColumns = COLUMNS.filter(c => !hiddenColumns.has(c.key));

  const toggleColumn = (key) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const clearFilters = () => {
    setFilterCategory(null);
    setFilterRegion(null);
  };

  return (
    <Card className='shadow-xl' x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        )}
        {loadError && (
          <div className="text-sm text-red-600 mb-2">{String(loadError)}</div>
        )}
        {!isLoading && (
        <div className="ml-auto flex items-center gap-2 mt-6 justify-end">
          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Category</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filterCategory === null}
                onCheckedChange={() => setFilterCategory(null)}
              >
                All
              </DropdownMenuCheckboxItem>
              {categories.map(cat => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={filterCategory === cat}
                  onCheckedChange={() => setFilterCategory(cat)}
                >
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Region</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filterRegion === null}
                onCheckedChange={() => setFilterRegion(null)}
              >
                All
              </DropdownMenuCheckboxItem>
              {regions.map(reg => (
                <DropdownMenuCheckboxItem
                  key={reg}
                  checked={filterRegion === reg}
                  onCheckedChange={() => setFilterRegion(reg)}
                >
                  {reg}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onCheckedChange={clearFilters}>
                Reset Filters
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Columns
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLUMNS.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={!hiddenColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
        )}
        {!isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow key={idx}>
                {visibleColumns.map(col => {
                  const value = row[col.key];
                  if (col.key === "SUM(Sales)") {
                    return (
                      <TableCell key={col.key}>{formatCurrency(value)}</TableCell>
                    );
                  }
                  if (col.key === "SUM(Profit)") {
                    const isNeg = Number(value) < 0;
                    return (
                      <TableCell key={col.key} className={isNeg ? "text-red-600" : undefined}>
                        {formatCurrency(value)}
                      </TableCell>
                    );
                  }
                  return <TableCell key={col.key}>{String(value)}</TableCell>;
                })}
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center text-sm text-muted-foreground">
                  No rows match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredRows.length}</strong> of <strong>{dataRows.length}</strong>{" "}
          rows
        </div>
      </CardFooter>
    </Card>
  )
}
