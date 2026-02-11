<template>
  <div class="bento-wrapper">
    <div class="bento-grid">
      <!-- 1. The Protagonist (Portrait) -->
      <div class="card card-portrait">
        <div class="image-wrapper">
          <img src="/portrait.png" alt="Bernt Popp" class="portrait-img" />
          <div class="overlay-gradient"></div>
        </div>
      </div>

      <!-- 2. The Title (Typography) -->
      <div class="card card-title">
        <h1 class="giant-type">HUMAN<br /><span class="outline">GENETICIST</span></h1>
        <p class="role-scroller">
          <span>PHYSICIAN</span>
          <span class="separator">/</span>
          <span>RESEARCHER</span>
          <span class="separator">/</span>
          <span>EXPLORER</span>
        </p>
      </div>

      <!-- 3. The Mission (Intro) -->
      <div class="card card-mission">
        <div class="meta-tag">01 // MISSION</div>
        <p class="mission-text">
          Decoding the fundamentals of life through clinical genomics, rare disease research, and
          bioinformatics. <br />
          <br />
          <em>"Nothing in biology makes sense except in the light of evolution."</em>
        </p>
        <a href="/about" class="arrow-link">The Journey &rarr;</a>
      </div>

      <!-- 4. The Science (Stats) -->
      <a href="/publications" class="card card-science interactive">
        <div class="meta-tag">02 // SCIENCE</div>
        <div class="stat-number">80+</div>
        <div class="stat-label">Publications</div>
        <div class="hover-reveal">
          <span>View Index &rarr;</span>
        </div>
      </a>

      <!-- 5. The Art (Photography) -->
      <a href="/photography" class="card card-art interactive">
        <div class="meta-tag">03 // ART</div>
        <div class="art-preview">
          <!-- Placeholder for art - could be a shark/ocean image -->
          <div class="art-circle"></div>
        </div>
        <div class="art-label">Photography</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Reset & Wrapper */
.bento-wrapper {
  width: 100vw;
  height: 100dvh; /* Force exact viewport height */
  background-color: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden; /* Lock scroll */
  position: relative;
  /* Removed top padding adjustment as nav is gone */
}

/* The Grid */
.bento-grid {
  display: grid;
  width: 100%;
  max-width: 1400px; /* Reduced max-width to keep things tight */
  height: 85vh; /* Leave space for dock */
  max-height: 800px;
  grid-template-columns: 1fr 1.2fr 0.8fr; /* Adjusted ratios */
  grid-template-rows: 1.2fr 1fr 1fr;
  gap: 1.5rem;
  padding-bottom: 0;
  box-sizing: border-box;
  grid-template-areas:
    'portrait title title'
    'portrait mission science'
    'portrait mission art';
}

/* Generic Card Styles */
.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px; /* Slight roundness */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card.interactive:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-text-1);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

/* Utility: Meta Tag (Monospace) */
.meta-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

/* 1. Portrait */
.card-portrait {
  grid-area: portrait;
  padding: 0;
  border: none;
  background: black; /* Framing */
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1);
}

.overlay-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

/* 2. Title */
.card-title {
  grid-area: title;
  justify-content: center;
  background: transparent;
  border: none;
  padding-left: 0;
}

.giant-type {
  font-family: var(--vp-font-family-headings);
  font-size: clamp(3.5rem, 6.5vw, 7.5rem); /* Fluid with caps */
  line-height: 0.9;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
  white-space: nowrap; /* Force single line if possible, or break gracefully */
}

.outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--vp-c-text-1);
  opacity: 0.3;
}

.role-scroller {
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 3. Mission */
.card-mission {
  grid-area: mission;
  justify-content: space-between;
}

.mission-text {
  font-family: var(--vp-font-family-base);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 90%;
  color: var(--vp-c-text-1);
}

.arrow-link {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--vp-c-accent);
  margin-top: auto;
  display: inline-block;
}

/* 4. Science */
.card-science {
  grid-area: science;
  background: #f5f5f7; /* Slight contrast */
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
}

:global(.dark) .card-science {
  background: #1e1e1e;
}

.stat-number {
  font-family: var(--vp-font-family-headings);
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-text-1);
}

.stat-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

/* 5. Art */
.card-art {
  grid-area: art;
  background: #1a1a1a;
  color: white;
  text-decoration: none;
  position: relative;
  justify-content: space-between;
}

.art-label {
  font-family: var(--vp-font-family-headings);
  font-size: 1.5rem;
  z-index: 2;
}

.art-circle {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--vp-c-accent);
  filter: blur(40px);
  opacity: 0.6;
  transition: all 0.5s ease;
}

.card-art:hover .art-circle {
  transform: scale(1.5);
  opacity: 0.8;
}

/* 6. Social */
.card-social {
  grid-area: social;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.social-item {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color 0.2s;
}

.social-item:hover {
  border-bottom-color: var(--vp-c-accent);
  color: var(--vp-c-accent);
}

/* Responsive */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 1rem;
    height: auto;
    grid-template-areas:
      'portrait portrait'
      'title    title'
      'mission  mission'
      'science  art'
      'social   social';
  }

  .bento-wrapper {
    height: auto;
    overflow-y: auto;
    padding-bottom: 6rem; /* Space for dock */
  }

  .card-portrait {
    height: 60vh;
  }
}

@media (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'title'
      'portrait'
      'mission'
      'science'
      'art'
      'social';
  }

  .giant-type {
    font-size: clamp(3rem, 13vw, 5rem);
  }

  .role-scroller {
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.85rem;
  }

  .role-scroller .separator {
    display: none;
  }
}
</style>
