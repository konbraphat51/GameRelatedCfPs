<!-- Responsive grid of conference cards, with an empty-state message. -->
<template>
  <section class="conference-list">
    <p v-if="conferences.length === 0" class="empty">{{ t("empty") }}</p>
    <div v-else class="grid">
      <ConferenceCard
        v-for="conference in conferences"
        :key="conference.id"
        :conference="conference"
        :today="today"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import ConferenceCard from "./ConferenceCard.vue";
import type { Conference } from "../Types/Conference";

/** Lays out already filtered and sorted conferences. */
export default defineComponent({
  name: "ConferenceList",
  components: { ConferenceCard },
  props: {
    /** Conferences to render, in display order. */
    conferences: { type: Array as PropType<Conference[]>, required: true },
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
.conference-list {
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
