# Feathers Calculator — Reference & Validation Guide

Use this document to cross-check the calculator's output against known expected values.  
Levels run from **1 to 10**. All stat values below are taken directly from `feathers.json`.

---

## Stat Code Reference

| Code | Stat Name              |
|------|------------------------|
| 1    | Max HP                 |
| 2    | Max SP                 |
| 3    | PATK                   |
| 4    | MATK                   |
| 5    | PDEF                   |
| 6    | MDEF                   |
| 7    | HP Recover             |
| 8    | SP Recover             |
| 9    | Hit                    |
| 10   | Flee                   |
| 11   | PATK/MATK              |
| 12   | Ignore PDEF            |
| 13   | Ignore MDEF            |
| 14   | PVP DMG Bonus          |
| 15   | PVE DMG Bonus          |
| 16   | PVP DMG Reduction      |
| 17   | PVE DMG Reduction      |
| 18   | PDMG/MDMG %            |
| 19   | PDMG/MDMG Reduction %  |
| 91   | STR                    |
| 92   | INT                    |
| 93   | VIT                    |
| 94   | AGI                    |
| 95   | DEX                    |
| 96   | LUK                    |

---

## Feather Upgrade Cost Tiers

Each feather has a `costTier` that maps to this cumulative cost array (index = level − 1):

| Cost Tier | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|-----------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| 2 (Purple base) | 1 | 3 | 6 | 10 | 15 | 21 | 28 | 40 | 56 | 84 |
| 3 (MIX Purple)  | 1 | 9 | 19 | 31 | 47 | 67 | 91 | 121 | 155 | 195 |
| 4 (Gold tier 4) | 1 | 5 | 11 | 18 | 27 | 37 | 49 | 62 | 77 | 99 |
| 5 (Gold tier 5) | 1 | 5 | 11 | 18 | 27 | 37 | 49 | 62 | 77 | 99 |
| 6 (Gold high)   | 1 | 7 | 15 | 25 | 37 | 51 | 67 | 85 | 105 | 133 |
| 7 (MIX Gold)    | 1 | 10 | 21 | 34 | 49 | 66 | 85 | 106 | 129 | 161 |

> **Note:** Tiers 4 and 5 share the same cost array in the current data. Verify whether this is intentional.

---

## ATK Feathers

### Space — Gold · Cost Tier 6

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PVP DMG Bonus    | 8   | 10  | 14  | 16  | 18  | 22  | 24  | 28  | 30  | 32   |
| PATK/MATK        | 7   | 10  | 12  | 15  | 17  | 20  | 23  | 25  | 28  | 30   |
| Ignore PDEF      | 12  | 20  | 28  | 36  | 44  | 52  | 60  | 68  | 76  | 84   |
| Ignore MDEF      | 3   | 5   | 7   | 9   | 11  | 13  | 15  | 17  | 19  | 21   |

### Time — Gold · Cost Tier 6

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PVE DMG Bonus    | 17  | 24  | 31  | 38  | 45  | 52  | 59  | 66  | 73  | 80   |
| PATK/MATK        | 7   | 10  | 12  | 15  | 17  | 20  | 23  | 25  | 28  | 30   |
| Ignore PDEF      | 12  | 20  | 28  | 36  | 44  | 52  | 60  | 68  | 76  | 84   |
| Ignore MDEF      | 3   | 5   | 7   | 9   | 11  | 13  | 15  | 17  | 19  | 21   |

### Day — Gold · Cost Tier 5

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Ignore PDEF      | 8   | 16  | 24  | 28  | 36  | 40  | 48  | 56  | 60  | 68   |
| Ignore MDEF      | 2   | 4   | 6   | 7   | 9   | 10  | 12  | 14  | 15  | 17   |
| PVE DMG Bonus    | 12  | 15  | 18  | 21  | 24  | 28  | 31  | 34  | 37  | 40   |

### Sky — Gold · Cost Tier 4

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK        | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 16  | 18  | 20   |
| Ignore PDEF      | 4   | 8   | 12  | 16  | 20  | 24  | 28  | 32  | 36  | 40   |
| Ignore MDEF      | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

### Faith — Purple · Cost Tier 2

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| INT              | 1   | 1   | 2   | 2   | 3   | 3   | 4   | 4   | 5   | 5    |
| PATK/MATK        | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

