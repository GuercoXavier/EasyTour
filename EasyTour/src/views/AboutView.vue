
<template>
  <section class="about-page">
    <div class="about-hero">
      <span class="eyebrow">SOBRE O EASYTOUR</span>

      <h1>Descubra Moçambique com mais facilidade.</h1>

      <p>
        O EasyTour é uma plataforma criada para facilitar a experiência
        de turistas e visitantes em Moçambique, reunindo ferramentas
        úteis para a comunicação e para o dia a dia durante as viagens.
      </p>
    </div>

    <div class="about-content">
      <article class="about-card">
        <div class="card-icon">🌍</div>
        <h2>Quem somos?</h2>
        <p>
          Somos um projecto académico desenvolvido no âmbito da
          disciplina de Programação Web II. O nosso objectivo é
          utilizar a tecnologia para responder a necessidades reais
          dos visitantes de Moçambique.
        </p>
      </article>

      <article class="about-card">
        <div class="card-icon">🎯</div>
        <h2>A nossa missão</h2>
        <p>
          Tornar as viagens mais simples, proporcionando acesso
          a ferramentas digitais que ajudam os visitantes a comunicar
          e a compreender melhor os valores monetários.
        </p>
      </article>

      <article class="about-card">
        <div class="card-icon">💡</div>
        <h2>O que oferecemos?</h2>
        <p>
          O EasyTour reúne funcionalidades de apoio ao visitante,
          incluindo conversão de moedas e ferramentas de tradução
          para facilitar a comunicação em diferentes contextos.
        </p>
      </article>
    </div>

    <div class="about-highlight">
      <h2>Explore Moçambique sem barreiras.</h2>
      <p>
        Queremos tornar a experiência de descobrir Moçambique
        mais acessível, prática e agradável.
      </p>
      <RouterLink to="/inicio" class="home-button">
        Voltar ao início
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  width: min(1100px, 100%);
  margin: 0 auto;
  padding: 20px 0 50px;
  color: #173f32;
}

.about-hero {
  max-width: 760px;
  margin: 0 auto 45px;
  text-align: center;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 16px;
  color: #168052;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.about-hero h1 {
  margin: 0 0 18px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.15;
}

.about-hero p {
  color: #64756c;
  font-size: 16px;
  line-height: 1.8;
}

.about-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.about-card {
  padding: 28px 24px;
  border: 1px solid #e5eee8;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 25px rgb(20 55 42 / 5%);
}

.card-icon {
  margin-bottom: 18px;
  font-size: 34px;
}

.about-card h2 {
  margin: 0 0 12px;
  font-size: 20px;
}

.about-card p {
  margin: 0;
  color: #64756c;
  font-size: 14px;
  line-height: 1.8;
}

.about-highlight {
  margin-top: 35px;
  padding: 38px 25px;
  border-radius: 18px;
  background: #edf7f0;
  text-align: center;
}

.about-highlight h2 {
  margin: 0 0 12px;
  font-size: 25px;
}

.about-highlight p {
  margin-bottom: 24px;
  color: #64756c;
}

.home-button {
  display: inline-block;
  padding: 12px 22px;
  border-radius: 8px;
  background: #168052;
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}

.home-button:hover {
  background: #116640;
}

@media (max-width: 750px) {
  .about-content {
    grid-template-columns: 1fr;
  }

  .about-hero {
    padding: 0 12px;
  }

  .about-highlight {
    padding: 30px 18px;
  }
}
</style>
