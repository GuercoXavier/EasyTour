
<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app">

    <!-- Cabeçalho do EasyTour -->
    <AppHeader />

    <!-- Conteúdo das páginas, incluindo o conversor -->
    <main class="shell main">
      <RouterView />
    </main>

    <!-- Rodapé do EasyTour -->
    <AppFooter />

  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding-top: clamp(1.5rem, 5vw, 2.75rem);
  padding-bottom: 2rem;
}
</style>
