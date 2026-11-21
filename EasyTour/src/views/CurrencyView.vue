<script setup>
import { computed, onMounted } from 'vue'
import {
  Calculator,
  CircleAlert,
  Clock,
  Coins,
  Info,
  RefreshCw,
} from 'lucide-vue-next'
import ConversionResult from '@/components/currency/ConversionResult.vue'
import CurrencyInput from '@/components/currency/CurrencyInput.vue'
import CurrencySelector from '@/components/currency/CurrencySelector.vue'
import CurrencySwap from '@/components/currency/CurrencySwap.vue'
import RateDetails from '@/components/currency/RateDetails.vue'
import { useConversion } from '@/composables/useConversion'
import { useExchangeRates } from '@/composables/useExchangeRates'
import { resolveCurrency } from '@/data/currencies'
import { formatPublicationDate } from '@/utils/format'

const {
  table,
  isLoading,
  error,
  hasRates,
  availableCodes,
  publishedAt,
  publisher,
  source,
  loadRates,
  refreshRates,
} = useExchangeRates()

const { amount, from, to, parsedAmount, amountError, isValid, result, swapCurrencies } =
  useConversion(table)

const fromCurrency = computed(() => resolveCurrency(from.value))
const toCurrency = computed(() => resolveCurrency(to.value))

const publicationLabel = computed(() =>
  publishedAt.value
    ? `Última publicação: ${formatPublicationDate(publishedAt.value)}`
    : 'A aguardar dados',
)

onMounted(() => {
  // Usa o cache da sessão quando existe, evitando pedidos desnecessários à API.
  if (!table.value) loadRates()
})
</script>

<template>
  <div class="view">
    <section class="hero">
      <p class="hero__eyebrow">
        <Coins :size="14" :stroke-width="2.2" aria-hidden="true" />
        Câmbio
      </p>
      <h1 class="hero__title">Conversor de Moedas</h1>
      <p class="hero__lead">
        Converta entre o metical moçambicano e as principais moedas usadas por quem visita
        Moçambique. As taxas são as oficiais publicadas pelo Banco de Moçambique, com indicação
        clara da taxa de compra ou de venda aplicada.
      </p>
    </section>

    <section
      v-if="isLoading && !hasRates"
      class="state-card"
      aria-live="polite"
      aria-busy="true"
    >
      <span class="spinner" aria-hidden="true"></span>
      <div class="state-card__body">
        <h2 class="state-card__title">A obter as taxas oficiais…</h2>
        <p class="state-card__text">
          A carregar a tabela de câmbio mais recente do Banco de Moçambique.
        </p>
      </div>
    </section>

    <section v-else-if="error && !hasRates" class="state-card state-card--error" role="alert">
      <span class="state-card__icon" aria-hidden="true">
        <CircleAlert :size="20" :stroke-width="2" />
      </span>
      <div class="state-card__body">
        <h2 class="state-card__title">Não foi possível obter as taxas</h2>
        <p class="state-card__text">{{ error.message }}</p>
        <button type="button" class="btn btn--primary" :disabled="isLoading" @click="refreshRates">
          <RefreshCw :size="15" :stroke-width="2.2" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    </section>

    <section v-else-if="!hasRates" class="state-card">
      <span class="state-card__icon" aria-hidden="true">
        <Info :size="20" :stroke-width="2" />
      </span>
      <div class="state-card__body">
        <h2 class="state-card__title">Sem taxas disponíveis</h2>
        <p class="state-card__text">
          Ainda não existem taxas carregadas. Actualize para consultar a tabela oficial do Banco
          de Moçambique.
        </p>
        <button type="button" class="btn btn--primary" :disabled="isLoading" @click="refreshRates">
          <RefreshCw :size="15" :stroke-width="2.2" aria-hidden="true" />
          Actualizar taxas
        </button>
      </div>
    </section>

    <template v-else>
      <p v-if="error" class="banner" role="status">
        <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />
        <span>{{ error.message }} Está a ser apresentada a última tabela obtida.</span>
      </p>

      <section class="card converter">
        <header class="card__head">
          <div class="card__heading">
            <span class="card__icon" aria-hidden="true">
              <Calculator :size="18" :stroke-width="2" />
            </span>
            <div>
              <h2 class="card__title">Converter montante</h2>
              <p class="card__subtitle">Escolha o montante e as moedas de origem e de destino.</p>
            </div>
          </div>

          <div class="card__tools">
            <span class="card__updated">
              <Clock :size="14" :stroke-width="2" aria-hidden="true" />
              {{ publicationLabel }}
            </span>
            <button
              type="button"
              class="btn btn--ghost"
              :disabled="isLoading"
              :aria-busy="isLoading"
              @click="refreshRates"
            >
              <RefreshCw
                :size="15"
                :stroke-width="2.2"
                :class="{ 'is-spinning': isLoading }"
                aria-hidden="true"
              />
              {{ isLoading ? 'A actualizar' : 'Actualizar taxas' }}
            </button>
          </div>
        </header>

        <div class="converter__body">
          <CurrencyInput
            v-model="amount"
            input-id="conversion-amount"
            label="Montante"
            :currency="fromCurrency"
            :error="amountError"
            hint="Use a vírgula para os decimais, por exemplo 1.500,50."
          />

          <div class="pair">
            <CurrencySelector
              v-model="from"
              input-id="from-currency"
              label="De"
              :available-codes="availableCodes"
            />

            <CurrencySwap :disabled="!hasRates" @swap="swapCurrencies" />

            <CurrencySelector
              v-model="to"
              input-id="to-currency"
              label="Para"
              :available-codes="availableCodes"
            />
          </div>

          <ConversionResult
            :result="result"
            :amount="parsedAmount"
            :from="from"
            :to="to"
            :loading="isLoading"
          />

          <p v-if="isValid && !result" class="converter__warning" role="status">
            Não existe taxa disponível para o par de moedas seleccionado. Escolha outra moeda ou
            actualize as taxas.
          </p>

          <RateDetails
            :result="result"
            :from="from"
            :to="to"
            :published-at="publishedAt"
            :publisher="publisher"
            :source-url="source.dataUrl"
          />
        </div>
      </section>

      <aside class="notice">
        <span class="notice__icon" aria-hidden="true">
          <Info :size="18" :stroke-width="2" />
        </span>
        <div class="notice__body">
          <h2 class="notice__title">Valores indicativos</h2>
          <p class="notice__text">
            As taxas reproduzem a tabela oficial do Banco de Moçambique e destinam-se a consulta e
            planeamento. Não constituem uma oferta de câmbio: o valor efectivamente aplicado por
            bancos, casas de câmbio ou comerciantes pode incluir comissões e diferenças próprias.
          </p>
          <p class="notice__text">
            Fonte:
            <a :href="source.publisherUrl" target="_blank" rel="noopener noreferrer">
              {{ source.publisher }}
            </a>
            ·
            <a :href="source.dataUrl" target="_blank" rel="noopener noreferrer">
              dados abertos AllRatesToday
            </a>
          </p>
        </div>
      </aside>
    </template>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;
}

