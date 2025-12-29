import Layout from '@/layouts/Layout';

export default function UnauthorizedPage() {
  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-4">Access Denied</p>
          <p className="text-gray-500 mb-4">
            You don't have permission to access this page
          </p>
          <a href="/dashboard" className="text-library-600 hover:text-library-700 hover:underline">
            Go to dashboard
          </a>
        </div>
      </div>
    </Layout>
  );
}