### Glory — Purple · Cost Tier 2

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| DEX              | 1   | 1   | 2   | 2   | 3   | 3   | 4   | 4   | 5   | 5    |
| PATK/MATK        | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

### Valor — Purple · Cost Tier 2

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| STR              | 1   | 1   | 2   | 2   | 3   | 3   | 4   | 4   | 5   | 5    |
| PATK/MATK        | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

---

## DEF Feathers

### Divine — Gold · Cost Tier 6

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PVP DMG Reduction   | 8   | 10  | 14  | 16  | 18  | 22  | 24  | 28  | 30  | 32   |
| PDEF                | 6   | 12  | 16  | 22  | 26  | 32  | 38  | 42  | 48  | 52   |
| MDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 14  | 16  | 18   |
| Max HP              | 108 | 156 | 204 | 252 | 300 | 348 | 396 | 444 | 492 | 540  |

### Nature — Gold · Cost Tier 6

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PVE DMG Reduction   | 17  | 24  | 31  | 38  | 45  | 52  | 59  | 66  | 73  | 80   |
| PDEF                | 6   | 12  | 16  | 22  | 26  | 32  | 38  | 42  | 48  | 52   |
| MDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 14  | 16  | 18   |
| Max HP              | 108 | 156 | 204 | 252 | 300 | 348 | 396 | 444 | 492 | 540  |

### Night — Gold · Cost Tier 5

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PDEF                | 4   | 8   | 12  | 14  | 18  | 20  | 24  | 28  | 30  | 34   |
| MDEF                | 1   | 3   | 5   | 7   | 9   | 11  | 13  | 15  | 17  | 19   |
| PVE DMG Reduction   | 12  | 15  | 18  | 21  | 24  | 28  | 31  | 34  | 37  | 40   |

### Terra — Gold · Cost Tier 4

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 16  | 18  | 20   |
| MDEF                | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |
| Max HP              | 33  | 66  | 99  | 132 | 165 | 198 | 231 | 264 | 297 | 330  |

### Soul — Purple · Cost Tier 2

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 16  | 18  | 20   |
| MDEF                | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

### Mercy — Purple · Cost Tier 2

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 16  | 18  | 20   |
| Max HP              | 20  | 30  | 40  | 50  | 60  | 70  | 80  | 90  | 100 | 110  |

### Virtue — Purple · Cost Tier 2

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| VIT                 | 1   | 1   | 2   | 2   | 3   | 3   | 4   | 4   | 5   | 5    |
| Max HP              | 20  | 30  | 40  | 50  | 60  | 70  | 80  | 90  | 100 | 110  |

---

## MIX Feathers

> MIX feathers are compatible with **both ATK and DEF sets**.

### Dark — Gold · Cost Tier 7

| Stat                     | Lv1  | Lv2  | Lv3  | Lv4  | Lv5  | Lv6  | Lv7  | Lv8  | Lv9  | Lv10 |
|--------------------------|------|------|------|------|------|------|------|------|------|------|
| PVP DMG Bonus            | 11   | 16   | 22   | 27   | 33   | 38   | 44   | 49   | 55   | 60   |
| PVP DMG Reduction        | 11   | 16   | 22   | 27   | 33   | 38   | 44   | 49   | 55   | 60   |
| PATK/MATK                | 9    | 12   | 15   | 18   | 21   | 24   | 27   | 30   | 33   | 36   |
| PDMG/MDMG Reduction %    | 0.28 | 0.36 | 0.44 | 0.52 | 0.60 | 0.68 | 0.76 | 0.84 | 0.92 | 1.00 |

### Light — Gold · Cost Tier 7

| Stat                | Lv1  | Lv2  | Lv3  | Lv4  | Lv5  | Lv6  | Lv7  | Lv8  | Lv9  | Lv10 |
|---------------------|------|------|------|------|------|------|------|------|------|------|
| PVP DMG Bonus       | 11   | 16   | 22   | 27   | 33   | 38   | 44   | 49   | 55   | 60   |
| PVP DMG Reduction   | 11   | 16   | 22   | 27   | 33   | 38   | 44   | 49   | 55   | 60   |
| PATK/MATK           | 9    | 12   | 15   | 18   | 21   | 24   | 27   | 30   | 33   | 36   |
| PDMG/MDMG %         | 0.28 | 0.36 | 0.44 | 0.52 | 0.60 | 0.68 | 0.76 | 0.84 | 0.92 | 1.00 |

