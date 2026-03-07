import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';

export default function AccessibilityStatementPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link to="/" className="text-library-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Accessibility Statement</h1>
        <p className="text-gray-500 text-sm mb-8">We try. We really do. Sometimes the books fall off the shelf.</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Our Commitment (Most of the Time)</h2>
            <p>
              Gotham City Public Library is committed to making our services usable by as many
              people as possible. This includes people who use screen readers, people who prefer
              large print, people who need ramps instead of those dramatic spiral staircases, and
              people who are just really bad at finding the “Log In” button. We see you. We’re
              working on it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">What We’ve Done So Far</h2>
            <p>
              We have added alt text to book covers (e.g., “Cover of a book you’re about to love”).
              We have ensured that our website can be navigated by keyboard, except for that one
              dropdown that still does the thing. We know. We’re sorry. We have installed a ramp
              to the second floor, though it does go past the rare manuscripts room, so please
              don’t speed. Our wheelchair-accessible bathroom is on the left. No, the other left.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Assistive Technology and Bats</h2>
            <p>
              Our catalog is designed to work with common screen readers. If you use a Batcomputer,
              Bat-assistive device, or any technology that goes “beep” in a heroic way, please
              contact us. We’d like to test that. We also offer large-print editions of popular
              titles, audiobooks (narrated by our resident dramatic reader, Dave), and a “someone
              will read this to you” service. Dave has opinions. You’ve been warned.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Feedback and Complaints</h2>
            <p>
              Found a barrier? Tell us. We have a form, a suggestion box, and a very patient
              librarian named Carol who will write everything down in perfect cursive. We aim to
              respond within 5 business days, unless it’s the week of the annual Book Sale, in
              which case we’re all in the basement and may emerge in spring. We’ll get back to you.
              Eventually.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">The Fine Print (We Mean Well)</h2>
            <p>
              We’re a small library in a city that has, let’s say, unique challenges. We’re doing
              our best. If something doesn’t work for you, we want to fix it. If our best isn’t
              good enough yet, we’re still glad you’re here. Please keep coming back. And if you
              see Dave, tell him to stop adding sound effects to the audiobooks. Thank you.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
          <Link to="/privacy" className="text-library-600 hover:underline">Privacy Statement</Link>
          <Link to="/terms" className="text-library-600 hover:underline">Terms of Use</Link>
        </div>
      </div>
    </Layout>
  );
}
