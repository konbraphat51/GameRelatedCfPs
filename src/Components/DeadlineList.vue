<!-- Chronological list of submission deadlines with remaining-day counters. -->
<template>
  <ol class="deadline-list">
    <li
      v-for="(deadline, index) in sortedDeadlines"
      :key="`${deadline.date}-${index}`"
      :class="{
        passed: isPassed(deadline),
        next: nextDeadline !== null && deadline === nextDeadline,
      }"
    >
      <span class="date">{{ formatDate(deadline.date) }}</span>
      <span class="label">
        {{ deadline.label }}
        <span v-if="deadline.note" class="note">({{ deadline.note }})</span>
      </span>
      <span class="remaining">
        {{ isPassed(deadline) ? t("card.passed") : t("card.daysLeft", daysUntil(deadline)) }}
      </span>
    </li>
  </ol>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import type { Deadline } from "../Types/Venue";
import { isDeadlinePassed, sortDeadlines } from "../Services/CfpStatusResolver";
import { countDaysBetween, formatIsoDate } from "../Services/DateUtility";
import { toIntlLocale } from "../I18n";

/** Deadline table of one venue; the next upcoming deadline is highlighted. */
export default defineComponent({
  name: "DeadlineList",
  props: {
    /** Deadlines to display (any order). */
    deadlines: { type: Array as PropType<Deadline[]>, required: true },
    /** Reference date (ISO) used to evaluate passed/remaining. */
    today: { type: String, required: true },
  },
  setup(props) {
    const { t, locale } = useI18n();

    const sortedDeadlines = computed(() => sortDeadlines(props.deadlines));
    const nextDeadline = computed(
      () => sortedDeadlines.value.find((deadline) => deadline.date >= props.today) ?? null,
    );

    /** Returns true when the deadline is in the past. */
    const isPassed = (deadline: Deadline): boolean => isDeadlinePassed(deadline, props.today);

    /** Returns the number of days from today to the deadline. */
    const daysUntil = (deadline: Deadline): number => countDaysBetween(props.today, deadline.date);

    /** Formats a date in the active locale. */
    const formatDate = (iso: string): string => formatIsoDate(iso, toIntlLocale(locale.value));

    return { t, sortedDeadlines, nextDeadline, isPassed, daysUntil, formatDate };
  },
});
</script>

<style scoped>
.deadline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
li {
  display: grid;
  grid-template-columns: minmax(130px, auto) 1fr auto;
  gap: 4px 12px;
  align-items: baseline;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
}
li.next {
  background: var(--color-open-soft);
}
li.passed {
  color: var(--color-text-muted);
}
li.passed .date,
li.passed .label {
  text-decoration: line-through;
}
.date {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  white-space: nowrap;
}
.note {
  color: var(--color-text-muted);
}
.remaining {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}
li.next .remaining {
  color: var(--color-open);
  font-weight: 700;
}
@media (max-width: 520px) {
  li {
    grid-template-columns: 1fr auto;
  }
  .label {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
