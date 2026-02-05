export const dynamic = "force-dynamic";

const API_URL = "https://circcircsupply.vercel.app/api/circulating-supply";

async function getSupply() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function fmtDecimals(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
}

export default async function SupplyPage() {
  const d = await getSupply();
  if (!d) return <div>Unavailable</div>;

  // token supplies (decimals allowed)
  const totalSupply = Number(d.total_supply);
  const circulatingSupply = Number(d.circulating_supply);

  // derived physical values (whole numbers only)
  const totalPhysical = Math.floor(totalSupply / 1000);
  const circulatingPhysical = Math.floor(circulatingSupply / 1000);

  const totalSheets = Math.floor(totalPhysical / 10_000);
  const circulatingSheets = Math.floor(circulatingPhysical / 10_000);

  return (
    <main
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        background: "transparent",
        color: "white",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        {/* TOTAL */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ opacity: 0.7, fontSize: 22 }}>Total Supply</div>
          <div style={{ fontSize: 44, fontWeight: 800, marginTop: 6 }}>
            {fmtDecimals(totalSupply)}
          </div>

          <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>
            {totalPhysical.toLocaleString()} physical circles
          </div>
          <div style={{ opacity: 0.65, fontSize: 15 }}>
            {totalSheets.toLocaleString()} full sheets
          </div>
        </div>

        {/* CIRCULATING */}
        <div>
          <div style={{ opacity: 0.7, fontSize: 22 }}>Circulating Supply</div>
          <div style={{ fontSize: 44, fontWeight: 800, marginTop: 6 }}>
            {fmtDecimals(circulatingSupply)}
          </div>

          <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>
            {circulatingPhysical.toLocaleString()} physical circles
          </div>
          <div style={{ opacity: 0.65, fontSize: 15 }}>
            {circulatingSheets.toLocaleString()} full sheets
          </div>
        </div>
      </div>
    </main>
  );
}
