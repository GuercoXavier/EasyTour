import { computed, ref } from 'vue'
import { convertAmount, parseAmountInput } from '@/services/conversionService'

/**
 * Composable que gere o formulário de conversão: montante, moedas de origem e
 * destino, validação e resultado. Mantém a vista livre de lógica de cálculo.
 *
 * @param {import('vue').Ref<object|null>} tableRef tabela de taxas carregada
 */
export function useConversion(tableRef) {
  const amount = ref('100')
  const from = ref('USD')
  const to = ref('MZN')

  const parsedAmount = computed(() => parseAmountInput(amount.value))

  const amountError = computed(() => {
    if (String(amount.value).trim() === '') {
      return 'Introduza o montante que pretende converter.'
    }
    if (parsedAmount.value === null) {
      return 'Montante inválido. Use apenas números, com vírgula ou ponto nos decimais.'
    }
    if (parsedAmount.value <= 0) {
      return 'O montante deve ser superior a zero.'
    }
    return ''
  })

  const isValid = computed(() => !amountError.value)

  const result = computed(() => {
    if (!isValid.value) return null

    return convertAmount({
      amount: parsedAmount.value,
      from: from.value,
      to: to.value,
      table: tableRef.value?.rates,
      homeCurrency: tableRef.value?.homeCurrency,
    })
  })

  /** Inverte as moedas de origem e destino, preservando o montante introduzido. */
  function swapCurrencies() {
    const previousFrom = from.value
    from.value = to.value
    to.value = previousFrom
  }

  return {
    amount,
    from,
    to,
    parsedAmount,
    amountError,
    isValid,
    result,
    swapCurrencies,
  }
}
