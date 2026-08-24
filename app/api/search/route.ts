import { NextRequest, NextResponse } from "next/server";
import { searchContent, getMcpInitialContext } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "relevant";

    if (!query.trim()) {
      return NextResponse.json({
        query: "",
        totalCount: 0,
        courseCount: 0,
        results: [],
      });
    }

    // Warm initial context cache in background if not already warm
    getMcpInitialContext().catch((err) =>
      console.warn("Initial context warm-up notice:", err)
    );

    const response = await searchContent(query, sort);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Search API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
        query: "",
        totalCount: 0,
        courseCount: 0,
        results: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || body.q || "";
    const sort = body.sort || "relevant";

    const response = await searchContent(query, sort);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
        query: "",
        totalCount: 0,
        courseCount: 0,
        results: [],
      },
      { status: 500 }
    );
  }
}
