/**
 * AUUI Prototype - {{PROJECT_TITLE}}
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AUUI
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start chatting to build your prototype. Changes appear instantly.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg">
            <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Ready for your first message</span>
          </div>
        </div>
      </div>
    </div>
  )
}
