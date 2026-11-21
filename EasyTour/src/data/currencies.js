/**
 * Catálogo de moedas apresentado na interface.
 *
 * As taxas em si vêm sempre da API (Banco de Moçambique); este ficheiro contém
 * apenas metadados de apresentação — código ISO 4217, nome em português e símbolo.
 * Qualquer moeda devolvida pela API que não exista aqui é apresentada pelo código.
 */

export const HOME_CURRENCY = 'MZN'

/** Moedas com destaque na interface, por ordem de relevância para o turista. */
export const PRIORITY_CURRENCIES = ['MZN', 'USD', 'ZAR', 'EUR', 'GBP', 'BWP']

export const CURRENCY_CATALOGUE = {
  MZN: { code: 'MZN', name: 'Metical moçambicano', symbol: 'MT', isLocal: true },
  USD: { code: 'USD', name: 'Dólar americano', symbol: 'US$' },
  ZAR: { code: 'ZAR', name: 'Rand sul-africano', symbol: 'R' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
  GBP: { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
  BWP: { code: 'BWP', name: 'Pula do Botswana', symbol: 'P' },
  AED: { code: 'AED', name: 'Dirham dos Emirados Árabes Unidos', symbol: 'AED' },
  AUD: { code: 'AUD', name: 'Dólar australiano', symbol: 'A$' },
  BRL: { code: 'BRL', name: 'Real brasileiro', symbol: 'R$' },
  CAD: { code: 'CAD', name: 'Dólar canadiano', symbol: 'C$' },
  CHF: { code: 'CHF', name: 'Franco suíço', symbol: 'CHF' },
  CNH: { code: 'CNH', name: 'Yuan chinês (mercado offshore)', symbol: 'CN¥' },
  CNY: { code: 'CNY', name: 'Yuan chinês', symbol: '¥' },
  DKK: { code: 'DKK', name: 'Coroa dinamarquesa', symbol: 'kr' },
  KWD: { code: 'KWD', name: 'Dinar kuwaitiano', symbol: 'KD' },
  MUR: { code: 'MUR', name: 'Rupia maurícia', symbol: '₨' },
  NOK: { code: 'NOK', name: 'Coroa norueguesa', symbol: 'kr' },
  NZD: { code: 'NZD', name: 'Dólar neozelandês', symbol: 'NZ$' },
  SEK: { code: 'SEK', name: 'Coroa sueca', symbol: 'kr' },
  XDR: { code: 'XDR', name: 'Direitos de saque especiais (FMI)', symbol: 'XDR' },
  ZMK: { code: 'ZMK', name: 'Kwacha zambiano', symbol: 'ZK' },
}

/**
 * Devolve os metadados de uma moeda, com recurso ao próprio código quando
 * a moeda não está catalogada.
 *
 * @param {string} code
 * @returns {{ code: string, name: string, symbol: string, isLocal?: boolean }}
 */
export function resolveCurrency(code) {
  const normalised = String(code ?? '').trim().toUpperCase()
  return (
    CURRENCY_CATALOGUE[normalised] ?? {
      code: normalised,
      name: normalised || 'Moeda desconhecida',
      symbol: normalised,
    }
  )
}

/**
 * Constrói a lista de moedas a apresentar nos selectores, separando as
 * principais das restantes e incluindo todas as que a API disponibiliza.
 *
 * @param {string[]} availableCodes códigos devolvidos pela API
 */
export function buildCurrencyList(availableCodes = []) {
  const codes = new Set(PRIORITY_CURRENCIES)
  for (const code of availableCodes) {
    const normalised = String(code ?? '').trim().toUpperCase()
    if (normalised) codes.add(normalised)
  }

  const priority = []
  const others = []
  for (const code of codes) {
    const currency = resolveCurrency(code)
    if (PRIORITY_CURRENCIES.includes(currency.code)) {
      priority.push(currency)
    } else {
      others.push(currency)
    }
  }

  priority.sort(
    (a, b) => PRIORITY_CURRENCIES.indexOf(a.code) - PRIORITY_CURRENCIES.indexOf(b.code),
  )
  others.sort((a, b) => a.name.localeCompare(b.name, 'pt'))

  return { priority, others }
}
