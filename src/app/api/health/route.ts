import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    BRANDFETCH_API_KEY: !!process.env.BRANDFETCH_API_KEY,
    PRINTIFY_API_KEY: !!process.env.PRINTIFY_API_KEY,
    SHOPIFY_ACCESS_TOKEN: !!process.env.SHOPIFY_ACCESS_TOKEN,
    SHOPIFY_STORE_NAME: !!(process.env.SHOPIFY_STORE_NAME || process.env.SHOPIFY_SHOP_NAME),
  };

  const missingRequired = Object.entries(vars)
    .filter(([, present]) => !present)
    .map(([key]) => key);

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      env: vars,
      missingRequired: missingRequired.length > 0 ? missingRequired : undefined,
    },
    { status: 200 }
  );
}
