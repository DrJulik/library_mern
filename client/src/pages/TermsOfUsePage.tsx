import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';

export default function TermsOfUsePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link to="/" className="text-library-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Use</h1>
        <p className="text-gray-500 text-sm mb-8">Effective: The moment you thought about clicking. Yes, we saw that.</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">1. You Agree to Everything</h2>
            <p>
              By entering this website, you have agreed to these terms, the privacy statement, the
              library’s secret handshake, and to bringing snacks to the next book club. We’re
              serious about the snacks. Failure to comply may result in being assigned the longest
              Russian novel we have. You have been warned.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">2. Proper Book Behavior</h2>
            <p>
              You shall not use library materials as doorstops, frisbees, or substitutes for
              missing table legs. You shall not return books that have clearly been used to defeat
              villains (we can tell by the cape fibers). You shall not claim that the dog ate your
              copy of “War and Peace” unless you have a very, very large dog and a notarized note.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">3. Fines and Punishments</h2>
            <p>
              Late fees accrue at a rate of one (1) disappointed librarian look per day. After
              thirty days, we escalate to two (2) sighs per week. Persistent non-returners may be
              subject to a mandatory read-aloud of our entire terms of use. Yes, this document. In
              the original legalese. We have done it before.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">4. No Vigilante Activity on Premises</h2>
            <p>
              While we appreciate Gotham’s many masked friends, please do not use the library
              roof for stakeouts, the study carrels for secret lairs, or the restrooms for
              costume changes. We have a designated Changing Room for Capes (Room 404). Ask at the
              front desk. They’ll know.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">5. We Reserve the Right to Be Weird</h2>
            <p>
              Gotham City Public Library reserves the right to amend these terms at any time by
              posting updates on this page, sending carrier pigeons, or writing them in skywriting
              during a particularly slow Tuesday. Continued use of the library after such notice
              constitutes acceptance. Or at least confusion. We accept both.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
          <Link to="/privacy" className="text-library-600 hover:underline">Privacy Statement</Link>
          <Link to="/accessibility" className="text-library-600 hover:underline">Accessibility Statement</Link>
        </div>
      </div>
    </Layout>
  );
}
