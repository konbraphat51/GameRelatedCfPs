<!-- Coloured pill showing a venue's CfP status. -->
<template>
  <span class="status-badge" :class="`status-${status}`">{{ t(`status.${status}`) }}</span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import type { CfpStatus } from "../Types/CfpStatus";

/** Status pill; colour is driven by CSS tokens per status. */
export default defineComponent({
  name: "StatusBadge",
  props: {
    /** Status to display. */
    status: { type: String as PropType<CfpStatus>, required: true },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
});
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.status-open {
  background: var(--color-open-soft);
  color: var(--color-open);
}
.status-rolling {
  background: var(--color-rolling-soft);
  color: var(--color-rolling);
}
.status-unknown {
  background: var(--color-unknown-soft);
  color: var(--color-unknown);
}
.status-closed {
  background: var(--color-closed-soft);
  color: var(--color-closed);
}
</style>
