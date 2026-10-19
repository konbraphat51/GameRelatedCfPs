<!-- Multi-select group of toggle chips; an empty selection means "all". -->
<template>
  <fieldset class="chip-group">
    <legend>{{ legend }}</legend>
    <div class="chips">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="chip"
        :class="{ selected: modelValue.includes(option.value) }"
        :aria-pressed="modelValue.includes(option.value)"
        @click="toggleOption(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

/** One selectable chip. */
export interface ChipOption {
  value: string;
  label: string;
}

/** Toggle-chip multi-select bound with v-model. */
export default defineComponent({
  name: "ChipGroup",
  props: {
    /** Caption of the group. */
    legend: { type: String, required: true },
    /** Selectable options. */
    options: { type: Array as PropType<ChipOption[]>, required: true },
    /** Currently selected values. */
    modelValue: { type: Array as PropType<string[]>, required: true },
  },
  emits: {
    /** Emits the new selection. */
    "update:modelValue": (values: string[]) => Array.isArray(values),
  },
  setup(props, { emit }) {
    /** Adds or removes a value from the selection. */
    const toggleOption = (value: string): void => {
      const next = props.modelValue.includes(value)
        ? props.modelValue.filter((selected) => selected !== value)
        : [...props.modelValue, value];
      emit("update:modelValue", next);
    };
    return { toggleOption };
  },
});
</script>

<style scoped>
.chip-group {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}
legend {
  padding: 0;
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 999px;
  padding: 4px 12px;
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
}
.chip:hover {
  background: var(--color-surface-hover);
}
.chip.selected {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}
</style>
