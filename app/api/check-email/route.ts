// app/api/check-email/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";

// OPTIONSメソッド（プリフライトリクエスト用）
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// POSTメソッド（本リクエスト用）
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { 
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" }
        }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error.message);
      return NextResponse.json(
        { error: "Database error" },
        { 
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" }
        }
      );
    }

    return NextResponse.json(
      { exists: !!data },
      { 
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }
}
