import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const DEMO_ORDERS = [
  {
    shopify_order_id: "10001",
    store_name: "Apex Athletic Co.",
    customer_name: "Jordan Miller",
    customer_email: "jordan.miller@example.com",
    customer_id: "cust_001",
    shipping_address: { street: "742 Evergreen Terrace", city: "Springfield", state: "IL", zip: "62701", country: "US" },
    product_name: "Premium Branded Hoodie",
    product_sku: "HOD-BLK-XL",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Hoodie",
    quantity: 2,
    unit_price: 49.99,
    total_price: 99.98,
    fulfillment_status: "shipped",
    printify_tracking_url: "https://printify.com/tracking/10001",
    order_notes: "Please ship ASAP — gift for team",
    order_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10002",
    store_name: "Apex Athletic Co.",
    customer_name: "Taylor Brooks",
    customer_email: "taylor.brooks@example.com",
    customer_id: "cust_002",
    shipping_address: { street: "1234 Oak Lane", city: "Austin", state: "TX", zip: "73301", country: "US" },
    product_name: "Performance T-Shirt",
    product_sku: "TSH-WHT-M",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=T-Shirt",
    quantity: 1,
    unit_price: 29.99,
    total_price: 29.99,
    fulfillment_status: "processing",
    printify_tracking_url: null,
    order_notes: null,
    order_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10003",
    store_name: "Summit Gear Collective",
    customer_name: "Alex Rivera",
    customer_email: "alex.rivera@example.com",
    customer_id: "cust_003",
    shipping_address: { street: "88 Pine Street", city: "Denver", state: "CO", zip: "80201", country: "US" },
    product_name: "Embroidered Cap",
    product_sku: "CAP-NAV-OS",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Cap",
    quantity: 3,
    unit_price: 24.99,
    total_price: 74.97,
    fulfillment_status: "pending",
    printify_tracking_url: null,
    order_notes: "Bulk order — corporate giveaway",
    order_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10004",
    store_name: "Summit Gear Collective",
    customer_name: "Casey O'Brien",
    customer_email: "casey.obrien@example.com",
    customer_id: "cust_004",
    shipping_address: { street: "500 River Rd", city: "Portland", state: "OR", zip: "97201", country: "US" },
    product_name: "Zip-Up Fleece Jacket",
    product_sku: "FLC-GRY-L",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Fleece",
    quantity: 1,
    unit_price: 79.99,
    total_price: 79.99,
    fulfillment_status: "shipped",
    printify_tracking_url: "https://printify.com/tracking/10004",
    order_notes: null,
    order_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10005",
    store_name: "Apex Athletic Co.",
    customer_name: "Morgan Chen",
    customer_email: "morgan.chen@example.com",
    customer_id: "cust_005",
    shipping_address: { street: "22 Harbor View", city: "San Francisco", state: "CA", zip: "94102", country: "US" },
    product_name: "Premium Branded Hoodie",
    product_sku: "HOD-NVY-S",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Hoodie",
    quantity: 1,
    unit_price: 49.99,
    total_price: 49.99,
    fulfillment_status: "delivered",
    printify_tracking_url: "https://printify.com/tracking/10005",
    order_notes: null,
    order_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10006",
    store_name: "Northside Merch Studio",
    customer_name: "Sam Patel",
    customer_email: "sam.patel@example.com",
    customer_id: "cust_006",
    shipping_address: { street: "9 Maple Avenue", city: "Chicago", state: "IL", zip: "60601", country: "US" },
    product_name: "Branded Tote Bag",
    product_sku: "TOT-BEG-OS",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Tote",
    quantity: 5,
    unit_price: 19.99,
    total_price: 99.95,
    fulfillment_status: "processing",
    printify_tracking_url: null,
    order_notes: "Event giveaways — need by end of month",
    order_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10007",
    store_name: "Summit Gear Collective",
    customer_name: "Riley Thompson",
    customer_email: "riley.thompson@example.com",
    customer_id: "cust_007",
    shipping_address: { street: "45 Cedar Court", city: "Seattle", state: "WA", zip: "98101", country: "US" },
    product_name: "Stainless Steel Tumbler",
    product_sku: "TUM-SLV-20",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Tumbler",
    quantity: 2,
    unit_price: 34.99,
    total_price: 69.98,
    fulfillment_status: "pending",
    printify_tracking_url: null,
    order_notes: null,
    order_date: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    shopify_order_id: "10008",
    store_name: "Northside Merch Studio",
    customer_name: "Drew Kim",
    customer_email: "drew.kim@example.com",
    customer_id: "cust_008",
    shipping_address: { street: "300 Willow Way", city: "Nashville", state: "TN", zip: "37201", country: "US" },
    product_name: "Embroidered Cap",
    product_sku: "CAP-BLK-OS",
    product_mockup_url: "https://via.placeholder.com/300x300/102542/ecebf3?text=Cap",
    quantity: 1,
    unit_price: 24.99,
    total_price: 24.99,
    fulfillment_status: "shipped",
    printify_tracking_url: "https://printify.com/tracking/10008",
    order_notes: null,
    order_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function POST() {
  try {
    const supabase = getServerSupabase();

    // Check how many orders already exist
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ message: `Demo data already present (${count} orders exist).`, seeded: 0 });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert(DEMO_ORDERS)
      .select("id");

    if (error) {
      console.error("seed-demo-orders error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Seeded ${data?.length ?? 0} demo orders.`, seeded: data?.length ?? 0 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