### Order — Purple · Cost Tier 3

| Stat                | Lv1  | Lv2  | Lv3  | Lv4  | Lv5  | Lv6  | Lv7  | Lv8  | Lv9  | Lv10 |
|---------------------|------|------|------|------|------|------|------|------|------|------|
| PDMG/MDMG %         | 0.23 | 0.28 | 0.32 | 0.36 | 0.40 | 0.44 | 0.48 | 0.52 | 0.56 | 0.60 |
| PDEF                | 2    | 4    | 6    | 8    | 10   | 12   | 14   | 16   | 18   | 20   |

### Truth — Purple · Cost Tier 3

| Stat                | Lv1  | Lv2  | Lv3  | Lv4  | Lv5  | Lv6  | Lv7  | Lv8  | Lv9  | Lv10 |
|---------------------|------|------|------|------|------|------|------|------|------|------|
| PDMG/MDMG %         | 0.23 | 0.28 | 0.32 | 0.36 | 0.40 | 0.44 | 0.48 | 0.52 | 0.56 | 0.60 |
| PATK/MATK           | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   |

### Justice — Purple · Cost Tier 2

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PDEF                | 2   | 4   | 6   | 8   | 10  | 12  | 14  | 16  | 18  | 20   |
| PATK/MATK           | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |

### Grace — Purple · Cost Tier 2

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK           | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10   |
| MAX HP              | 20  | 30  | 40  | 50  | 60  | 70  | 80  | 90  | 100 | 110  |

---

## Set Bonuses

A set bonus activates when 5 feathers in a set match the tier composition required.  
The set bonus level equals the **lowest level among the 5 feathers** in that set.  
`setBonusesGrouped` bonuses are additive % boosts applied to the base stat total.

### ATK Set Bonuses

#### Raven's Hour (ATK) — 4 Gold + 1 Purple

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK        | 13  | 18  | 23  | 28  | 33  | 38  | 43  | 48  | 53  | 58   |
| PVP DMG Bonus    | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33  | 36  | 39   |

**Grouped % bonuses (applied to base totals):**
- Attack Stats (Ignore PDEF, Ignore MDEF, PATK/MATK, PDMG/MDMG %): +10–20%
- PvE Stats (PVE DMG Reduction, PVE DMG Bonus): +30–60%
- PvP Stats (PVP DMG Reduction, PVP DMG Bonus): +30–60%

#### Raven's Prestige (ATK) — 3 Gold + 2 Purple

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK        | 12  | 16  | 20  | 24  | 28  | 32  | 36  | 40  | 44  | 48   |
| PVP DMG Bonus    | 9   | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33  | 36   |

**Grouped % bonuses:**
- Attack Stats: +10–20%
- PvE Stats: +30–60%

#### Raven's Plunder (ATK) — 2 Gold + 3 Purple

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK        | 11  | 14  | 17  | 20  | 23  | 26  | 29  | 32  | 35  | 38   |
| PVP DMG Reduction| 6   | 9   | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33   |

**Grouped % bonuses:**
- Attack Stats: +10–20%
- PvE Stats: +30–60%

#### Raven's Edge (ATK) — 1 Gold + 4 Purple

| Stat             | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| PATK/MATK        | 10  | 12  | 14  | 16  | 18  | 20  | 22  | 24  | 26  | 28   |

**Grouped % bonuses:**
- Attack Stats: +10–20%

---

### DEF Set Bonuses

#### Raven's Hour (DEF) — 4 Gold + 1 Purple

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Max HP              | 110 | 200 | 290 | 380 | 470 | 560 | 650 | 740 | 830 | 920  |
| PVP DMG Reduction   | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33  | 36  | 39   |

**Grouped % bonuses:**
- Defense Stats (PDEF, MDEF, Max HP, PDMG/MDMG Reduction %): +10–20%
- PvE Stats: +30–60%
- PvP Stats: +30–60%

