<script setup>
import { ref } from 'vue'

const idiomas = [
  { codigo: 'pt', nome: 'Português' },
  { codigo: 'changana', nome: 'Changana' },
  { codigo: 'en', nome: 'Inglês' },
]

const origem = ref('pt')
const destino = ref('changana')
const texto = ref('')
const resultado = ref('')

function trocarIdiomas() {
  const anterior = origem.value
  origem.value = destino.value
  destino.value = anterior
}

function traduzir() {
  resultado.value = 'A integração com a API Moz-Translate será adicionada na próxima etapa.'
}
</script>

<template>
  <div class="tradutor">
    <h1>Tradutor EasyTour</h1>

    <p>Traduza entre Português, Changana e Inglês.</p>

    <div class="idiomas">
      <select v-model="origem">
        <option
          v-for="idioma in idiomas"
          :key="idioma.codigo"
          :value="idioma.codigo"
        >
          {{ idioma.nome }}
        </option>
      </select>

      <button @click="trocarIdiomas">⇄</button>

      <select v-model="destino">
        <option
          v-for="idioma in idiomas"
          :key="idioma.codigo"
          :value="idioma.codigo"
        >
          {{ idioma.nome }}
        </option>
      </select>
    </div>

    <textarea
      v-model="texto"
      placeholder="Escreva o texto a traduzir..."
    ></textarea>

    <button
      class="traduzir"
      :disabled="!texto.trim() || origem === destino"
      @click="traduzir"
    >
      Traduzir
    </button>

    <div class="resultado">
      <h3>Tradução</h3>
      <p>{{ resultado || 'O resultado aparecerá aqui.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.tradutor {
  max-width: 900px;
  margin: auto;
  padding: 30px;
}

h1 {
  color: #164e36;
}

.idiomas {
  display: flex;
  gap: 15px;
  margin: 25px 0;
}

select {
  flex: 1;
  min-width: 0;
  padding: 12px;
}

textarea {
  width: 100%;
  min-height: 180px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10px;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.traduzir {
  margin-top: 15px;
  background: #16835a;
  color: white;
}

.traduzir:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resultado {
  background: #f1f5f9;
  padding: 20px;
  margin-top: 25px;
  border-radius: 10px;
}
</style>
