<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  currency: { type: Object, default: () => ({ code: '', symbol: '' }) },
  label: { type: String, default: 'Montante' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  inputId: { type: String, default: 'amount' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const MAX_INTEGER_DIGITS = 12
const MAX_DECIMALS = 4

const describedBy = computed(() => {
  if (props.error) return `${props.inputId}-error`
  if (props.hint) return `${props.inputId}-hint`
  return undefined
})

const symbol = computed(() => props.currency?.symbol ?? '')

/**
 * Remove caracteres inválidos e garante um único separador decimal.
 * @param {string} raw
 */
function sanitise(raw) {
  let value = String(raw).replace(/[\s\u00a0]/g, '').replace(/[^\d.,]/g, '')

  // A vírgula marca os decimais; nesse caso os pontos são separadores de milhares.
  if (value.includes(',')) {
    const commaIndex = value.indexOf(',')
    const integerPart = value.slice(0, commaIndex).replace(/\./g, '')
    const decimalPart = value.slice(commaIndex + 1).replace(/[.,]/g, '')
    value = `${integerPart}.${decimalPart}`
  }

  const firstDot = value.indexOf('.')
  if (firstDot !== -1) {
    value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '')
  }

  const [integerPart = '', decimalPart] = value.split('.')
  const integer = integerPart.replace(/^0+(?=\d)/, '').slice(0, MAX_INTEGER_DIGITS)

  if (decimalPart === undefined) return integer
  return `${integer}.${decimalPart.slice(0, MAX_DECIMALS)}`
}

/** Sanitiza mantendo o cursor na posição esperada (não salta para o fim). */
function handleInput(event) {
  const element = event.target
  const raw = element.value
  const caret = element.selectionStart ?? raw.length
  const cleaned = sanitise(raw)

  emit('update:modelValue', cleaned)

  if (cleaned !== raw) {
    const nextCaret = Math.max(0, caret - (raw.length - cleaned.length))
    element.value = cleaned
    if (typeof element.setSelectionRange === 'function') {
      element.setSelectionRange(nextCaret, nextCaret)
    }
  }
}
</script>

<template>
  <div class="field" :class="{ 'field--invalid': Boolean(error) }">
    <div class="field__head">
      <label class="field__label" :for="inputId">{{ label }}</label>
      <span class="field__tag">{{ currency.code }}</span>
    </div>

    <div class="amount">
      <span v-if="symbol" class="amount__symbol" aria-hidden="true">{{ symbol }}</span>
      <input
        :id="inputId"
        class="amount__input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        placeholder="0,00"
        aria-placeholder="0,00"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
        @input="handleInput"
      />
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.field__tag {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--blue-600);
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
}

.amount {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--white);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.amount:focus-within {
  border-color: var(--blue-500);
  box-shadow: 0 0 0 4px rgba(31, 111, 235, 0.12);
}

.field--invalid .amount {
  border-color: var(--danger);
}

.field--invalid .amount:focus-within {
  box-shadow: 0 0 0 4px rgba(180, 35, 24, 0.12);
}

.amount__symbol {
  flex: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--muted);
}

.amount__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: clamp(1.4rem, 5vw, 1.85rem);
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--navy-900);
  font-variant-numeric: tabular-nums;
}

.amount__input::placeholder {
  color: var(--muted-2);
  font-weight: 500;
}

.field__hint {
  font-size: 0.78rem;
  color: var(--muted-2);
  line-height: 1.45;
}

.field__error {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--danger);
  line-height: 1.45;
}
</style>
