<script setup>
import { computed } from 'vue'
import { Clock, Info, Landmark } from 'lucide-vue-next'
import {
  RATE_METHOD_LABELS,
  RATE_TYPE_LABELS,
} from '@/services/conversionService'
import {
  describePublicationAge,
  formatPublicationDate,
  formatRate,
} from '@/utils/format'

const props = defineProps({
  result: { type: Object, default: null },
  from: { type: String, default: '' },
  to: { type: String, default: '' },
  publishedAt: { type: String, default: null },
  publisher: { type: String, default: 'Banco de Moçambique' },
  sourceUrl: { type: String, default: '' },
})

const rateTypeLabel = computed(() => {
  if (!props.result) return '—'
  if (props.result.rateType === 'cross') {
    const [first, second] = props.result.legs
    return `${RATE_TYPE_LABELS.cross} (${first?.currency} · ${second?.currency})`
  }
  return RATE_TYPE_LABELS[props.result.rateType] ?? '—'
})

const methodLabel = computed(() => {
  if (!props.result) return '—'
  return RATE_METHOD_LABELS[props.result.method] ?? '—'
})

const publicationLabel = computed(() => formatPublicationDate(props.publishedAt))
const publicationAge = computed(() => describePublicationAge(props.publishedAt))

const legsDescription = computed(() => {
  if (!props.result || props.result.legs.length < 2) return ''
  return props.result.legs
    .map((leg) => `${RATE_TYPE_LABELS[leg.type]} ${leg.currency}: ${formatRate(leg.value)} MZN`)
    .join(' · ')
})
</script>

<template>
  <section class="details" aria-label="Informação da taxa aplicada">
    <header class="details__head">
      <span class="details__icon"><Info :size="16" :stroke-width="2" aria-hidden="true" /></span>
      <h2 class="details__title">Taxa aplicada</h2>
    </header>

    <dl class="details__grid">
      <div class="details__item details__item--wide">
        <dt>Taxa de câmbio</dt>
        <dd>
          <template v-if="result">
            1 {{ from }} = {{ formatRate(result.rate) }} {{ to }}
          </template>
          <template v-else>—</template>
        </dd>
      </div>

      <div class="details__item">
        <dt>Tipo de taxa</dt>
        <dd>{{ rateTypeLabel }}</dd>
      </div>

      <div class="details__item">
        <dt>Natureza</dt>
        <dd>
          <span
            class="details__pill"
            :class="{ 'details__pill--derived': result?.derived }"
          >
            {{ methodLabel }}
          </span>
        </dd>
      </div>

      <div class="details__item">
        <dt>Par de moedas</dt>
        <dd>{{ from }} → {{ to }}</dd>
      </div>

      <div class="details__item">
        <dt>Publicação</dt>
        <dd>
          {{ publicationLabel }}
          <span v-if="publicationAge" class="details__note">({{ publicationAge }})</span>
        </dd>
      </div>

      <div class="details__item details__item--wide">
        <dt>Fonte dos dados</dt>
        <dd class="details__source">
          <Landmark :size="14" :stroke-width="2" aria-hidden="true" />
          <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">
            {{ publisher }}
          </a>
          <span v-else>{{ publisher }}</span>
        </dd>
      </div>

      <div v-if="legsDescription" class="details__item details__item--wide">
        <dt>Cálculo</dt>
        <dd class="details__note">{{ legsDescription }}</dd>
      </div>
    </dl>

    <p class="details__timestamp">
      <Clock :size="13" :stroke-width="2" aria-hidden="true" />
      <span>
        Tabela oficial publicada todos os dias úteis. Em fins de semana e feriados é
        apresentada a última tabela disponível.
      </span>
    </p>
  </section>
</template>

<style scoped>
.details {
  border-top: 1px solid var(--line);
  padding-top: 1.15rem;
  margin-top: 1.35rem;
}

.details__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.details__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 8px;
  background: var(--blue-50);
  color: var(--blue-600);
}

.details__title {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--navy-800);
}

.details__grid {
  display: grid;
  gap: 0.9rem 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.details__item {
  min-width: 0;
}

.details__item--wide {
  grid-column: 1 / -1;
}

.details__item dt {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-bottom: 0.2rem;
}

.details__item dd {
  font-size: 0.9rem;
  font-weight: 550;
  color: var(--navy-900);
  line-height: 1.45;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.details__pill {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--success);
  background: #ecfdf3;
  border: 1px solid #d1fadf;
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}

.details__pill--derived {
  color: var(--warning);
  background: var(--warning-bg);
  border-color: #fdecc8;
}

.details__source {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--navy-700) !important;
}

.details__source a {
  color: var(--blue-600);
  text-decoration: none;
  border-bottom: 1px solid rgba(19, 96, 196, 0.3);
}

.details__source a:hover {
  border-bottom-color: currentColor;
}

.details__note {
  font-size: 0.8rem;
  font-weight: 450;
  color: var(--muted);
}

.details__timestamp {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  margin-top: 1.1rem;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--line);
  font-size: 0.76rem;
  color: var(--muted-2);
  line-height: 1.5;
}

.details__timestamp svg {
  flex: none;
  margin-top: 0.15rem;
}

@media (min-width: 860px) {
  .details__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .details__item--wide {
    grid-column: span 2;
  }
}
</style>
