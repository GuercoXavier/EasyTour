# EasyTour

Turistas e tal............... vou editar depois

## APIS usadas

[bdm-exchange-rate](https://github.com/AllRates-Today/bdm-exchange-rate.git)

[moz-translate](https://github.com/emiltonnhampossa/Moz-Translate.git)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Conversor de Moedas (componente)

Implementado na branch `hersonbila_cambio`. Converte montantes entre o metical moçambicano (MZN)
e as moedas publicadas pelo **Banco de Moçambique**, distinguindo sempre a taxa de compra da taxa
de venda e assinalando as taxas derivadas (inversas e cruzadas).

- **Fonte de dados:** tabela oficial do BDM, lida de um espelho público de dados abertos
  (`https://raw.githubusercontent.com/AllRates-Today/central-bank-exchange-rates/main/data/bdm/latest.json`).
  Não exige chave de API, pelo que nenhuma credencial é exposta ao browser. Caso seja necessário
  usar um serviço com chave, definir `VITE_EXCHANGE_RATES_URL` com o endereço da função
  serverless intermediária (ver `.env.example`).
- **Componentes:** `src/components/currency/` — `CurrencyInput`, `CurrencySelector`,
  `CurrencySwap`, `ConversionResult`, `RateDetails`.
- **Composables:** `src/composables/useExchangeRates.js` (carregamento, cache de sessão, erros e
  actualização) e `src/composables/useConversion.js` (estado e validação do formulário).
- **Serviços:** `src/services/exchangeRateService.js` (comunicação com a API) e
  `src/services/conversionService.js` (regras de conversão e taxas cruzadas).
- **Rotas:** `/` apresenta `src/views/CurrencyView.vue`; qualquer rota inexistente mostra
  `src/views/NotFoundView.vue`.
- **Estados tratados:** carregamento, sucesso, erro, sem dados e actualização manual.

```sh
cp .env.example .env   # opcional, apenas para VITE_EXCHANGE_RATES_URL
```
