import { Connection, PublicKey } from "@solana/web3.js";

const MINT_ADDRESS = "Aea8zJW7jp1wkct3BjMeekBC1RQnHQyrvNutigc3pump";

let cachedValue: number | null = null;
let cachedAt = 0;
const TTL_MS = 60_000;

export async function GET() {
  try {
    // cache fast path
    if (cachedValue !== null && Date.now() - cachedAt < TTL_MS) {
      return Response.json(
        { circulating_supply: cachedValue },
        {
          status: 200,
          headers: {
            "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");

    const mint = new PublicKey(MINT_ADDRESS);

    // UI amount already accounts for decimals
    const supplyResp = await connection.getTokenSupply(mint);
    const uiAmountString = supplyResp.value.uiAmountString;

    const circulating = Number(uiAmountString);

    if (!Number.isFinite(circulating)) {
      return Response.json(
        { error: "Invalid circulating supply", uiAmountString },
        { status: 500 }
      );
    }

    cachedValue = circulating;
    cachedAt = Date.now();

    return Response.json(
      { circulating_supply: circulating },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    return Response.json(
      {
        error: "Failed to fetch circulating supply",
        detail: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}

