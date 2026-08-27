import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getIndiaDateString } from "@/lib/analytics/timezone";

export async function POST(req: NextRequest) {
  try {
    let payload: any = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!payload || !payload.sessionId || !payload.action) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const pagePath = (payload.pagePath || "/").trim();
    // Do not record admin interactions
    if (pagePath.startsWith("/admin")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const now = new Date();
    const visitDate = getIndiaDateString(now); // Exact YYYY-MM-DD in Asia/Kolkata!

    const supabase = await createClient();

    const insertData: Record<string, any> = {
      session_id: payload.sessionId,
      page_path: pagePath,
      action: payload.action,
      details: payload.details || null,
      language: payload.language || "en",
      device: payload.device || "Desktop",
      operating_system: payload.operatingSystem || "Other",
      browser: payload.browser || "Other",
      device_name: payload.deviceName || "Unknown",
      viewport_width: payload.viewportWidth || null,
      viewport_height: payload.viewportHeight || null,
      referrer: payload.referrer || null,
      visited_at: now.toISOString(),
      visit_date: visitDate,
    };

    // Safe insert
    const { error } = await supabase.from("visitor_logs").insert(insertData);

    if (error) {
      // Fallback: If extra columns fail due to older table schema, insert standard base columns
      await supabase.from("visitor_logs").insert({
        session_id: payload.sessionId,
        page_path: pagePath,
        action: payload.action,
        details: payload.details || null,
        language: payload.language || "en",
        device: payload.device || "Desktop",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
