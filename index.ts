type Rate = number | [number, number];
type Conversion = {
  [id: number]: {
    name: string;
    rate: [Rate, Rate, Rate];
  };
};

// How many spend per unit received
const getRateValue = (rate: Rate) =>
  typeof rate === "number" ? rate : rate[1] / rate[0];
const getAmountReceived = (rate: Rate) =>
  typeof rate === "number" ? 1 : rate[0];

const wood: Conversion = {
  19723: { name: "Green Wood Log", rate: [20, 10, 5] },
  19726: { name: "Seasoned Wood Log", rate: [12, 6, 3] },
  19727: { name: "Seasoned Wood Log", rate: [4, 2, 1] },
  19724: { name: "Hard Wood Log", rate: [4, 2, 1] },
  19722: { name: "Elder Wood Log", rate: [4, 2, 1] },
  19725: { name: "Ancient Wood Log", rate: [2, 1, [2, 1]] },
};

const metal: Conversion = {
  19702: { name: "Platinum Ore", rate: [2, 1, [2, 1]] },
  19697: { name: "Copper Ore", rate: [8, 4, 2] },
  19700: { name: "Mithril Ore", rate: [4, 2, 1] },
  19701: { name: "Orichalcum Ore", rate: [2, 1, [2, 1]] },
  19703: { name: "Silver Ore", rate: [20, 10, 5] },
  19698: { name: "Gold Ore", rate: [8, 4, 2] },
  19699: {
    name: "Iron Ore",
    rate: [
      [2, 4],
      [2, 2],
      [2, 1],
    ],
  },
};

const rt = (s: number): [Rate, Rate, Rate] => [
  s,
  s / 2,
  s >= 4 ? s / 4 : [2, s / 2],
];
const fiber: Conversion = {
  12246: { name: "Parsley Leaf", rate: rt(4) },
  36731: { name: "Passion Fruit", rate: rt(20) },
  12330: { name: "Zucchini", rate: rt(8) },
  12544: { name: "Ghost Pepper", rate: rt(4) },
  12162: { name: "Turnip", rate: rt(48) },
  73113: { name: "Cassava Root", rate: rt(4) },
  12238: { name: "Head of Lettuce", rate: rt(2) },
  12255: { name: "Blueberry", rate: rt(8) },
  12538: { name: "Sugar Pumpkin", rate: rt(32) },
  12545: { name: "Orrian Truffle", rate: rt(2) },
  12334: { name: "Portobello Mushroom", rate: rt(13) },
  12547: { name: "Saffron Thread", rate: rt(2) },
  12243: { name: "Sage Leaf", rate: rt(2) },
  12248: { name: "Thyme Leaf", rate: rt(4) },
  12511: { name: "Butternut Squash", rate: rt(28) },
  12537: { name: "Blackberry", rate: rt(4) },
  73096: { name: "Pile of Allspice Berries", rate: rt(4) },
  12332: { name: "Head of Cabbage", rate: rt(40) },
  12508: { name: "Leek", rate: rt(28) },
  12142: { name: "Onion", rate: rt(4) },
  12147: { name: "Mushroom", rate: rt(4) },
  12535: { name: "Rutabaga", rate: rt(4) },
  73504: { name: "Sawgill Mushroom", rate: rt(24) },
  12336: { name: "Dill Sprig", rate: rt(40) },
  66524: { name: "Nopal", rate: rt(24) },
  12241: { name: "Spinach Leaf", rate: rt(4) },
  12331: { name: "Chili Pepper", rate: rt(8) },
  12504: { name: "Cayenne Pepper", rate: rt(4) },
  12532: { name: "Head of Cauliflower", rate: rt(32) },
  82866: { name: "Handful of Red Lentils", rate: rt(4) },
  12341: { name: "Grape", rate: rt(32) },
  12254: { name: "Raspberry", rate: rt(2) },
  12135: { name: "Potato", rate: rt(8) },
  12134: { name: "Carrot", rate: rt(4) },
  12512: { name: "Artichoke", rate: rt(28) },
  12509: { name: "Seaweed", rate: rt(2) },
  12335: { name: "Rosemary Sprig", rate: rt(4) },
  66522: { name: "Prickly Pear", rate: rt(24) },
  12253: { name: "Strawberry", rate: rt(4) },
  12163: { name: "Head of Garlic", rate: rt(4) },
  12546: { name: "Lemongrass", rate: rt(16) },
  12536: { name: "Mint Leaf", rate: rt(28) },
  12510: { name: "Lotus Root", rate: rt(16) },
  12333: { name: "Kale Leaf", rate: rt(4) },
  12534: { name: "Clove", rate: rt(4) },
  12247: { name: "Bay Leaf", rate: rt(32) },
  12236: { name: "Black Peppercorn", rate: rt(2) },
  12505: { name: "Asparagus Spear", rate: rt(4) },
  12144: { name: "Snow Truffle", rate: rt(8) },
  12342: { name: "Sesame Seed", rate: rt(8) },
  74090: { name: "Pile of Flax Seeds", rate: rt(2) },
  12161: { name: "Beet", rate: rt(60) },
  12506: { name: "Tarragon Leaves", rate: rt(4) },
  12234: { name: "Vanilla Bean", rate: rt(2) },
  12533: { name: "Green Onion", rate: rt(24) },
  12128: { name: "Omnomberry", rate: rt(4) },
  12329: { name: "Yam", rate: rt(32) },
  12507: { name: "Parsnip", rate: rt(28) },
  12244: { name: "Oregano Leaf", rate: rt(40) },
};

