import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

type FeatherType = 'ATK' | 'DEF' | 'MIX';
type FeatherTier = 'Blue' | 'Purple' | 'Gold' | string;

interface FeatherStat {
  statCode: number;
  statValue: number[];
}

interface FeatherStatMeta {
  statCode: number;
  statName: string;
}

interface FeatherSetBonusGroup {
  statGroupDisplayName: string;
  statIncluded: number[];
  statBonus: number[];
  isPercentage: boolean;
}

interface FeatherSetBonus {
  setBonusName: string;
  setRequirement: string[];
  setClassification: SetType;
  setBonuses: FeatherStat[];
  setBonusesGrouped: FeatherSetBonusGroup[];
}

interface Feather {
  name: string;
  type: FeatherType;
  tier: FeatherTier;
  cost: number | number[];
  costTier?: number;
  imageURL?: string;
  stats: FeatherStat[];
}

interface FeatherTierGroup {
  tier: string;
  feathers: FeatherView[];
}

interface FeatherGroup {
  type: 'ATK' | 'DEF' | 'MIX';
  tierGroups: FeatherTierGroup[];
}

type SetType = 'ATK' | 'DEF';

interface FeatherSlot {
  featherId: string | null;
  level: number;
}

interface FeatherSet {
  id: number;
  setType: SetType;
  slots: FeatherSlot[];
}

interface AggregatedStat {
  statCode: number;
  statName: string;
  statValue: number;
}

interface FeatherView extends Feather {
  id: string;
  normalizedType: 'ATK' | 'DEF' | 'MIX';
  costLevels: number[];
}

interface PickerContext {
  setId: number;
  slotIndex: number;
}

interface FeatherInventoryItem {
  featherId: string;
  quantity: number;
}

interface SavedBuildSlot {
  featherId: string | null;
  level: number;
}

interface SavedBuildSet {
  setType: SetType;
  slots: SavedBuildSlot[];
}

interface SavedBuildEntry {
  id: string;
  name: string;
  createdAt: number;
  sets: SavedBuildSet[];
  showBuilderInventory: boolean;
  inventory: FeatherInventoryItem[];
}

interface BuildComparisonOption {
  id: string;
  label: string;
}

interface BuildComparisonStatRow {
  statCode: number;
  statName: string;
  baseValue: number;
  targetValue: number;
  delta: number;
  deltaPercent: number | null;
}

interface BuildComparisonReport {
  baseLabel: string;
  targetLabel: string;
  rows: BuildComparisonStatRow[];
  improvedCount: number;
  regressedCount: number;
  unchangedCount: number;
  netDelta: number;
  maxStatValue: number;
}

interface OptimizerSlot {
  featherId: string;
  level: number;
}

interface OptimizerSetResult {
  setType: SetType;
  slots: OptimizerSlot[];
  stats: AggregatedStat[];
  featherStats: AggregatedStat[];
  setBonusLevel: number;
  activeSetBonus: FeatherSetBonus | null;
}

interface OptimizerResult {
  requestedStatCode: number;
  requestedSecondaryStatCode: number | null;
  requestedThirdStatCode: number | null;
  fullSetPairs: number;
  sets: OptimizerSetResult[];
  totalStats: AggregatedStat[];
  transformationSummary: OptimizerTransformationSummary[];
  power: number;
}

interface OptimizerPriorityScore {
  primary: number;
  secondary: number;
  third: number;
  overflow: number;
  power: number;
}

interface OptimizerTransformationSummary {
  costTier: number;
  available: number;
  used: number;
  remaining: number;
  assignments: OptimizerTransformationAssignment[];
}

interface OptimizerTransformationAssignment {
  featherName: string;
  featherType: FeatherType;
  featherTier: FeatherTier;
  used: number;
  slotCount: number;
}

interface SetCandidate {
  setType: SetType;
  slots: OptimizerSlot[];
  usageByGroup: Map<string, number>;
  stats: AggregatedStat[];
  featherStats: AggregatedStat[];
  setBonusLevel: number;
  activeSetBonus: FeatherSetBonus | null;
  score: OptimizerPriorityScore;
}

interface PairCandidate {
  atk: SetCandidate;
  def: SetCandidate;
  usageByGroup: Map<string, number>;
  score: OptimizerPriorityScore;
}

interface OptimizerSearchState {
  chosenPairs: PairCandidate[];
  usageByGroup: Map<string, number>;
  score: OptimizerPriorityScore;
}