/* ── Cabeçalho da página ─────────────────────────────────────── */
.hero {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding-top: 0.5rem;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue-600);
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
}

.hero__title {
  font-size: clamp(1.85rem, 7vw, 2.6rem);
  font-weight: 750;
  line-height: 1.12;
  letter-spacing: -0.025em;
  color: var(--navy-900);
}

.hero__lead {
  max-width: 62ch;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--muted);
}

/* ── Cartão principal ────────────────────────────────────────── */
.card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.converter {
  padding: clamp(1.1rem, 4vw, 1.75rem);
}

.card__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.9rem;
  padding-bottom: 1.15rem;
  margin-bottom: 1.15rem;
  border-bottom: 1px solid var(--line);
}

.card__heading {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  flex: none;
  border-radius: 11px;
  background: var(--blue-50);
  color: var(--blue-600);
  border: 1px solid var(--blue-100);
}

.card__title {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--navy-900);
  letter-spacing: -0.01em;
}

.card__subtitle {
  font-size: 0.82rem;
  color: var(--muted-2);
  margin-top: 0.1rem;
  line-height: 1.4;
}

.card__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.85rem;
}

.card__updated {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  color: var(--muted-2);
  white-space: nowrap;
}

.converter__body {
  display: grid;
  gap: 1.1rem;
}

.converter__warning {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--warning);
  background: var(--warning-bg);
  border: 1px solid #fdecc8;
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.85rem;
}

.pair {
  display: grid;
  gap: 0.85rem;
  align-items: start;
}

@media (min-width: 760px) {
  .pair {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 1rem;
  }
}

/* ── Botões ──────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.btn--ghost {
  background: var(--white);
  border-color: var(--line-strong);
  color: var(--navy-800);
}

.btn--ghost:hover:not(:disabled) {
  border-color: var(--blue-500);
  color: var(--blue-600);
  background: var(--blue-50);
}

.btn--primary {
  background: var(--blue-600);
  color: var(--white);
  box-shadow: 0 10px 20px -14px rgba(19, 96, 196, 0.9);
}

.btn--primary:hover:not(:disabled) {
  background: var(--navy-700);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(31, 111, 235, 0.2);
}

/* ── Estados ─────────────────────────────────────────────────── */
.state-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
}

.state-card--error {
  border-color: #fbd5d1;
  background: #fffbfa;
}

.state-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex: none;
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--navy-700);
}

.state-card--error .state-card__icon {
  background: var(--danger-bg);
  color: var(--danger);
}

.state-card__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
}

.state-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy-900);
}

.state-card__text {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 58ch;
}

.state-card .btn {
  margin-top: 0.4rem;
}

.spinner {
  width: 1.6rem;
  height: 1.6rem;
  flex: none;
  margin-top: 0.35rem;
  border-radius: 50%;
  border: 2.5px solid var(--blue-100);
  border-top-color: var(--blue-500);
  animation: spin 0.8s linear infinite;
}

.is-spinning {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.banner {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 0.95rem;
  border-radius: var(--radius-md);
  border: 1px solid #fdecc8;
  background: var(--warning-bg);
  color: var(--warning);
  font-size: 0.82rem;
  line-height: 1.5;
}

.banner svg {
  flex: none;
  margin-top: 0.1rem;
}

/* ── Nota legal ──────────────────────────────────────────────── */
.notice {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.15rem;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.notice__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  flex: none;
  border-radius: 9px;
  background: var(--white);
  border: 1px solid var(--line);
  color: var(--blue-600);
}

.notice__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.notice__title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--navy-800);
}

.notice__text {
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--muted);
}

.notice__text a {
  color: var(--blue-600);
  text-decoration: none;
  border-bottom: 1px solid rgba(19, 96, 196, 0.35);
}

.notice__text a:hover {
  border-bottom-color: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .spinner,
  .is-spinning {
    animation-duration: 2.4s;
  }
}
</style>
