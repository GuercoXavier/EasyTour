<script setup>
import { computed } from 'vue'
import { buildCurrencyList } from '@/data/currencies'

const props = defineProps({
  modelValue: { type: String, required: true },
  availableCodes: { type: Array, default: () => [] },
  label: { type: String, default: 'Moeda' },
  inputId: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const groups = computed(() => buildCurrencyList(props.availableCodes))

const selected = computed(() => {
  const all = [...groups.value.priority, ...groups.value.others]
  return (
    all.find((currency) => currency.code === props.modelValue) ?? {
      code: props.modelValue,
      name: props.modelValue,
      symbol: props.modelValue,
    }
  )
})

const isLocalCurrency = computed(() => props.modelValue === 'MZN')

function handleChange(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="field">
    <div class="field__head">
      <label class="field__label" :for="inputId">{{ label }}</label>
      <span v-if="isLocalCurrency" class="field__badge">Moeda local</span>
    </div>

    <div class="select-wrap">
      <select
        :id="inputId"
        class="select"
        :value="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
        <optgroup label="Principais moedas">
          <option v-for="currency in groups.priority" :key="currency.code" :value="currency.code">
            {{ currency.code }} — {{ currency.name }}
          </option>
        </optgroup>
        <optgroup v-if="groups.others.length" label="Outras moedas publicadas pelo BDM">
          <option v-for="currency in groups.others" :key="currency.code" :value="currency.code">
            {{ currency.code }} — {{ currency.name }}
          </option>
        </optgroup>
      </select>
      <svg class="select-wrap__chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path
          d="M5 7.5 10 12.5 15 7.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <p class="field__hint">
      <span class="field__code">{{ selected.code }}</span>
      <span aria-hidden="true">·</span>
      <span>{{ selected.name }}</span>
      <span aria-hidden="true">·</span>
      <span>Símbolo {{ selected.symbol }}</span>
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.field__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 1.4rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.field__badge {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--navy-700);
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
}

.select-wrap {
  position: relative;
}

.select {
  appearance: none;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 550;
  color: var(--navy-900);
  background: var(--white);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 0.85rem 2.6rem 0.85rem 1rem;
  cursor: pointer;
  text-overflow: ellipsis;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.select:focus-visible {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 4px rgba(31, 111, 235, 0.12);
}

.select:disabled {
  background: var(--surface-2);
  color: var(--muted);
  cursor: not-allowed;
}

.select-wrap__chevron {
  position: absolute;
  top: 50%;
  right: 0.9rem;
  width: 1.15rem;
  height: 1.15rem;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.field__hint {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--muted-2);
  line-height: 1.45;
}

.field__code {
  font-weight: 700;
  color: var(--navy-700);
  letter-spacing: 0.02em;
}
</style>
