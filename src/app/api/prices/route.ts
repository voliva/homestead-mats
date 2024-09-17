import { NextResponse } from "next/server";
import { fiber, metal, wood } from "../data";

export async function GET() {
  console.log("get prices");

  const allIds = [
    ...Object.keys(wood),
    ...Object.keys(metal),
    ...Object.keys(fiber),
  ].map((v) => Number(v));

  const result = await fetch(
    `http://api.guildwars2.com/v2/commerce/prices?ids=${allIds.join(",")}`
  ).then((r) => r.json());

  return NextResponse.json(
    result.map((item: any) => ({
      id: item.id,
      buy: item.buys.unit_price,
      sell: item.sells.unit_price,
    }))
  );
}

// Revalidate every 5 minutes
export const revalidate = 60 * 5;
