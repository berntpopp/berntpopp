<template>
  <div class="story-wrapper">
    <div class="story-container">
      <div class="story-header">
        <div class="meta-tag">LEGAL NOTICE</div>
        <h1 class="story-title">Impressum</h1>
        <div class="story-subtitle">Legal information required under German law (DDG).</div>

        <div class="lang-toggle">
          <button :class="['lang-btn', { active: lang === 'de' }]" @click="lang = 'de'">
            Deutsch
          </button>
          <button :class="['lang-btn', { active: lang === 'en' }]" @click="lang = 'en'">
            English
          </button>
        </div>
      </div>

      <!-- German Version -->
      <div v-if="lang === 'de'" class="legal-content">
        <section class="legal-section">
          <h2 class="section-heading">Über diese Webseite</h2>

          <div class="legal-block">
            <h3 class="block-heading">Impressum</h3>
            <p>
              Gemäß § 28 BDSG widerspreche ich jeder kommerziellen Verwendung und Weitergabe der
              Daten.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Verantwortungsbereich</span>
            <p>
              Das Impressum gilt nur für die Internetpräsenz unter der Adresse:
              <a href="http://berntpopp.com/">berntpopp.com</a>
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Abgrenzung</span>
            <p>
              Die Web-Präsenz ist Teil des WWW und dementsprechend mit fremden, sich jederzeit
              wandeln könnenden Web-Sites verknüpft, die folglich auch nicht diesem
              Verantwortungsbereich unterliegen und für die nachfolgende Informationen nicht gelten.
              Dass die Links weder gegen Sitten noch Gesetze verstoßen, wurde genau ein Mal geprüft
              (bevor sie hier aufgenommen wurden).
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Diensteanbieter</span>
            <p>Bernt Popp</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Ansprechpartner</span>
            <p>Bernt Popp (bernt.popp.md[at]gmail.com)</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Verantwortlicher</span>
            <p>Bernt Popp (bernt.popp.md[at]gmail.com)</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Anschrift</span>
            <p>
              Bernt Popp<br />
              Chaußeestr. 58D<br />
              10115 Berlin<br />
              Telefon: 0162 - 1086590
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Urheberschutz und Nutzung</span>
            <p>
              Der Urheber räumt Ihnen ganz konkret das Nutzungsrecht ein, sich eine private Kopie
              für persönliche Zwecke anzufertigen. Nicht berechtigt sind Sie dagegen, die
              Materialien zu verändern und/oder weiter zu geben oder gar selbst zu veröffentlichen.
              Wenn nicht ausdrücklich anders vermerkt, liegen die Urheberrechte bei Bernt Popp.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Datenschutz</span>
            <p>
              Personenbezogene Daten werden nur mit Ihrem Wissen und Ihrer Einwilligung erhoben. Auf
              Antrag erhalten Sie unentgeltlich Auskunft zu den über Sie gespeicherten
              personenbezogenen Daten. Wenden Sie sich dazu bitte an den Administrator.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Keine Haftung</span>
            <p>
              Die Inhalte dieses Webprojektes wurden sorgfältig geprüft und nach bestem Wissen
              erstellt. Aber für die hier dargebotenen Informationen wird kein Anspruch auf
              Vollständigkeit, Aktualität, Qualität und Richtigkeit erhoben. Es kann keine
              Verantwortung für Schäden übernommen werden, die durch das Vertrauen auf die Inhalte
              dieser Website oder deren Gebrauch entstehen.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Schutzrechtsverletzung</span>
            <p>
              Falls Sie vermuten, dass von dieser Website aus eines Ihrer Schutzrechte verletzt
              wird, teilen Sie das bitte umgehend per elektronischer Post mit, damit zügig Abhilfe
              geschafft werden kann. Bitte nehmen Sie zur Kenntnis: Die zeitaufwändigere
              Einschaltung eines Anwaltes zur für den Diensteanbieter kostenpflichtigen Abmahnung
              entspricht nicht dessen wirklichen oder mutmaßlichen Willen.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Haftung für Links</span>
            <p>
              Lt. Urteil vom 12. Mai 1998 - 312 O 85/98 - "Haftung für Links" hat das Landgericht
              Hamburg entschieden, dass man durch die Anbringung eines Links, die Inhalte der
              gelinkten Seite ggf. mit zu verantworten hat. Dies kann nur dadurch verhindert werden,
              dass man sich ausdrücklich von diesen Inhalten distanziert. "Hiermit distanzieren wir
              uns ausdrücklich von allen Inhalten aller gelinkten Seiten auf unserer Website und
              machen uns diese Inhalte nicht zu eigen. Diese Erklärung gilt für alle auf unsere
              Website angebrachten Links."
            </p>
          </div>

          <div class="copyright">© Copyright 2025 Bernt Popp</div>
        </section>
      </div>

      <!-- English Version -->
      <div v-else class="legal-content">
        <section class="legal-section">
          <h2 class="section-heading">About this Website</h2>

          <div class="legal-block">
            <h3 class="block-heading">Legal Notice</h3>
            <p>
              According to § 28 BDSG (German Federal Data Protection Act), I object to any
              commercial use and distribution of the data.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Scope of Responsibility</span>
            <p>
              This legal notice applies only to the internet presence at the address:
              <a href="http://berntpopp.com/">berntpopp.com</a>
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Delimitation</span>
            <p>
              This web presence is part of the WWW and accordingly linked to external, constantly
              changing websites, which consequently are not subject to this area of responsibility
              and for which the following information does not apply. The links have been checked
              exactly once (before being included here) to ensure they do not violate customs or
              laws.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Service Provider</span>
            <p>Bernt Popp</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Website Contact</span>
            <p>Bernt Popp (bernt.popp.md[at]gmail.com)</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Responsible Party</span>
            <p>Bernt Popp (bernt.popp.md[at]gmail.com)</p>
          </div>

          <div class="legal-block">
            <span class="block-label">Address</span>
            <p>
              Bernt Popp<br />
              Chaußeestr. 58D<br />
              10115 Berlin, Germany<br />
              Phone: +49 162 - 1086590
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Copyright and Usage</span>
            <p>
              The author specifically grants you the right to make a private copy for personal
              purposes. However, you are not authorized to modify and/or redistribute or publish the
              materials yourself. Unless expressly stated otherwise, the copyrights belong to Bernt
              Popp.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Data Protection</span>
            <p>
              Personal data is only collected with your knowledge and consent. Upon request, you
              will receive free information about the personal data stored about you. Please contact
              the administrator for this purpose.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">No Liability</span>
            <p>
              The contents of this web project have been carefully reviewed and created to the best
              of our knowledge. However, no claim is made for the completeness, timeliness, quality,
              and accuracy of the information presented here. No responsibility can be assumed for
              damages arising from trust in the contents of this website or their use.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Infringement of Proprietary Rights</span>
            <p>
              If you suspect that one of your proprietary rights is being infringed from this
              website, please notify us immediately by email so that remedial action can be taken
              quickly. Please note: The more time-consuming involvement of a lawyer for a fee-based
              warning letter does not correspond to the actual or presumed will of the service
              provider.
            </p>
          </div>

          <div class="legal-block">
            <span class="block-label">Liability for Links</span>
            <p>
              According to the judgment of May 12, 1998 - 312 O 85/98 - "Liability for Links" the
              Hamburg Regional Court has decided that by placing a link, one may be jointly
              responsible for the contents of the linked page. This can only be prevented by
              expressly distancing oneself from these contents. "We hereby expressly distance
              ourselves from all contents of all linked pages on our website and do not adopt these
              contents as our own. This declaration applies to all links placed on our website."
            </p>
          </div>

          <div class="copyright">© Copyright 2025 Bernt Popp</div>
        </section>
      </div>
    </div>
    <Dock />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dock from './Dock.vue'

const lang = ref('de')
</script>

<style scoped>
.story-wrapper {
  background-color: var(--vp-c-bg);
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 8rem;
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

/* Language Toggle */
.lang-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.lang-btn {
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  padding: 0.5rem 1.5rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.lang-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
}

.lang-btn.active {
  color: var(--vp-c-accent);
  border-color: var(--vp-c-accent);
}

/* Legal Content */
.legal-content {
  max-width: 720px;
}

.section-heading {
  font-family: var(--vp-font-family-headings);
  font-size: 1.75rem;
  margin-bottom: 3rem;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}

.legal-block {
  margin-bottom: 2.5rem;
}

.block-heading {
  font-family: var(--vp-font-family-headings);
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.block-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  display: block;
  margin-bottom: 0.5rem;
}

.legal-block p {
  font-family: var(--vp-font-family-base);
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin: 0;
}

.legal-block a {
  color: var(--vp-c-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.legal-block a:hover {
  border-bottom-color: var(--vp-c-accent);
}

.copyright {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-align: center;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .story-container {
    padding: 4rem 1.5rem;
  }
}
</style>
