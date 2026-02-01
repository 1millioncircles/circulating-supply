export const dynamic = "force-dynamic";

const API_URL =
  "https://circulating-supply-delta.vercel.app/api/circulating-supply";

async function getCirculatingSupply(): Promise<number | null> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  const n = Number(data?.circulating_supply);
  return Number.isFinite(n) ? n : null;
}

export default async function CirculatingWidgetPage() {
  const supply = await getCirculatingSupply();

  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 140,
        padding: 16,
        margin: 0,
        background: "transparent",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, opacity: 0.75, marginBottom: 6 }}>
          Circulating Supply
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>
          {supply === null ? "Unavailable" : supply.toLocaleString()}
        </div>
      </div>
    </main>
  );
}

