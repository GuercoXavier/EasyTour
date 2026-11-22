<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="header-container">

      <RouterLink
        class="brand"
        to="/inicio"
        aria-label="EasyTour - página inicial"
        @click="closeMenu"
      >
        <span class="brand-mark" aria-hidden="true">E</span>
        <span class="brand-copy">
          <strong>EasyTour</strong>
          <small>Descubra Moçambique</small>
        </span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Abrir ou fechar menu"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav
        class="main-nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="Navegação principal"
      >
        <RouterLink to="/inicio" class="nav-link" @click="closeMenu">
          Início
        </RouterLink>

        <RouterLink to="/inicio#tradutor" class="nav-link" @click="closeMenu">
          Tradutor
        </RouterLink>

        <RouterLink to="/cambio" class="nav-link" @click="closeMenu">
          Câmbio
        </RouterLink>

        <RouterLink to="/sobre" class="nav-cta" @click="closeMenu">
          Sobre nós
        </RouterLink>
      </nav>

    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e8eee9;
  box-shadow: 0 3px 16px rgb(20 55 42 / 5%);
}
.header-container {
  width: min(1160px, calc(100% - 40px));
  min-height: 78px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand { display: inline-flex; align-items: center; gap: 11px; color: #173f32; text-decoration: none; }
.brand-mark {
  width: 43px; height: 43px; display: grid; place-items: center;
  border-radius: 13px; background: #168052; color: #fff;
  font-size: 25px; font-weight: 800; box-shadow: 0 5px 12px rgb(22 128 82 / 20%);
}
.brand-copy { display: flex; flex-direction: column; line-height: 1.2; }
.brand-copy strong { font-size: 21px; font-weight: 800; letter-spacing: -.5px; }
.brand-copy small { margin-top: 4px; color: #718078; font-size: 11px; letter-spacing: .25px; }
.main-nav { display: flex; align-items: center; gap: 30px; }
.nav-link { color: #40564b; text-decoration: none; font-size: 14px; font-weight: 600; transition: color .2s; }
.nav-link:hover { color: #168052; }
.nav-cta { padding: 11px 19px; border-radius: 8px; background: #168052; color: #fff; text-decoration: none; font-size: 14px; font-weight: 700; transition: background .2s, transform .2s; }
.nav-cta:hover { background: #116640; transform: translateY(-1px); }
.menu-toggle { display: none; border: 0; background: transparent; padding: 8px; cursor: pointer; }
.menu-toggle span { display: block; width: 24px; height: 2px; margin: 5px; border-radius: 2px; background: #173f32; }
@media (max-width: 700px) {
  .header-container { width: min(100% - 32px, 1160px); min-height: 70px; }
  .menu-toggle { display: block; }
  .main-nav { display: none; position: absolute; top: 70px; left: 0; right: 0; padding: 18px 22px 22px; flex-direction: column; align-items: stretch; gap: 0; background: #fff; border-bottom: 1px solid #e8eee9; box-shadow: 0 12px 18px rgb(20 55 42 / 8%); }
  .main-nav.is-open { display: flex; }
  .nav-link { padding: 12px 4px; }
  .nav-cta { margin-top: 8px; text-align: center; }
}
</style>
