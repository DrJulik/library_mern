import Button from './components/common/Button';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              📚 Library Management System
            </h1>
            <p className="text-xl text-gray-600">
              Welcome to your MERN Stack Library Application
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ⚛️ Frontend
              </h3>
              <p className="text-gray-600">React 18 + TypeScript + Vite + Tailwind CSS</p>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                🔧 Backend
              </h3>
              <p className="text-gray-600">Node.js + Express + MongoDB</p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🚀 Getting Started
            </h2>
            <p className="text-gray-600 mb-4">
              Your frontend is now configured with TypeScript, Tailwind CSS, and ready to build!
            </p>
            <Button variant="primary" size="lg">
              Start Building
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

