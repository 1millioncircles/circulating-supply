export const dynamic = "force-dynamic";

const API_URL =
  "https://circulating-supply-delta.vercel.app/api/circulating-supply";

async function getSupply() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SupplyPage() {
  const data = await getSupply();

  const total =
    data && Number.isFinite(Number(data.total_supply))
      ? Number(data.total_supply)
      : null;

  const circulating =
    data && Number.isFinite(Number(data.circulating_supply))
      ? Number(data.circulating_supply)
      : null;

  const totalPhysical =
    data && Number.isFinite(Number(data.total_physical_circles))
      ? Number(data.total_physical_circles)
      : null;

  const circulatingPhysical =
    data && Number.isFinite(Number(data.circulating_physical_circles))
      ? Number(data.circulating_physical_circles)
      : null;

  const circulatingSheets =
    data && Number.isFinite(Number(data.circulating_full_sheets))
      ? Number(data.circulating_full_sheets)
      : null;

  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 180,
        padding: 16,
        margin: 0,
        background: "transparent",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.75 }}>Total Supply</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            {total === null ? "Unavailable" : total.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, opacity: 0.75 }}>
            Circulating Supply
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            {circulating === null
              ? "Unavailable"
              : circulating.toLocaleString()}
          </div>
        </div>
      </div>
    </main>
  );
}
