// App.jsx
import CollaborativeEditor from './InstantTiptapEditor';
import { id } from './config';
import { updateDoc, useQueryAllDocIds } from './database';

/**
 * Main App Component
 * 
 * This component serves as the primary interface for the collaborative editor demo.
 * It showcases real-time collaboration features by:
 * 
 * 1. Loading/initializing multiple document instances
 * 2. Rendering multiple editor instances that can:
 *    - Share the same document (Editors 1 & 2 -> doc1) demonstrating real-time collaboration
 *    - Use different documents (Editor 3 -> doc2) showing document isolation
 * 
 * The component handles:
 * - Document initialization with default content if no documents exist
 * - Loading states and error handling for document fetching
 * - Layout of multiple editor instances
 * 
 * Uses:
 * - CollaborativeEditor component for rich text editing
 * - Database hooks for document management
 */

export default function App() {

  const { data, isLoading, error } = useQueryAllDocIds();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // get the first two documents
  let doc1 = data?.[0]?.id;
  let doc2 = data?.[1]?.id;

  // if the documents don't exist, create them
  if (!doc1 || !doc2) {
    // Initialize two Documents in the database
    // For demonstration, we set initial content to something
    doc1 = updateDoc(id(), {
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Hello from doc-1!' }] },
        ],
        // ... Tiptap JSON structure
      },
      updatedBy: 'server-init',
      updatedAt: new Date().toISOString(),
    });

    doc2 = updateDoc(id(), {
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Welcome to doc-2' }] },
        ],
      },
      updatedBy: 'server-init',
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        <h1>Editor 1 (doc-1)</h1>
        <CollaborativeEditor docId={doc1} />
      </div>
      <div>
        <h1>Editor 2 (doc-1)</h1>
        {/* Another instance editing the same doc => real-time collab */}
        <CollaborativeEditor docId={doc1} />
      </div>
      <div>
        <h1>Editor 3 (doc-2)</h1>
        {/* Another instance for a different doc => no overlap */}
        <CollaborativeEditor docId={doc2} />
      </div>
    </div>
  );
}
