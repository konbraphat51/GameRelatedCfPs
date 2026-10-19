<!-- Detailed card for one conference: identity, event info, CfP deadlines and links. -->
<template>
  <article class="conference-card" :class="`status-${status}`">
    <header class="card-header">
      <div class="heading">
        <h2>
          <a :href="conference.url" target="_blank" rel="noopener">{{ conference.acronym }}</a>
        </h2>
        <p class="full-name">{{ displayName }}</p>
      </div>
      <StatusBadge :status="status" />
    </header>

    <div class="tags">
      <span class="tag tag-region">{{ t(`region.${conference.region}`) }}</span>
      <span class="tag">{{ t(`scope.${conference.gameScope}`) }}</span>
      <span v-for="field in conference.fields" :key="field" class="tag tag-field">
        {{ t(`field.${field}`) }}
      </span>
    </div>

    <dl class="facts">
      <div>
        <dt>{{ t("card.event") }}</dt>
        <dd>{{ eventDateLabel }}</dd>
      </div>
      <div>
        <dt>{{ t("card.location") }}</dt>
        <dd>{{ conference.location ?? t("card.dateTbd") }}</dd>
      </div>
      <div>
        <dt>{{ t("card.organizer") }}</dt>
        <dd>{{ conference.organizer }}</dd>
      </div>
      <div v-if="conference.trackName" class="wide">
        <dt>{{ t("card.track") }}</dt>
        <dd>{{ conference.trackName }}</dd>
      </div>
    </dl>

    <section class="cfp">
      <h3>{{ t("card.deadlines") }}</h3>
      <DeadlineList v-if="status !== 'unknown'" :deadlines="conference.deadlines" :today="today" />
      <template v-else>
        <p class="unknown">{{ t("card.cfpUnknown") }}</p>
        <p v-if="pastPattern" class="past-pattern">
          <strong>{{ t("card.pastPattern") }}:</strong> {{ pastPattern }}
        </p>
      </template>
    </section>

    <p v-if="notes" class="notes">
      <strong>{{ t("card.notes") }}:</strong> {{ notes }}
    </p>

    <footer class="links">
      <a :href="conference.url" target="_blank" rel="noopener">{{ t("card.website") }}</a>
      <a v-if="conference.cfpUrl" :href="conference.cfpUrl" target="_blank" rel="noopener">
        {{ t("card.cfp") }}
      </a>
      <details class="sources">
        <summary>{{ t("card.sources") }} ({{ conference.sources.length }})</summary>
        <ul>
          <li v-for="source in conference.sources" :key="source">
            <a :href="source" target="_blank" rel="noopener">{{ source }}</a>
          </li>
        </ul>
      </details>
    </footer>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import StatusBadge from "./StatusBadge.vue";
import DeadlineList from "./DeadlineList.vue";
import type { Conference } from "../Types/Conference";
import { resolveCfpStatus } from "../Services/CfpStatusResolver";
import { formatIsoDateRange } from "../Services/DateUtility";
import { toIntlLocale } from "../I18n";

/** Card presenting a single conference edition. */
export default defineComponent({
  name: "ConferenceCard",
  components: { StatusBadge, DeadlineList },
  props: {
    /** Conference to display. */
    conference: { type: Object as PropType<Conference>, required: true },
    /** Reference date (ISO) for status evaluation. */
    today: { type: String, required: true },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const isJapanese = computed(() => locale.value === "ja");

    const status = computed(() => resolveCfpStatus(props.conference, props.today));

    const displayName = computed(() =>
      isJapanese.value && props.conference.nameJa
        ? props.conference.nameJa
        : props.conference.nameEn,
    );

    const eventDateLabel = computed(() => {
      const { eventStart, eventEnd, eventDateText } = props.conference;
      if (eventStart !== null) {
        return formatIsoDateRange(eventStart, eventEnd, toIntlLocale(locale.value));
      }
      return eventDateText ?? t("card.dateTbd");
    });

    const pastPattern = computed(() =>
      isJapanese.value
        ? (props.conference.pastPatternJa ?? props.conference.pastPatternEn)
        : (props.conference.pastPatternEn ?? props.conference.pastPatternJa),
    );

    const notes = computed(() =>
      isJapanese.value
        ? (props.conference.notesJa ?? props.conference.notesEn)
        : (props.conference.notesEn ?? props.conference.notesJa),
    );

    return { t, status, displayName, eventDateLabel, pastPattern, notes };
  },
});
</script>

<style scoped>
.conference-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-top: 4px solid var(--color-unknown);
  border-radius: 12px;
  background: var(--color-surface);
  min-width: 0;
}
.conference-card.status-open {
  border-top-color: var(--color-open);
}
.conference-card.status-closed {
  border-top-color: var(--color-closed);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.heading {
  min-width: 0;
}
h2 {
  margin: 0;
  font-size: 1.25rem;
}
h2 a {
  color: var(--color-text);
  text-decoration: none;
}
h2 a:hover {
  text-decoration: underline;
}
.full-name {
  margin: 2px 0 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--color-tag);
  color: var(--color-text);
}
.tag-region {
  font-weight: 700;
}
.tag-field {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px 16px;
  margin: 0;
}
.facts .wide {
  grid-column: 1 / -1;
}
.facts dt {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
}
.facts dd {
  margin: 0;
  font-size: 0.9375rem;
  overflow-wrap: anywhere;
}
h3 {
  margin: 0 0 6px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.unknown {
  margin: 0;
  font-weight: 600;
  color: var(--color-unknown);
}
.past-pattern,
.notes {
  margin: 6px 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: baseline;
  margin-top: auto;
  font-size: 0.875rem;
}
.sources {
  flex-basis: 100%;
  color: var(--color-text-muted);
}
.sources summary {
  cursor: pointer;
}
.sources ul {
  margin: 6px 0 0;
  padding-left: 18px;
}
.sources a {
  overflow-wrap: anywhere;
}
</style>
