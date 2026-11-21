<script setup>
import { ref } from 'vue'
import { traduzirPalavra } from '@/services/translationService.js'

const idiomas = [
  { codigo: 'pt', nome: 'Português' },
  { codigo: 'changana', nome: 'Changana' },
  { codigo: 'en', nome: 'Inglês' },
]

const origem = ref('pt')
const destino = ref('changana')
const texto = ref('')
const resultado = ref('')
const erro = ref('')
const carregando = ref(false)

function limparResposta() {
  resultado.value = ''
  erro.value = ''
}

function trocarIdiomas() {
  const anterior = origem.value
  origem.value = destino.value
  destino.value = anterior
  limparResposta()
}

async function traduzir() {
  limparResposta()
  carregando.value = true
  try {
    resultado.value = await traduzirPalavra(texto.value, origem.value, destino.value)
  } catch (falha) {
    erro.value = falha?.message || 'Ocorreu um erro ao traduzir.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <section class="tradutor">
    <h1>Tradutor EasyTour</h1>
    <p>Tradução básica com o dicionário moçambicano Moz-Translate.</p>

    <div class="painel">
      <div class="idiomas">
        <label>
          <span>Idioma de origem</span>
          <select v-model="origem" @change="limparResposta">
            <option v-for="idioma in idiomas" :key="idioma.codigo" :value="idioma.codigo">
              {{ idioma.nome }}
            </option>
          </select>
        </label>

        <button class="trocar" type="button" title="Trocar idiomas" @click="trocarIdiomas">⇄</button>

        <label>
          <span>Idioma de destino</span>
          <select v-model="destino" @change="limparResposta">
            <option v-for="idioma in idiomas" :key="idioma.codigo" :value="idioma.codigo">
              {{ idioma.nome }}
            </option>
          </select>
        </label>
      </div>

      <label class="texto-label" for="palavra">Palavra a traduzir</label>
      <textarea
        id="palavra"
        v-model="texto"
        placeholder="Escreve uma palavra em português..."
        rows="5"
        @input="limparResposta"
      ></textarea>

      <button
        type="button"
        class="traduzir"
        :disabled="!texto.trim() || carregando"
        @click="traduzir"
      >
        {{ carregando ? 'A traduzir...' : 'Traduzir' }}
      </button>

      <div class="resultado" aria-live="polite">
        <h2>Resultado</h2>
        <p v-if="erro" class="erro" role="alert">{{ erro }}</p>
        <p v-else-if="resultado" class="sucesso">{{ resultado }}</p>
        <p v-else class="aviso">Escreve uma palavra e selecciona os idiomas.</p>
      </div>
    </div>
    <p class="nota">Nesta versão, a API suporta português para Changana ou Inglês. As traduções inversas exigem uma extensão da API.</p>
  </section>
</template>

<style scoped>
.tradutor { max-width: 900px; margin: 0 auto; padding: 1.5rem 0; }
h1 { color: #075c3b; font-size: 2rem; }
.painel { background: #fff; margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 14px; }
.idiomas { display: flex; align-items: flex-end; gap: 1rem; margin-bottom: 1.3rem; }
.idiomas label { flex: 1; min-width: 0; }
label span, .texto-label { display: block; margin-bottom: .5rem; font-weight: 650; color: #164e36; }
select, textarea { width: 100%; box-sizing: border-box; padding: .8rem; border: 1px solid #bccbce; border-radius: 8px; font: inherit; }
textarea { resize: vertical; min-height: 150px; }
.trocar { padding: .75rem 1rem; background: #e5f6ee; color: #075c3b; border: 0; border-radius: 8px; cursor: pointer; }
.traduzir { display: block; margin-top: 1rem; padding: .85rem 1.5rem; background: #087c50; color: #fff; border: 0; border-radius: 8px; cursor: pointer; font-weight: 650; }
.traduzir:disabled { opacity: .55; cursor: not-allowed; }
.resultado { margin-top: 1.3rem; padding: 1.2rem; background: #f1f5f9; border-radius: 10px; min-height: 100px; overflow-wrap: anywhere; }
h2 { font-size: 1.1rem; margin: 0 0 .75rem; }
.sucesso { color: #075c3b; font-weight: 650; }
.erro { color: #a11515; font-weight: 650; }
.aviso, .nota { color: #64748b; }
.nota { margin-top: 1rem; font-size: .9rem; }
@media (max-width: 600px) { .idiomas { gap: .4rem; } .trocar { padding: .75rem; } .painel { padding: 1rem; } }
</style>
