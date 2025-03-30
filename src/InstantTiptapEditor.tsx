import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useQueryDoc, updateDoc } from './database';
import { v4 as uuidv4 } from 'uuid';


/**
 * InstantTiptapEditor - A collaborative rich text editor component using Tiptap
 * 
 * This component provides real-time collaborative editing functionality by:
 * 1. Connecting to a shared document in InstantDB using a unique docId
 * 2. Initializing a Tiptap editor instance with basic text editing features
 * 3. Syncing local changes to the database with debouncing
 * 4. Applying remote changes from other users in real-time
 * 
 * The editor uses a client ID system to handle conflict resolution between
 * multiple simultaneous editors, and implements debouncing to prevent 
 * excessive database writes.
 * 
 * Key features:
 * - Real-time collaboration between multiple users
 * - Debounced saves to reduce database load
 * - Conflict resolution using client IDs
 * - Rich text editing via Tiptap
 */

interface InstantTiptapEditorProps {
  docId: string;
  debounceMs?: number;
}

export default function InstantTiptapEditor({ docId, debounceMs = 300 }: InstantTiptapEditorProps) {
  // each editor gets a unique client id. This allows us to detect conflicts
  // and prevent them by not applying updates from the same client
  const clientIdRef = useRef(uuidv4());
  const lastSentRef = useRef<any>(null);
  const saveTimer = useRef<number | null>(null);

  // Query our doc from InstantDB
  const { data: docData, error } = useQueryDoc(docId);

  // Initialize Tiptap editor
  const editor = useEditor({
    
    // See Tiptap docs https://tiptap.dev/docs/examples/advanced/react-performance
    shouldRerenderOnTransaction: false,

    // Configure the editor with basic text editing features, including undo/redo 
    // using the standard history extension
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
      }),
    ],
    content: '',

    // The onUpdate handler is called whenever the editor content changes locally.
    // It implements our collaborative editing strategy by:
    // 1. Capturing the current editor state as JSON
    // 2. Debouncing rapid changes to avoid excessive DB writes
    // 3. Saving to the database with:
    //    - The new content
    //    - A client ID to track which client made the change
    //    - A timestamp for change ordering
    // 4. Storing the last sent content to avoid echo effects
    //
    // The debouncing helps performance by coalescing rapid typing into single updates,
    // while the client ID system prevents changes from being applied back to their
    // originating editor, avoiding infinite loops.
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      // Debounce writes to DB
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      saveTimer.current = window.setTimeout(() => {
        updateDoc(docId, {
          content: json,
          updatedBy: clientIdRef.current,
          updatedAt: new Date().toISOString(),
        });
        lastSentRef.current = json;
      }, debounceMs);
    },
  });

  // Apply remote updates to editor if needed
  useEffect(() => {
    if (!editor || !docData?.content) return;

    const newContent = docData.content;
    const currentContent = safeGetEditorContent(editor);
    const lastSent = lastSentRef.current;

    // If new content is the same as the editor's content, skip
    if (JSON.stringify(newContent) === JSON.stringify(currentContent)) {
      return;
    }
    // If new content is the same as the last we sent, skip
    if (
      docData.updatedBy === clientIdRef.current &&
      JSON.stringify(newContent) === JSON.stringify(lastSent)
    ) {
      return;
    }

    // OK, there's a genuine remote update to apply
    const { from, to } = editor.state.selection;
    editor.commands.setContent(newContent, false /* do not emit update */);

    // Attempt to restore selection. This is janky but it kinda works
    try {
      editor.commands.setTextSelection({ from, to });
    } catch (err) {
      // Can we restore just the cursor position?
      try {
        editor.commands.setTextSelection(from);
      } catch (err) {
        // If all else fails, go to the end of the document
        editor.commands.setTextSelection({ from: newContent.length, to: newContent.length });
      }
    }
  }, [docData, editor]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      editor?.destroy();
    };
  }, [editor]);

  if (error) {
    return <div className="error">Error loading doc: {error.message}</div>;
  }

  if (!editor) {
    return <div>Initializing editor…</div>;
  }

  return (
    <div className="collaborative-editor">
      <EditorContent editor={editor} />
    </div>
  );
}

// This is really stupid, but it works
// Tiptap getJSON returns invalid object structure for deep comparison
export function safeGetEditorContent(editor: Editor) {
  return JSON.parse(JSON.stringify(editor.getJSON()));
}
