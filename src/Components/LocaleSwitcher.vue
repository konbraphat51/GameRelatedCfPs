<!-- Toggle between the supported UI languages. -->
<template>
  <div class="locale-switcher" role="group" :aria-label="t('language')">
    <button
      v-for="option in locales"
      :key="option.code"
      type="button"
      class="locale-button"
      :class="{ active: option.code === locale }"
      :aria-pressed="option.code === locale"
      @click="selectLocale(option.code)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { SUPPORTED_LOCALES, storeLocale, type AppLocale } from "../I18n";

/** Language toggle that updates and persists the active locale. */
export default defineComponent({
  name: "LocaleSwitcher",
  setup() {
    const { t, locale } = useI18n();

    /** Activates the given locale and remembers it. */
    const selectLocale = (code: AppLocale): void => {
      locale.value = code;
      storeLocale(code);
      document.documentElement.lang = code;
    };

    return { t, locale, locales: SUPPORTED_LOCALES, selectLocale };
  },
});
</script>

<style scoped>
.locale-switcher {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}
.locale-button {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  padding: 6px 14px;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}
.locale-button.active {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
</style>
