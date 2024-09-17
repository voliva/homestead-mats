import { NextResponse } from "next/server";
import { fiber, metal, wood, type Conversion } from "../data";

const FIBER_ID = 102306;
const WOOD_ID = 103049;
const METAL_ID = 102205;
export async function GET() {
  console.log("get items");

  const allIds = [
    ...Object.keys(wood),
    ...Object.keys(metal),
    ...Object.keys(fiber),
    FIBER_ID,
    WOOD_ID,
    METAL_ID,
  ].map((v) => Number(v));

  const result = await fetch(
    `https://api.guildwars2.com/v2/items?ids=${allIds.join(",")}`
  ).then((r) => r.json());
  const itemInfoById: Record<string | number, any> = {};
  result.forEach((info: any) => (itemInfoById[info.id] = info));

  function getInfo(conversion: Conversion, id: number) {
    return {
      name: itemInfoById[id]?.name,
      icon: itemInfoById[id]?.icon,
      recipes: Object.entries(conversion).map(([id, rates]) => ({
        id: Number(id),
        name: itemInfoById[id]?.name,
        icon: itemInfoById[id]?.icon,
        rates,
      })),
    };
  }

  return NextResponse.json({
    wood: getInfo(wood, WOOD_ID),
    metal: getInfo(metal, METAL_ID),
    fiber: getInfo(fiber, FIBER_ID),
  });
}

// Revalidate every day
export const revalidate = 60 * 60 * 24;
