import { db, tx } from "./config";

/**
 * Database interface for the collaborative editor
 *
 * This module provides hooks and functions to interact with the database:
 * - useQueryDoc: Hook to fetch a single document by ID
 * - useQueryAllDocIds: Hook to fetch all document IDs
 * - updateDoc: Function to update or create a document
 *
 * The database stores collaborative documents with their content and metadata
 * like who last updated them and when. This enables real-time collaboration
 * between multiple editor instances.
 */

export function useQueryDoc(docId: string) {
  const { data, error } = db.useQuery({ documents: { $: { where: { id: docId } } } });

  const note = data?.documents?.[0];
  return { data: note, error };
}

export function useQueryAllDocIds() {
  // only get the id field to minimize unecessary rerenders
  const { data, isLoading, error } = db.useQuery({ documents: { $: { fields: ["id"] } } });
  return { data: data?.documents, isLoading, error };
}

// upsert
export function updateDoc(docId: string, docUpdate: any) {
  // Merge the update into the existing doc or create if none
  db.transact([tx.documents[docId].update(docUpdate)]);
  return docId;
}
