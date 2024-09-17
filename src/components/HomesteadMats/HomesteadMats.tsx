"use client";

import { Suspense, type FC } from "react";
import {
  getRateAmount,
  getRateValue,
  items$,
  prices$,
  type ItemPrice,
  type MatName,
  type Rate,
} from "./data";
import { state, Subscribe, useStateObservable } from "@react-rxjs/core";
import { createKeyedSignal } from "@react-rxjs/utils";
import { combineLatest, map, of, startWith, tap } from "rxjs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import "./ToggleButton.css";

export const HomesteadMats = () => {
  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold text-center my-2">
        Homestead Refined Materials
      </h1>
      <p>
        This tool shows the price per unit for each of the refined materials of
        the GW2 homestead, by getting each of the material prices and dividing
        by amount produced.
      </p>
      <p>
        You can set your efficiency levels for each one of the materials to show
        accurate price per unit and amounts.
      </p>
      <Subscribe fallback={null}>
        <div className="flex flex-wrap gap-2 justify-center">
          <HomesteadMat mat="metal" />
          <HomesteadMat mat="wood" />
          <HomesteadMat mat="fiber" />
        </div>
      </Subscribe>
    </div>
  );
};

const itemInfo$ = state((mat: MatName) => items$.pipe(map((v) => v[mat])));
const [matEfficiencyChange$, setMatEfficiency] = createKeyedSignal<
  MatName,
  number
>();
const matEfficiency$ = state(
  (mat: MatName) =>
    matEfficiencyChange$(mat).pipe(
      tap((v) => localStorage.setItem(`${mat}-efficiency`, String(v)))
    ),
  (mat) => {
    const stored = localStorage.getItem(`${mat}-efficiency`);
    return stored ? Number(stored) : 2;
  }
);

const HomesteadMat: FC<{
  mat: MatName;
}> = ({ mat }) => {
  const itemInfo = useStateObservable(itemInfo$(mat));
  const efficiency = useStateObservable(matEfficiency$(mat));

  return (
    <div className="p-2 rounded border">
      <h2 className="flex gap-2 items-center ">
        <img
          crossOrigin="anonymous"
          className="w-8"
          alt={mat}
          src={itemInfo.icon}
        />
        {itemInfo.name}
      </h2>
      <label className="flex items-center justify-center gap-2">
        Efficiency
        <ToggleGroup.Root
          type="single"
          className="ToggleGroup"
          value={String(efficiency)}
          onValueChange={(v) => setMatEfficiency(mat, Number(v))}
        >
          <ToggleGroup.Item className="ToggleGroupItem" value="0">
            1
          </ToggleGroup.Item>
          <ToggleGroup.Item className="ToggleGroupItem" value="1">
            2
          </ToggleGroup.Item>
          <ToggleGroup.Item className="ToggleGroupItem" value="2">
            3
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </label>
      <Suspense fallback="Loading prices...">
        <HomesteadMatPrices mat={mat} />
      </Suspense>
    </div>
  );
};

const priceById$ = prices$.pipeState(
  map((prices) => {
    const priceInfoById: Record<number, ItemPrice> = {};
    prices.forEach((info) => (priceInfoById[info.id] = info));
    return priceInfoById;
  })
);

const matPrices$ = state((mat: MatName) =>
  combineLatest({
    itemInfo: itemInfo$(mat),
    prices: priceById$,
    efficiency: matEfficiency$(mat),
  }).pipe(
    map(({ itemInfo, prices, efficiency }) =>
      itemInfo.recipes
        .map((recipe) => {
          const rate = recipe.rates[efficiency];
          const rateValue = getRateValue(rate);
          return {
            id: recipe.id,
            icon: recipe.icon,
            name: recipe.name,
            price:
              recipe.id in prices
                ? {
                    buy: prices[recipe.id].buy * rateValue,
                    sell: prices[recipe.id].sell * rateValue,
                  }
                : null,
            amount: getRateAmount(rate),
          };
        })
        .sort((a, b) => {
          if (!a.price) return 1;
          if (!b.price) return -1;

          return a.price.buy - b.price.buy;
        })
    )
  )
);

const HomesteadMatPrices: FC<{
  mat: MatName;
}> = ({ mat }) => {
  const recipes = useStateObservable(matPrices$(mat));

  return (
    <table className="border-separate border-spacing-2">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Amount</th>
          <th>Buy price</th>
          <th>Sell price</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id}>
            <td>
              <img
                crossOrigin="anonymous"
                alt="icon"
                src={recipe.icon}
                className="w-6"
              />
            </td>
            <td className="border-b">{recipe.name}</td>
            <td className="border-b text-center">{recipe.amount}</td>
            <td className="border-b text-right font-mono">
              {formatCcy(recipe.price?.buy)}
            </td>
            <td className="border-b text-right font-mono">
              {formatCcy(recipe.price?.sell)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function formatCcy(value?: number) {
  if (!value) return "-";

  const strValue = String(Math.round(value));
  let l = strValue.length;
  const [gold, rest] =
    l > 4 ? [strValue.slice(0, l - 4), strValue.slice(l - 4)] : ["0", strValue];

  l = rest.length;
  const [silver, copper] =
    l > 2
      ? [strValue.slice(0, l - 2).padStart(2, "0"), strValue.slice(l - 2)]
      : ["00", strValue];
  return `${gold} ${silver} ${copper}`;
}
