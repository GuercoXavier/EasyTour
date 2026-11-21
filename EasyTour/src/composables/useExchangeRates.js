import { computed, ref } from 'vue'
import { ExchangeRateError, EXCHANGE_SOURCE, fetchExchangeRates } from '@/services/exchangeRateService'

/**
 * Composable responsável pelo carregamento e pelo estado das taxas de câmbio.
 *
 * O estado é partilhado por módulo (singleton) para que vários componentes
 * possam consumir as mesmas taxas sem repetir pedidos à API — relevante num
 * contexto de dados móveis caros. Um cache curto em sessionStorage evita ainda
 * um novo pedido ao recarregar a página.
 */

const CACHE_KEY = 'easytour.cambio.taxas.v1'
const CACHE_TTL_MS = 15 * 60 * 1000

const table = ref(null)
const isLoading = ref(false)
const error = ref(null)
const lastCheckedAt = ref(null)

/** Pedido em curso, para deduplicar chamadas simultâneas. */
let inflightRequest = null

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (!entry || typeof entry.savedAt !== 'number') return null
    if (Date.now() - entry.savedAt > CACHE_TTL_MS) return null
    if (!entry.payload?.rates || !entry.payload?.publishedAt) return null

    return entry.payload
  } catch {
    return null
  }
}

function writeCache(payload) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload }))
  } catch {
    // Armazenamento indisponível (modo privado, quota): a aplicação continua a funcionar.
  }
}

/**
 * Traduz a falha técnica numa mensagem compreensível para o utilizador.
 * @param {unknown} failure
 * @returns {{ code: string, message: string }}
 */
function toFriendlyError(failure) {
  if (failure instanceof ExchangeRateError) {
    switch (failure.code) {
      case 'timeout':
        return {
          code: failure.code,
          message: 'O serviço de taxas demorou demasiado tempo a responder. Tente novamente.',
        }
      case 'network':
        return {
          code: failure.code,
          message:
            'Não foi possível contactar o serviço de taxas. Verifique a ligação à Internet e tente novamente.',
        }
      case 'http':
        return {
          code: failure.code,
          message: `O serviço de taxas respondeu com um erro (HTTP ${failure.status}). Tente novamente dentro de instantes.`,
        }
      case 'empty':
        return {
          code: failure.code,
          message: 'O serviço respondeu, mas não devolveu nenhuma taxa disponível.',
        }
      case 'invalid-response':
        return {
          code: failure.code,
          message: 'A resposta do serviço de taxas não tem o formato esperado.',
        }
      default:
        return {
          code: failure.code,
          message: 'Não foi possível obter as taxas de câmbio.',
        }
    }
  }

  return {
    code: 'unknown',
    message: 'Ocorreu um erro inesperado ao obter as taxas de câmbio.',
  }
}

function applyResult(result) {
  table.value = result
  lastCheckedAt.value = new Date()
  error.value = null
  writeCache(result)
}

/**
 * Carrega as taxas, usando o cache quando disponível.
 *
 * @param {{ force?: boolean }} [options] force ignora o cache (botão "Actualizar")
 * @returns {Promise<object|null>}
 */
function loadRates({ force = false } = {}) {
  if (inflightRequest) return inflightRequest

  if (!force) {
    const cached = readCache()
    if (cached) {
      table.value = cached
      lastCheckedAt.value = new Date()
      return Promise.resolve(cached)
    }
  }

  isLoading.value = true
  error.value = null

  inflightRequest = fetchExchangeRates()
    .then((result) => {
      applyResult(result)
      return result
    })
    .catch((failure) => {
      // Mantém as taxas anteriores em memória, se existirem, e expõe o erro.
      error.value = toFriendlyError(failure)
      return null
    })
    .finally(() => {
      isLoading.value = false
      inflightRequest = null
    })

  return inflightRequest
}

/** Força uma nova consulta à API. */
function refreshRates() {
  return loadRates({ force: true })
}

export function useExchangeRates() {
  const hasRates = computed(
    () => Boolean(table.value?.rates) && Object.keys(table.value.rates).length > 0,
  )

  const availableCodes = computed(() => Object.keys(table.value?.rates ?? {}).sort())

  return {
    table,
    isLoading,
    error,
    lastCheckedAt,
    hasRates,
    availableCodes,
    publishedAt: computed(() => table.value?.publishedAt ?? null),
    publisher: computed(() => table.value?.publisher ?? EXCHANGE_SOURCE.publisher),
    source: EXCHANGE_SOURCE,
    loadRates,
    refreshRates,
  }
}
