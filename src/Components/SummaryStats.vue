<!-- Headline counts of venues per CfP status; each tile toggles a status filter. -->
<template>
  <section class="summary-stats">
    <div class="tile">
      <span class="value">{{ total }}</span>
      <span class="label">{{ t("summary.total") }}</span>
    </div>
    <button
      v-for="status in statuses"
      :key="status"
      type="button"
      class="tile clickable"
      :class="[`status-${status}`, { active: activeStatuses.includes(status) }]"
      :aria-pressed="activeStatuses.includes(status)"
      @click="$emit('toggle-status', status)"
    >
      <span class="value">{{ counts[status] }}</span>
      <span class="label">{{ t(`summary.${status}`) }}</span>
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { CFP_STATUS_VALUES, type CfpStatus } from "../Types/CfpStatus";

/** Status tiles summarising the whole dataset. */
export default defineComponent({
  name: "SummaryStats",
  props: {
    /** Total number of venues in the dataset. */
    total: { type: Number, required: true },
    /** Number of venues per status. */
    counts: { type: Object as PropType<Record<CfpStatus, number>>, required: true },
    /** Statuses currently selected in the filter. */
    activeStatuses: { type: Array as PropType<CfpStatus[]>, required: true },
  },
  emits: {
    /** Requests toggling the given status in the filter. */
    "toggle-status": (status: CfpStatus) => CFP_STATUS_VALUES.includes(status),
  },
  setup() {
    const { t } = useI18n();
    return { t, statuses: CFP_STATUS_VALUES };
  },
});
</script>

<style scoped>
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin: 20px 0;
}
.tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  text-align: left;
}
.clickable {
  cursor: pointer;
  border-left-width: 4px;
}
.clickable:hover {
  background: var(--color-surface-hover);
}
.clickable.active {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}
.status-open {
  border-left-color: var(--color-open);
}
.status-unknown {
  border-left-color: var(--color-unknown);
}
.status-closed {
  border-left-color: var(--color-closed);
}
.value {
  font-size: 1.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
