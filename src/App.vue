<!-- Root component: owns filter/sort state and composes the page. -->
<template>
  <div class="app">
    <AppHeader :last-updated="dataset.lastUpdated" />
    <SummaryStats
      :total="dataset.venues.length"
      :counts="statusCounts"
      :active-statuses="criteria.statuses"
      @toggle-status="toggleStatus"
    />
    <FilterPanel
      v-model:criteria="criteria"
      v-model:sort-key="sortKey"
      :shown="visibleVenues.length"
      :total="dataset.venues.length"
      @reset="resetFilters"
    />
    <VenueList :venues="visibleVenues" :today="today" />
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import AppHeader from "./Components/AppHeader.vue";
import SummaryStats from "./Components/SummaryStats.vue";
import FilterPanel from "./Components/FilterPanel.vue";
import VenueList from "./Components/VenueList.vue";
import AppFooter from "./Components/AppFooter.vue";
import { loadVenueDataset } from "./Services/VenueRepository";
import {
  createEmptyCriteria,
  filterVenues,
  sortVenues,
  type FilterCriteria,
  type SortKey,
} from "./Services/VenueFilter";
import { resolveCfpStatus } from "./Services/CfpStatusResolver";
import { toIsoDate } from "./Services/DateUtility";
import type { CfpStatus } from "./Types/CfpStatus";

/** Application shell. */
export default defineComponent({
  name: "App",
  components: { AppHeader, SummaryStats, FilterPanel, VenueList, AppFooter },
  setup() {
    const dataset = loadVenueDataset();
    const today = toIsoDate(new Date());
    const criteria = ref<FilterCriteria>(createEmptyCriteria());
    const sortKey = ref<SortKey>("deadline");

    const statusCounts = computed(() => {
      const counts: Record<CfpStatus, number> = { open: 0, unknown: 0, closed: 0 };
      for (const venue of dataset.venues) {
        counts[resolveCfpStatus(venue, today)] += 1;
      }
      return counts;
    });

    const visibleVenues = computed(() =>
      sortVenues(filterVenues(dataset.venues, criteria.value, today), sortKey.value, today),
    );

    /** Adds or removes one status from the status filter. */
    const toggleStatus = (status: CfpStatus): void => {
      const statuses = criteria.value.statuses.includes(status)
        ? criteria.value.statuses.filter((selected) => selected !== status)
        : [...criteria.value.statuses, status];
      criteria.value = { ...criteria.value, statuses };
    };

    /** Clears every filter while keeping the sort order. */
    const resetFilters = (): void => {
      criteria.value = createEmptyCriteria();
    };

    return {
      dataset,
      today,
      criteria,
      sortKey,
      statusCounts,
      visibleVenues,
      toggleStatus,
      resetFilters,
    };
  },
});
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>
