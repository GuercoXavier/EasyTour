
<template>
  <main id="inicio" class="page-content">
    <section class="welcome-section">
      <span class="eyebrow">DESCUBRA MOÇAMBIQUE</span>

      <h1>
        Explore Moçambique
        <span>sem barreiras.</span>
      </h1>

      <p>
        Comunique, converta moedas e aproveite melhor
        cada momento da sua viagem.
      </p>

      <div class="welcome-actions">
        <RouterLink to="/inicio#tradutor" class="primary-action">
          Experimentar tradutor
        </RouterLink>

        <RouterLink to="/cambio" class="secondary-action">
          Converter moeda
        </RouterLink>
      </div>
    </section>

    <section class="feature-placeholders" aria-label="Ferramentas EasyTour">
      <article id="tradutor" class="feature-card">
        <span class="feature-icon">文</span>

        <div>
          <h2>Tradutor</h2>
          <p>
            Traduza expressões entre português, inglês e changana.
          </p>
          <small>O componente de tradução será integrado aqui.</small>
        </div>
      </article>

      <article class="feature-card">
        <span class="feature-icon">↔</span>

        <div>
          <h2>Conversor de moeda</h2>
          <p>
            Consulte taxas de câmbio e converta valores
            para facilitar as suas compras.
          </p>

          <RouterLink to="/cambio" class="card-link">
            Abrir conversor →
          </RouterLink>
        </div>
      </article>
    </section>

    <section class="destinations-section">
      <div class="section-heading">
        <span class="eyebrow">EXPLORE MOÇAMBIQUE</span>
        <h2>Destinos que merecem ser descobertos</h2>
        <p>
          Conheça alguns dos lugares mais fascinantes de Moçambique.
        </p>
      </div>

      <div class="destinations-grid">
        <article class="destination-card">
          <div class="destination-visual island">
            <span>🏝️</span>
          </div>

          <div class="destination-info">
            <span class="destination-location">Nampula</span>
            <h3>Ilha de Moçambique</h3>
            <p>
              Descubra a história, a cultura e a arquitectura
              desta ilha histórica.
            </p>
            <RouterLink to="/destino/1" class="destination-link">
              Explorar destino →
            </RouterLink>
          </div>
        </article>

        <article class="destination-card">
          <div class="destination-visual beach">
            <span>🌊</span>
          </div>

          <div class="destination-info">
            <span class="destination-location">Inhambane</span>
            <h3>Praia do Tofo</h3>
            <p>
              Desfrute das praias, das paisagens costeiras
              e das actividades marítimas.
            </p>
            <RouterLink to="/destino/2" class="destination-link">
              Explorar destino →
            </RouterLink>
          </div>
        </article>

        <article class="destination-card">
          <div class="destination-visual gorongosa">
            <span>🦁</span>
          </div>

          <div class="destination-info">
            <span class="destination-location">Sofala</span>
            <h3>Parque Nacional da Gorongosa</h3>
            <p>
              Explore a biodiversidade e as paisagens
              naturais de Moçambique.
            </p>
            <RouterLink to="/destino/3" class="destination-link">
              Explorar destino →
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

  </main>
</template>

<style scoped>
.page-content {
  flex: 1;
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
  padding: 76px 0 86px;
}

.welcome-section {
  max-width: 760px;
  margin: 0 auto 56px;
  text-align: center;
}

.eyebrow {
  color: #168052;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.welcome-section h1 {
  margin: 16px 0;
  color: #173f32;
  font-size: clamp(36px, 6vw, 58px);
  line-height: 1.12;
  letter-spacing: -2px;
}

.welcome-section h1 span {
  color: #168052;
}

.welcome-section p {
  max-width: 610px;
  margin: 0 auto;
  color: #64756b;
  font-size: 17px;
  line-height: 1.7;
}

.welcome-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-action,
.secondary-action {
  padding: 13px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}

.primary-action {
  background: #168052;
  color: white;
}

.secondary-action {
  border: 1px solid #168052;
  color: #168052;
}

.feature-placeholders {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 26px;
  border: 1px solid #e4ece6;
  border-radius: 14px;
  background: white;
  box-shadow: 0 8px 25px rgb(25 65 45 / 4%);
  scroll-margin-top: 100px;
}

.feature-icon {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #e8f5ed;
  color: #168052;
  font-size: 23px;
  font-weight: 800;
}

.feature-card h2 {
  margin: 0 0 7px;
  color: #173f32;
  font-size: 19px;
}

.feature-card p {
  margin: 0 0 12px;
  color: #64756b;
  font-size: 14px;
  line-height: 1.6;
}

.feature-card small,
.card-link {
  color: #168052;
  font-size: 12px;
}

.card-link {
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 700px) {
  .page-content {
    width: min(100% - 32px, 1160px);
    padding: 55px 0 60px;
  }

  .welcome-section {
    margin-bottom: 38px;
  }

  .welcome-section h1 {
    letter-spacing: -1px;
  }

  .welcome-section p {
    font-size: 15px;
  }

  .feature-placeholders {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .feature-card {
    padding: 20px;
  }
}

.destinations-section {
  margin-top: 85px;
}

.section-heading {
  margin-bottom: 30px;
  text-align: center;
}

.section-heading h2 {
  margin: 12px 0;
  color: #173f32;
  font-size: clamp(25px, 4vw, 34px);
}

.section-heading p {
  color: #64756b;
  font-size: 15px;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.destination-card {
  overflow: hidden;
  border: 1px solid #e4ece6;
  border-radius: 15px;
  background: white;
  box-shadow: 0 8px 25px rgb(25 65 45 / 5%);
  transition: transform 0.2s, box-shadow 0.2s;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgb(25 65 45 / 10%);
}

.destination-visual {
  min-height: 155px;
  display: grid;
  place-items: center;
  font-size: 65px;
}

.island {
  background: #e4f3ed;
}

.beach {
  background: #e1f2f7;
}

.gorongosa {
  background: #edf2df;
}

.destination-info {
  padding: 22px;
}

.destination-location {
  color: #168052;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.destination-info h3 {
  margin: 10px 0;
  color: #173f32;
  font-size: 19px;
}

.destination-info p {
  min-height: 65px;
  color: #64756b;
  font-size: 14px;
  line-height: 1.7;
}

.destination-link {
  display: inline-block;
  margin-top: 10px;
  color: #168052;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.destination-link:hover {
  text-decoration: underline;
}

@media (max-width: 850px) {
  .destinations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .destinations-section {
    margin-top: 60px;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
  }
}

</style>
