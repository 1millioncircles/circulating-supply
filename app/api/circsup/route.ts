export const runtime = "nodejs";


export async function GET(req: Request) {
  try {
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const baseUrl = `${proto}://${host}`;

    // Fetch your accurate JSON endpoint
    const r = await fetch(`${baseUrl}/api/circulating-supply`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Upstream failed: ${r.status}`);

    const data = await r.json();

    const circulating = Number(data.circulating_supply);
    if (!Number.isFinite(circulating)) throw new Error("Invalid circulating_supply");

    return new Response(String(circulating), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("0", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
