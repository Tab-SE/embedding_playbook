/**
 * Georgia roster rows aligned with the Morgan internal-records table (same order as canned markdown).
 * `name` + `address` mirror what a Tableau export would provide; replace with live query fields when MCP is connected.
 * Coordinates are approximate geocodes for mapping only.
 */
export const MORGAN_GA_OFFICE_ROWS = [
  { name: "Jordan Ellis", address: "2700 West Broad St. STE 110, Athens, GA 30601", lat: 33.9461, lng: -83.4124 },
  { name: "Priya Nandakumar", address: "4501 Habersham St. and 45th St, Savannah, GA 31405", lat: 32.0451, lng: -81.0902 },
  { name: "Thomas Brennan", address: "13040 North Point Circle Ste B, Alpharetta, GA 30022", lat: 34.0496, lng: -84.2803 },
  { name: "Angela Ruiz", address: "222 West Harris St., Savannah, GA 31401", lat: 32.0755, lng: -81.092 },
  { name: "Marcus Chen", address: "3275 Mall Blvd, Buford, GA 30519", lat: 34.0678, lng: -83.9986 },
  { name: "Sandra Okonkwo", address: "1777 S. Milledge Ave, Athens, GA 30605", lat: 33.9012, lng: -83.3837 },
  { name: "Leslie Harper", address: "3405 Piedmont Road NE #200, Atlanta, GA 30305", lat: 33.8492, lng: -84.379 },
  { name: "David Whitfield", address: "215 West Belair Rd., Suite A-2, Augusta, GA 30907", lat: 33.5226, lng: -82.0791 },
  { name: "Renee Caldwell", address: "2700 Old Dawson Road Suite 1, Albany, GA 31707", lat: 31.6157, lng: -84.203 },
  { name: "Omar Haddad", address: "855 Sunset Dr. #3, Athens, GA 30606", lat: 33.962, lng: -83.4371 },
  { name: "Christine Boyd", address: "191 Peachtree St NW Ste 1000, Atlanta, GA 30303", lat: 33.7589, lng: -84.3874 },
  { name: "Kevin O’Malley", address: "541 Stephenson Ave., Savannah, GA 31405", lat: 32.0439, lng: -81.0978 },
  { name: "Natalie Brooks", address: "3344 Peachtree Road NE, Suite 1000, Atlanta, GA 30305", lat: 33.8478, lng: -84.373 },
  { name: "William Park", address: "5671 Abernathy Rd NE Ste 100, Sandy Springs, GA 30328", lat: 33.9216, lng: -84.3518 },
] as const;

export type MorganGaMapPoint = {
  index: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** Shown as popup title (same as name when sourced from roster). */
  label: string;
};

function normalizeHeader(s: string) {
  return s.trim().toLowerCase();
}

function tableHeaders(row: Record<string, unknown>): string[] {
  return Object.keys(row).map(normalizeHeader);
}

/**
 * First markdown table is a Georgia roster (# + Name + Location) with the expected row count.
 */
export function isGeorgiaExpertLocationTable(rows: Record<string, unknown>[] | null): boolean {
  if (!rows?.length || rows.length !== MORGAN_GA_OFFICE_ROWS.length) return false;
  const headers = tableHeaders(rows[0] as Record<string, unknown>);
  if (!headers.includes("#") || !headers.includes("location") || !headers.includes("name")) return false;
  return rows.every((row) => {
    const loc = String((row as Record<string, string>).Location ?? "").trim();
    const nm = String((row as Record<string, string>).Name ?? "").trim();
    return /\bGA\b/i.test(loc) && nm.length > 0;
  });
}

export function mergeGeorgiaOfficeTableForMap(rows: Record<string, unknown>[]): MorganGaMapPoint[] | null {
  if (!isGeorgiaExpertLocationTable(rows)) return null;
  return rows.map((row, i) => {
    const ref = MORGAN_GA_OFFICE_ROWS[i];
    const idx = typeof (row as Record<string, unknown>)["#"] === "number" ? ((row as Record<string, number>)["#"] as number) : i + 1;
    const address = String((row as Record<string, string>).Location ?? ref.address).trim();
    const name = String((row as Record<string, string>).Name ?? ref.name).trim() || ref.name;
    return {
      index: idx,
      name,
      address,
      lat: ref.lat,
      lng: ref.lng,
      label: name,
    };
  });
}
