export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const baseUrl = `${proto}://${host}`;

    const r = await fetch(`${baseUrl}/api/circulating-supply`, {
      cache: "no-store",
    });

    if (!r.ok) throw new Error("Upstream failed");

    const data = await r.json();
    const n = Number(data.total_supply);

    if (!Number.isFinite(n)) throw new Error("Invalid number");

    return new Response(String(n), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("0", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

