
<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { destinations } from '@/data/destinations'

const route = useRoute()

const destination = computed(() =>
  destinations.find(
    (item) => item.id === Number(route.params.id)
  )
)
</script>

<template>
  <section class="destination-page">
    <div v-if="destination" class="destination-content">
      <RouterLink to="/inicio" class="back-link">
        ← Voltar ao início
      </RouterLink>

      <span class="category">
        {{ destination.category }}
      </span>

      <h1>{{ destination.name }}</h1>

      <p class="province">
        📍 {{ destination.province }}, Moçambique
      </p>

      <p class="description">
        {{ destination.description }}
      </p>

      <div class="highlights">
        <h2>O que pode encontrar</h2>

        <ul>
          <li
            v-for="(highlight, index) in destination.highlights"
            :key="index"
          >
            {{ highlight }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="not-found">
      <h1>Destino não encontrado</h1>
      <p>Não conseguimos encontrar este destino turístico.</p>

      <RouterLink to="/inicio" class="back-button">
        Voltar ao início
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.destination-page {
  width: min(900px, 100%);
  margin: 0 auto;
  padding: 25px 0 50px;
  color: #173f32;
}

.destination-content {
  padding: 35px;
  border: 1px solid #e5eee8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 25px rgb(20 55 42 / 5%);
}

.back-link {
  display: inline-block;
  margin-bottom: 35px;
  color: #168052;
  text-decoration: none;
  font-weight: 700;
}

.category {
  display: block;
  margin-bottom: 12px;
  color: #168052;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 12px;
  font-size: clamp(30px, 5vw, 42px);
}

.province {
  color: #168052;
  font-weight: 600;
}

.description {
  margin-top: 25px;
  color: #64756c;
  font-size: 16px;
  line-height: 1.8;
}

.highlights {
  margin-top: 35px;
  padding: 25px;
  border-radius: 12px;
  background: #edf7f0;
}

.highlights h2 {
  margin-top: 0;
  font-size: 21px;
}

.highlights li {
  margin: 12px 0;
  color: #40564b;
}

.not-found {
  padding: 60px 20px;
  text-align: center;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #168052;
  color: white;
  text-decoration: none;
}

@media (max-width: 600px) {
  .destination-content {
    padding: 24px 18px;
  }
}
</style>
