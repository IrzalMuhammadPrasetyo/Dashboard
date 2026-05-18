import { google } from "googleapis";

export interface CustomerData {
  id: string;
  olt: string;
  ponId: string;
  onuId: string;
  name: string;
  status: string;
  sn: string;
  rsl: number | string;
  rslOnt: number | string;
  vendor: string;
  city: string;
  activeDate: string;
  tt: string;
}

// Sample data for demo/fallback when Google Sheets is not configured
export const sampleCustomerData: CustomerData[] = [
  { id: "1", olt: "OLT-JKT-01", ponId: "0/1/0", onuId: "1", name: "PT Maju Jaya", status: "Online", sn: "HWTC12345678", rsl: -18.5, rslOnt: -19.2, vendor: "Huawei", city: "Jakarta", activeDate: "2024-01-15", tt: "" },
  { id: "2", olt: "OLT-JKT-01", ponId: "0/1/0", onuId: "2", name: "CV Sukses Mandiri", status: "Online", sn: "ZTEG87654321", rsl: -21.3, rslOnt: -22.1, vendor: "ZTE", city: "Jakarta", activeDate: "2024-02-20", tt: "" },
  { id: "3", olt: "OLT-JKT-02", ponId: "0/2/1", onuId: "5", name: "Toko Elektronik ABC", status: "Offline", sn: "HWTC23456789", rsl: -35.0, rslOnt: -36.5, vendor: "Huawei", city: "Bandung", activeDate: "2024-03-10", tt: "TT-2024-001" },
  { id: "4", olt: "OLT-SBY-01", ponId: "0/1/2", onuId: "3", name: "RS Sehat Sentosa", status: "Online", sn: "FIBH34567890", rsl: -16.8, rslOnt: -17.5, vendor: "Fiberhome", city: "Surabaya", activeDate: "2024-01-25", tt: "" },
  { id: "5", olt: "OLT-SBY-01", ponId: "0/1/2", onuId: "8", name: "Hotel Grand Palace", status: "Warning", sn: "ZTEG45678901", rsl: -27.5, rslOnt: -28.2, vendor: "ZTE", city: "Surabaya", activeDate: "2024-04-05", tt: "" },
  { id: "6", olt: "OLT-BDG-01", ponId: "0/3/0", onuId: "2", name: "Universitas Merdeka", status: "Online", sn: "HWTC56789012", rsl: -19.2, rslOnt: -20.0, vendor: "Huawei", city: "Bandung", activeDate: "2024-02-28", tt: "" },
  { id: "7", olt: "OLT-BDG-01", ponId: "0/3/1", onuId: "4", name: "Mall Central Plaza", status: "Online", sn: "FIBH67890123", rsl: -17.9, rslOnt: -18.6, vendor: "Fiberhome", city: "Bandung", activeDate: "2024-03-15", tt: "" },
  { id: "8", olt: "OLT-JKT-02", ponId: "0/2/0", onuId: "6", name: "Kantor Advokat HLB", status: "Offline", sn: "ZTEG78901234", rsl: -40.2, rslOnt: -41.0, vendor: "ZTE", city: "Jakarta", activeDate: "2024-01-08", tt: "TT-2024-002" },
  { id: "9", olt: "OLT-MDN-01", ponId: "0/1/0", onuId: "1", name: "Bank Nusantara", status: "Online", sn: "HWTC89012345", rsl: -15.6, rslOnt: -16.3, vendor: "Huawei", city: "Medan", activeDate: "2024-04-12", tt: "" },
  { id: "10", olt: "OLT-MDN-01", ponId: "0/1/1", onuId: "3", name: "Pabrik Tekstil Jaya", status: "Warning", sn: "FIBH90123456", rsl: -26.8, rslOnt: -27.5, vendor: "Fiberhome", city: "Medan", activeDate: "2024-02-10", tt: "" },
  { id: "11", olt: "OLT-JKT-03", ponId: "0/4/0", onuId: "2", name: "Gedung Perkantoran ABC", status: "Online", sn: "HWTC01234567", rsl: -18.1, rslOnt: -18.9, vendor: "Huawei", city: "Jakarta", activeDate: "2024-03-22", tt: "" },
  { id: "12", olt: "OLT-SBY-02", ponId: "0/2/0", onuId: "5", name: "Sekolah Internasional", status: "Online", sn: "ZTEG12345678", rsl: -20.4, rslOnt: -21.2, vendor: "ZTE", city: "Surabaya", activeDate: "2024-04-18", tt: "" },
  { id: "13", olt: "OLT-BDG-02", ponId: "0/1/0", onuId: "1", name: "Klinik Sehat Bahagia", status: "Offline", sn: "FIBH23456789", rsl: -38.7, rslOnt: -39.5, vendor: "Fiberhome", city: "Bandung", activeDate: "2024-01-30", tt: "TT-2024-003" },
  { id: "14", olt: "OLT-JKT-01", ponId: "0/1/1", onuId: "7", name: "Restoran Padang Jaya", status: "Online", sn: "HWTC34567890", rsl: -17.3, rslOnt: -18.0, vendor: "Huawei", city: "Jakarta", activeDate: "2024-02-14", tt: "" },
  { id: "15", olt: "OLT-MDN-02", ponId: "0/2/1", onuId: "4", name: "Gudang Logistik Prima", status: "Warning", sn: "ZTEG45678902", rsl: -28.9, rslOnt: -29.7, vendor: "ZTE", city: "Medan", activeDate: "2024-03-08", tt: "" },
];

