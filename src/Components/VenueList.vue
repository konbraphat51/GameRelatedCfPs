<!-- Responsive grid of venue cards, with an empty-state message. -->
<template>
  <section class="venue-list">
    <p v-if="venues.length === 0" class="empty">{{ t("empty") }}</p>
    <div v-else class="grid">
      <VenueCard v-for="venue in venues" :key="venue.id" :venue="venue" :today="today" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import VenueCard from "./VenueCard.vue";
import type { Venue } from "../Types/Venue";

/** Lays out already filtered and sorted venues. */
export default defineComponent({
  name: "VenueList",
  components: { VenueCard },
  props: {
    /** Venues to render, in display order. */
    venues: { type: Array as PropType<Venue[]>, required: true },
    /** Reference date (ISO) for status evaluation. */
    today: { type: String, required: true },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
});
</script>

<style scoped>
.venue-list {
  margin: 20px 0 40px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
  gap: 16px;
}
.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 40px 0;
}
</style>
