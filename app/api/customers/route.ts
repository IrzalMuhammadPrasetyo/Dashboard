import { NextResponse } from "next/server";
import { getCustomerData } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCustomerData();
    const isUsingGoogleSheets = !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID);
    
    return NextResponse.json({ 
      success: true, 
      data, 
      lastUpdated: new Date().toISOString(),
      dataSource: isUsingGoogleSheets ? "google-sheets" : "sample-data"
    });
  } catch (error) {
    console.error("[v0] API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch data" },
      { status: 500 }
    );
  }
}
