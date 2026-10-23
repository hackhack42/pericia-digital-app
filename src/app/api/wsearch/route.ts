import { NextRequest, NextResponse } from "next/server";

const UA = { "User-Agent": "caso2471-detective-game/1.0 (contact: local)" };

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const title = req.nextUrl.searchParams.get("title");

  try {
    if (title) {
      // resumo do artigo (Wikipedia REST)
      const res = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { headers: UA, next: { revalidate: 3600 } }
      );
      if (!res.ok) return NextResponse.json({ error: "not found" }, { status: 404 });
      const data = await res.json();
      return NextResponse.json({
        title: data.title,
        extract: data.extract ?? "",
        url: data.content_urls?.desktop?.page ?? `https://pt.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        thumb: data.thumbnail?.source ?? null,
      });
    }

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }
    const res = await fetch(
      `https://pt.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=5&namespace=0&format=json`,
      { headers: UA, next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const results = ((data?.[1] as string[]) ?? []).map((t: string, i: number) => ({
      title: t,
      snippet: (data?.[2] as string[])?.[i] ?? "",
      url: (data?.[3] as string[])?.[i] ?? "",
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: "offline" });
  }
}
