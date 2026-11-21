/**
 * Serviço de acesso às taxas de câmbio oficiais do Banco de Moçambique (BDM).
 *
 * Fonte: tabela diária publicada pelo BDM (compra e venda de cada moeda contra
 * o metical), distribuída como dados abertos em JSON e servida com CORS aberto.
 * Não é necessária qualquer chave de API, pelo que nenhuma credencial é exposta
 * ao browser. Caso se pretenda usar um endpoint com chave, defina
 * VITE_EXCHANGE_RATES_URL a apontar para uma função serverless intermediária.
 *
 * Formato esperado da resposta:
 * {
 *   "name": "Banco de Moçambique",
 *   "home_currency": "MZN",
 *   "date": "2026-11-20",
 *   "rates": [{ "base": "USD", "quote": "MZN", "type": "buy", "value": 63.27 }, …]
 * }
 */

const DEFAULT_ENDPOINT =
  'https://raw.githubusercontent.com/AllRates-Today/central-bank-exchange-rates/main/data/bdm/latest.json'

export const REQUEST_TIMEOUT_MS = 12_000

/** Metadados da fonte apresentados na interface e na documentação. */
export const EXCHANGE_SOURCE = {
  publisher: 'Banco de Moçambique',
  publisherUrl: 'https://www.bancomoc.mz',
  dataUrl: 'https://allratestoday.com/central-bank-rates-api/bdm/',
  mirrorLabel: 'Banco de Moçambique · dados abertos AllRatesToday',
  disclaimer:
    'As taxas reproduzem a tabela oficial publicada pelo Banco de Moçambique. Os valores apresentados são indicativos e não constituem uma oferta de câmbio.',
}

/**
 * Erro de domínio do serviço de taxas, com um código estável para a interface
 * poder traduzir a falha numa mensagem compreensível.
 */
export class ExchangeRateError extends Error {
  constructor(message, code = 'unknown', status = null) {
    super(message)
    this.name = 'ExchangeRateError'
    this.code = code
    this.status = status
  }
}

/**
 * Endpoint efectivamente usado. Permite interpor um proxy seguro sem alterar código.
 * @returns {string}
 */
export function getRatesEndpoint() {
  const configured = import.meta.env?.VITE_EXCHANGE_RATES_URL
  return typeof configured === 'string' && configured.trim() ? configured.trim() : DEFAULT_ENDPOINT
}

/**
 * Valida e normaliza a resposta da API para o formato consumido pela aplicação.
 *
 * @param {unknown} payload
 * @returns {{
 *   publishedAt: string,
 *   publisher: string,
 *   homeCurrency: string,
 *   rates: Record<string, { buy: number|null, sell: number|null }>,
 *   fetchedAt: string,
 * }}
 */
export function parseRatesPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ExchangeRateError('A resposta do serviço não tem o formato esperado.', 'invalid-response')
  }

  const publishedAt = payload.date ?? payload.rate_date
  if (typeof publishedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new ExchangeRateError(
      'A resposta do serviço não inclui uma data de publicação válida.',
      'invalid-response',
    )
  }

  if (!Array.isArray(payload.rates) || payload.rates.length === 0) {
    throw new ExchangeRateError('O serviço não devolveu nenhuma taxa disponível.', 'empty')
  }

  const homeCurrency = String(payload.home_currency ?? 'MZN').trim().toUpperCase()
  const rates = {}

  for (const row of payload.rates) {
    if (!row || typeof row !== 'object') continue

    const base = String(row.base ?? '').trim().toUpperCase()
    const quote = String(row.quote ?? '').trim().toUpperCase()
    const type = String(row.type ?? '').trim().toLowerCase()
    const value = Number(row.value)

    if (!base || !quote || base === homeCurrency) continue
    if (quote !== homeCurrency) continue
    if (type !== 'buy' && type !== 'sell') continue
    if (!Number.isFinite(value) || value <= 0) continue

    rates[base] ??= { buy: null, sell: null }
    rates[base][type] = value
  }

  if (Object.keys(rates).length === 0) {
    throw new ExchangeRateError('Nenhuma taxa utilizável foi encontrada na resposta.', 'empty')
  }

  return {
    publishedAt,
    publisher:
      typeof payload.name === 'string' && payload.name.trim()
        ? payload.name.trim()
        : EXCHANGE_SOURCE.publisher,
    homeCurrency,
    rates,
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Obtém a tabela de taxas mais recente, com timeout e tratamento de erros.
 *
 * @param {{ timeoutMs?: number }} [options]
 */
export async function fetchExchangeRates({ timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const endpoint = getRatesEndpoint()
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  let response
  try {
    response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-cache',
    })
  } catch {
    if (timedOut) {
      throw new ExchangeRateError('O pedido de taxas demorou demasiado tempo.', 'timeout')
    }
    throw new ExchangeRateError('Não foi possível contactar o serviço de taxas.', 'network')
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    throw new ExchangeRateError(
      `O serviço de taxas respondeu com o estado HTTP ${response.status}.`,
      'http',
      response.status,
    )
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ExchangeRateError('A resposta do serviço não é um JSON válido.', 'invalid-response')
  }

  return parseRatesPayload(payload)
}
