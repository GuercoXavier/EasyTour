
<script setup>
const anoAtual = new Date().getFullYear()
</script>

<template>
  <footer class="footer" id="sobre">

    <div class="footer-container">

      <!-- Informações da aplicação -->
      <div class="footer-about">
        <h2 class="footer-logo">
          🌍 Easy<span>Tour</span>
        </h2>

        <p>
          O seu companheiro de viagem em Moçambique.
          Facilitamos a comunicação e a conversão de moedas
          para tornar a sua viagem mais simples e agradável.
        </p>
      </div>

      <!-- Links úteis -->
      <div class="footer-links">
        <h3>Links úteis</h3>

        <ul>
          <li><a href="#inicio">Início</a></li>
          <li><a href="#tradutor">Tradutor</a></li>
          <li><a href="#cambio">Conversor de moeda</a></li>
          <li><a href="#sobre">Sobre nós</a></li>
        </ul>
      </div>

      <!-- Informações de contacto -->
      <div class="footer-contact">
        <h3>Contactos</h3>

        <p>Moçambique</p>
        <p>Estamos aqui para facilitar a sua viagem!</p>

        <div class="footer-social">
          <a href="https://www.facebook.com/"
             target="_blank"
             rel="noopener noreferrer">
            Facebook
          </a>

          <a href="https://www.instagram.com/"
             target="_blank"
             rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>

    </div>

    <!-- Fontes de informação -->
    <div class="footer-sources">
      <p>
        Fontes de dados: APIs de câmbio e tradução utilizadas
        pela aplicação.
      </p>
    </div>

    <!-- Direitos reservados -->
    <div class="footer-bottom">
      <p>
        © {{ anoAtual }} EasyTour.
        Todos os direitos reservados.
      </p>
    </div>

  </footer>
</template>

<style scoped>
.footer {
  background-color: #174d35;
  color: white;
  padding: 50px 25px 20px;
}

.footer-container {
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 40px;
}

/* Logótipo e descrição */
.footer-logo {
  font-size: 27px;
  margin-bottom: 15px;
}

.footer-logo span {
  color: #e5a900;
}

.footer-about p {
  color: #d5e4da;
  line-height: 1.7;
  max-width: 380px;
}

/* Títulos */
.footer h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #ffffff;
}

/* Links */
.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a,
.footer-social a {
  color: #d5e4da;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover,
.footer-social a:hover {
  color: #e5a900;
}

/* Contactos */
.footer-contact p {
  color: #d5e4da;
  margin-bottom: 12px;
  line-height: 1.5;
}

.footer-social {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

/* Fontes de informação */
.footer-sources {
  max-width: 1200px;
  margin: 35px auto 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-sources p {
  color: #d5e4da;
  font-size: 13px;
  text-align: center;
}

/* Direitos reservados */
.footer-bottom {
  max-width: 1200px;
  margin: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}

.footer-bottom p {
  color: #d5e4da;
  font-size: 13px;
}

/* Responsividade */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-social {
    flex-wrap: wrap;
  }
}
</style>
