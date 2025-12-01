export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";

// Demo dataset for Products table
const DATA = [
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

export async function GET() {
  return NextResponse.json({ data: DATA }, { status: 200 });
}


