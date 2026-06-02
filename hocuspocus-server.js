import { Server } from '@hocuspocus/server';
import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs';

const server = new Server({
  host: '0.0.0.0',
  port: 1234,
  name: 'aryanadocs-ws',
  
  async onLoadDocument({ documentName }) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/documents/${documentName}/state`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.state) || data.state.length === 0) {
        return;
      }

      const bytes = Uint8Array.from(data.state);
      const doc = new Doc();
      applyUpdate(doc, bytes);
      console.log(`🔄 Loaded saved state for document ID ${documentName}`);
      return doc;
    } catch (error) {
      console.error(`❌ Failed to load saved state for document ID ${documentName}:`, error);
    }
  },

  async onStoreDocument({ documentName, document }) {
    console.log(`💾 Menyimpan dokumen ID: ${documentName}...`);
    
    try {
      if (!document) {
        console.warn('⚠️ onStoreDocument called without document object for', documentName);
        return;
      }

      const state = encodeStateAsUpdate(document);
      if (!state || typeof state[Symbol.iterator] !== 'function') {
        console.warn('⚠️ encodeStateAsUpdate returned invalid state for', documentName, state);
        return;
      }

      const bytes = Array.from(state);

      await fetch('http://127.0.0.1:8000/api/documents/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentName,
          state: bytes,
          user_id: null
        })
      });
      
      console.log(`✅ Berhasil simpan dokumen ${documentName}`);
    } catch (error) {
      console.error(' Gagal simpan ke database:', error);
    }
  }
});

server.listen();
console.log('🚀 Hocuspocus WebSocket Server running on ws://localhost:1234');