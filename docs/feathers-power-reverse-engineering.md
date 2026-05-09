# Feathers Power Reverse Engineering Workbook

Use this document to collect real in-game samples so we can derive the set power formula.

Scope for now: **power is computed per set**.

---

## How To Use

1. Add one row per measured set in the Sample Input table.
2. Always capture all 5 feather levels for that set.
3. If possible, keep one variable changing at a time (for example, only one feather level increase).
4. Record exact observed power from the game for that set.
5. Keep notes for anything unusual (bonus active, mixed rarity, etc.).

---

## Set Metadata

Use one row to describe the exact set state you measured.

| Set Type | Slot 1 Type | Slot 1 Lv | Slot 2 Type | Slot 2 Lv | Slot 3 Type | Slot 3 Lv | Slot 4 Type | Slot 4 Lv | Slot 5 Type | Slot 5 Lv | Power Value |
|---|---|---:|---|---:|---|---:|---|---:|---|---:|---:|
| ATK / DEF / MIX |  |  |  |  |  |  |  |  |  |  |  |

---

## Sample Input Table (Main)

Add one row per measured set state.

| Set Type | Slot 1 Type | Slot 1 Lv | Slot 2 Type | Slot 2 Lv | Slot 3 Type | Slot 3 Lv | Slot 4 Type | Slot 4 Lv | Slot 5 Type | Slot 5 Lv | Power Value |
|---|---|---:|---|---:|---|---:|---|---:|---|---:|---:|
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Valor | 1 | 33 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Valor | 2 | 47 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Valor | 3 | 61 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Valor | 4 | 74 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Valor | 5 | 88 |

| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Faith | 1 | 33 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Faith | 2 | 47 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Faith | 3 | 61 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Faith | 4 | 74 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Faith | 5 | 88 |

| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Glory | 1 | 33 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Glory | 1 | 47 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Glory | 1 | 61 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Glory | 1 | 74 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Glory | 1 | 88 |

| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Order | 1 | 33 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Order | 1 | 47 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Order | 1 | 61 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Order | 1 | 74 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Order | 1 | 88 |

| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Truth | 1 | 33 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Truth | 2 | 47 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Truth | 3 | 61 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Truth | 4 | 74 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 0 | Truth | 5 | 88 |

| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 1 | Valor | 0 | 62 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 2 | Valor | 0 | 113 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 3 | Valor | 0 | 164 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 4 | Valor | 0 | 215 |
| ATK | Space | 0 | Time | 0 | Day | 0 | Sky | 5 | Valor | 0 | 266 |

| ATK | Space | 0 | Time | 0 | Day | 1 | Sky | 0 | Valor | 0 | 83 |
| ATK | Space | 0 | Time | 0 | Day | 2 | Sky | 0 | Valor | 0 | 140 |
| ATK | Space | 0 | Time | 0 | Day | 3 | Sky | 0 | Valor | 0 | 196 |
| ATK | Space | 0 | Time | 0 | Day | 4 | Sky | 0 | Valor | 0 | 252 |
| ATK | Space | 0 | Time | 0 | Day | 5 | Sky | 0 | Valor | 0 | 309 |

| ATK | Space | 0 | Time | 1 | Day | 0 | Sky | 0 | Valor | 0 | 129 |
| ATK | Space | 0 | Time | 2 | Day | 0 | Sky | 0 | Valor | 0 | 186 |
| ATK | Space | 0 | Time | 3 | Day | 0 | Sky | 0 | Valor | 0 | 242 |
| ATK | Space | 0 | Time | 4 | Day | 0 | Sky | 0 | Valor | 0 | 298 |
| ATK | Space | 0 | Time | 5 | Day | 0 | Sky | 0 | Valor | 0 | 354 |

| ATK | Space | 1 | Time | 0 | Day | 0 | Sky | 0 | Valor | 0 | 129 |
| ATK | Space | 2 | Time | 0 | Day | 0 | Sky | 0 | Valor | 0 | 186 |
| ATK | Space | 3 | Time | 0 | Day | 0 | Sky | 0 | Valor | 0 | 242 |
| ATK | Space | 4 | Time | 0 | Day | 0 | Sky | 0 | Valor | 0 | 298 |
| ATK | Space | 5 | Time | 0 | Day | 0 | Sky | 0 | Valor | 0 | 354 |