function formatPrivateKey(key: string): string {
  // Handle various formats of private key input
  let formattedKey = key;
  
  // Replace literal \n with actual newlines
  formattedKey = formattedKey.replace(/\\n/g, "\n");
  
  // If the key doesn't have proper PEM headers, it might be base64 encoded
  if (!formattedKey.includes("-----BEGIN")) {
    // Try to construct PEM format
    formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----\n`;
  }
  
  return formattedKey;
}

function getGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawPrivateKey) {
    console.log("[v0] Missing Google Service Account credentials, will use sample data");
    return null;
  }

  const privateKey = formatPrivateKey(rawPrivateKey);

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getCustomerData(): Promise<CustomerData[]> {
  const auth = getGoogleAuth();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  // Return sample data if credentials are not configured
  if (!auth || !sheetId) {
    console.log("[v0] Using sample data - Google Sheets not configured");
    return sampleCustomerData;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:L", // Columns A through L (OLT to TT)
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("[v0] No data in spreadsheet, using sample data");
      return sampleCustomerData;
    }

    // Skip header row and map data
    const data = rows.slice(1).map((row, index) => ({
      id: String(index + 1),
      olt: row[0] || "",
      ponId: row[1] || "",
      onuId: row[2] || "",
      name: row[3] || "",
      status: (row[4] || "").trim(),
      sn: (row[5] || "").trim(),
      rsl: row[6] ? (parseFloat(String(row[6]).replace(',', '.')) || String(row[6]).trim()) : "",
      rslOnt: row[7] ? (parseFloat(String(row[7]).replace(',', '.')) || String(row[7]).trim()) : "",
      vendor: (row[8] || "").trim(),
      city: (row[9] || "").trim(),
      activeDate: (row[10] || "").trim(),
      tt: (row[11] || "").trim(),
    }));

    return data;
  } catch (error) {
    console.error("[v0] Error fetching data from Google Sheets:", error);
    console.log("[v0] Falling back to sample data");
    return sampleCustomerData;
  }
}

export async function getSheetMetadata() {
  const auth = getGoogleAuth();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !sheetId) {
    throw new Error("Missing Google Auth credentials or Sheet ID");
  }

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
  });

  return {
    title: response.data.properties?.title || "Unknown",
    sheets: response.data.sheets?.map((s) => s.properties?.title) || [],
  };
}
