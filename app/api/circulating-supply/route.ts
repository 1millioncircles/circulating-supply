import { Connection, PublicKey } from "@solana/web3.js";

export const runtime = "nodejs";

const MINT_ADDRESS = "Aea8zJW7jp1wkct3BjMeekBC1RQnHQyrvNutigc3pump";

// Streamflow vault token accounts
const STREAMFLOW_VAULTS: string[] = [
  "3D3M6tuDkrfpcamyN9Sd6BpxWpQXtqgj9EH4zhhvUauF",
  "FDnZoR6TfTrdtHoJ3LnxdWuKu7AmVLqHNyncB15Kc3L5",
  "saRxDE8f2TYsU8TkiZkRyZntXWht9wTbcmsrqdS6dcF",
  "2nDKbjB5ztsewvUfXF3GuEbFhDFVxDQrTkHZ9ExiwPt6",
  "DBm691avcmV45wTKhyEq2T1g1pHYuKjrQ1k2EKwCwoq3",
  "2LAk19b53kdGyvYq6igWr1QucMq2kDp9Vi8JMjiBTqVQ",
  "8cUrCtsnf3orqo94fDAgWWXVK6GY3yH68Wub3RdbiwEA",
];

let cached:
  | { total_supply: number; locked_supply: number; circulating_supply: number }
  | null = null;
let cachedAt = 0;
const TTL_MS = 60_000;

async function getVaultUiBalance(
  connection: Connection,
  vault: PublicKey,
  mint: PublicKey
): Promise<number> {
  // Verify it is a token account and for the correct mint
  const info = await connection.getParsedAccountInfo(vault);
  const parsed: any = info.value?.data;

  const mintOnAcct = parsed?.parsed?.info?.mint;
  if (mintOnAcct && mintOnAcct !== mint.toBase58()) return 0;

  // If it's not a token account, this may throw; caller will catch
  const bal = await connection.getTokenAccountBalance(vault);
  const n = Number(bal.value.uiAmountString);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    if (cached && Date.now() - cachedAt < TTL_MS) {
      return Response.json(cached, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    }

    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");

    const mint = new PublicKey(MINT_ADDRESS);

    // Total supply (post-burn) from mint
    const supplyResp = await connection.getTokenSupply(mint);
    const total = Number(supplyResp.value.uiAmountString);

    if (!Number.isFinite(total)) {
      throw new Error("Total supply is not a finite number");
    }

    // Sum locked balances across vault token accounts
    let locked = 0;

    for (const s of STREAMFLOW_VAULTS) {
      try {
        locked += await getVaultUiBalance(connection, new PublicKey(s), mint);
      } catch {
        // If a vault address isn't a token account, ignore it (treat as 0)
        // This prevents the endpoint from failing hard.
      }
    }

    const circulating = Math.max(total - locked, 0);

    cached = {
      total_supply: total,
      locked_supply: locked,
      circulating_supply: circulating,
    };
    cachedAt = Date.now();

    return Response.json(cached, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err: any) {
    return Response.json(
      { error: "Failed to compute supply", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
