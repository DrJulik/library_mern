import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';

export default function PrivacyStatementPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link to="/" className="text-library-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Statement</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: Never. We don’t actually update these.</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">1. We Know What You Read</h2>
            <p>
              By using Gotham City Public Library, you consent to us knowing every book you have ever
              glanced at, every page you dog-eared, and every time you pretended to read philosophy
              while actually napping. We share this information only with: the Batcomputer, Alfred
              (for tea recommendations), and our pet goldfish. The goldfish is very discreet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">2. Cookies (The Digital Kind)</h2>
            <p>
              We use cookies to remember that you’re you. We do not use cookies to bake anything.
              If you find a chocolate chip in your browser cache, that’s from a different website.
              Please do not eat our cookies. They are not nutritious.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">3. Your Data and Superheroes</h2>
            <p>
              We may share anonymized borrowing statistics with local vigilantes for crime-fighting
              purposes. Your name will never appear in a cape-and-cowl report unless you check out
              “How to Become a Vigilante” twelve times. Then we make no promises.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">4. Late Fees and Eternal Shame</h2>
            <p>
              Overdue book records are stored forever. Not for legal reasons—we just think it’s
              funny. Generations from now, your great-grandchildren may receive a letter beginning
              “Regarding the copy of ‘Goodnight Moon’ returned in 2025…”
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">5. Contact Us (We’re Not Hiding)</h2>
            <p>
              Questions? Pigeon-mail the Gotham City Public Library, Attn: Privacy Officer (the
              one who wears the “I read the privacy policy” badge). We’ll respond within 3–5 business
              decades or when the Bat-Signal next appears, whichever is sooner.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
          <Link to="/terms" className="text-library-600 hover:underline">Terms of Use</Link>
          <Link to="/accessibility" className="text-library-600 hover:underline">Accessibility Statement</Link>
        </div>
      </div>
    </Layout>
  );
}