const efficiency = 2;

getBestMat(wood).then(logResults);
getBestMat(metal).then(logResults);
getBestMat(fiber).then((r) => logResults(r.slice(0, 15)));

async function getBestMat(conversion: Conversion) {
  const items = Object.entries(conversion).map(([id, value]) => ({
    ...value,
    id: Number(id),
  }));

  const priceInfo = await fetch(
    `http://api.guildwars2.com/v2/commerce/prices?ids=${items
      .map((v) => v.id)
      .join(",")}`
  ).then((r) => r.json());
  const priceInfoById: Record<number, any> = {};
  priceInfo.forEach((info: any) => (priceInfoById[info.id] = info));

  const withPrices = items.map((item) => ({
    ...item,
    price: priceInfoById[item.id]
      ? {
          buy:
            priceInfoById[item.id].buys.unit_price *
            getRateValue(item.rate[efficiency]),
          sell:
            priceInfoById[item.id].sells.unit_price *
            getRateValue(item.rate[efficiency]),
        }
      : null,
  }));

  return withPrices.sort((a, b) => {
    const aEf = getAmountReceived(a.rate[efficiency]);
    const bEf = getAmountReceived(b.rate[efficiency]);
    if (aEf > 1 && bEf == 1) {
      return -1;
    }
    if (aEf == 1 && bEf > 1) {
      return 1;
    }
    if (!a.price) return 1;
    if (!b.price) return -1;

    return a.price.buy - b.price.buy;
  });
}

function logResults(withPrices: Awaited<ReturnType<typeof getBestMat>>) {
  console.table(
    Object.fromEntries(
      withPrices.map((v) => {
        const amount = getAmountReceived(v.rate[efficiency]);

        return [
          v.name,
          v.price
            ? `${amount} for ${formatCcy(v.price.buy)} - ${formatCcy(
                v.price.sell
              )} each`
            : null,
        ];
      })
    )
  );
}

function formatCcy(value: number) {
  const strValue = String(Math.round(value));
  let l = strValue.length;
  const [gold, rest] =
    l > 4 ? [strValue.slice(0, l - 4), strValue.slice(l - 4)] : ["0", strValue];

  l = rest.length;
  const [silver, copper] =
    l > 2
      ? [strValue.slice(0, l - 2).padStart(2, "0"), strValue.slice(l - 2)]
      : ["00", strValue];
  return `${gold},${silver},${copper}`;
}
