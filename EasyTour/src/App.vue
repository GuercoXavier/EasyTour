
<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app">

    <AppHeader />

    <main id="inicio" class="main-content">
      <section class="welcome">
        <h1>Bem-vindo ao EasyTour!</h1>

        <p>
          O seu companheiro de viagem em Moçambique.
          Descubra, comunique e explore sem barreiras.
        </p>
      </section>
    </main>

    <AppFooter />

  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
}

.main-content {
  min-height: 70vh;
  padding: 80px 20px;
}

.welcome {
  max-width: 900px;
  margin: auto;
  text-align: center;
  padding: 60px 20px;
}

.welcome h1 {
  color: #174d35;
  font-size: 36px;
  margin-bottom: 20px;
}

.welcome p {
  color: #555;
  font-size: 18px;
  line-height: 1.6;
}
</style>
