import Link from 'next/link'
import { auth } from '../../auth'
import ContentGate from '../components/ContentGate'

export default async function Home() {
  const session = await auth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Jonny Cangemi</h1>
          <div className="flex space-x-6 items-center">
            <Link href="#projects" className="text-gray-300 hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-400 text-sm">✓ Signed In</span>
                <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Admin
                </Link>
                <Link href="/api/auth/signout" className="text-gray-400 hover:text-white transition-colors">
                  Sign Out
                </Link>
              </div>
            ) : (
              <Link href="/auth/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Full Stack
            <span className="text-blue-400"> Developer</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Building modern web applications with clean code, innovative solutions,
            and a focus on user experience.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/portfolio"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              📊 Live Portfolio
            </Link>
            <Link
              href="#projects"
              className="border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </main>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">Featured Projects</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Portfolio Automation Project */}
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-400 text-sm font-semibold">LIVE</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Portfolio Automation</h4>
            <p className="text-gray-300 mb-4">
              Real-time portfolio tracking system with automated email reports,
              market data integration, and stealth mode for demos.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Node.js</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">PostgreSQL</span>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">Supabase</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm">Vercel</span>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/portfolio"
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                Dashboard →
              </Link>
              <Link
                href="https://github.com/jcangemi24-canman/Portfolio-Automation"
                className="text-gray-400 hover:text-gray-300 text-sm font-semibold"
                target="_blank"
              >
                Code →
              </Link>
            </div>
          </div>

          {/* Placeholder for Portfolio Dashboard */}
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors opacity-75">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-yellow-400 text-sm font-semibold">IN DEVELOPMENT</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Portfolio Dashboard</h4>
            <p className="text-gray-300 mb-4">
              Interactive React dashboard with real-time charts, portfolio analytics,
              and public demo mode for showcasing.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">React</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">Chart.js</span>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">TypeScript</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm">Next.js</span>
            </div>
            <span className="text-gray-500 text-sm">Coming Soon...</span>
          </div>

          {/* Placeholder for Future Project */}
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-gray-400 text-sm font-semibold">PLANNED</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Next Project</h4>
            <p className="text-gray-300 mb-4">
              Future development projects will be showcased here as they come online.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">TBD</span>
            </div>
            <span className="text-gray-500 text-sm">Ideas Welcome...</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-8">About Me</h3>

          {/* Public content */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            I&apos;m a full-stack developer passionate about creating efficient, scalable solutions
            that solve real-world problems. With expertise in modern web technologies,
            I focus on building applications that are both powerful and user-friendly.
          </p>

          {/* Protected detailed content */}
          <ContentGate
            requireAuth={true}
            publicContent={
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mt-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-blue-400 mr-2">🔒</span>
                  <span className="text-gray-300">Detailed Experience & Skills</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Access my complete technical background, project case studies, and professional experience.
                </p>
                <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Sign in to view details →
                </Link>
              </div>
            }
          >
            <div className="bg-gray-800 rounded-lg p-8 mt-8">
              <h4 className="text-2xl font-bold text-white mb-6">🚀 Full Technical Background</h4>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h5 className="text-lg font-semibold text-blue-400 mb-3">Backend Expertise</h5>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Node.js & Express.js production applications</li>
                    <li>• PostgreSQL database design & optimization</li>
                    <li>• RESTful API development & security</li>
                    <li>• Automated testing & CI/CD pipelines</li>
                    <li>• Cloud deployment (Vercel, AWS)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-semibold text-green-400 mb-3">Frontend Skills</h5>
                  <ul className="text-gray-300 space-y-2">
                    <li>• React.js & Next.js 15 applications</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Modern CSS (Tailwind, responsive design)</li>
                    <li>• State management & authentication</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h5 className="text-lg font-semibold text-purple-400 mb-4">Recent Projects Impact</h5>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$47K+</div>
                    <div className="text-gray-400 text-sm">Portfolio value tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99.9%</div>
                    <div className="text-gray-400 text-sm">API uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">&lt;200ms</div>
                    <div className="text-gray-400 text-sm">Average response time</div>
                  </div>
                </div>
              </div>
            </div>
          </ContentGate>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-white mb-8">Get In Touch</h3>
          <p className="text-xl text-gray-300 mb-8">
            Interested in working together or have questions about my projects?
          </p>
          <Link
            href="mailto:jonny@jonnycangemi.com"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Send Email
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <p className="text-gray-400">© 2024 Jonny Cangemi. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="https://github.com/jcangemi24-canman" className="text-gray-400 hover:text-white" target="_blank">
              GitHub
            </Link>
            <Link href="https://linkedin.com/in/jonnycangemi" className="text-gray-400 hover:text-white" target="_blank">
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
