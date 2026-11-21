/**
 * Integração com a API moçambicana Moz-Translate.
 * Documentação: https://github.com/emiltonnhampossa/Moz-Translate
 * A rota /translate aceita uma palavra em português e o idioma de destino.
 */
export async function traduzirPalavra(palavra, origem, destino) {
  const texto = palavra.trim()
  if (!texto) throw new Error('Escreve uma palavra para traduzir.')
  if (origem === destino) throw new Error('Escolhe dois idiomas diferentes.')

  if (origem !== 'pt' || !['changana', 'en'].includes(destino)) {
    throw new Error(
      'Esta combinação ainda não é suportada pela API Moz-Translate. Por agora, utiliza Português → Changana ou Português → Inglês.',
    )
  }

  const parametros = new URLSearchParams({
    word: texto,
    lang: destino === 'en' ? 'english' : 'changana',
  })

  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), 10000)
  let resposta

  try {
    resposta = await fetch(`/moz-api/translate?${parametros.toString()}`, {
      signal: controlador.signal,
      headers: { Accept: 'application/json' },
    })
  } catch (erro) {
    if (erro?.name === 'AbortError') {
      throw new Error('A API demorou demasiado a responder. Tenta novamente.')
    }
    throw new Error('Não foi possível contactar a API. Confirma se o servidor Moz-Translate está ligado na porta 3000.')
  } finally {
    clearTimeout(temporizador)
  }

  if (resposta.status === 404) {
    throw new Error('Palavra não encontrada no dicionário da Moz-Translate.')
  }
  if (!resposta.ok) {
    throw new Error(`A API de tradução devolveu um erro (HTTP ${resposta.status}).`)
  }

  let dados
  try {
    dados = await resposta.json()
  } catch {
    throw new Error('A resposta da API não é JSON. Confirma se o servidor Moz-Translate está ligado.')
  }

  if (dados?.error) {
    throw new Error(typeof dados.error === 'string' ? dados.error : 'A API não conseguiu traduzir a palavra.')
  }

  const traducao = dados?.translation
  if (typeof traducao !== 'string' || !traducao.trim()) {
    throw new Error('Palavra não encontrada no dicionário da Moz-Translate.')
  }

  return traducao.trim()
}
