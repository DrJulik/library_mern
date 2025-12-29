export default function Footer() {
  return (
    <footer>
      {/* Top footer bar */}
      <div className="bg-library-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:underline">Privacy Statement</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Accessibility Statement</a>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-sm text-gray-600">
          <p>Powered by BiblioCommons.</p>
          <p>BiblioCore: app33 Version 9.33.1 Last updated 2025/12/09 15:45.</p>
        </div>
      </div>
    </footer>
  );
}

