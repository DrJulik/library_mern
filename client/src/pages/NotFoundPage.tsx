import Layout from '@/layouts/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Page not found</p>
          <a href="/" className="text-library-600 hover:text-library-700 hover:underline">
            Go back home
          </a>
        </div>
      </div>
    </Layout>
  );
}

