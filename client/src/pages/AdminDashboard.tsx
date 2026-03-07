import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/books"
            className="px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700"
          >
            Manage Books
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/borrowing"
            className="px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700"
          >
            Borrowing Records
          </Link>
          <Link
            to="/admin/holds"
            className="px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700"
          >
            Manage Holds
          </Link>
          <Link
            to="/admin/create-admin"
            className="px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700"
          >
            Create Admin
          </Link>
        </div>
      </div>
    </Layout>
  );
}

