import Image from 'next/image'
import Header from '@/app/components/Header'
import FooterComponent from '@/app/components/Footer'

export default function About() {
  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div style={{ textAlign: 'center' }}>
          <Image
            src="https://github.com/c4ldas.png"
            alt="Github Avatar"
            width={150}
            height={150}
            style={{ borderRadius: '50%', border: '5px solid rgba(38, 132, 255, 0.3)' }}
            priority={true}
          />
          <h1 style={{ marginTop: '1rem' }}>Hi, I&#39;m <strong>Rodrigo Caldas!</strong></h1>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <h2>About</h2>
          <p>
            I&#39;m a Networking and Customer Technical Support professional with around 15 years of experience helping businesses maintain reliable and secure IT infrastructure.
            I specialize in network systems, virtualization technologies (e.g., vSphere, ESXi), and data protection solutions&#8212;backed by a strong sense of empathy, problem-solving, and customer-first mindset.
          </p>
          <p>
            Although my main career is in infrastructure and support, I love learning and building things on the web.
            In my free time, I develop personal projects that mix creativity and technology&#8212;ranging from API integrations to tools for streamers.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Professional Experience</h2>
          <p>This is a brief overview of some roles I&#39;ve held&#8212;my full professional background includes a wider range of experience in support and infrastructure.</p>
          <ul>
            <li><strong>Senior Technical Support Engineer at VMware</strong>: Specialized in supporting vSphere and ESXi environments for enterprise customers.</li>
            <li><strong>Technical Support Analyst at Dell</strong>: Provided enterprise support for data protection solutions, including Avamar and Data Domain systems.</li>
            <li><strong>Network Analyst</strong>: Managed and optimized network systems to ensure uptime and performance.</li>
            <li><strong>Windows &amp; Linux Server Administration</strong>: Experience in configuring and maintaining both environments.</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Education</h2>
          <p><strong>Associate Degree</strong> in Computer Networking/IT &#8212; Universidade Salvador (UNIFACS)</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Languages</h2>
          <p>Fluent in English and Portuguese, with Portuguese as my native language.</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Personal Projects</h2>
          <p>These are hobby projects I created in my spare time to experiment with web development and integrations:</p>
          <ul>
            <li>
              <a href="https://c4ldas.com.br" target="_blank" rel="noopener noreferrer">Main Website &amp; API</a> - It is this website! Built with Next.js and hosted on Vercel. It serves as my portfolio, a place to share experiments, and a backend API playground. Source on{' '}
              <a href="https://github.com/c4ldas/c4ldas-api" target="_blank" rel="noopener noreferrer">GitHub</a>.
            </li>
            <li>
              <a href="https://seapi.c4ldas.com.br" target="_blank" rel="noopener noreferrer">SEAPI (Streamelements Overlay Tool)</a> - A customizable overlay sharing tool for streamers using Streamelements, built with Next.js and also hosted on Vercel. Source on{' '}
              <a href="https://github.com/c4ldas/c4ldas-seapi" target="_blank" rel="noopener noreferrer">GitHub</a>.
            </li>
            <li>
              <a href="https://c4ldas.github.io/streamelements-api" target="_blank" rel="noopener noreferrer">Streamelements API Rewrite</a> - Vanilla JS implementation using the OpenAPI specification, based on the official documentation hosted at{' '}
              <a href="https://dev.streamelements.com" target="_blank" rel="noopener noreferrer">https://dev.streamelements.com</a>. Hosted on GitHub Pages. Source on{' '}
              <a href="https://github.com/c4ldas/streamelements-api" target="_blank" rel="noopener noreferrer">GitHub</a>.
            </li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Contact</h2>
          <p>
            For all contact details and ways to reach me, please check the footer below
            where you will find my social and professional links. You can also send me a message directly via the{' '}
            <a href="/terms/contact">contact form</a>.
          </p>
        </section>
      </main>
      <FooterComponent />
    </div>
  )
}
