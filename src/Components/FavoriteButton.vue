<!-- Star toggle that adds or removes a venue from the viewer's favourites. -->
<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ active }"
    :aria-pressed="active"
    :aria-label="label"
    :title="label"
    @click="$emit('toggle')"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L2.9 9.4l6.3-.9z"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

/** Accessible star toggle; the parent owns the favourite state. */
export default defineComponent({
  name: "FavoriteButton",
  props: {
    /** Whether the venue is currently a favourite. */
    active: { type: Boolean, required: true },
  },
  emits: {
    /** Requests flipping the favourite state. */
    toggle: () => true,
  },
  setup(props) {
    const { t } = useI18n();
    const label = computed(() => (props.active ? t("favorite.remove") : t("favorite.add")));
    return { label };
  },
});
</script>

<style scoped>
.favorite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  flex: 0 0 auto;
}
.favorite-button:hover {
  background: var(--color-surface-hover);
}
.favorite-button svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}
.favorite-button.active {
  color: var(--color-favorite);
  border-color: var(--color-favorite);
}
.favorite-button.active svg {
  fill: currentColor;
}
</style>
