<template>
  <div class="story-wrapper">
    <div class="story-container">
      <div class="story-header">
        <div class="meta-tag">THE STORY</div>
        <h1 class="story-title">Origins &<br />Evolution</h1>
        <div class="story-subtitle">Decoding the narrative of life, one genome at a time.</div>
      </div>

      <div class="story-content">
        <section class="chapter">
          <h2 class="chapter-title">I. Origins</h2>
          <p>
            I was born in a small Romanian town, bridging cultures as the son of a Transylvanian
            Saxon mother and a Romanian father. This dual heritage taught me early on to see
            connections where others saw contrast—a perspective that became the foundation of my
            work in genetics.
          </p>
          <p>
            My interest in the fundamentals of life began instinctively. I was fascinated by the
            paradox of nature: that every living thing is simultaneously unique and deeply
            interconnected.
          </p>
        </section>

        <section class="chapter">
          <h2 class="chapter-title">II. The Code of Life</h2>
          <p>
            The arrival of our family's first computer in the late 90s introduced me to a new kind
            of language: BASIC. The thrill of making pixels dance with code was my first lesson in
            logic. Decades later, I apply those same principles to decode the human genome.
          </p>
          <p>
            Medicine was the natural convergence. At
            <span class="highlight">FAU Erlangen-Nürnberg</span>, I found Human Genetics—a field
            where computational precision meets biological mystery.
          </p>
        </section>

        <section class="chapter">
          <h2 class="chapter-title">III. The Science</h2>
          <p>
            Genetics isn't just data; it's narrative. Every variant tells a story, every mutation
            has a history. My research focuses on <strong>neurodevelopmental disorders</strong>,
            <strong>rare tumors</strong>, and <strong>kidney diseases</strong>. Looking at the
            molecular level allows us to understand what makes us uniquely human.
          </p>
          <p>
            In 2018, securing my first DFG project was a turning point. It validated my approach:
            combining rigorous bioinformatics with clinical insight. Awards like the
            <em>GfH-Promotionspreis</em> and the <em>SYNLAB Award</em> are honors, but the true
            reward is seeing research translate into better patient outcomes.
          </p>
        </section>

        <section class="chapter">
          <h2 class="chapter-title">IV. Beyond the Lab</h2>
          <p>Nature reminds us to marvel; science teaches us to question.</p>
          <p>
            When I am not analyzing genomes, I am exploring the other 71% of our planet.
            <strong>Freediving</strong> is my active meditation—floating alongside creatures whose
            lineage predates humanity. Photography allows me to capture these moments of suspended
            time.
          </p>
          <p>
            My recent fascination is searching for fossil shark teeth. Holding a
            <strong>Megalodon</strong> tooth that is 20 million years old is a humble reminder: we
            are all just brief participants in a never-ending experiment.
          </p>
        </section>

        <div class="story-footer">
          <p class="final-quote">
            "We are just billions of years of evolution learning to understand itself."
          </p>
        </div>
      </div>
    </div>
    <Dock />
  </div>
</template>

<script setup>
import Dock from './Dock.vue'
</script>

<style scoped>
.story-wrapper {
  background-color: var(--vp-c-bg);
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 8rem; /* Space for dock */
}

.story-container {
  max-width: 720px;
  width: 100%;
  padding: 6rem 1.5rem;
}

.story-header {
  text-align: center;
  margin-bottom: 6rem;
}

.meta-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--vp-c-accent);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.story-title {
  font-family: var(--vp-font-family-headings);
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.story-subtitle {
  font-family: var(--vp-font-family-base);
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.chapter {
  margin-bottom: 5rem;
  position: relative;
}

.chapter-title {
  font-family: var(--vp-font-family-headings);
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chapter p {
  font-family: var(--vp-font-family-base);
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.chapter p:last-child {
  margin-bottom: 0;
}

.highlight {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.story-footer {
  margin-top: 6rem;
  padding-top: 3rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.final-quote {
  font-family: var(--vp-font-family-headings);
  font-size: 1.5rem;
  font-style: italic;
  color: var(--vp-c-text-1);
  max-width: 600px;
  margin: 0 auto;
}

/* Drop cap for first paragraph */
.chapter:first-of-type p:first-of-type::first-letter {
  float: left;
  font-family: var(--vp-font-family-headings);
  font-size: 4.5rem;
  line-height: 0.8;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .story-title {
    font-size: 3.5rem;
  }

  .story-container {
    padding: 4rem 1.5rem;
  }
}
</style>
