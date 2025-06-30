<template>
  <div class="cv-container">
    <div class="cv-header">
      <h1>Curriculum Vitae</h1>
      <div class="cv-actions">
        <a href="/Bernt-Popp_CV_EN.pdf" target="_blank" class="cv-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Download PDF (English)
        </a>
        <a href="/Bernt-Popp_CV_DE.pdf" target="_blank" class="cv-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Download PDF (Deutsch)
        </a>
      </div>
    </div>

    <div class="cv-content">
      <section class="cv-section">
        <h2>Contact</h2>
        <div class="contact-info">
          <p>📧 bernt.popp@charite.de</p>
          <p>📱 +49 162 1086590</p>
          <p>🌐 <a href="https://www.berntpopp.com">https://www.berntpopp.com</a></p>
          <p>📚 <a href="https://orcid.org/0000-0002-3679-1081">ORCID 0000-0002-3679-1081</a></p>
        </div>
      </section>

      <section class="cv-section">
        <h2>Professional Experience</h2>
        <CVEntry 
          title="Senior Physician"
          organization="Charité – Universitätsmedizin Berlin"
          department="Translational Research Area - Research Group 'Hypertension and Molecular Biology of Endocrine Tumors'"
          period="07/2022 - Present"
          location="Berlin, Germany"
        />
        
        <CVEntry 
          title="Senior Physician & Head of Genetics Outpatient Clinic"
          organization="MVZ Dresden"
          period="2021 - 2022"
          location="Dresden, Germany"
        />
        
        <CVEntry 
          title="Specialist in Human Genetics"
          organization="University of Leipzig Medical Center"
          department="Institute of Human Genetics"
          period="2019 - 2021"
          location="Leipzig, Germany"
          details="Deputy Team Leader Genetic Diagnostics - Clinical Genomics"
        />
      </section>

      <section class="cv-section">
        <h2>Education</h2>
        <CVEntry 
          title="Dr. med. (summa cum laude)"
          organization="University Hospital Erlangen"
          department="Institute of Human Genetics"
          period="02/2013 - 11/2015"
          location="Erlangen, Germany"
          details="Dissertation: 'De novo missense mutations in the NAA10 gene cause severe non-syndromic developmental delay in males and females'"
        />
        
        <CVEntry 
          title="Medical License"
          organization="Friedrich-Alexander-Universität Erlangen-Nürnberg"
          period="Completed 11/2012"
          location="Erlangen, Germany"
        />
      </section>

      <section class="cv-section">
        <h2>Core Competencies</h2>
        <ul class="competencies">
          <li>Specialist in human genetics with 12 years of experience in genetic diagnostics and counseling</li>
          <li>Scientist with experience in high throughput sequencing, data analysis, rare diseases of neural development and kidney</li>
          <li>Bioinformatician with experience in R, Bash, Python, Javascript, workflow automation, virtualization and Linux administration</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import CVEntry from './CVEntry.vue'
</script>

<style scoped>
.cv-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.cv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.cv-header h1 {
  margin: 0;
}

.cv-actions {
  display: flex;
  gap: 1rem;
}

.cv-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-brand);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.cv-link:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.cv-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.cv-section h2 {
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-info p {
  margin: 0;
}

.contact-info a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.competencies {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.competencies li {
  padding-left: 1.5rem;
  position: relative;
}

.competencies li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
}

@media (max-width: 768px) {
  .cv-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cv-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .cv-link {
    justify-content: center;
  }
}
</style>