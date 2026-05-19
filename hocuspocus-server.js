import { Server } from '@hocuspocus/server';

const server = new Server({
  port: 1234,
  name: 'aryanadocs-ws',
  
  // Fungsi ini otomatis jalan saat dokumen berubah atau user disconnect
  async onStoreDocument({ documentName, document }) {
    console.log(`💾 Menyimpan dokumen ID: ${documentName}...`);
    
    try {
      // Ambil state dari dokumen Y.js
      const state = document.state;
      
      // Kirim ke Laravel
      await fetch('http://127.0.0.1:8000/api/documents/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentName,
          state: Array.from(state), // Convert ke array biasa
          user_id: null // Bisa di-pass dari context kalau mau
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