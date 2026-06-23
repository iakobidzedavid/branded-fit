import { getServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = getServerSupabase();

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "1000");

    // Fetch responses with related prospect and outreach data
    const { data: responses, error } = await supabase
      .from("gtm_responses")
      .select(`
        id,
        prospect_id,
        outreach_id,
        first_reply_date,
        reply_type,
        reply_body,
        sentiment,
        top_objection,
        qualification_status,
        discovery_call_scheduled,
        discovery_call_date,
        created_at,
        gtm_prospects(prospect_name, company_name, email, title),
        gtm_outreach(sent_date, email_subject, wave_name)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Fetch daily metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("gtm_metrics_daily")
      .select("*")
      .order("measurement_date", { ascending: false })
      .limit(30);

    if (metricsError) {
      console.error("Error fetching metrics:", metricsError);
    }

    return Response.json({
      responses: responses || [],
      metrics: metrics || [],
      count: responses?.length || 0,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServerSupabase();
    const body = await request.json();

    // Validate required fields
    const { prospect_id, outreach_id, sentiment, reply_type, qualification_status } = body;
    if (!prospect_id || !outreach_id) {
      return Response.json(
        { error: "Missing prospect_id or outreach_id" },
        { status: 400 }
      );
    }

    // Insert or update response
    const { data, error } = await supabase
      .from("gtm_responses")
      .insert([
        {
          prospect_id,
          outreach_id,
          sentiment: sentiment || "unclassified",
          reply_type: reply_type || "email",
          qualification_status: qualification_status || "unqualified",
          first_reply_date: body.first_reply_date || new Date().toISOString(),
          reply_body: body.reply_body,
          top_objection: body.top_objection,
          next_action: body.next_action,
          next_action_date: body.next_action_date,
          discovery_call_scheduled: body.discovery_call_scheduled || false,
          discovery_call_date: body.discovery_call_date,
        },
      ])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
