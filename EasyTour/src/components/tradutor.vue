<template>
  <div id="tradutor">
    <div id="container">
      <div id="origem">
        <label for="lang-origem">Lingua de origem</label>
        <select id="lang-origem" v-model="idiomaOrigem">
          <option v-for="l in linguas" :key="l.id" :value="l.id">
            {{ l.nome }}
          </option>
        </select>
        <textarea
          id="campo-texto-in"
          v-model="textoEntrada"
          placeholder="Escreve uma palavra..."
        ></textarea>
      </div>

      <div id="destino">
        <label for="lang-destino">Lingua de destino</label>
        <select id="lang-destino" v-model="idiomaDestino">
          <option v-for="l in linguas" :key="l.id" :value="l.id">
            {{ l.nome }}
          </option>
        </select>
        <p id="campo-texto-out">
          {{ textoTraduzido || "A traducao aparecera aqui." }}
        </p>
      </div>
    </div>

    <div id="acoes">
      <div v-if="erro" id="mensagem-erro">{{ erro }}</div>
      <button
        id="btn-traduzir"
        @click="traduzir"
        :disabled="carregando || !textoEntrada.trim() || !dicionario"
      >
        {{
          carregando
            ? "A traduzir..."
            : dicionario
              ? "Traduzir"
              : "A carregar..."
        }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const linguas = [
  { id: "portuguese", nome: "Portugues" },
  { id: "changana", nome: "Changana" },
  { id: "english", nome: "Ingles" },
];

const idiomaOrigem = ref("portuguese");
const idiomaDestino = ref("changana");
const textoEntrada = ref("");
const textoTraduzido = ref("");
const carregando = ref(false);
const erro = ref("");
const dicionario = ref(null);

onMounted(async () => {
  carregando.value = true;
  try {
    const r = await fetch("/dictionary.json", { cache: "no-store" });
    const tipo = r.headers.get("content-type") || "";
    if (!r.ok || !tipo.includes("application/json")) {
      throw new Error("dictionary.json nao encontrado em public/.");
    }
    dicionario.value = await r.json();
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
});

function normalizar(s) {
  return (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function traduzirLocal(palavra, origem, destino) {
  const p = normalizar(palavra);
  const dic = dicionario.value;
  if (!dic) return null;

  if (origem === "portuguese") {
    for (const [chave, entrada] of Object.entries(dic)) {
      if (normalizar(chave) === p) return entrada[destino] ?? null;
    }
    return null;
  }

  for (const [chave, entrada] of Object.entries(dic)) {
    if (normalizar(entrada[origem]) === p) {
      return destino === "portuguese" ? chave : (entrada[destino] ?? null);
    }
  }
  return null;
}

function traduzir() {
  const palavra = textoEntrada.value.trim();
  if (!palavra) return;

  if (idiomaOrigem.value === idiomaDestino.value) {
    erro.value = "Escolhe linguas diferentes.";
    return;
  }

  erro.value = "";
  textoTraduzido.value = "";

  const resultado = traduzirLocal(
    palavra,
    idiomaOrigem.value,
    idiomaDestino.value,
  );
  if (resultado) {
    textoTraduzido.value = resultado;
  } else {
    erro.value = `"${palavra}" nao foi encontrada no dicionario.`;
  }
}
</script>
