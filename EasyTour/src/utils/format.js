/**
 * Formatação de números, montantes e datas para português de Moçambique.
 * Centralizada para garantir a mesma apresentação em toda a interface.
 */

const FALLBACK_LOCALE = 'pt-PT'

function resolveLocale() {
  try {
    return Intl.NumberFormat.supportedLocalesOf(['pt-MZ']).length > 0 ? 'pt-MZ' : FALLBACK_LOCALE
  } catch {
    return FALLBACK_LOCALE
  }
}

export const numberLocale = resolveLocale()

function createNumberFormat(options) {
  return new Intl.NumberFormat(numberLocale, options)
}

/**
 * Converte uma data ISO (YYYY-MM-DD) num objecto Date local, sem desvios de fuso.
 * @param {string} isoDate
 * @returns {Date|null}
 */
function parseIsoDate(isoDate) {
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null
  const date = new Date(`${isoDate}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Formata um montante monetário. Valores muito pequenos (inferiores a um
 * cêntimo) recebem mais casas decimais para não aparecerem como "0,00".
 *
 * @param {number|null|undefined} value
 */
export function formatCurrencyAmount(value) {
  if (!Number.isFinite(value)) return '—'

  const magnitude = Math.abs(value)
  const maximumFractionDigits = magnitude > 0 && magnitude < 0.01 ? 6 : 2

  return createNumberFormat({
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Formata uma taxa de câmbio com precisão adaptada à sua ordem de grandeza.
 *
 * @param {number|null|undefined} value
 */
export function formatRate(value) {
  if (!Number.isFinite(value) || value <= 0) return '—'

  const maximumFractionDigits =
    value >= 1 ? 4 : value >= 0.01 ? 6 : 8

  return createNumberFormat({
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Formata a data de publicação da tabela de taxas.
 *
 * @param {string|null|undefined} isoDate
 */
export function formatPublicationDate(isoDate) {
  const date = parseIsoDate(isoDate)
  if (!date) return '—'

  return new Intl.DateTimeFormat(numberLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Descreve há quanto tempo a tabela foi publicada ("publicado hoje", "ontem", …).
 *
 * @param {string|null|undefined} isoDate
 */
export function describePublicationAge(isoDate) {
  const date = parseIsoDate(isoDate)
  if (!date) return ''

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const elapsedDays = Math.round((startOfToday - date) / 86_400_000)

  if (elapsedDays <= 0) return 'publicado hoje'
  if (elapsedDays === 1) return 'publicado ontem'
  return `publicado há ${elapsedDays} dias`
}

/**
 * Hora local da última verificação das taxas.
 *
 * @param {Date|null|undefined} date
 */
export function formatTimeOfDay(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat(numberLocale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