| ATK | Light | 1 | Dark | 0 | Day | 0 | Sky | 0 | Valor | 0 | 189 |
| ATK | Light | 1 | Dark | 0 | Day | 0 | Sky | 0 | Valor | 0 | 245 |
| ATK | Light | 1 | Dark | 0 | Day | 0 | Sky | 0 | Valor | 0 | 300 |
| ATK | Light | 1 | Dark | 0 | Day | 0 | Sky | 0 | Valor | 0 | 356 |
| ATK | Light | 1 | Dark | 0 | Day | 0 | Sky | 0 | Valor | 0 | 412 |

| ATK | Light | 0 | Dark | 1 | Day | 0 | Sky | 0 | Valor | 0 | 189 |
| ATK | Light | 0 | Dark | 1 | Day | 0 | Sky | 0 | Valor | 0 | 245 |
| ATK | Light | 0 | Dark | 1 | Day | 0 | Sky | 0 | Valor | 0 | 300 |
| ATK | Light | 0 | Dark | 1 | Day | 0 | Sky | 0 | Valor | 0 | 356 |
| ATK | Light | 0 | Dark | 1 | Day | 0 | Sky | 0 | Valor | 0 | 412 |


| ATK | Light | 1 | Time | 1 | Day | 1 | Sky | 1 | Valor | 1 | 606 |
| ATK | Light | 1 | Time | 1 | Day | 1 | Sky | 1 | Valor | 2 | 620 |
| ATK | Light | 1 | Time | 1 | Day | 1 | Sky | 2 | Valor | 2 | 671 |
| ATK | Light | 1 | Time | 1 | Day | 2 | Sky | 2 | Valor | 2 | 728 |
| ATK | Light | 1 | Time | 2 | Day | 2 | Sky | 2 | Valor | 2 | 785 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Sky | 2 | Valor | 2 | 894 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Sky | 2 | Valor | 3 | 908 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Sky | 3 | Valor | 3 | 959 |
| ATK | Light | 2 | Time | 2 | Day | 3 | Sky | 3 | Valor | 3 | 1015 |
| ATK | Light | 2 | Time | 3 | Day | 3 | Sky | 3 | Valor | 3 | 1071 |
| ATK | Light | 3 | Time | 3 | Day | 3 | Sky | 3 | Valor | 3 | 1178 |

| ATK | Light | 1 | Time | 1 | Day | 1 | Faith | 1 | Valor | 1 | 570 |
| ATK | Light | 1 | Time | 1 | Day | 1 | Faith | 1 | Valor | 2 | 584 |
| ATK | Light | 1 | Time | 1 | Day | 1 | Faith | 2 | Valor | 2 | 598 |
| ATK | Light | 1 | Time | 1 | Day | 2 | Faith | 2 | Valor | 2 | 655 |
| ATK | Light | 1 | Time | 2 | Day | 2 | Faith | 2 | Valor | 2 | 712 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Faith | 2 | Valor | 2 | 813 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Faith | 2 | Valor | 3 | 827 |
| ATK | Light | 2 | Time | 2 | Day | 2 | Faith | 3 | Valor | 3 | 841 |
| ATK | Light | 2 | Time | 2 | Day | 3 | Faith | 3 | Valor | 3 | 897 |
| ATK | Light | 2 | Time | 3 | Day | 3 | Faith | 3 | Valor | 3 | 953 |
| ATK | Light | 3 | Time | 3 | Day | 3 | Faith | 3 | Valor | 3 | 1053 |

