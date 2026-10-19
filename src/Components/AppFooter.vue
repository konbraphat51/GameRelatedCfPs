<!-- Page footer with repository link and contribution note. -->
<template>
  <footer class="app-footer">
    <p>{{ t("app.disclaimer") }}</p>
    <p>
      {{ t("app.contribute") }}
      <a :href="repositoryUrl" target="_blank" rel="noopener">{{ t("app.source") }}</a>
    </p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

/** Static footer. */
export default defineComponent({
  name: "AppFooter",
  setup() {
    const { t } = useI18n();
    return { t, repositoryUrl: "https://github.com/konbraphat51/GameRelatedCfPs" };
  },
});
</script>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: 20px 0 40px;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
.app-footer p {
  margin: 4px 0;
}
</style>
