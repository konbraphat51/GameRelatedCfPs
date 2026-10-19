<!-- Search box, filter chips and sort selector for the venue list. -->
<template>
  <section class="filter-panel">
    <div class="top-row">
      <label class="field keyword">
        <span>{{ t("filter.keyword") }}</span>
        <input
          type="search"
          :value="criteria.keyword"
          :placeholder="t('filter.keywordPlaceholder')"
          @input="updateKeyword"
        />
      </label>
      <label class="field sort">
        <span>{{ t("filter.sort") }}</span>
        <select :value="sortKey" @change="updateSortKey">
          <option v-for="key in sortKeys" :key="key" :value="key">{{ t(`sort.${key}`) }}</option>
        </select>
      </label>
    </div>
    <div class="chip-rows">
      <ChipGroup
        v-for="group in chipGroups"
        :key="group.field"
        :class="{ wide: group.field === 'fields' }"
        :legend="t(group.legendKey)"
        :options="buildOptions(group.values, group.namespace)"
        :model-value="criteria[group.field]"
        @update:model-value="updateField(group.field, $event)"
      />
    </div>
    <div class="bottom-row">
      <span class="count">{{ t("filter.showing", { shown, total }) }}</span>
      <button type="button" class="reset" @click="$emit('reset')">{{ t("filter.reset") }}</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import ChipGroup, { type ChipOption } from "./ChipGroup.vue";
import type { FilterCriteria, SortKey } from "../Services/VenueFilter";
import { CFP_STATUS_VALUES } from "../Types/CfpStatus";
import { FIELD_VALUES, VENUE_TYPE_VALUES } from "../Types/Venue";

/** Filter fields that hold multi-select arrays. */
type ArrayField = Exclude<keyof FilterCriteria, "keyword" | "favoritesOnly">;

/** Definition of one chip group in the panel. */
interface ChipGroupDefinition {
  field: ArrayField;
  legendKey: string;
  namespace: string;
  values: readonly string[];
}

const SORT_KEYS: readonly SortKey[] = ["deadline", "event", "name"];

const CHIP_GROUPS: readonly ChipGroupDefinition[] = [
  {
    field: "venueTypes",
    legendKey: "filter.venueType",
    namespace: "venueType",
    values: VENUE_TYPE_VALUES,
  },
  {
    field: "regions",
    legendKey: "filter.region",
    namespace: "region",
    values: ["domestic", "international"],
  },
  { field: "statuses", legendKey: "filter.status", namespace: "status", values: CFP_STATUS_VALUES },
  { field: "scopes", legendKey: "filter.scope", namespace: "scope", values: ["whole", "track"] },
  { field: "fields", legendKey: "filter.field", namespace: "field", values: FIELD_VALUES },
];

/** Controls that edit FilterCriteria and the sort key. */
export default defineComponent({
  name: "FilterPanel",
  components: { ChipGroup },
  props: {
    /** Current filter criteria. */
    criteria: { type: Object as PropType<FilterCriteria>, required: true },
    /** Current sort key. */
    sortKey: { type: String as PropType<SortKey>, required: true },
    /** Number of venues after filtering. */
    shown: { type: Number, required: true },
    /** Number of venues before filtering. */
    total: { type: Number, required: true },
  },
  emits: {
    /** Emits replacement criteria. */
    "update:criteria": (criteria: FilterCriteria) => typeof criteria === "object",
    /** Emits the selected sort key. */
    "update:sortKey": (sortKey: SortKey) => SORT_KEYS.includes(sortKey),
    /** Requests clearing every filter. */
    reset: () => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    /** Builds chip options whose labels come from the given i18n namespace. */
    const buildOptions = (values: readonly string[], namespace: string): ChipOption[] =>
      values.map((value) => ({ value, label: t(`${namespace}.${value}`) }));

    /** Replaces one multi-select field. */
    const updateField = (field: ArrayField, values: string[]): void => {
      emit("update:criteria", { ...props.criteria, [field]: values });
    };

    /** Replaces the keyword from an input event. */
    const updateKeyword = (event: Event): void => {
      emit("update:criteria", {
        ...props.criteria,
        keyword: (event.target as HTMLInputElement).value,
      });
    };

    /** Replaces the sort key from a change event. */
    const updateSortKey = (event: Event): void => {
      emit("update:sortKey", (event.target as HTMLSelectElement).value as SortKey);
    };

    return {
      t,
      buildOptions,
      updateField,
      updateKeyword,
      updateSortKey,
      sortKeys: SORT_KEYS,
      chipGroups: CHIP_GROUPS,
    };
  },
});
</script>

<style scoped>
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}
.top-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}
.keyword {
  flex: 1 1 260px;
}
.sort {
  flex: 0 0 auto;
}
input,
select {
  font: inherit;
  font-weight: 400;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 10px;
  min-width: 0;
}
.chip-rows {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px 20px;
}
.wide {
  grid-column: 1 / -1;
}
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.count {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
.reset {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  padding: 6px 12px;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}
.reset:hover {
  background: var(--color-surface-hover);
}
</style>