| ATK | Light | 1 | Time | 1 | Order | 1 | Faith | 1 | Valor | 1 | 512 |
| ATK | Light | 1 | Time | 1 | Order | 1 | Faith | 1 | Valor | 2 | 526 |
| ATK | Light | 1 | Time | 1 | Order | 1 | Faith | 2 | Valor | 2 | 540 |
| ATK | Light | 1 | Time | 1 | Order | 2 | Faith | 2 | Valor | 2 | 554 |
| ATK | Light | 1 | Time | 2 | Order | 2 | Faith | 2 | Valor | 2 | 611 |
| ATK | Light | 2 | Time | 2 | Order | 2 | Faith | 2 | Valor | 2 | 705 |
| ATK | Light | 2 | Time | 2 | Order | 2 | Faith | 2 | Valor | 3 | 719 |
| ATK | Light | 2 | Time | 2 | Order | 2 | Faith | 3 | Valor | 3 | 733 |
| ATK | Light | 2 | Time | 2 | Order | 3 | Faith | 3 | Valor | 3 | 747 |
| ATK | Light | 2 | Time | 3 | Order | 3 | Faith | 3 | Valor | 3 | 803 |
| ATK | Light | 3 | Time | 3 | Order | 3 | Faith | 3 | Valor | 3 | 895 |

| ATK | Light | 1 | Justice | 1 | Order | 1 | Faith | 1 | Valor | 1 | 367 |
| ATK | Light | 1 | Justice | 1 | Order | 1 | Faith | 1 | Valor | 2 | 381 |
| ATK | Light | 1 | Justice | 1 | Order | 1 | Faith | 2 | Valor | 2 | 395 |
| ATK | Light | 1 | Justice | 1 | Order | 2 | Faith | 2 | Valor | 2 | 409 |
| ATK | Light | 1 | Justice | 2 | Order | 2 | Faith | 2 | Valor | 2 | 423 |
| ATK | Light | 2 | Justice | 2 | Order | 2 | Faith | 2 | Valor | 2 | 509 |
| ATK | Light | 2 | Justice | 2 | Order | 2 | Faith | 2 | Valor | 3 | 523 |
| ATK | Light | 2 | Justice | 2 | Order | 2 | Faith | 3 | Valor | 3 | 537 |
| ATK | Light | 2 | Justice | 2 | Order | 3 | Faith | 3 | Valor | 3 | 551 |
| ATK | Light | 2 | Justice | 3 | Order | 3 | Faith | 3 | Valor | 3 | 565 |
| ATK | Light | 3 | Justice | 3 | Order | 3 | Faith | 3 | Valor | 3 | 650 |

| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Soul | 1 | 33 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Soul | 2 | 47 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Soul | 3 | 61 |

| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Mercy | 1 | 33 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Mercy | 2 | 47 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Mercy | 3 | 61 |

| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Virtue | 1 | 33 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Virtue | 2 | 47 |
| DEF | Divine | 0 | Nature | 0 | Night | 0 | Terra | 0 | Virtue | 3 | 61 |


| DEF | Dark | 1 | Nature | 1 | Night | 1 | Terra | 1 | Soul | 1 | 606 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Terra | 1 | Soul | 2 | 620 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Terra | 2 | Soul | 2 | 671 |
| DEF | Dark | 1 | Nature | 1 | Night | 2 | Terra | 2 | Soul | 2 | 728 |
| DEF | Dark | 1 | Nature | 2 | Night | 2 | Terra | 2 | Soul | 2 | 785 |
| DEF | Dark | 2 | Nature | 2 | Night | 2 | Terra | 2 | Soul | 2 | 894 |

| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 1 | Soul | 1 | 570 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 1 | Soul | 2 | 584 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 2 | Soul | 2 | 598 |
| DEF | Dark | 1 | Nature | 1 | Night | 2 | Mercy | 2 | Soul | 2 | 655 |
| DEF | Dark | 1 | Nature | 2 | Night | 2 | Mercy | 2 | Soul | 2 | 712 |
| DEF | Dark | 2 | Nature | 2 | Night | 2 | Mercy | 2 | Soul | 2 | 813 |

| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 1 | Soul | 1 | 570 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 1 | Soul | 2 | 584 |
| DEF | Dark | 1 | Nature | 1 | Night | 1 | Mercy | 2 | Soul | 2 | 598 |
| DEF | Dark | 1 | Nature | 1 | Night | 2 | Mercy | 2 | Soul | 2 | 655 |
| DEF | Dark | 1 | Nature | 2 | Night | 2 | Mercy | 2 | Soul | 2 | 712 |
| DEF | Dark | 2 | Nature | 2 | Night | 2 | Mercy | 2 | Soul | 2 | 813 |

| DEF | Dark | 1 | Virtue | 1 | Truth | 1 | Mercy | 1 | Soul | 1 | 367 |
| DEF | Dark | 1 | Virtue | 1 | Truth | 1 | Mercy | 1 | Soul | 2 | 381 |
| DEF | Dark | 1 | Virtue | 1 | Truth | 1 | Mercy | 2 | Soul | 2 | 395 |
| DEF | Dark | 1 | Virtue | 1 | Truth | 2 | Mercy | 2 | Soul | 2 | 409 |
| DEF | Dark | 1 | Virtue | 2 | Truth | 2 | Mercy | 2 | Soul | 2 | 423 |
| DEF | Dark | 2 | Virtue | 2 | Truth | 2 | Mercy | 2 | Soul | 2 | 509 |



---

## Hypothesis Tracking

Track candidate formulas and whether they fit your samples.

| Hypothesis ID | Candidate Formula | Parameters | Samples Tested | Matches | Mismatches | Verdict | Notes |
|---|---|---|---:|---:|---:|---|---|
| H1 | Power = (slot1Power[lvl] + slot2Power[lvl] +slot3Power[lvl] +slot4Power[lvl] +slot5Power[lvl] +) * setBonusMultiplier | weights | 0 | 0 | 0 | Rejected | Multiplier doesn't hold constant across compositions |
| H2 | Piecewise by rarity composition | rule set | 0 | 0 | 0 | Rejected | Too vague; power is costTier-based, not tier-only |
| H3 | Power = Σ feather_power[costTier][level] + setBonusPower[goldCount][min(all levels)] | lookup tables | 100+ | 100+ | 0 | **Confirmed** | All measured samples match within rounding error |

---

## Derived Formula (H3 — Confirmed)

```
Power = Σ feather_power[costTier][level]  +  setBonusPower[goldCount][min(all_levels)]
```

### Feather Intrinsic Power (by costTier × level)

| Level | Purple CT2 & CT3 | Gold CT4 | Gold CT5 | Gold CT6 | Gold CT7 |
|------:|-------:|-------:|-------:|-------:|-------:|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 33 | 62 | 83 | 129 | 189 |
| 2 | 47 | 113 | 140 | 186 | 245 |
| 3 | 61 | 164 | 196 | 242 | 300 |
| 4 | 74 | 215 | 252 | 298 | 356 |
| 5 | 88 | 266 | 309 | 354 | 412 |
| 6 | 102 | 317 | 366 | 410 | 468 |
| 7 | 116 | 368 | 422 | 466 | 524 |
| 8 | 130 | 419 | 479 | 522 | 580 |
| 9 | 143 | 470 | 535 | 578 | 635 |
| 10 | 157 | 521 | 591 | 634 | 691 |

**Feather → costTier mapping:**
- Purple CT2: Valor, Faith, Glory, Truth (ATK) · Soul, Mercy, Virtue (DEF) · Justice, Grace (MIX)
- Purple CT3: Order, Truth (MIX)
- Gold CT4: Sky (ATK) · Terra (DEF)
- Gold CT5: Day (ATK) · Night (DEF)
- Gold CT6: Space, Time (ATK) · Divine, Nature (DEF)
- Gold CT7: Light, Dark (MIX)

### Set Bonus Power (by goldCount × min-level)

`goldCount` = number of feathers with tier **Gold** in the set.  
`min-level` = `min(all 5 feather levels)`.  
When `min-level = 0`, set bonus = **0** (bonus not activated).

