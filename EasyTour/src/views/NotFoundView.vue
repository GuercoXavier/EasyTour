<script setup>
import { Compass } from 'lucide-vue-next'
</script>

<template>
  <div class="not-found">
    <span class="not-found__icon" aria-hidden="true">
      <Compass :size="26" :stroke-width="1.8" />
    </span>
    <p class="not-found__code">Erro 404</p>
    <h1 class="not-found__title">Página não encontrada</h1>
    <p class="not-found__text">
      O endereço que tentou abrir não existe neste componente. Volte ao conversor de moedas para
      continuar.
    </p>
    <RouterLink to="/" class="not-found__link">Ir para o Conversor de Moedas</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  margin: clamp(2rem, 8vw, 4.5rem) auto;
  max-width: 34rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: clamp(1.75rem, 6vw, 2.75rem);
  box-shadow: var(--shadow-card);
}

.not-found__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  color: var(--blue-600);
}

.not-found__code {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.not-found__title {
  font-size: clamp(1.4rem, 5vw, 1.85rem);
  font-weight: 720;
  letter-spacing: -0.02em;
  color: var(--navy-900);
}

.not-found__text {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--muted);
}

.not-found__link {
  margin-top: 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--blue-600);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  transition: background 0.15s ease;
}

.not-found__link:hover {
  background: var(--navy-700);
}
</style>
