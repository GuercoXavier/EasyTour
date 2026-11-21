<script setup>
import { ArrowLeftRight } from 'lucide-vue-next'

defineProps({
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['swap'])
</script>

<template>
  <div class="swap">
    <span class="swap__rule" aria-hidden="true"></span>
    <button
      type="button"
      class="swap__button"
      :disabled="disabled"
      title="Inverter moedas"
      aria-label="Inverter a moeda de origem com a moeda de destino"
      @click="emit('swap')"
    >
      <ArrowLeftRight :size="19" :stroke-width="2" aria-hidden="true" />
    </button>
    <span class="swap__rule" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.swap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-block: 0.25rem;
}

.swap__rule {
  flex: 1;
  height: 1px;
  background: var(--line);
  max-width: 4rem;
}

.swap__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  border-radius: 50%;
  border: 1.5px solid var(--blue-100);
  background: var(--white);
  color: var(--blue-600);
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease,
    border-color 0.18s ease, box-shadow 0.18s ease;
}

.swap__button:hover:not(:disabled) {
  background: var(--blue-500);
  border-color: var(--blue-500);
  color: var(--white);
  box-shadow: 0 8px 18px -10px rgba(31, 111, 235, 0.9);
  transform: rotate(180deg);
}

.swap__button:focus-visible {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 4px rgba(31, 111, 235, 0.18);
}

.swap__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 760px) {
  .swap {
    padding-top: 1.9rem;
  }

  .swap__rule {
    display: none;
  }
}
</style>
