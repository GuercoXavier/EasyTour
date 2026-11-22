/** Pesquisa exacta em duas fontes, sem deduzir palavras de frases bíblicas. */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt')
    .replace(/[“”«».,;:!?()\[\]…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function adicionar(indice, idioma, original, valor) {
  const chave = normalizar(original)
  if (chave && valor && !indice[idioma].has(chave)) {
    indice[idioma].set(chave, valor)
  }
}

export function criarIndices(dicionario = {}, corpus = []) {
  const indiceDicionario = {
    portuguese: new Map(), changana: new Map(), english: new Map(),
  }
  const indiceCorpus = { portuguese: new Map(), changana: new Map() }

  for (const [portuguese, traducao] of Object.entries(dicionario)) {
    if (!traducao || typeof traducao !== 'object') continue
    const entrada = {
      portuguese,
      changana: traducao.changana || '',
      english: traducao.english || '',
    }
    for (const idioma of Object.keys(indiceDicionario)) {
      adicionar(indiceDicionario, idioma, entrada[idioma], entrada)
    }
  }

  for (const par of corpus) {
    const portugues = par.portuguese || par.text_pt
    const changana = par.changana || par.text_cg
    if (typeof portugues !== 'string' || typeof changana !== 'string') continue
    const entrada = {
      portuguese: portugues, changana,
      referencia: par.referencia || [par.book_pt, par.chapter, par.verse]
        .filter((x) => x !== undefined && x !== null && x !== '').join(' '),
    }
    adicionar(indiceCorpus, 'portuguese', portugues, entrada)
    adicionar(indiceCorpus, 'changana', changana, entrada)
  }

  return { indiceDicionario, indiceCorpus, numeroPalavras: Object.keys(dicionario).length,
    numeroPares: corpus.length }
}

export function procurarTraducao(indices, texto, origem, destino) {
  if (origem === destino) return { erro: 'Escolhe línguas diferentes.' }
  const chave = normalizar(texto)
  if (!chave) return { erro: 'Escreve uma palavra ou expressão.' }

  const entradaDicionario = indices.indiceDicionario[origem]?.get(chave)
  const respostaDicionario = entradaDicionario?.[destino]
  if (respostaDicionario) {
    return { texto: respostaDicionario, fonte: 'Dicionário trilingue' }
  }

  // O corpus tem apenas Português e Changana, nunca Inglês.
  if (['portuguese', 'changana'].includes(origem) &&
      ['portuguese', 'changana'].includes(destino)) {
    const entradaCorpus = indices.indiceCorpus[origem]?.get(chave)
    if (entradaCorpus?.[destino]) {
      return {
        texto: entradaCorpus[destino],
        fonte: 'Corpus Português–Changana (correspondência integral)',
        referencia: entradaCorpus.referencia,
      }
    }
  }
  return { erro: 'Não foi encontrada uma correspondência exacta nos dados disponíveis.' }
}
