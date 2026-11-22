<template>
  <div id="tradutor">
    <div id="container">
      <div id="origem">
        <label for="lang-origem">Língua de origem</label>
        <select id="lang-origem" v-model="idiomaOrigem">
          <option v-for="lingua in linguas" :key="lingua.id" :value="lingua.id">
            {{ lingua.nome }}
          </option>
        </select>
        <textarea
          id="campo-texto-in"
          v-model="textoEntrada"
          placeholder="Escreve uma palavra ou frase completa..."
          aria-label="Texto original"
        ></textarea>
      </div>
      <div id="destino">
        <label for="lang-destino">Língua de destino</label>
        <select id="lang-destino" v-model="idiomaDestino">
          <option v-for="lingua in linguas" :key="lingua.id" :value="lingua.id">
            {{ lingua.nome }}
          </option>
        </select>
        <p id="campo-texto-out" aria-live="polite">
          {{ textoTraduzido || 'A tradução aparecerá aqui.' }}
        </p>
      </div>
    </div>

    <div id="acoes">
      <p v-if="indices" class="informacao">
        {{ indices.numeroPalavras }} entradas no dicionário ·
        {{ indices.numeroPares }} pares de frases do corpus moçambicano
      </p>
      <p v-if="aviso" class="informacao">{{ aviso }}</p>
      <p v-if="fonte && textoTraduzido" class="informacao">
        Fonte: {{ fonte }}<span v-if="referencia"> · {{ referencia }}</span>
      </p>
      <p v-if="erro" id="mensagem-erro" role="alert">{{ erro }}</p>
      <button id="btn-traduzir" @click="traduzir"
        :disabled="carregando || !textoEntrada.trim() || !indices">
        {{ carregando ? 'A carregar...' : 'Traduzir' }}
      </button>
      <p class="nota">O corpus procura apenas frases completas em Português ↔ Changana.
        Não traduz palavras isoladas por aproximação. Inglês é suportado pelo dicionário.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { criarIndices, procurarTraducao } from '../services/traducaoLocal.js'

const linguas = [
  { id: 'portuguese', nome: 'Português' },
  { id: 'changana', nome: 'Changana' },
  { id: 'english', nome: 'Inglês' },
]
const idiomaOrigem = ref('portuguese')
const idiomaDestino = ref('changana')
const textoEntrada = ref('')
const textoTraduzido = ref('')
const carregando = ref(true)
const indices = ref(null)
const erro = ref('')
const aviso = ref('')
const fonte = ref('')
const referencia = ref('')

async function carregarJson(ficheiro) {
  const url = `${import.meta.env.BASE_URL}${ficheiro}`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${ficheiro}: HTTP ${r.status}`)
  return r.json()
}

onMounted(async () => {
  try {
    const base = await carregarJson('dictionary.json')
    let complementar = {}
    let pares = []
    try {
      complementar = await carregarJson('dictionary_complementar_mz.json')
    } catch {
      // Ficheiro opcional; a base permanece funcional.
    }
    try {
      const corpus = await carregarJson('corpus_changana_pt.json')
      if (!Array.isArray(corpus.pares)) throw new Error('Formato inválido do corpus')
      pares = corpus.pares
    } catch {
      aviso.value = 'Corpus ainda não importado. Executa python3 scripts/importar_corpus_changana.py.'
    }
    indices.value = criarIndices({ ...complementar, ...base }, pares)
  } catch (e) {
    erro.value = `Não foi possível carregar o dicionário: ${e.message}`
  } finally {
    carregando.value = false
  }
})

function traduzir() {
  erro.value = ''
  textoTraduzido.value = ''
  fonte.value = ''
  referencia.value = ''
  if (!indices.value) return
  const r = procurarTraducao(indices.value, textoEntrada.value, idiomaOrigem.value, idiomaDestino.value)
  if (r.erro) erro.value = r.erro
  else {
    textoTraduzido.value = r.texto
    fonte.value = r.fonte
    referencia.value = r.referencia || ''
  }
}
</script>

<style scoped>
.informacao {
  color: #52616e;
  font-size: 12px;
  text-align: center;
}
.nota {
  color: #52616e;
  font-size: 12px;
  text-align: center;
  max-width: 720px;
}
#campo-texto-out { white-space: pre-wrap; }
</style>
