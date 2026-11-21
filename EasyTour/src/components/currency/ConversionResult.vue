<script setup>
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { formatCurrencyAmount, formatRate } from '@/utils/format'

const props = defineProps({
  result: { type: Object, default: null },
  amount: { type: Number, default: null },
  from: { type: String, default: '' },
  to: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const hasResult = computed(() => Boolean(props.result))
</script>

<template>
  <section class="result" aria-live="polite">
    <header class="result__head">
      <span class="result__label">Resultado da conversão</span>
      <span v-if="from && to" class="result__pair">
        <span>{{ from }}</span>
        <ArrowRight :size="13" :stroke-width="2.2" aria-hidden="true" />
        <span>{{ to }}</span>
      </span>
    </header>

    <p class="result__value" :class="{ 'result__value--muted': !hasResult }">
      <template v-if="hasResult">
        <span class="result__number">{{ formatCurrencyAmount(result.value) }}</span>
        <span class="result__code">{{ to }}</span>
      </template>
      <template v-else-if="loading">A calcular…</template>
      <template v-else>—</template>
    </p>

    <div v-if="hasResult" class="result__meta">
      <p class="result__equivalent">
        <span class="result__sublabel">Equivalência</span>
        {{ formatCurrencyAmount(amount) }} {{ from }} = {{ formatCurrencyAmount(result.value) }}
        {{ to }}
      </p>
      <p class="result__rate">
        <span class="result__sublabel">Taxa</span>
        1 {{ from }} = {{ formatRate(result.rate) }} {{ to }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.result {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.4rem 1.5rem;
  color: var(--white);
  background:
    radial-gradient(120% 140% at 100% 0%, #1d5ea8 0%, rgba(29, 94, 168, 0) 58%),
    linear-gradient(160deg, #0e2f52 0%, #0b2545 68%);
  box-shadow: 0 24px 40px -30px rgba(11, 37, 69, 0.9);
}

.result::after {
  content: '';
  position: absolute;
  inset: auto -30% -70% auto;
  width: 22rem;
  height: 22rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.result__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.result__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.result__pair {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
}

.result__value {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.result__value--muted {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.35rem;
  font-weight: 500;
}

.result__number {
  font-size: clamp(1.85rem, 7.5vw, 2.7rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.result__code {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9dc4ff;
}

.result__meta {
  display: grid;
  gap: 0.4rem;
  margin-top: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.result__equivalent,
.result__rate {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
}

.result__rate {
  color: rgba(255, 255, 255, 0.7);
}

.result__sublabel {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  min-width: 5.6rem;
}
</style>
