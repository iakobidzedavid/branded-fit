import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return Response.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { domain, email, company_name } = body;

    if (!domain || !email || !company_name) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if domain already exists
    const { data: existingDomain } = await supabase
      .from("pilot_inquiries")
      .select("id")
      .eq("domain", domain.toLowerCase())
      .single();

    if (existingDomain) {
      return Response.json(
        { message: "Domain already submitted. Please check your email." },
        { status: 400 }
      );
    }

    // Insert new inquiry
    const { data, error } = await supabase
      .from("pilot_inquiries")
      .insert([
        {
          domain: domain.toLowerCase(),
          email,
          company_name,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { message: "Failed to store inquiry" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        status: "success",
        inquiry_id: data.id,
        message: "Inquiry submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
