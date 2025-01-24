import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const page = searchParams.get("page");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Build the full URL with page if provided
  const fullUrl = page ? `${url}?page=${page}` : url;

  try {
    // Fetch the external URL
    const response = await fetch(fullUrl);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Determine the response type (text or JSON)
    const contentType = response.headers.get("Content-Type");

    let data: string | object;

    // If it's text (HTML, etc.), just get the raw text
    data = await response.text();

    // Return the fetched data
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": contentType || "text/plain" }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
