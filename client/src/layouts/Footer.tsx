import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      {/* Top footer bar */}
      <div className="bg-library-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:underline">Privacy Statement</Link>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <Link to="/accessibility" className="hover:underline">Accessibility Statement</Link>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-sm text-gray-600">
          <p>Powered by black magic. Made by the Gotham City Public Library. Thanks Batman!</p>
        </div>
      </div>
    </footer>
  );
}

