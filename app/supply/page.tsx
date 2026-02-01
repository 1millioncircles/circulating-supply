export const dynamic = "force-dynamic";

async function getSupply() {
  const res = await fetch(
    "https://circulating-supply-delta.vercel.app/api/circulating-supply",
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load supply");
  return res.json();
}

export default async function SupplyPage() {
  let supply: number | null = null;

  try {
    const data = await getSupply();
    const n = Number(data?.circulating_supply);
    supply = Number.isFinite(n) ? n : null;
  } catch {
    supply = null;
  }

  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        margin: 0,
        padding: 24,
        background: "transparent",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, opacity: 0.75, marginBottom: 8 }}>
          Circulating Supply
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
          {supply === null ? "Unavailable" : supply.toLocaleString()}
        </div>
      </div>
    </main>
  );
}