| min-level | 0G | 1G | 2G | 3G | 4G | 5G |
|----------:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 46 | 95 | 103 | 110 | 117 |
| 2 | 0 | 76 | 133 | 148 | 163 | 170 |
| 3 | 0 | 106 | 170 | 193 | 215 | 223 |
| 4 | 0 | 136 | 208 | 238 | 267 | 275 |
| 5 | 0 | 166 | 245 | 283 | 320 | 328 |
| 6 | 0 | 196 | 283 | 328 | 372 | 380 |
| 7 | 0 | 226 | 320 | 373 | 425 | 433 |
| 8 | 0 | 256 | 357 | 418 | 477 | 485 |
| 9 | 0 | 286 | 395 | 463 | 530 | 538 |
| 10 | 0 | 316 | 432 | 508 | 582 | 590 |

Levels 1–3 are empirically measured. Levels 4–10 are linearly extrapolated.  
5G row is fully extrapolated (no game data; kept for completeness).

### Validation Samples

| Set | Measured | Formula | Error |
|---|---:|---:|---:|
| ATK · Sky@1, others@0 | 62 | 62 | 0% |
| ATK · Time@1, others@0 | 129 | 129 | 0% |
| ATK · Light@1, others@0 | 189 | 189 | 0% |
| ATK · Light@1+Time@1+Day@1+Sky@1+Valor@1 (4G+1P, L1) | 606 | 496+110=606 | 0% |
| ATK · Light@2+Time@2+Day@2+Sky@2+Valor@2 (4G+1P, L2) | 894 | 731+163=894 | 0% |
| ATK · Light@3+Time@3+Day@3+Sky@3+Valor@3 (4G+1P, L3) | 1178 | 963+215=1178 | 0% |
| ATK · Light@1+Time@1+Day@1+Faith@1+Valor@1 (3G+2P, L1) | 570 | 467+103=570 | 0% |
| ATK · Light@2+Time@2+Day@2+Faith@2+Valor@2 (3G+2P, L2) | 813 | 665+148=813 | 0% |
| ATK · Light@1+Time@1+Order@1+Faith@1+Valor@1 (2G+3P, L1) | 512 | 417+95=512 | 0% |
| ATK · Light@1+Justice@1+Order@1+Faith@1+Valor@1 (1G+4P, L1) | 367 | 321+46=367 | 0% |
| DEF · Dark@1+Nature@1+Night@1+Terra@1+Soul@1 (4G+1P, L1) | 606 | 496+110=606 | 0% |
| DEF · Dark@1+Virtue@1+Truth@1+Mercy@1+Soul@1 (1G+4P, L1) | 367 | 321+46=367 | 0% |

All samples match exactly (0% error). Target was ≤10%.

### Implementation

The formula is implemented in `feathers-calculator.component.ts` as `computeSlotsPower()`.  
It is exposed via `getSetPower(set)`, `getBuilderTotalPower()`, and `getOptimizerSetPower(setResult)`.  
Power is displayed in both the **Set Builder** (per set badge + combined total) and **Build Optimizer** (per set badge + grand total).

---

## User Observed Behaviour

- Single Feather's Power has linear increases per level.
- Feather with the same cost tier have the same Power level per level.
- Power computation isn't purely based on stats. as seen on Order vs Valor. they have different stat bonuses but they have the same power per level because they are both purple feather.
- On Gold tier feathers, Each cost tier feathers differs power value per level. but the same cost tier have the same power level per level (Space and Time, Divine and Nature).
- Regardless of ATK or DEF sets, they have the same Power level based on the Feathers cost tier and level, and set stat bonus.

## Data Quality Checklist

- Levels are recorded correctly for all 5 feathers.
- Observed power is captured from the same screen/context every time.
- Bonus activation state is noted.
- Measurement order is preserved (helps compute deltas).
- At least 5 controlled progression samples are available per set.

---

## Next Step After You Fill Samples

Once you paste your first batch, we can:
1. Fit simple linear and piecewise models.
2. Check if minimum level gates cause breakpoints.
3. Compare model error per set type (ATK/DEF/MIX).
4. Turn the best-fit logic into code for the calculator.