#### Raven's Prestige (DEF) — 3 Gold + 2 Purple

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Max HP              | 100 | 180 | 260 | 340 | 420 | 500 | 580 | 660 | 740 | 820  |
| PVP DMG Reduction   | 9   | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33  | 36   |

**Grouped % bonuses:**
- Defense Stats: +10–20%
- PvE Stats: +30–60%

#### Raven's Plunder (DEF) — 2 Gold + 3 Purple

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Max HP              | 90  | 160 | 230 | 300 | 370 | 440 | 510 | 580 | 650 | 720  |
| PVP DMG Reduction   | 6   | 9   | 12  | 15  | 18  | 21  | 24  | 27  | 30  | 33   |

**Grouped % bonuses:**
- Attack Stats: +10–20%
- PvE Stats: +30–60%

#### Raven's Edge (DEF) — 1 Gold + 4 Purple

| Stat                | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | Lv7 | Lv8 | Lv9 | Lv10 |
|---------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Max HP              | 80  | 140 | 200 | 260 | 320 | 380 | 440 | 500 | 560 | 620  |

**Grouped % bonuses:**
- Defense Stats: +10–20%

---

## Calculation Rules

### Base Stat Aggregation

For a set of 5 feathers, the total for a given stat is:

$$\text{total} = \sum_{i=1}^{5} \text{statValue}[\text{level}_i - 1]$$

### Set Bonus Level

$$\text{setBonusLevel} = \min(\text{level}_1, \text{level}_2, \text{level}_3, \text{level}_4, \text{level}_5)$$

### Grouped Bonus Application

The grouped bonus multiplies the feather-only subtotal (before flat set stat bonuses):

$$\text{boosted} = \text{base} \times \left(1 + \frac{\text{statBonus}[\text{setBonusLevel} - 1]}{100}\right)$$

### Flat Set Stat Application

After grouped bonuses are applied, flat set stats are added:

$$\text{final} = \text{boosted} + \text{flatSetBonus}$$

### Set Tier Requirement Check

Count how many feathers in the set are **Gold** vs **Purple** (MIX feathers count as whichever tier they are — currently Gold or Purple). The first matching set bonus from the list (in descending Gold count) is applied.

---

## Test Cases

Use these manually verified examples to validate the calculator output.

### Test 1 — Single ATK set, all Lv10, Space + Time + Day + Sky + Valor (Raven's Hour)

**Setup:** 4 Gold (Space, Time, Day, Sky) + 1 Purple (Valor), all at Level 10.  
**Set bonus:** Raven's Hour (ATK), bonus level = 10.

**Expected base stats before grouped bonus:**

| Stat             | Space | Time | Day | Sky | Valor | Total |
|------------------|-------|------|-----|-----|-------|-------|
| PVP DMG Bonus    | 32    | —    | —   | —   | —     | 32    |
| PVE DMG Bonus    | —     | 80   | 40  | —   | —     | 120   |
| PATK/MATK        | 30    | 30   | —   | 20  | 10    | 90    |
| Ignore PDEF      | 84    | 84   | 68  | 40  | —     | 276   |
| Ignore MDEF      | 21    | 21   | 17  | 10  | —     | 69    |
| STR              | —     | —    | —   | —   | 5     | 5     |

**Grouped bonus at Lv10 (+20% to Attack Stats: Ignore PDEF, Ignore MDEF, PATK/MATK, PDMG/MDMG %):**
- PATK/MATK after grouped: 90 × 1.20 = **108**
- Ignore PDEF after grouped: 276 × 1.20 = **331**
- Ignore MDEF after grouped: 69 × 1.20 = **82**

**Grouped bonus at Lv10 (+60% to PvE Stats: PVE DMG Bonus):**
- PVE DMG Bonus after grouped: 120 × 1.60 = **192**

**Grouped bonus at Lv10 (+60% to PvP Stats: PVP DMG Bonus):**
- PVP DMG Bonus after grouped: 32 × 1.60 = **51**

**Set bonus flat stats at Lv10 (added after grouped):**
- PATK/MATK: 108 + 58 = **166**
- PVP DMG Bonus: 51 + 39 = **90**

> ⬜ **Result:** _[fill in actual calculator output here]_

---

### Test 2 — Single DEF set, all Lv10, Divine + Nature + Night + Terra + Soul (Raven's Hour)

