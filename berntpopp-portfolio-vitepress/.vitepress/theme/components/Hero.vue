<template>
  <div class="hero-container">
    <div class="hero-content">
      <p class="greeting">Hi, I'm Dr. med. Bernt Popp!</p>
      <h1 class="title">
        GENETICIST &<br><span class="highlight">RESEARCHER</span>
      </h1>
      <p class="description">
        A board-certified geneticist and senior physician with expertise in human genetics, rare diseases, bioinformatics, and high-throughput sequencing data analysis.
      </p>
      <div class="actions">
        <a href="/publications" class="button primary">Publications</a>
        <a href="/cv" class="button secondary">View CV</a>
      </div>
      <div class="social-icons">
        <!-- Social links will be styled from the nav -->
      </div>
    </div>
    <div class="hero-image-container">
      <img src="/b1_square_nobg.png" alt="Dr. Bernt Popp" class="hero-image" />
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to right, #ffffff 50%, #f5f7fa 100%);
}

.hero-content {
  flex: 1;
  max-width: 550px;
}

.greeting {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.05em;
  margin: 0.5rem 0;
  color: #2c3e50; /* A dark, professional text color */
}

.title .highlight {
  color: var(--vp-c-brand); /* Uses the theme's brand color */
}

.description {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 500px;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  text-align: center;
}

.button.primary {
  background-color: #2c3e50;
  color: white;
}
.button.primary:hover {
  background-color: #425a74;
}

.button.secondary {
  background-color: transparent;
  color: var(--vp-c-brand);
  border: 2px solid var(--vp-c-brand);
}
.button.secondary:hover {
  background-color: var(--vp-c-brand-soft);
}

.hero-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  max-width: 80%;
  height: auto;
  object-fit: cover;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-container {
    flex-direction: column-reverse;
    text-align: center;
    background: white;
    padding: 4rem 1rem;
  }
  .actions {
    justify-content: center;
  }
  .hero-image {
    max-width: 250px;
    margin-bottom: 2rem;
  }
  .title {
    font-size: 3rem;
  }
}
</style>