@Component({
  selector: 'app-feathers-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feathers-calculator.component.html',
  styleUrl: './feathers-calculator.component.scss'
})
export class FeathersCalculatorComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly savedBuildsStorageKey = 'rooc-feathers-saved-builds';
  private readonly maxSlotsPerSet = 5;
  private statNameByCode = new Map<number, string>();
  private featherById = new Map<string, FeatherView>();

  feathers: FeatherView[] = [];
  featherGroups: FeatherGroup[] = [];
  featherSetBonuses: FeatherSetBonus[] = [];
  featherSets: FeatherSet[] = [
    this.createFeatherSet(1, 'ATK'),
    this.createFeatherSet(2, 'ATK'),
    this.createFeatherSet(3, 'ATK'),
    this.createFeatherSet(4, 'ATK'),
    this.createFeatherSet(5, 'ATK'),
    this.createFeatherSet(6, 'DEF'),
    this.createFeatherSet(7, 'DEF'),
    this.createFeatherSet(8, 'DEF'),
    this.createFeatherSet(9, 'DEF'),
    this.createFeatherSet(10, 'DEF'),
  ];
  loading = true;
  errorMessage = '';
  showReferenceModal = false;
  showPickerModal = false;
  activePickerContext: PickerContext | null = null;
  readonly maxSets = 10;
  readonly maxFeatherLevel = 10;

  // How much 1 unit of Power is worth relative to 1 unit of Primary Stat in scoring.
  // At 0.05, a 1000-power advantage is treated as equivalent to +50 primary stat points.
  // Kept deliberately low so power is a meaningful tiebreaker without overriding stat optimization.
  private readonly powerStatEquivalentFactor = 0.05;

  // Intrinsic power per feather by costTier and level (index 0 = level 0, index 10 = level 10).
  // Values for levels 1-5 are empirically derived from in-game measurements.
  // Values for levels 6-10 are linearly extrapolated using the observed per-level delta.
  private readonly featherIntrinsicPowerByTier: ReadonlyMap<number, readonly number[]> = new Map([
    [2, [0, 33, 47, 61, 74, 88, 102, 116, 130, 143, 157]],  // Purple (costTier 2)
    [3, [0, 33, 47, 61, 74, 88, 102, 116, 130, 143, 157]],  // Purple (costTier 3) — same power as CT2
    [4, [0, 62, 113, 164, 215, 266, 317, 368, 419, 470, 521]],  // Gold CT4 (Sky, Terra)
    [5, [0, 83, 140, 196, 252, 309, 366, 422, 479, 535, 591]],  // Gold CT5 (Day, Night)
    [6, [0, 129, 186, 242, 298, 354, 410, 466, 522, 578, 634]],  // Gold CT6 (Space, Time, Divine, Nature)
    [7, [0, 189, 245, 300, 356, 412, 468, 524, 580, 635, 691]],  // Gold CT7 (Light, Dark)
  ]);

  // Flat power bonus contributed by the set bonus, keyed by the number of Gold-tier feathers
  // in the set and the set bonus level (min feather level across all slots).
  // Values for levels 1-3 are empirically derived; levels 4-10 are linearly extrapolated.
  private readonly setBonusPowerByGoldCount: ReadonlyMap<number, readonly number[]> = new Map([
    [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],     // All Purple — no set bonus entry exists
    [1, [0, 46, 76, 106, 136, 166, 196, 226, 256, 286, 316]],   // 1G+4P (Δ=30)
    [2, [0, 95, 133, 170, 208, 245, 283, 320, 357, 395, 432]],  // 2G+3P (Δ≈37.5)
    [3, [0, 103, 148, 193, 238, 283, 328, 373, 418, 463, 508]], // 3G+2P (Δ=45)
    [4, [0, 110, 163, 215, 267, 320, 372, 425, 477, 530, 582]], // 4G+1P (Δ≈52.5)
    [5, [0, 117, 170, 223, 275, 328, 380, 433, 485, 538, 590]], // All Gold (extrapolated)
  ]);

  optimizerInventory: FeatherInventoryItem[] = [];
  optimizerStatCode = 11;
  optimizerSecondaryStatCode: number | null = null;
  optimizerThirdStatCode: number | null = null;
  optimizerResult: OptimizerResult | null = null;
  optimizerMessage = '';
  showBuilderInventory = true;
  builderInventoryMessage = '';
  savedBuilds: SavedBuildEntry[] = [];
  savedBuildsMessage = '';
  readonly savedBuildLimit = 3;
  renamingBuildId: string | null = null;
  renamingBuildName = '';
  comparisonBaseBuildId = 'current';
  comparisonTargetBuildId: string | null = null;
  collapsedBuilderSets = new Set<number>();
  collapsedOptimizerSets = new Set<number>();
  buildCompareCollapsed = true;

  toggleBuildCompare(): void {
    this.buildCompareCollapsed = !this.buildCompareCollapsed;
  }

  toggleInventoryMode(): void {
    this.showBuilderInventory = !this.showBuilderInventory;
    if (this.showBuilderInventory) {
      this.reconcileBuilderLevelsWithInventory();
    } else {
      this.builderInventoryMessage = '';
      this.optimizerResult = null;
      this.optimizerMessage = '';
    }
  }

  hasEquippedFeathers(): boolean {
    return this.featherSets.some((set) => set.slots.some((slot) => !!slot.featherId));
  }

  convertSetsToInventory(): void {
    const costById = new Map<string, number>();

    for (const set of this.featherSets) {
      for (const slot of set.slots) {
        if (!slot.featherId) {
          continue;
        }

        const feather = this.featherById.get(slot.featherId);
        if (!feather) {
          continue;
        }

        const slotCost = feather.costLevels[slot.level - 1] ?? 0;
        costById.set(slot.featherId, (costById.get(slot.featherId) ?? 0) + slotCost);
      }
    }

    this.optimizerInventory = this.optimizerInventory.map((item) => ({
      ...item,
      quantity: costById.get(item.featherId) ?? 0
    }));

    this.showBuilderInventory = true;
    this.optimizerResult = null;
    this.optimizerMessage = '';
    this.builderInventoryMessage = 'Inventory synced from current build.';
  }

  toggleBuilderSet(setId: number): void {
    if (this.collapsedBuilderSets.has(setId)) {
      this.collapsedBuilderSets.delete(setId);
    } else {
      this.collapsedBuilderSets.add(setId);
    }
  }

  isBuilderSetCollapsed(setId: number): boolean {
    return this.collapsedBuilderSets.has(setId);
  }

  getAtkSets(): FeatherSet[] {
    return this.featherSets.filter((s) => s.setType === 'ATK');
  }

  getDefSets(): FeatherSet[] {
    return this.featherSets.filter((s) => s.setType === 'DEF');
  }

  toggleOptimizerSet(index: number): void {
    if (this.collapsedOptimizerSets.has(index)) {
      this.collapsedOptimizerSets.delete(index);
    } else {
      this.collapsedOptimizerSets.add(index);
    }
  }

  isOptimizerSetCollapsed(index: number): boolean {
    return this.collapsedOptimizerSets.has(index);
  }

  ngOnInit(): void {
    forkJoin({
      feathers: this.http.get<Feather[]>('/data/feathers.json'),
      featherStats: this.http.get<FeatherStatMeta[]>('/data/featherStats.json'),
      featherSetBonuses: this.http.get<FeatherSetBonus[]>('/data/feathersSetBonus.json')
    }).subscribe({
      next: ({ feathers, featherStats, featherSetBonuses }) => {
        this.statNameByCode = new Map(
          featherStats.map((entry) => [entry.statCode, entry.statName])
        );
        this.feathers = this.buildFeatherViews(feathers);
        this.featherById = new Map(this.feathers.map((feather) => [feather.id, feather]));
        this.featherGroups = this.groupFeathersByType(this.feathers);
        this.featherSetBonuses = featherSetBonuses;
        this.optimizerInventory = this.feathers.map((feather) => ({
          featherId: feather.id,
          quantity: 0
        }));
        this.loadSavedBuildsFromStorage();
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load feather data files from /public/data.';
        this.loading = false;
      }
    });
  }

  getStatName(statCode: number): string {
    return this.statNameByCode.get(statCode) ?? `Unknown Stat (${statCode})`;
  }

  formatCostLevels(costLevels: number[]): string {
    return costLevels.join(' / ');
  }

  formatStatValueRange(statValues: number[]): string {
    if (statValues.length === 0) return '0';
    if (statValues.length === 1) return `${statValues[0]}`;
    return `${statValues[0]}-${statValues[statValues.length - 1]}`;
  }

  getSelectableFeathers(setType: SetType): FeatherView[] {
    return this.feathers.filter((feather) => {
      if (setType === 'ATK') {
        return feather.normalizedType === 'ATK' || feather.normalizedType === 'MIX';
      }

      return feather.normalizedType === 'DEF' || feather.normalizedType === 'MIX';
    });
  }

  getAllFeathersFromGroup(group: FeatherGroup): FeatherView[] {
    return group.tierGroups.flatMap((tierGroup) => tierGroup.feathers);
  }

  isFeatherDisabledInSet(set: FeatherSet, slotIndex: number, featherId: string): boolean {
    return set.slots.some(
      (slot, selectedSlotIndex) => selectedSlotIndex !== slotIndex && slot.featherId === featherId
    );
  }

  getFeatherById(featherId: string | null): FeatherView | null {
    if (!featherId) {
      return null;
    }

    return this.featherById.get(featherId) ?? null;
  }

  getFeatherImageUrl(feather: FeatherView): string {
    const imagePath = feather.imageURL?.trim() ?? '';
    if (!imagePath) {
      return '';
    }

    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  onLevelChange(set: FeatherSet, slotIndex: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const level = Number.parseInt(target.value, 10);

    if (Number.isNaN(level)) {
      return;
    }

    set.slots[slotIndex].level = Math.max(1, Math.min(level, this.maxFeatherLevel));

    if (this.showBuilderInventory) {
      const maxAllowed = this.getBuilderSlotMaxLevel(set, slotIndex);
      set.slots[slotIndex].level = Math.min(set.slots[slotIndex].level, maxAllowed);
      this.reconcileBuilderLevelsWithInventory();
    }
  }

  getSlotCost(slot: FeatherSlot): number {
    if (!slot.featherId) {
      return 0;
    }

    const feather = this.featherById.get(slot.featherId);
    if (!feather) {
      return 0;
    }

    return feather.costLevels[slot.level - 1] ?? 0;
  }

  getSetTotalCost(set: FeatherSet): number {
    return set.slots.reduce((sum, slot) => sum + this.getSlotCost(slot), 0);
  }

  getAllSetsTotalCost(): number {
    return this.featherSets.reduce((sum, set) => sum + this.getSetTotalCost(set), 0);
  }

  getSetStatTotals(set: FeatherSet): AggregatedStat[] {
    const calculation = this.calculateSetStatsWithBonuses(set);
    return calculation.stats;
  }

  getActiveSetBonus(set: FeatherSet): FeatherSetBonus | null {
    const calculation = this.calculateSetStatsWithBonuses(set);
    return calculation.activeSetBonus;
  }

  getSetBonusLevelForDisplay(set: FeatherSet): number {
    return this.getSetBonusLevel(set);
  }

  getSetFeatherStats(set: FeatherSet): AggregatedStat[] {
    return this.calculateSetStatsWithBonuses(set).featherStats;
  }

  getBuilderTotalStats(): AggregatedStat[] {
    const setsWithStats = this.featherSets.filter((set) => this.calculateSetStatsWithBonuses(set).stats.length > 0);
    return this.aggregateStats(setsWithStats.map((set) => this.calculateSetStatsWithBonuses(set).stats));
  }

  getSetPower(set: FeatherSet): number | null {
    return this.computeSlotsPower(set.slots);
  }

  getBuilderTotalPower(): number | null {
    const powers = this.featherSets.map((set) => this.computeSlotsPower(set.slots));
    if (powers.some((p) => p === null)) {
      return null;
    }
    return powers.reduce((sum, p) => (sum ?? 0) + (p ?? 0), 0 as number);
  }

  getGroupedBonusValueAtLevel(groupedBonus: FeatherSetBonusGroup, level: number): number {
    return this.getStatValueAtLevel(groupedBonus.statBonus, level);
  }

  getSetBonusFlatStatValue(statValues: number[], level: number): number {
    return this.getStatValueAtLevel(statValues, level);
  }

  getAvailableOptimizerStats(): FeatherStatMeta[] {
    return Array.from(this.statNameByCode.entries())
      .map(([statCode, statName]) => ({ statCode, statName }))
      .sort((a, b) => a.statName.localeCompare(b.statName));
  }

  getOptimizerInventoryQuantity(featherId: string): number {
    return this.optimizerInventory.find((item) => item.featherId === featherId)?.quantity ?? 0;
  }

  onOptimizerInventoryChange(featherId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const nextValue = Number.parseInt(target.value, 10);
    const quantity = Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue);

    this.optimizerInventory = this.optimizerInventory.map((item) =>
      item.featherId === featherId ? { ...item, quantity } : item
    );

    if (this.showBuilderInventory) {
      this.reconcileBuilderLevelsWithInventory();
    }
  }

  canSaveCurrentBuild(): boolean {
    return this.savedBuilds.length < this.savedBuildLimit;
  }

  getBuildComparisonOptions(): BuildComparisonOption[] {
    return [
      { id: 'current', label: 'Current Build' },
      ...this.savedBuilds.map((build) => ({
        id: build.id,
        label: build.name
      }))
    ];
  }

  onBuildComparisonSelectionChange(): void {
    this.ensureValidBuildComparisonSelection();
  }

  getBuildComparisonReport(): BuildComparisonReport | null {
    this.ensureValidBuildComparisonSelection();
    const optionsById = new Map(this.getBuildComparisonOptions().map((option) => [option.id, option.label]));

    if (!this.comparisonTargetBuildId || this.comparisonTargetBuildId === this.comparisonBaseBuildId) {
      return null;
    }

    const baseStats = this.getCombinedStatsForComparisonOption(this.comparisonBaseBuildId);
    const targetStats = this.getCombinedStatsForComparisonOption(this.comparisonTargetBuildId);
    const baseByCode = new Map(baseStats.map((stat) => [stat.statCode, stat.statValue]));
    const targetByCode = new Map(targetStats.map((stat) => [stat.statCode, stat.statValue]));

    const statCodes = new Set<number>([...baseByCode.keys(), ...targetByCode.keys()]);
    const rows = Array.from(statCodes)
      .map((statCode) => {
        const baseValue = baseByCode.get(statCode) ?? 0;
        const targetValue = targetByCode.get(statCode) ?? 0;
        const delta = this.roundStatValue(targetValue - baseValue);
        const deltaPercent = baseValue > 0 ? ((targetValue - baseValue) / baseValue) * 100 : null;

        return {
          statCode,
          statName: this.getStatName(statCode),
          baseValue,
          targetValue,
          delta,
          deltaPercent
        };
      })
      .sort((first, second) => {
        const deltaDiff = Math.abs(second.delta) - Math.abs(first.delta);
        if (deltaDiff !== 0) {
          return deltaDiff;
        }

        return first.statName.localeCompare(second.statName);
      });

    if (rows.length === 0) {
      return null;
    }

    const improvedCount = rows.filter((row) => row.delta > 0).length;
    const regressedCount = rows.filter((row) => row.delta < 0).length;
    const unchangedCount = rows.filter((row) => row.delta === 0).length;
    const netDelta = this.roundStatValue(rows.reduce((sum, row) => sum + row.delta, 0));
    const maxStatValue = Math.max(
      1,
      ...rows.map((row) => Math.max(row.baseValue, row.targetValue))
    );

    return {
      baseLabel: optionsById.get(this.comparisonBaseBuildId) ?? 'Baseline',
      targetLabel: optionsById.get(this.comparisonTargetBuildId) ?? 'Compared Build',
      rows,
      improvedCount,
      regressedCount,
      unchangedCount,
      netDelta,
      maxStatValue
    };
  }

  getComparisonBarWidth(value: number, maxValue: number): number {
    if (maxValue <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(100, (value / maxValue) * 100));
  }

  getComparisonDeltaClass(delta: number): 'positive' | 'negative' | 'neutral' {
    if (delta > 0) {
      return 'positive';
    }

    if (delta < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  formatComparisonDelta(delta: number): string {
    if (delta > 0) {
      return `+${delta}`;
    }

    return `${delta}`;
  }

  saveCurrentBuild(): void {
    this.savedBuildsMessage = '';

    if (this.savedBuilds.length >= this.savedBuildLimit) {
      this.savedBuildsMessage = 'Build Vault is full. Delete one saved build to save a new one.';
      return;
    }

    const nextNumber = this.savedBuilds.length + 1;
    const now = Date.now();

    const snapshot: SavedBuildEntry = {
      id: `build-${now}`,
      name: `Build ${nextNumber}`,
      createdAt: now,
      sets: this.featherSets.map((set) => ({
        setType: set.setType,
        slots: set.slots.map((slot) => ({
          featherId: slot.featherId,
          level: Math.max(1, Math.min(slot.level, this.maxFeatherLevel))
        }))
      })),
      showBuilderInventory: this.showBuilderInventory,
      inventory: this.optimizerInventory.map((entry) => ({ ...entry }))
    };

    this.savedBuilds = [...this.savedBuilds, snapshot]
      .sort((first, second) => second.createdAt - first.createdAt);

    this.ensureValidBuildComparisonSelection();
    this.persistSavedBuilds();
    this.savedBuildsMessage = `${snapshot.name} saved locally.`;
  }

  loadSavedBuild(savedBuildId: string): void {
    this.savedBuildsMessage = '';
    const selected = this.savedBuilds.find((build) => build.id === savedBuildId);

    if (!selected) {
      this.savedBuildsMessage = 'Saved build not found.';
      return;
    }

    const loadedSets = selected.sets
      .map((set, setIndex) => ({
        id: setIndex + 1,
        setType: set.setType,
        slots: set.slots.map((slot) => ({
          featherId: slot.featherId && this.featherById.has(slot.featherId) ? slot.featherId : null,
          level: Math.max(1, Math.min(slot.level, this.maxFeatherLevel))
        }))
      }))
      .filter((set) => set.slots.length === this.maxSlotsPerSet);

    if (loadedSets.length === 0) {
      this.savedBuildsMessage = 'Saved build data is invalid for the current feather data.';
      return;
    }

    this.featherSets = loadedSets;
    this.collapsedBuilderSets.clear();

    const inventoryById = new Map(selected.inventory.map((entry) => [entry.featherId, entry.quantity]));
    this.optimizerInventory = this.feathers.map((feather) => ({
      featherId: feather.id,
      quantity: Math.max(0, inventoryById.get(feather.id) ?? 0)
    }));

    this.showBuilderInventory = selected.showBuilderInventory ?? true;
    this.builderInventoryMessage = '';

    if (this.showBuilderInventory) {
      this.reconcileBuilderLevelsWithInventory();
    }

    this.savedBuildsMessage = `${selected.name} loaded.`;
  }

  deleteSavedBuild(savedBuildId: string): void {
    const existingCount = this.savedBuilds.length;
    this.savedBuilds = this.savedBuilds.filter((build) => build.id !== savedBuildId);

    if (this.savedBuilds.length === existingCount) {
      this.savedBuildsMessage = 'Saved build not found.';
      return;
    }

    if (this.renamingBuildId === savedBuildId) {
      this.cancelRenameBuild();
    }

    this.ensureValidBuildComparisonSelection();
    this.persistSavedBuilds();
    this.savedBuildsMessage = 'Saved build removed.';
  }

  startRenameBuild(build: SavedBuildEntry): void {
    this.renamingBuildId = build.id;
    this.renamingBuildName = build.name;
    this.savedBuildsMessage = '';
  }

  confirmRenameBuild(buildId: string): void {
    const trimmed = this.renamingBuildName.trim();
    if (!trimmed) {
      return;
    }

    const maxNameLength = 40;
    const safeName = trimmed.slice(0, maxNameLength);

    this.savedBuilds = this.savedBuilds.map((build) =>
      build.id === buildId ? { ...build, name: safeName } : build
    );
    this.renamingBuildId = null;
    this.renamingBuildName = '';
    this.persistSavedBuilds();
    this.savedBuildsMessage = `Build renamed to "${safeName}".`;
  }

  cancelRenameBuild(): void {
    this.renamingBuildId = null;
    this.renamingBuildName = '';
  }

  formatSavedBuildDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  getSavedBuildSetSummary(build: SavedBuildEntry): string {
    const atkCount = build.sets.filter((set) => set.setType === 'ATK').length;
    const defCount = build.sets.filter((set) => set.setType === 'DEF').length;
    return `${atkCount} ATK · ${defCount} DEF`;
  }

  getBuilderSlotMaxLevel(set: FeatherSet, slotIndex: number): number {
    const slot = set.slots[slotIndex];
    if (!this.showBuilderInventory || !slot.featherId) {
      return this.maxFeatherLevel;
    }

    const feather = this.featherById.get(slot.featherId);
    if (!feather) {
      return this.maxFeatherLevel;
    }

    const availabilityByTier = this.getInventoryAvailabilityByTier();
    const usageByTier = this.getBuilderUsageByTier();
    const targetTier = feather.costTier ?? -1;
    const currentCost = feather.costLevels[slot.level - 1] ?? 0;
    const usedByOthers = Math.max(0, (usageByTier.get(targetTier) ?? 0) - currentCost);
    const tierAvailable = availabilityByTier.get(targetTier) ?? 0;
    const budgetForSlot = Math.max(0, tierAvailable - usedByOthers);

    let maxAllowed = 1;
    const fallbackCost = feather.costLevels[feather.costLevels.length - 1] ?? 0;

    for (let level = 1; level <= this.maxFeatherLevel; level += 1) {
      const levelCost = feather.costLevels[level - 1] ?? fallbackCost;
      if (levelCost <= budgetForSlot) {
        maxAllowed = level;
      } else {
        break;
      }
    }

    return Math.max(1, Math.min(maxAllowed, this.maxFeatherLevel));
  }

  onOptimizerPrimaryStatChange(statCode: number): void {
    this.optimizerStatCode = statCode;
    this.normalizeOptimizerPriorityStats();
  }

  onOptimizerSecondaryStatChange(statCode: number | null): void {
    this.optimizerSecondaryStatCode = statCode;
    this.normalizeOptimizerPriorityStats();
  }

  onOptimizerThirdStatChange(statCode: number | null): void {
    this.optimizerThirdStatCode = statCode;
    this.normalizeOptimizerPriorityStats();
  }

  private normalizeOptimizerPriorityStats(): void {
    if (this.optimizerSecondaryStatCode === this.optimizerStatCode) {
      this.optimizerSecondaryStatCode = null;
    }

    if (this.optimizerThirdStatCode === this.optimizerStatCode) {
      this.optimizerThirdStatCode = null;
    }

    if (
      this.optimizerSecondaryStatCode !== null &&
      this.optimizerThirdStatCode === this.optimizerSecondaryStatCode
    ) {
      this.optimizerThirdStatCode = null;
    }
  }

  runBuildOptimizer(): void {
    this.optimizerMessage = '';
    this.optimizerResult = null;
    this.collapsedOptimizerSets.clear();
    // Evaluate candidates at level 5 so set bonus multipliers are proportionally meaningful
    // relative to the power advantage of high-tier feathers. At level 1 the absolute stat values
    // are so small that even a small power advantage overwhelms the set bonus contribution.
    const baselineLevel = 5;

    const inventoryByGroup = this.buildInventoryByGroup();
    const maxPairs = this.getMaxFullSetPairs(inventoryByGroup);

    if (maxPairs <= 0) {
      this.optimizerMessage =
        'Not enough feathers to build at least one full ATK + DEF pair (5 feathers per set).';
      return;
    }

    const optimizedSets = this.selectBestSetsGlobally(
      inventoryByGroup,
      baselineLevel,
      maxPairs,
      this.optimizerStatCode,
      this.optimizerSecondaryStatCode,
      this.optimizerThirdStatCode
    );

    if (optimizedSets.length === 0) {
      this.optimizerMessage =
        'Unable to find a valid optimized setup with the current inventory. Try adding more feather counts.';
      return;
    }

    const leveledSets = this.allocateSetLevelsWithinPools(
      optimizedSets,
      inventoryByGroup,
      this.optimizerStatCode,
      this.optimizerSecondaryStatCode,
      this.optimizerThirdStatCode
    );

    const budgetSafeSets = this.enforcePoolBudgets(
      leveledSets,
      inventoryByGroup,
      this.optimizerStatCode,
      this.optimizerSecondaryStatCode,
      this.optimizerThirdStatCode
    );

    const totalStats = this.aggregateStats(budgetSafeSets.map((setResult) => setResult.stats));
    const transformationSummary = this.buildTransformationSummary(budgetSafeSets, inventoryByGroup);
    const power = budgetSafeSets.reduce((sum, setResult) => sum + (this.computeSlotsPower(setResult.slots) ?? 0), 0);

    this.optimizerResult = {
      requestedStatCode: this.optimizerStatCode,
      requestedSecondaryStatCode: this.optimizerSecondaryStatCode,
      requestedThirdStatCode: this.optimizerThirdStatCode,
      fullSetPairs: Math.floor(budgetSafeSets.length / 2),
      sets: budgetSafeSets,
      totalStats,
      transformationSummary,
      power
    };

    // Load optimizer results into the visible 10 feather sets.
    // ATK results fill slots 1-5, DEF results fill slots 6-10.
    const atkResults = budgetSafeSets.filter((s) => s.setType === 'ATK');
    const defResults = budgetSafeSets.filter((s) => s.setType === 'DEF');

    const toFeatherSet = (id: number, setType: SetType, result: OptimizerSetResult | undefined): FeatherSet => {
      if (!result) {
        return this.createFeatherSet(id, setType);
      }
      return {
        id,
        setType,
        slots: result.slots.map((slot) => ({ featherId: slot.featherId, level: slot.level }))
      };
    };

    this.featherSets = [
      toFeatherSet(1, 'ATK', atkResults[0]),
      toFeatherSet(2, 'ATK', atkResults[1]),
      toFeatherSet(3, 'ATK', atkResults[2]),
      toFeatherSet(4, 'ATK', atkResults[3]),
      toFeatherSet(5, 'ATK', atkResults[4]),
      toFeatherSet(6, 'DEF', defResults[0]),
      toFeatherSet(7, 'DEF', defResults[1]),
      toFeatherSet(8, 'DEF', defResults[2]),
      toFeatherSet(9, 'DEF', defResults[3]),
      toFeatherSet(10, 'DEF', defResults[4]),
    ];
    this.collapsedBuilderSets.clear();
  }

  getOptimizerSetTotalCost(setResult: OptimizerSetResult): number {
    return setResult.slots.reduce((totalCost, slot) => {
      const feather = this.featherById.get(slot.featherId);
      if (!feather) {
        return totalCost;
      }

      return totalCost + (feather.costLevels[slot.level - 1] ?? 0);
    }, 0);
  }

  getOptimizerAllSetsCost(result: OptimizerResult | null): number {
    if (!result) {
      return 0;
    }

    return result.sets.reduce((sum, setResult) => sum + this.getOptimizerSetTotalCost(setResult), 0);
  }

  getOptimizerSetPower(setResult: OptimizerSetResult): number | null {
    return this.computeSlotsPower(setResult.slots);
  }

  private buildInventoryByGroup(): Map<string, number> {
    const inventoryByGroup = new Map<string, number>();

    for (const item of this.optimizerInventory) {
      if (item.quantity <= 0) {
        continue;
      }

      const feather = this.featherById.get(item.featherId);
      if (!feather) {
        continue;
      }

      const groupKey = this.getInventoryGroupKey(feather);
      const current = inventoryByGroup.get(groupKey) ?? 0;
      inventoryByGroup.set(groupKey, current + item.quantity);
    }

    return inventoryByGroup;
  }

  private getMaxFullSetPairs(inventoryByGroup: Map<string, number>): number {
    const totalAvailable = Array.from(inventoryByGroup.values()).reduce((sum, value) => sum + value, 0);
    const upperBound = Math.min(Math.floor(totalAvailable / 10), Math.floor(this.maxSets / 2));

    for (let pairCount = upperBound; pairCount >= 1; pairCount -= 1) {
      if (this.canBuildGivenPairCount(inventoryByGroup, pairCount)) {
        return pairCount;
      }
    }

    return 0;
  }

  private canBuildGivenPairCount(inventoryByGroup: Map<string, number>, pairCount: number): boolean {
    if (pairCount <= 0) {
      return true;
    }

    const totalAvailable = Array.from(inventoryByGroup.values()).reduce((sum, value) => sum + value, 0);
    return totalAvailable >= pairCount * this.maxSlotsPerSet * 2;
  }

  private buildSetCandidates(
    setType: SetType,
    inventoryByGroup: Map<string, number>,
    level: number,
    targetStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): SetCandidate[] {
    const options = this.feathers.filter((feather) => this.isFeatherCompatibleWithSet(feather.normalizedType, setType));
    const candidates: SetCandidate[] = [];

    const visit = (
      startIndex: number,
      chosen: FeatherView[],
      usageByGroup: Map<string, number>
    ): void => {
      if (chosen.length === this.maxSlotsPerSet) {
        const slots = chosen.map((feather) => ({ featherId: feather.id, level }));
        const statsWithBonus = this.calculateStatsForSlots(setType, slots);
        const slotPower = this.computeSlotsPower(slots) ?? 0;
        const score = this.calculatePriorityScore(
          statsWithBonus.stats,
          targetStatCode,
          secondaryStatCode,
          thirdStatCode,
          slotPower
        );
        candidates.push({
          setType,
          slots,
          usageByGroup: new Map(usageByGroup),
          stats: statsWithBonus.stats,
          featherStats: statsWithBonus.featherStats,
          setBonusLevel: statsWithBonus.setBonusLevel,
          activeSetBonus: statsWithBonus.activeSetBonus,
          score
        });
        return;
      }

      const remainingSlots = this.maxSlotsPerSet - chosen.length;
      if (options.length - startIndex < remainingSlots) {
        return;
      }

      for (let optionIndex = startIndex; optionIndex < options.length; optionIndex += 1) {
        const feather = options[optionIndex];
        const groupKey = this.getInventoryGroupKey(feather);
        const currentUsage = usageByGroup.get(groupKey) ?? 0;
        const available = inventoryByGroup.get(groupKey) ?? 0;

        if (currentUsage >= available) {
          continue;
        }

        usageByGroup.set(groupKey, currentUsage + 1);
        chosen.push(feather);
        visit(optionIndex + 1, chosen, usageByGroup);
        chosen.pop();

        if (currentUsage === 0) {
          usageByGroup.delete(groupKey);
        } else {
          usageByGroup.set(groupKey, currentUsage);
        }
      }
    };

    visit(0, [], new Map<string, number>());

    return candidates.sort((first, second) => this.comparePriorityScores(second.score, first.score));
  }

  private selectBestSetsGlobally(
    inventoryByGroup: Map<string, number>,
    baselineLevel: number,
    maxPairs: number,
    targetStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): OptimizerSetResult[] {
    const setCandidateLimit = 120;
    const pairCandidateLimit = 280;
    const beamWidth = 80;

    const atkCandidates = this
      .buildSetCandidates(
        'ATK',
        inventoryByGroup,
        baselineLevel,
        targetStatCode,
        secondaryStatCode,
        thirdStatCode
      )
      .slice(0, setCandidateLimit);
    const defCandidates = this
      .buildSetCandidates(
        'DEF',
        inventoryByGroup,
        baselineLevel,
        targetStatCode,
        secondaryStatCode,
        thirdStatCode
      )
      .slice(0, setCandidateLimit);

    if (atkCandidates.length === 0 || defCandidates.length === 0) {
      return [];
    }

    const pairCandidates: PairCandidate[] = [];

    for (const atkCandidate of atkCandidates) {
      for (const defCandidate of defCandidates) {
        const usageByGroup = this.mergeUsageMaps(atkCandidate.usageByGroup, defCandidate.usageByGroup);
        if (!this.hasInventoryForUsage(inventoryByGroup, usageByGroup)) {
          continue;
        }

        pairCandidates.push({
          atk: atkCandidate,
          def: defCandidate,
          usageByGroup,
          score: {
            primary: atkCandidate.score.primary + defCandidate.score.primary,
            secondary: atkCandidate.score.secondary + defCandidate.score.secondary,
            third: atkCandidate.score.third + defCandidate.score.third,
            overflow: atkCandidate.score.overflow + defCandidate.score.overflow,
            power: atkCandidate.score.power + defCandidate.score.power
          }
        });
      }
    }

    pairCandidates.sort((first, second) => this.comparePriorityScores(second.score, first.score));

    const trimmedPairs = pairCandidates.slice(0, pairCandidateLimit);
    if (trimmedPairs.length === 0) {
      return [];
    }

    let beam: OptimizerSearchState[] = [
      {
        chosenPairs: [],
        usageByGroup: new Map<string, number>(),
        score: {
          primary: 0,
          secondary: 0,
          third: 0,
          overflow: 0,
          power: 0
        }
      }
    ];

    for (let pairIndex = 0; pairIndex < maxPairs; pairIndex += 1) {
      const nextStates: OptimizerSearchState[] = [];

      for (const state of beam) {
        for (const pairCandidate of trimmedPairs) {
          const mergedUsage = this.mergeUsageMaps(state.usageByGroup, pairCandidate.usageByGroup);

          if (!this.hasInventoryForUsage(inventoryByGroup, mergedUsage)) {
            continue;
          }

          const remainingAfterPick = this.subtractUsageFromInventory(inventoryByGroup, mergedUsage);
          const remainingPairs = maxPairs - pairIndex - 1;

          if (!this.canBuildGivenPairCount(remainingAfterPick, remainingPairs)) {
            continue;
          }

          nextStates.push({
            chosenPairs: [...state.chosenPairs, pairCandidate],
            usageByGroup: mergedUsage,
            score: {
              primary: state.score.primary + pairCandidate.score.primary,
              secondary: state.score.secondary + pairCandidate.score.secondary,
              third: state.score.third + pairCandidate.score.third,
              overflow: state.score.overflow + pairCandidate.score.overflow,
              power: state.score.power + pairCandidate.score.power
            }
          });
        }
      }

      if (nextStates.length === 0) {
        break;
      }

      const bestByUsage = new Map<string, OptimizerSearchState>();

      for (const state of nextStates) {
        const usageSignature = this.serializeUsageMap(state.usageByGroup);
        const existing = bestByUsage.get(usageSignature);

        if (!existing) {
          bestByUsage.set(usageSignature, state);
          continue;
        }

        if (this.comparePriorityScores(state.score, existing.score) > 0) {
          bestByUsage.set(usageSignature, state);
        }
      }

      beam = Array.from(bestByUsage.values())
        .sort((first, second) => this.comparePriorityScores(second.score, first.score))
        .slice(0, beamWidth);
    }

    const completed = beam
      .filter((state) => state.chosenPairs.length === maxPairs)
      .sort((first, second) => this.comparePriorityScores(second.score, first.score));

    const bestState = completed[0] ?? null;
    if (!bestState) {
      return [];
    }

    return bestState.chosenPairs.flatMap((pairCandidate) => [
      {
        setType: pairCandidate.atk.setType,
        slots: pairCandidate.atk.slots.map((slot) => ({ ...slot })),
        stats: pairCandidate.atk.stats,
        featherStats: pairCandidate.atk.featherStats,
        setBonusLevel: pairCandidate.atk.setBonusLevel,
        activeSetBonus: pairCandidate.atk.activeSetBonus
      },
      {
        setType: pairCandidate.def.setType,
        slots: pairCandidate.def.slots.map((slot) => ({ ...slot })),
        stats: pairCandidate.def.stats,
        featherStats: pairCandidate.def.featherStats,
        setBonusLevel: pairCandidate.def.setBonusLevel,
        activeSetBonus: pairCandidate.def.activeSetBonus
      }
    ]);
  }

  private serializeUsageMap(usageByGroup: Map<string, number>): string {
    return Array.from(usageByGroup.entries())
      .sort((first, second) => first[0].localeCompare(second[0]))
      .map(([group, value]) => `${group}:${value}`)
      .join('|');
  }

  private calculateStatsForSlots(
    setType: SetType,
    slots: OptimizerSlot[]
  ): { activeSetBonus: FeatherSetBonus | null; stats: AggregatedStat[]; featherStats: AggregatedStat[]; setBonusLevel: number } {
    const totalsByStatCode = new Map<number, number>();
    const selectedFeathers: FeatherView[] = [];

    for (const slot of slots) {
      const feather = this.featherById.get(slot.featherId);
      if (!feather) {
        continue;
      }

      selectedFeathers.push(feather);

      for (const stat of feather.stats) {
        const scaledValue = this.getStatValueAtLevel(stat.statValue, slot.level);
        const currentTotal = totalsByStatCode.get(stat.statCode) ?? 0;
        totalsByStatCode.set(stat.statCode, currentTotal + scaledValue);
      }
    }

    const activeSetBonus = this.findMatchingSetBonusForFeathers(setType, selectedFeathers);
    const setBonusLevel = this.getOptimizerSetBonusLevel(slots);

    // Phase 1: apply grouped % bonuses only — captures featherStats (no flat set stats)
    const afterGrouped = new Map(totalsByStatCode);
    if (activeSetBonus) {
      for (const groupedBonus of activeSetBonus.setBonusesGrouped) {
        const bonusValue = this.getStatValueAtLevel(groupedBonus.statBonus, setBonusLevel);
        for (const statCode of groupedBonus.statIncluded) {
          if (groupedBonus.isPercentage) {
            const current = afterGrouped.get(statCode);
            if (current !== undefined) {
              afterGrouped.set(statCode, this.roundStatValue(current * (1 + bonusValue / 100)));
            }
          } else {
            afterGrouped.set(statCode, this.roundStatValue((afterGrouped.get(statCode) ?? 0) + bonusValue));
          }
        }
      }
    }

    const featherStats = Array.from(afterGrouped.entries())
      .map(([statCode, statValue]) => ({
        statCode,
        statName: this.getStatName(statCode),
        statValue: this.roundStatValue(statValue)
      }))
      .sort((a, b) => b.statValue - a.statValue);

    // Phase 2: apply flat set bonuses on top of grouped result
    if (activeSetBonus) {
      for (const setBonusStat of activeSetBonus.setBonuses) {
        const bonusValue = this.getStatValueAtLevel(setBonusStat.statValue, setBonusLevel);
        const current = afterGrouped.get(setBonusStat.statCode) ?? 0;
        afterGrouped.set(setBonusStat.statCode, this.roundStatValue(current + bonusValue));
      }
    }

    const stats = Array.from(afterGrouped.entries())
      .map(([statCode, statValue]) => ({
        statCode,
        statName: this.getStatName(statCode),
        statValue: this.roundStatValue(statValue)
      }))
      .sort((a, b) => b.statValue - a.statValue);

    return {
      activeSetBonus,
      stats,
      featherStats,
      setBonusLevel
    };
  }
  private getOptimizerSetBonusLevel(slots: OptimizerSlot[]): number {
    if (slots.length === 0) {
      return 1;
    }

    return slots.reduce((minimum, slot) => Math.min(minimum, slot.level), this.maxFeatherLevel);
  }

  private findMatchingSetBonusForFeathers(setType: SetType, selectedFeathers: FeatherView[]): FeatherSetBonus | null {
    for (const setBonus of this.featherSetBonuses) {
      if (setBonus.setClassification !== setType) {
        continue;
      }

      if (setBonus.setRequirement.length !== selectedFeathers.length) {
        continue;
      }

      const requirementCounts = this.toTierCountMap(setBonus.setRequirement);
      const selectedCounts = this.toTierCountMap(selectedFeathers.map((feather) => feather.tier));

      if (this.areTierCountMapsEqual(requirementCounts, selectedCounts)) {
        return setBonus;
      }
    }

    return null;
  }

  private getInventoryGroupKey(feather: FeatherView): string {
    const costTier = feather.costTier ?? -1;
    return `${costTier}`;
  }

  private isFeatherCompatibleWithSet(featherType: FeatherType, setType: SetType): boolean {
    if (setType === 'ATK') {
      return featherType === 'ATK' || featherType === 'MIX';
    }

    return featherType === 'DEF' || featherType === 'MIX';
  }

  private mergeUsageMaps(first: Map<string, number>, second: Map<string, number>): Map<string, number> {
    const merged = new Map(first);

    for (const [groupKey, usage] of second.entries()) {
      const current = merged.get(groupKey) ?? 0;
      merged.set(groupKey, current + usage);
    }

    return merged;
  }

  private hasInventoryForUsage(inventoryByGroup: Map<string, number>, usageByGroup: Map<string, number>): boolean {
    for (const [groupKey, usage] of usageByGroup.entries()) {
      if ((inventoryByGroup.get(groupKey) ?? 0) < usage) {
        return false;
      }
    }

    return true;
  }

  private subtractUsageFromInventory(
    inventoryByGroup: Map<string, number>,
    usageByGroup: Map<string, number>
  ): Map<string, number> {
    const next = new Map(inventoryByGroup);

    for (const [groupKey, usage] of usageByGroup.entries()) {
      const remaining = (next.get(groupKey) ?? 0) - usage;
      if (remaining <= 0) {
        next.delete(groupKey);
      } else {
        next.set(groupKey, remaining);
      }
    }

    return next;
  }

  private getStatValueFromAggregated(stats: AggregatedStat[], statCode: number): number {
    return stats.find((stat) => stat.statCode === statCode)?.statValue ?? 0;
  }

  private getSecondaryScore(stats: AggregatedStat[], excludedStatCode: number): number {
    return stats
      .filter((stat) => stat.statCode !== excludedStatCode)
      .reduce((sum, stat) => sum + stat.statValue, 0);
  }

  private calculatePriorityScore(
    stats: AggregatedStat[],
    primaryStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null,
    power = 0
  ): OptimizerPriorityScore {
    const excluded = new Set<number>([primaryStatCode]);
    const secondary = secondaryStatCode === null ? 0 : this.getStatValueFromAggregated(stats, secondaryStatCode);
    const third = thirdStatCode === null ? 0 : this.getStatValueFromAggregated(stats, thirdStatCode);

    if (secondaryStatCode !== null) {
      excluded.add(secondaryStatCode);
    }

    if (thirdStatCode !== null) {
      excluded.add(thirdStatCode);
    }

    const overflow = stats
      .filter((stat) => !excluded.has(stat.statCode))
      .reduce((sum, stat) => sum + stat.statValue, 0);

    return {
      primary: this.getStatValueFromAggregated(stats, primaryStatCode),
      secondary,
      third,
      overflow,
      power
    };
  }

  private comparePriorityScores(first: OptimizerPriorityScore, second: OptimizerPriorityScore): number {
    const firstEffective = first.primary + first.power * this.powerStatEquivalentFactor;
    const secondEffective = second.primary + second.power * this.powerStatEquivalentFactor;

    if (firstEffective !== secondEffective) {
      return firstEffective - secondEffective;
    }

    if (first.secondary !== second.secondary) {
      return first.secondary - second.secondary;
    }

    if (first.third !== second.third) {
      return first.third - second.third;
    }

    return first.overflow - second.overflow;
  }

  private aggregateStats(statLists: AggregatedStat[][]): AggregatedStat[] {
    const totalsByCode = new Map<number, number>();

    for (const statList of statLists) {
      for (const stat of statList) {
        const current = totalsByCode.get(stat.statCode) ?? 0;
        totalsByCode.set(stat.statCode, current + stat.statValue);
      }
    }

    return Array.from(totalsByCode.entries())
      .map(([statCode, statValue]) => ({
        statCode,
        statName: this.getStatName(statCode),
        statValue: this.roundStatValue(statValue)
      }))
      .sort((a, b) => b.statValue - a.statValue);
  }

  private allocateSetLevelsWithinPools(
    sets: OptimizerSetResult[],
    inventoryByGroup: Map<string, number>,
    targetStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): OptimizerSetResult[] {
    const workingSets = sets.map((set) => ({
      ...set,
      slots: set.slots.map((slot) => ({ ...slot }))
    }));

    const remainingByTier = new Map<number, number>();
    for (const [groupKey, amount] of inventoryByGroup.entries()) {
      const tier = Number.parseInt(groupKey, 10);
      if (!Number.isNaN(tier)) {
        remainingByTier.set(tier, amount);
      }
    }

    for (const set of workingSets) {
      for (const slot of set.slots) {
        const feather = this.featherById.get(slot.featherId);
        if (!feather) {
          continue;
        }

        const tier = feather.costTier ?? -1;
        const baseCost = feather.costLevels[0] ?? 1;
        const remaining = remainingByTier.get(tier) ?? 0;
        remainingByTier.set(tier, Math.max(0, remaining - baseCost));
        slot.level = 1;
      }
    }

    let totals = this.calculateOptimizerTotals(
      workingSets,
      targetStatCode,
      secondaryStatCode,
      thirdStatCode
    );

    while (true) {
      let bestSetIndex = -1;
      let bestSlotIndex = -1;
      let bestTier = 0;
      let bestAdditionalCost = 0;
      let bestDeltaScore: OptimizerPriorityScore | null = null;

      for (let setIndex = 0; setIndex < workingSets.length; setIndex += 1) {
        const set = workingSets[setIndex];

        for (let slotIndex = 0; slotIndex < set.slots.length; slotIndex += 1) {
          const slot = set.slots[slotIndex];
          const feather = this.featherById.get(slot.featherId);
          if (!feather || slot.level >= this.maxFeatherLevel) {
            continue;
          }

          const tier = feather.costTier ?? -1;
          const currentTierRemaining = remainingByTier.get(tier) ?? 0;
          const currentCost = feather.costLevels[slot.level - 1] ?? 0;
          const nextCost = feather.costLevels[slot.level] ?? currentCost;
          const additionalCost = Math.max(0, nextCost - currentCost);

          if (currentTierRemaining < additionalCost) {
            continue;
          }

          slot.level += 1;
          const upgradedTotals = this.calculateOptimizerTotals(
            workingSets,
            targetStatCode,
            secondaryStatCode,
            thirdStatCode
          );
          slot.level -= 1;

          const deltaScore: OptimizerPriorityScore = {
            primary: upgradedTotals.primary - totals.primary,
            secondary: upgradedTotals.secondary - totals.secondary,
            third: upgradedTotals.third - totals.third,
            overflow: upgradedTotals.overflow - totals.overflow,
            power: upgradedTotals.power - totals.power
          };

          const isBetterDelta =
            bestDeltaScore === null || this.comparePriorityScores(deltaScore, bestDeltaScore) > 0;
          const isBetterCostTie = additionalCost < bestAdditionalCost || bestAdditionalCost === 0;

          if (isBetterDelta || (bestDeltaScore !== null && this.comparePriorityScores(deltaScore, bestDeltaScore) === 0 && isBetterCostTie)) {
            bestSetIndex = setIndex;
            bestSlotIndex = slotIndex;
            bestTier = tier;
            bestAdditionalCost = additionalCost;
            bestDeltaScore = deltaScore;
          }
        }
      }

      if (bestSetIndex < 0 || bestSlotIndex < 0) {
        break;
      }

      if (
        !bestDeltaScore ||
        this.comparePriorityScores(bestDeltaScore, { primary: 0, secondary: 0, third: 0, overflow: 0, power: 0 }) <= 0
      ) {
        break;
      }

      const targetSet = workingSets[bestSetIndex];
      const targetSlot = targetSet.slots[bestSlotIndex];
      targetSlot.level += 1;
      const currentRemaining = remainingByTier.get(bestTier) ?? 0;
      remainingByTier.set(bestTier, Math.max(0, currentRemaining - bestAdditionalCost));
      totals = this.calculateOptimizerTotals(
        workingSets,
        targetStatCode,
        secondaryStatCode,
        thirdStatCode
      );
    }

    return workingSets.map((set) => this.recalculateOptimizerSetResult(set));
  }

  private calculateOptimizerTotals(
    sets: OptimizerSetResult[],
    primaryStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): OptimizerPriorityScore {
    const recalculatedSets = sets.map((set) => this.recalculateOptimizerSetResult(set));
    const combined = this.aggregateStats(recalculatedSets.map((set) => set.stats));
    const totalPower = recalculatedSets.reduce((sum, set) => sum + (this.computeSlotsPower(set.slots) ?? 0), 0);

    return this.calculatePriorityScore(
      combined,
      primaryStatCode,
      secondaryStatCode,
      thirdStatCode,
      totalPower
    );
  }

  private computeSlotsPower(slots: ReadonlyArray<{ featherId: string | null; level: number }>): number | null {
    if (slots.length !== this.maxSlotsPerSet) {
      return null;
    }

    if (slots.some((slot) => !slot.featherId)) {
      return null;
    }

    let baseTotal = 0;
    let goldCount = 0;
    let minLevel = this.maxFeatherLevel;

    for (const slot of slots) {
      const feather = this.featherById.get(slot.featherId!);
      if (!feather) {
        return null;
      }

      const costTier = feather.costTier ?? 2;
      const powerTable = this.featherIntrinsicPowerByTier.get(costTier) ?? this.featherIntrinsicPowerByTier.get(2)!;
      const level = Math.max(0, Math.min(slot.level, this.maxFeatherLevel));
      baseTotal += powerTable[level] ?? 0;

      if (feather.tier === 'Gold') {
        goldCount += 1;
      }

      minLevel = Math.min(minLevel, level);
    }

    const bonusTable = this.setBonusPowerByGoldCount.get(goldCount) ?? this.setBonusPowerByGoldCount.get(0)!;
    const setBonusLevel = Math.max(0, Math.min(minLevel, this.maxFeatherLevel));
    const bonusPower = bonusTable[setBonusLevel] ?? 0;

    return Math.round(baseTotal + bonusPower);
  }

  private calculatePowerScore(
    stats: AggregatedStat[],
    primaryStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): number {
    const score = this.calculatePriorityScore(
      stats,
      primaryStatCode,
      secondaryStatCode,
      thirdStatCode
    );
    const weightedPower = score.primary * 4 + score.secondary * 2 + score.third + score.overflow;
    return this.roundStatValue(weightedPower);
  }

  private recalculateOptimizerSetResult(set: OptimizerSetResult): OptimizerSetResult {
    const recalculated = this.calculateStatsForSlots(set.setType, set.slots);

    return {
      ...set,
      stats: recalculated.stats,
        featherStats: recalculated.featherStats,
        setBonusLevel: recalculated.setBonusLevel,
      activeSetBonus: recalculated.activeSetBonus
    };
  }

  private enforcePoolBudgets(
    sets: OptimizerSetResult[],
    inventoryByGroup: Map<string, number>,
    primaryStatCode: number,
    secondaryStatCode: number | null,
    thirdStatCode: number | null
  ): OptimizerSetResult[] {
    const workingSets = sets.map((set) => ({
      ...set,
      slots: set.slots.map((slot) => ({ ...slot }))
    }));

    while (true) {
      const usageByTier = this.calculatePoolUsageByTier(workingSets);
      const overdrawn = Array.from(usageByTier.entries())
        .map(([tier, used]) => ({
          tier,
          used,
          available: inventoryByGroup.get(`${tier}`) ?? 0,
          over: used - (inventoryByGroup.get(`${tier}`) ?? 0)
        }))
        .filter((entry) => entry.over > 0)
        .sort((first, second) => second.over - first.over);

      if (overdrawn.length === 0) {
        break;
      }

      const targetTier = overdrawn[0].tier;
      const currentScore = this.calculateOptimizerTotals(
        workingSets,
        primaryStatCode,
        secondaryStatCode,
        thirdStatCode
      );

      let bestSetIndex = -1;
      let bestSlotIndex = -1;
      let bestReducedCost = 0;
      let bestScoreAfterDowngrade: OptimizerPriorityScore | null = null;

      for (let setIndex = 0; setIndex < workingSets.length; setIndex += 1) {
        const set = workingSets[setIndex];

        for (let slotIndex = 0; slotIndex < set.slots.length; slotIndex += 1) {
          const slot = set.slots[slotIndex];
          if (slot.level <= 1) {
            continue;
          }

          const feather = this.featherById.get(slot.featherId);
          if (!feather || (feather.costTier ?? -1) !== targetTier) {
            continue;
          }

          const currentCost = feather.costLevels[slot.level - 1] ?? 0;
          const previousCost = feather.costLevels[slot.level - 2] ?? currentCost;
          const reducedCost = Math.max(0, currentCost - previousCost);

          if (reducedCost <= 0) {
            continue;
          }

          slot.level -= 1;
          const downgradedScore = this.calculateOptimizerTotals(
            workingSets,
            primaryStatCode,
            secondaryStatCode,
            thirdStatCode
          );
          slot.level += 1;

          const isBetterScore =
            !bestScoreAfterDowngrade ||
            this.comparePriorityScores(downgradedScore, bestScoreAfterDowngrade) > 0;
          const isEqualScore =
            !!bestScoreAfterDowngrade &&
            this.comparePriorityScores(downgradedScore, bestScoreAfterDowngrade) === 0;

          if (isBetterScore || (isEqualScore && reducedCost > bestReducedCost)) {
            bestSetIndex = setIndex;
            bestSlotIndex = slotIndex;
            bestReducedCost = reducedCost;
            bestScoreAfterDowngrade = downgradedScore;
          }
        }
      }

      if (bestSetIndex < 0 || bestSlotIndex < 0 || !bestScoreAfterDowngrade) {
        break;
      }

      if (this.comparePriorityScores(currentScore, bestScoreAfterDowngrade) < 0) {
        break;
      }

      workingSets[bestSetIndex].slots[bestSlotIndex].level -= 1;
    }

    return workingSets.map((set) => this.recalculateOptimizerSetResult(set));
  }

  private calculatePoolUsageByTier(sets: OptimizerSetResult[]): Map<number, number> {
    const usage = new Map<number, number>();

    for (const set of sets) {
      for (const slot of set.slots) {
        const feather = this.featherById.get(slot.featherId);
        if (!feather) {
          continue;
        }

        const tier = feather.costTier ?? -1;
        const cost = feather.costLevels[slot.level - 1] ?? 0;
        const current = usage.get(tier) ?? 0;
        usage.set(tier, current + cost);
      }
    }

    return usage;
  }

  private buildTransformationSummary(
    sets: OptimizerSetResult[],
    inventoryByGroup: Map<string, number>
  ): OptimizerTransformationSummary[] {
    const assignmentCountsByTier = new Map<number, Map<string, OptimizerTransformationAssignment>>();

    for (const set of sets) {
      for (const slot of set.slots) {
        const feather = this.featherById.get(slot.featherId);
        if (!feather) {
          continue;
        }

        const costTier = feather.costTier ?? -1;
        if (!assignmentCountsByTier.has(costTier)) {
          assignmentCountsByTier.set(costTier, new Map<string, OptimizerTransformationAssignment>());
        }

        const assignmentsForTier = assignmentCountsByTier.get(costTier);
        if (!assignmentsForTier) {
          continue;
        }

        const existing = assignmentsForTier.get(feather.id);
        const consumedFromPool = feather.costLevels[slot.level - 1] ?? 1;

        if (existing) {
          existing.used += consumedFromPool;
          existing.slotCount += 1;
          continue;
        }

        assignmentsForTier.set(feather.id, {
          featherName: feather.name,
          featherType: feather.normalizedType,
          featherTier: feather.tier,
          used: consumedFromPool,
          slotCount: 1
        });
      }
    }

    const costTiers = Array.from(inventoryByGroup.keys())
      .map((groupKey) => Number.parseInt(groupKey, 10))
      .filter((costTier) => Number.isFinite(costTier));

    return costTiers
      .sort((first, second) => first - second)
      .map((costTier) => {
        const assignments = Array.from(assignmentCountsByTier.get(costTier)?.values() ?? []).sort((first, second) => {
          if (second.used !== first.used) {
            return second.used - first.used;
          }

          return first.featherName.localeCompare(second.featherName);
        });

        const available = inventoryByGroup.get(`${costTier}`) ?? 0;
        const used = assignments.reduce((sum, assignment) => sum + assignment.used, 0);

        return {
          costTier,
          available,
          used,
          remaining: Math.max(0, available - used),
          assignments
        };
      })
      .filter((summary) => summary.available > 0);
  }

  private applySetBonuses(
    baseTotalsByStatCode: Map<number, number>,
    activeSetBonus: FeatherSetBonus,
    setBonusLevel: number
  ): Map<number, number> {
    const totalsByStatCode = new Map(baseTotalsByStatCode);

    // Grouped bonuses scale/add from feather-only totals.
    for (const groupedBonus of activeSetBonus.setBonusesGrouped) {
      const bonusValue = this.getStatValueAtLevel(groupedBonus.statBonus, setBonusLevel);

      for (const statCode of groupedBonus.statIncluded) {
        const currentTotal = totalsByStatCode.get(statCode);

        if (groupedBonus.isPercentage) {
          if (currentTotal === undefined) {
            continue;
          }

          totalsByStatCode.set(statCode, this.roundStatValue(currentTotal * (1 + bonusValue / 100)));
          continue;
        }

        const baseValue = currentTotal ?? 0;
        totalsByStatCode.set(statCode, this.roundStatValue(baseValue + bonusValue));
      }
    }

    // Flat set stats are added after grouped bonuses.
    for (const setBonusStat of activeSetBonus.setBonuses) {
      const bonusValue = this.getStatValueAtLevel(setBonusStat.statValue, setBonusLevel);
      const currentTotal = totalsByStatCode.get(setBonusStat.statCode) ?? 0;
      totalsByStatCode.set(setBonusStat.statCode, this.roundStatValue(currentTotal + bonusValue));
    }

    return totalsByStatCode;
  }

  private calculateSetStatsWithBonuses(set: FeatherSet): {
    activeSetBonus: FeatherSetBonus | null;
    stats: AggregatedStat[];
    featherStats: AggregatedStat[];
    setBonusLevel: number;
  } {
    const totalsByStatCode = new Map<number, number>();

    for (const slot of set.slots) {
      if (!slot.featherId) {
        continue;
      }

      const feather = this.featherById.get(slot.featherId);
      if (!feather) {
        continue;
      }

      for (const stat of feather.stats) {
        const scaledValue = this.getStatValueAtLevel(stat.statValue, slot.level);
        const currentTotal = totalsByStatCode.get(stat.statCode) ?? 0;
        totalsByStatCode.set(stat.statCode, currentTotal + scaledValue);
      }
    }

    const activeSetBonus = this.findMatchingSetBonus(set);
    const setBonusLevel = this.getSetBonusLevel(set);

    // Phase 1: apply grouped % bonuses — captures featherStats
    const afterGrouped = new Map(totalsByStatCode);
    if (activeSetBonus) {
      for (const groupedBonus of activeSetBonus.setBonusesGrouped) {
        const bonusValue = this.getStatValueAtLevel(groupedBonus.statBonus, setBonusLevel);
        for (const statCode of groupedBonus.statIncluded) {
          if (groupedBonus.isPercentage) {
            const current = afterGrouped.get(statCode);
            if (current !== undefined) {
              afterGrouped.set(statCode, this.roundStatValue(current * (1 + bonusValue / 100)));
            }
          } else {
            afterGrouped.set(statCode, this.roundStatValue((afterGrouped.get(statCode) ?? 0) + bonusValue));
          }
        }
      }
    }

    const featherStats = Array.from(afterGrouped.entries())
      .map(([statCode, statValue]) => ({
        statCode,
        statName: this.getStatName(statCode),
        statValue: this.roundStatValue(statValue)
      }))
      .sort((a, b) => b.statValue - a.statValue);

    // Phase 2: apply flat set bonuses on top
    if (activeSetBonus) {
      for (const setBonusStat of activeSetBonus.setBonuses) {
        const bonusValue = this.getStatValueAtLevel(setBonusStat.statValue, setBonusLevel);
        const current = afterGrouped.get(setBonusStat.statCode) ?? 0;
        afterGrouped.set(setBonusStat.statCode, this.roundStatValue(current + bonusValue));
      }
    }

    const stats = Array.from(afterGrouped.entries())
      .map(([statCode, statValue]) => ({
        statCode,
        statName: this.getStatName(statCode),
        statValue: this.roundStatValue(statValue)
      }))
      .sort((a, b) => b.statValue - a.statValue);

    return {
      activeSetBonus,
      stats,
      featherStats,
      setBonusLevel
    };
  }

  hasOtherSetOfType(set: FeatherSet): boolean {
    return this.featherSets.some(
      (candidateSet) => candidateSet.id !== set.id && candidateSet.setType === set.setType
    );
  }

  copySetToOthers(sourceSet: FeatherSet): void {
    if (!this.hasOtherSetOfType(sourceSet)) {
      return;
    }

    const copiedSlots = sourceSet.slots.map((slot) => ({
      featherId: slot.featherId,
      level: slot.level
    }));

    this.featherSets = this.featherSets.map((set) => {
      if (set.id === sourceSet.id || set.setType !== sourceSet.setType) {
        return set;
      }

      return {
        ...set,
        slots: copiedSlots.map((slot) => ({ ...slot }))
      };
    });

    if (this.showBuilderInventory) {
      this.reconcileBuilderLevelsWithInventory();
    }
  }

  openReferenceModal(): void {
    this.showReferenceModal = true;
  }

  closeReferenceModal(): void {
    this.showReferenceModal = false;
  }

  openPicker(set: FeatherSet, slotIndex: number): void {
    this.activePickerContext = {
      setId: set.id,
      slotIndex
    };
    this.showPickerModal = true;
  }

  closePicker(): void {
    this.showPickerModal = false;
    this.activePickerContext = null;
  }

  clearSlot(set: FeatherSet, slotIndex: number): void {
    set.slots[slotIndex] = {
      featherId: null,
      level: 1
    };

    if (this.showBuilderInventory) {
      this.reconcileBuilderLevelsWithInventory();
    }
  }

  getPickerSetType(): SetType | null {
    const activeSet = this.getActivePickerSet();
    return activeSet?.setType ?? null;
  }

  isPickerOptionDisabled(featherId: string): boolean {
    const activeSet = this.getActivePickerSet();
    const slotIndex = this.activePickerContext?.slotIndex;

    if (!activeSet || slotIndex === undefined) {
      return true;
    }

    return this.isFeatherDisabledInSet(activeSet, slotIndex, featherId);
  }

  selectFeatherFromPicker(featherId: string): void {
    const activeSet = this.getActivePickerSet();
    const slotIndex = this.activePickerContext?.slotIndex;

    if (!activeSet || slotIndex === undefined) {
      return;
    }

    if (this.isFeatherDisabledInSet(activeSet, slotIndex, featherId)) {
      return;
    }

    activeSet.slots[slotIndex].featherId = featherId;
    if (activeSet.slots[slotIndex].level < 1) {
      activeSet.slots[slotIndex].level = 1;
    }

    if (this.showBuilderInventory) {
      const maxAllowed = this.getBuilderSlotMaxLevel(activeSet, slotIndex);
      activeSet.slots[slotIndex].level = Math.min(activeSet.slots[slotIndex].level, maxAllowed);
      this.reconcileBuilderLevelsWithInventory();
    }

    this.closePicker();
  }

  private getInventoryAvailabilityByTier(): Map<number, number> {
    const availabilityByTier = new Map<number, number>();
    const inventoryByGroup = this.buildInventoryByGroup();

    for (const [groupKey, amount] of inventoryByGroup.entries()) {
      const tier = Number.parseInt(groupKey, 10);
      if (Number.isNaN(tier)) {
        continue;
      }

      availabilityByTier.set(tier, amount);
    }

    return availabilityByTier;
  }

  private loadSavedBuildsFromStorage(): void {
    if (!this.canUseLocalStorage()) {
      this.savedBuilds = [];
      return;
    }

    try {
      const raw = localStorage.getItem(this.savedBuildsStorageKey);
      if (!raw) {
        this.savedBuilds = [];
        return;
      }

      const parsed = JSON.parse(raw) as SavedBuildEntry[];
      if (!Array.isArray(parsed)) {
        this.savedBuilds = [];
        return;
      }

      this.savedBuilds = parsed
        .filter((entry) => {
          return (
            !!entry &&
            typeof entry.id === 'string' &&
            typeof entry.name === 'string' &&
            typeof entry.createdAt === 'number' &&
            Array.isArray(entry.sets) &&
            Array.isArray(entry.inventory) &&
            typeof entry.showBuilderInventory === 'boolean'
          );
        })
        .sort((first, second) => second.createdAt - first.createdAt)
        .slice(0, this.savedBuildLimit);

      this.ensureValidBuildComparisonSelection();
    } catch {
      this.savedBuilds = [];
      this.ensureValidBuildComparisonSelection();
    }
  }

  private ensureValidBuildComparisonSelection(): void {
    const options = this.getBuildComparisonOptions();
    const optionIds = new Set(options.map((option) => option.id));

    if (!optionIds.has(this.comparisonBaseBuildId)) {
      this.comparisonBaseBuildId = 'current';
    }

    if (!this.comparisonTargetBuildId || !optionIds.has(this.comparisonTargetBuildId)) {
      this.comparisonTargetBuildId = options.find((option) => option.id !== this.comparisonBaseBuildId)?.id ?? null;
      return;
    }

    if (this.comparisonTargetBuildId === this.comparisonBaseBuildId) {
      this.comparisonTargetBuildId = options.find((option) => option.id !== this.comparisonBaseBuildId)?.id ?? null;
    }
  }

  private getCombinedStatsForComparisonOption(optionId: string): AggregatedStat[] {
    if (optionId === 'current') {
      return this.getBuilderTotalStats();
    }

    const savedBuild = this.savedBuilds.find((build) => build.id === optionId);
    if (!savedBuild) {
      return [];
    }

    return this.calculateCombinedStatsForSavedBuild(savedBuild);
  }

  private calculateCombinedStatsForSavedBuild(savedBuild: SavedBuildEntry): AggregatedStat[] {
    const sets: FeatherSet[] = savedBuild.sets.map((set, setIndex) => ({
      id: setIndex + 1,
      setType: set.setType,
      slots: set.slots.map((slot) => ({
        featherId: slot.featherId,
        level: Math.max(1, Math.min(slot.level, this.maxFeatherLevel))
      }))
    }));

    const statsBySet = sets
      .map((set) => this.calculateSetStatsWithBonuses(set).stats)
      .filter((stats) => stats.length > 0);

    return this.aggregateStats(statsBySet);
  }

  private persistSavedBuilds(): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    try {
      localStorage.setItem(this.savedBuildsStorageKey, JSON.stringify(this.savedBuilds));
    } catch {
      // Ignore local storage failures and keep runtime state available.
    }
  }

  private canUseLocalStorage(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private getBuilderUsageByTier(): Map<number, number> {
    const usageByTier = new Map<number, number>();

    for (const set of this.featherSets) {
      for (const slot of set.slots) {
        if (!slot.featherId) {
          continue;
        }

        const feather = this.featherById.get(slot.featherId);
        if (!feather) {
          continue;
        }

        const tier = feather.costTier ?? -1;
        const slotCost = feather.costLevels[slot.level - 1] ?? 0;
        const current = usageByTier.get(tier) ?? 0;
        usageByTier.set(tier, current + slotCost);
      }
    }

    return usageByTier;
  }

  private reconcileBuilderLevelsWithInventory(): void {
    if (!this.showBuilderInventory) {
      this.builderInventoryMessage = '';
      return;
    }

    const availabilityByTier = this.getInventoryAvailabilityByTier();

    while (true) {
      const usageByTier = this.getBuilderUsageByTier();
      const overdrawn = Array.from(usageByTier.entries())
        .map(([tier, used]) => ({
          tier,
          used,
          available: availabilityByTier.get(tier) ?? 0,
          over: used - (availabilityByTier.get(tier) ?? 0)
        }))
        .filter((entry) => entry.over > 0)
        .sort((first, second) => second.over - first.over);

      if (overdrawn.length === 0) {
        this.builderInventoryMessage = '';
        return;
      }

      const targetTier = overdrawn[0].tier;
      let bestSetIndex = -1;
      let bestSlotIndex = -1;
      let bestReduction = 0;

      for (let setIndex = 0; setIndex < this.featherSets.length; setIndex += 1) {
        const set = this.featherSets[setIndex];

        for (let slotIndex = 0; slotIndex < set.slots.length; slotIndex += 1) {
          const slot = set.slots[slotIndex];
          if (!slot.featherId || slot.level <= 1) {
            continue;
          }

          const feather = this.featherById.get(slot.featherId);
          if (!feather || (feather.costTier ?? -1) !== targetTier) {
            continue;
          }

          const currentCost = feather.costLevels[slot.level - 1] ?? 0;
          const previousCost = feather.costLevels[slot.level - 2] ?? currentCost;
          const reduction = Math.max(0, currentCost - previousCost);

          if (reduction > bestReduction) {
            bestReduction = reduction;
            bestSetIndex = setIndex;
            bestSlotIndex = slotIndex;
          }
        }
      }

      if (bestSetIndex < 0 || bestSlotIndex < 0) {
        this.builderInventoryMessage =
          'Current equipped feathers exceed your pooled Cost Tier inventory. Lower levels or change equipped feathers.';
        return;
      }

      this.featherSets[bestSetIndex].slots[bestSlotIndex].level -= 1;
    }
  }

  private groupFeathersByType(feathers: FeatherView[]): FeatherGroup[] {
    const orderedTypes: Array<'ATK' | 'DEF' | 'MIX'> = ['ATK', 'DEF', 'MIX'];
    const tierOrder = ['Gold', 'Purple', 'Blue'];
    const groupsMap = new Map<'ATK' | 'DEF' | 'MIX', Map<string, FeatherView[]>>();

    for (const type of orderedTypes) {
      groupsMap.set(type, new Map());
    }

    for (const feather of feathers) {
      const normalizedType = feather.normalizedType;

      if (!groupsMap.has(normalizedType)) {
        groupsMap.set(normalizedType, new Map());
      }

      const typeGroup = groupsMap.get(normalizedType)!;
      const tier = feather.tier as string;
      if (!typeGroup.has(tier)) {
        typeGroup.set(tier, []);
      }

      typeGroup.get(tier)!.push(feather);
    }

    return Array.from(groupsMap.entries())
      .filter(([, tierMap]) => tierMap.size > 0)
      .map(([type, tierMap]) => ({
        type,
        tierGroups: Array.from(tierMap.entries())
          .sort((a, b) => {
            const aIndex = tierOrder.indexOf(a[0]);
            const bIndex = tierOrder.indexOf(b[0]);
            return aIndex - bIndex;
          })
          .map(([tier, featherList]) => ({
            tier,
            feathers: featherList
          }))
      }));
  }

  private createFeatherSet(id: number, setType: SetType): FeatherSet {
    return {
      id,
      setType,
      slots: Array.from({ length: this.maxSlotsPerSet }, () => ({ featherId: null, level: 1 }))
    };
  }

  private buildFeatherViews(rawFeathers: Feather[]): FeatherView[] {
    return rawFeathers.map((feather, index) => {
      const normalizedType = feather.type.toUpperCase() as 'ATK' | 'DEF' | 'MIX';

      return {
        ...feather,
        id: `${normalizedType}-${feather.name}-${index}`,
        normalizedType,
        costLevels: this.generateCostLevels(feather.cost)
      };
    });
  }

  private generateCostLevels(cost: number | number[]): number[] {
    const baseLevels = Array.isArray(cost) ? [...cost] : [cost];
    const cleaned = baseLevels
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0)
      .map((value) => Math.round(value));

    const levels = cleaned.length > 0 ? cleaned : [1];

    while (levels.length < this.maxFeatherLevel) {
      const last = levels[levels.length - 1];
      const previous = levels[levels.length - 2] ?? Math.max(1, last - 1);
      const delta = Math.max(1, last - previous);
      const next = last + Math.max(1, Math.round(delta * 1.15));
      levels.push(next);
    }

    return levels.slice(0, this.maxFeatherLevel);
  }

  private scaleStatValueByLevel(baseValue: number, level: number): number {
    const scaled = baseValue * level;
    return Number.isInteger(baseValue) ? Math.round(scaled) : Math.round(scaled * 100) / 100;
  }

  private getStatValueAtLevel(statValues: number[], level: number): number {
    // Clamp level to 1-based valid indices
    const index = Math.max(0, Math.min(level - 1, statValues.length - 1));
    return statValues[index] ?? 0;
  }

  private getSetBonusLevel(set: FeatherSet): number {
    // Find the minimum level among all equipped feathers
    let minLevel = this.maxFeatherLevel;
    let hasEquippedFeathers = false;

    for (const slot of set.slots) {
      if (slot.featherId) {
        minLevel = Math.min(minLevel, slot.level);
        hasEquippedFeathers = true;
      }
    }

    return hasEquippedFeathers ? minLevel : 1;
  }

  private findMatchingSetBonus(set: FeatherSet): FeatherSetBonus | null {
    const selectedFeathers = set.slots
      .map((slot) => (slot.featherId ? this.featherById.get(slot.featherId) ?? null : null))
      .filter((feather): feather is FeatherView => feather !== null);

    for (const setBonus of this.featherSetBonuses) {
      if (setBonus.setClassification !== set.setType) {
        continue;
      }

      if (setBonus.setRequirement.length !== selectedFeathers.length) {
        continue;
      }

      const requirementCounts = this.toTierCountMap(setBonus.setRequirement);
      const selectedCounts = this.toTierCountMap(selectedFeathers.map((feather) => feather.tier));

      if (this.areTierCountMapsEqual(requirementCounts, selectedCounts)) {
        return setBonus;
      }
    }

    return null;
  }

  private toTierCountMap(tiers: string[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const tier of tiers) {
      const normalizedTier = this.normalizeTier(tier);
      const current = counts.get(normalizedTier) ?? 0;
      counts.set(normalizedTier, current + 1);
    }

    return counts;
  }

  private areTierCountMapsEqual(first: Map<string, number>, second: Map<string, number>): boolean {
    if (first.size !== second.size) {
      return false;
    }

    for (const [key, value] of first.entries()) {
      if ((second.get(key) ?? 0) !== value) {
        return false;
      }
    }

    return true;
  }

  private normalizeTier(tier: string): string {
    const lowercaseTier = tier.toLowerCase();
    return lowercaseTier.charAt(0).toUpperCase() + lowercaseTier.slice(1);
  }

  private roundStatValue(value: number): number {
    // Decimal stats (e.g. PDMG/MDMG %) have base values between 0 and 1 — preserve 2dp.
    // All integer-based stats are floored per game rounding rules.
    if (value > 0 && value < 1) {
      return Math.round(value * 100) / 100;
    }
    return Math.floor(value);
  }

  private getActivePickerSet(): FeatherSet | null {
    const activeSetId = this.activePickerContext?.setId;
    if (activeSetId === undefined) {
      return null;
    }

    return this.featherSets.find((set) => set.id === activeSetId) ?? null;
  }
}
