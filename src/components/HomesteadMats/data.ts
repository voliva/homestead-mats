import { state, type StateObservable } from "@react-rxjs/core";
import { from, retry, switchMap, timer } from "rxjs";

export interface ItemInfo {
  icon: string;
  name: string;
}

export const getRateValue = (rate: Rate) =>
  typeof rate === "number" ? rate : rate[1] / rate[0];
export const getRateAmount = (rate: Rate) =>
  typeof rate === "number" ? 1 : rate[0];
export type Rate = number | [number, number];
export interface ItemRecipe extends ItemInfo {
  id: number;
  rates: [Rate, Rate, Rate];
}

export type HomesteadItemRecipes = ItemInfo & {
  recipes: Array<ItemRecipe>;
};

export type MatName = "fiber" | "metal" | "wood";

export const items$: StateObservable<{
  fiber: HomesteadItemRecipes;
  metal: HomesteadItemRecipes;
  wood: HomesteadItemRecipes;
}> = state(
  from(fetch("/api/items")).pipe(
    switchMap((v) => v.json()),
    retry({
      delay: 5000,
      count: 12,
    })
  )
);

export interface ItemPrice {
  id: number;
  buy: number;
  sell: number;
}
export const prices$: StateObservable<ItemPrice[]> = state(
  timer(0, 5 * 60000).pipe(
    switchMap(() => fetch("/api/prices")),
    switchMap((v) => v.json()),
    retry({
      delay: 5000,
      count: 12,
    })
  )
);
