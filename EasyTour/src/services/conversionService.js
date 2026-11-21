/**
 * Regras de conversão monetária.
 *
 * O Banco de Moçambique publica, para cada moeda estrangeira, quantos meticais
 * custa comprar (sell) e quantos meticais se recebem ao vender (buy) uma unidade
 * dessa moeda. As duas taxas não são iguais — a diferença é o spread cambial —
 * e por isso a escolha da taxa depende da operação do turista:
 *
 *   moeda estrangeira → MZN : o turista vende a moeda → usa a taxa de COMPRA (buy)
 *   MZN → moeda estrangeira : o turista compra a moeda → usa a taxa de VENDA (sell)
 *
 * Conversões entre duas moedas estrangeiras seguem a mesma lógica, passando pelo
 * metical: vende-se a moeda de origem (buy) para obter MZN e compra-se a moeda de
 * destino (sell) com esses meticais. A taxa resultante é uma taxa cruzada derivada.
 */

/** Rótulos de apresentação do tipo de taxa aplicada. */
export const RATE_TYPE_LABELS = {
  buy: 'Compra',
  sell: 'Venda',
  cross: 'Compra + venda',
  identity: 'Sem conversão',
}

/** Rótulos de apresentação da natureza da taxa. */
export const RATE_METHOD_LABELS = {
  published: 'Directa',
  inverse: 'Derivada (inversa)',
  cross: 'Derivada (cruzada)',
  identity: 'Sem conversão',
}

/** Limite defensivo: evita valores absurdos e perda de precisão. */
const MAX_AMOUNT = 1_000_000_000_000_000

/**
 * Interpreta o texto introduzido pelo utilizador, aceitando vírgula ou ponto
 * como separador decimal.
 *
 * @param {string|number} raw
 * @returns {number|null} número válido ou null
 */
export function parseAmountInput(raw) {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null
  }

  const compact = String(raw ?? '')
    .trim()
    .replace(/[\s\u00a0]/g, '')
    .replace(/[^\d.,]/g, '')

  if (!compact) return null

  // Com vírgula, os pontos são separadores de milhares ("1.500,50");
  // sem vírgula, o ponto é o separador decimal ("1500.50").
  const normalised = compact.includes(',')
    ? compact.replace(/\./g, '').replace(',', '.')
    : compact

  if (!/^\d*\.?\d*$/.test(normalised)) return null

  const value = Number(normalised)
  return Number.isFinite(value) ? value : null
}

/**
 * Converte um montante entre duas moedas.
 *
 * @param {object} params
 * @param {number|null} params.amount
 * @param {string} params.from código da moeda de origem
 * @param {string} params.to código da moeda de destino
 * @param {Record<string, { buy: number|null, sell: number|null }>} params.table
 * @param {string} [params.homeCurrency]
 * @returns {{
 *   value: number,
 *   rate: number,
 *   rateType: 'buy'|'sell'|'cross'|'identity',
 *   method: 'published'|'inverse'|'cross'|'identity',
 *   derived: boolean,
 *   legs: Array<{ currency: string, type: 'buy'|'sell', value: number }>,
 * }|null}
 */
export function convertAmount({ amount, from, to, table, homeCurrency = 'MZN' }) {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount)

  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > MAX_AMOUNT) {
    return null
  }

  const source = String(from ?? '').trim().toUpperCase()
  const target = String(to ?? '').trim().toUpperCase()
  const home = String(homeCurrency ?? 'MZN').trim().toUpperCase()

  if (!source || !target) return null

  if (source === target) {
    return {
      value: numericAmount,
      rate: 1,
      rateType: 'identity',
      method: 'identity',
      derived: false,
      legs: [],
    }
  }

  if (!table) return null

  // Moeda estrangeira → MZN: taxa de compra publicada directamente pelo BDM.
  if (target === home) {
    const buy = table[source]?.buy
    if (!Number.isFinite(buy) || buy <= 0) return null

    return {
      value: numericAmount * buy,
      rate: buy,
      rateType: 'buy',
      method: 'published',
      derived: false,
      legs: [{ currency: source, type: 'buy', value: buy }],
    }
  }

  // MZN → moeda estrangeira: compra-se a moeda à taxa de venda (relação inversa).
  if (source === home) {
    const sell = table[target]?.sell
    if (!Number.isFinite(sell) || sell <= 0) return null

    return {
      value: numericAmount / sell,
      rate: 1 / sell,
      rateType: 'sell',
      method: 'inverse',
      derived: true,
      legs: [{ currency: target, type: 'sell', value: sell }],
    }
  }

  // Moeda estrangeira → moeda estrangeira: taxa cruzada via metical.
  const sourceBuy = table[source]?.buy
  const targetSell = table[target]?.sell
  if (!Number.isFinite(sourceBuy) || sourceBuy <= 0) return null
  if (!Number.isFinite(targetSell) || targetSell <= 0) return null

  const rate = sourceBuy / targetSell

  return {
    value: numericAmount * rate,
    rate,
    rateType: 'cross',
    method: 'cross',
    derived: true,
    legs: [
      { currency: source, type: 'buy', value: sourceBuy },
      { currency: target, type: 'sell', value: targetSell },
    ],
  }
}
