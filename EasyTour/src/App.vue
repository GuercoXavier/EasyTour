<script setup>
import { Coins } from 'lucide-vue-next'
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="shell topbar__inner">
        <RouterLink to="/" class="brand">
          <span class="brand__mark" aria-hidden="true">
            <Coins :size="19" :stroke-width="2" />
          </span>
          <span class="brand__text">
            <strong class="brand__name">EasyTour</strong>
            <span class="brand__tag">Câmbio</span>
          </span>
        </RouterLink>

        <nav class="topbar__nav" aria-label="Navegação principal">
          <RouterLink to="/" class="topbar__link">Conversor</RouterLink>
        </nav>
      </div>
    </header>

    <main class="shell main">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="shell footer__inner">
        <p class="footer__text">
          EasyTour · componente de câmbio de moedas para turistas em Moçambique.
        </p>
        <p class="footer__text footer__text--muted">
          Taxas oficiais do Banco de Moçambique. Projecto académico de Programação Web II.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Barra superior ──────────────────────────────────────────── */
.topbar {
  background: var(--white);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: saturate(180%) blur(8px);
}

.topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 11px;
  background: linear-gradient(150deg, var(--navy-800), var(--navy-900));
  color: var(--white);
  box-shadow: 0 8px 16px -10px rgba(11, 37, 69, 0.8);
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand__name {
  font-size: 0.98rem;
  font-weight: 750;
  letter-spacing: -0.015em;
  color: var(--navy-900);
}

.brand__tag {
  font-size: 0.72rem;
  font-weight: 550;
  color: var(--muted-2);
  letter-spacing: 0.04em;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.topbar__link {
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease;
}

.topbar__link:hover {
  color: var(--blue-600);
  background: var(--blue-50);
}

.topbar__link.router-link-active {
  color: var(--navy-900);
  background: var(--surface-2);
}

/* ── Conteúdo ────────────────────────────────────────────────── */
.main {
  flex: 1;
  padding-top: clamp(1.5rem, 5vw, 2.75rem);
  padding-bottom: 2rem;
}

/* ── Rodapé ──────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  background: var(--white);
  padding-block: 1.4rem;
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer__text {
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.5;
}

.footer__text--muted {
  color: var(--muted-2);
}

@media (min-width: 700px) {
  .footer__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
}
</style>
