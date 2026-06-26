import { NextResponse } from "next/server";

export async function GET() {
  // గూగుల్ అడ్సెన్స్ రూల్స్ ప్రకారం ads.txt ఫార్మాట్ ఇది
  //pub-0000000000000000 ప్లేస్‌లో రేపు నీకు అడ్సెన్స్ అకౌంట్ వచ్చాక నీ 'Publisher ID' మార్చుకోవాలి
  const adsTextContent = `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(adsTextContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200", // 24 గంటల క్యాషింగ్
    },
  });
}