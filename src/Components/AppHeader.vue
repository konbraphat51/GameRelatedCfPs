<!-- Page header with title, description and language switch. -->
<template>
  <header class="app-header">
    <div class="title-row">
      <h1>{{ t("app.title") }}</h1>
      <LocaleSwitcher />
    </div>
    <p class="subtitle">{{ t("app.subtitle") }}</p>
    <p class="meta">
      {{ t("app.lastUpdated", { date: lastUpdated }) }} · {{ t("app.disclaimer") }}
    </p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import LocaleSwitcher from "./LocaleSwitcher.vue";

/** Top-of-page title block. */
export default defineComponent({
  name: "AppHeader",
  components: { LocaleSwitcher },
  props: {
    /** ISO date the dataset was last researched. */
    lastUpdated: { type: String, required: true },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
});
</script>

<style scoped>
.app-header {
  padding: 32px 0 8px;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  letter-spacing: -0.01em;
}
.subtitle {
  margin: 12px 0 4px;
  color: var(--color-text);
  max-width: 70ch;
}
.meta {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
