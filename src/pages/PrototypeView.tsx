/**
 * Prototype Viewer Component
 *
 * This component is installed by `npx ui-prototyping init`
 * It dynamically loads and renders prototypes from apps/prototypes/
 */

import { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PrototypeView() {
  const { id } = useParams<{ id: string }>();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    // Dynamically import the prototype component
    import(`../../apps/prototypes/${id}/index.tsx`)
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading prototype:', err);
        setError(`Failed to load prototype: ${id}`);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prototype...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Prototype Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            This prototype may not exist yet, or the branch hasn't been deployed.
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No component found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Prototype info bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm text-gray-600">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <span className="font-medium">Prototype:</span> {id}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(id)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              💾 Save to Main
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Prototype content */}
      <Suspense fallback={<div className="p-8 text-center">Loading component...</div>}>
        <Component />
      </Suspense>
    </div>
  );
}

/**
 * Save prototype to main branch (creates a PR)
 */
async function handleSave(id: string) {
  if (!confirm('Create a pull request to merge this prototype to main?')) return;

  try {
    const response = await fetch(`/api/prototypes/${id}/save`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to save prototype');
    }

    const data = await response.json();
    alert(`✅ Pull request created: ${data.prUrl}`);
    window.open(data.prUrl, '_blank');
  } catch (error) {
    alert(`❌ Failed to save: ${error.message}`);
  }
}

/**
 * Delete prototype (removes branch and files)
 */
async function handleDelete(id: string) {
  if (!confirm('Delete this prototype? This cannot be undone.')) return;

  try {
    const response = await fetch(`/api/prototypes/${id}/delete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to delete prototype');
    }

    alert('✅ Prototype deleted');
    window.location.href = '/';
  } catch (error) {
    alert(`❌ Failed to delete: ${error.message}`);
  }
}