**Setup:** 4 Gold (Divine, Nature, Night, Terra) + 1 Purple (Soul), all at Level 10.  
**Set bonus:** Raven's Hour (DEF), bonus level = 10.

**Expected base stats before grouped bonus:**

| Stat                | Divine | Nature | Night | Terra | Soul | Total |
|---------------------|--------|--------|-------|-------|------|-------|
| PVP DMG Reduction   | 32     | —      | —     | —     | —    | 32    |
| PVE DMG Reduction   | —      | 80     | 40    | —     | —    | 120   |
| PDEF                | 52     | 52     | 34    | 20    | 20   | 178   |
| MDEF                | 18     | 18     | 19    | 10    | 10   | 75    |
| Max HP              | 540    | 540    | —     | 330   | —    | 1410  |

**Grouped bonus at Lv10 (+20% Defense Stats: PDEF, MDEF, Max HP, PDMG/MDMG Reduction %):**
- PDEF: 178 × 1.20 = **213**
- MDEF: 75 × 1.20 = **90**
- Max HP: 1410 × 1.20 = **1692**

**Grouped bonus at Lv10 (+60% PvP Stats: PVP DMG Reduction):**
- PVP DMG Reduction: 32 × 1.60 = **51**

**Grouped bonus at Lv10 (+60% PvE Stats: PVE DMG Reduction):**
- PVE DMG Reduction: 120 × 1.60 = **192**

**Set bonus flat stats at Lv10 (added after grouped):**
- Max HP: 1692 + 920 = **2612**
- PVP DMG Reduction: 51 + 39 = **90**

> ⬜ **Result:** _[fill in actual calculator output here]_

---

### Test 3 — Mixed levels with Lv1 set bonus scaling

**Setup (ATK):** Space Lv5, Sky Lv3, Faith Lv10, Glory Lv1, Valor Lv10  
**Tier composition:** Gold, Gold, Purple, Purple, Purple → Raven's Plunder (ATK)

**Expected base stats before grouped bonus:**

| Stat                | Space  | Sky | Faith | Glory | Valor | Total |
|---------------------|--------|-----|-------|-------|-------|-------|
| PVP DMG Bonus       | 18     | —   | —     | —     | —     | 18    |
| DEX                 | —      | —   | —     | 1     | —     | 1     |
| STR                 | —      | —   | —     | —     | 5     | 5     |
| Ignore PDEF         | 44     | 12  | —     | —     | —     | 56    |
| Ignore MDEF         | 11     | 3   | —     | —     | —     | 14    |
| INT                 | —      | —   | 5     | —     | —     | 5     |
| PATK/MATK           | 17     | 6   | 10    | 1     | 10    | 44    |

**Set bonus level** = min(5, 3, 10, 1, 10) = **1**

**Grouped bonus at Lv1 (+10% to Attack Stats: Ignore PDEF, Ignore MDEF, PATK/MATK, PDMG/MDMG %):**
- PATK/MATK after grouped: 44 × 1.10 = floor(48.4) = **48**
- Ignore PDEF after grouped: 56 × 1.10 = floor(61.6) = **61**
- Ignore MDEF after grouped: 14 × 1.10 = floor(15.4) = **15**

**Set bonus flat stats at Lv1 (added after grouped):**
- PATK/MATK: 48 + 11 = **59**
- PVP DMG Bonus: 18 + 6 = **24**

> ⬜ **Result:** _[fill in actual calculator output here]_
- PVP DMG Bonus = **24**
- DEX = **1**
- STR = **5**
- Ignore PDEF = **61**
- Ignore MDEF = **15**
- INT = **5**
- PATK/MATK = **59**


---

## Open Questions / Known Issues

| # | Issue | Status |
|---|-------|--------|
| 1 | Cost tiers 4 and 5 have identical cost arrays — confirm this is intentional | yes |
| 2 | Rounding behavior for grouped bonus calculations (floor / round / ceil?) — confirm expected precision | floor |
| 3 | Dark feather has PDMG/MDMG **Reduction %** (code 19), Light has PDMG/MDMG **%** (code 18) — confirm this asymmetry is intentional | yes, this is a different stat. this decreases incoming damages |

---

*Last updated: 2026-05-08 — auto-generated from `feathers.json` and `feathersSetBonus.json`*
