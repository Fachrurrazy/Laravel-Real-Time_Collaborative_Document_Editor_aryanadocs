# AryanaDocs - Real-Time Collaborative Document Editor

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-7B68EE?style=for-the-badge&logo=javascript&logoColor=white)

**AryanaDocs** adalah aplikasi editor dokumen kolaboratif real-time yang memungkinkan banyak pengguna untuk mengedit dokumen yang sama secara bersamaan, mirip dengan Google Docs. Dibangun dengan Laravel, TipTap, Yjs, dan Hocuspocus.

## ✨ Fitur Utama

- ✅ **Multi-User Editing** - Beberapa pengguna dapat mengedit dokumen yang sama secara bersamaan
- ✅ **Live Cursor Tracking** - Lihat kursor dan seleksi pengguna lain secara real-time dengan warna yang berbeda
- ✅ **Version History** - Simpan dan restore versi dokumen sebelumnya
- ✅ **Conflict Resolution** - Otomatis menangani konflik editing menggunakan CRDT (Conflict-Free Replicated Data Types)
- ✅ **Real-Time Sync** - Perubahan tersinkronisasi secara instant ke semua pengguna
- ✅ **Rich Text Editor** - Formatting teks (Bold, Italic, Underline, Heading, Font Size)
- ✅ **User Authentication** - Sistem login dan registrasi yang aman

## 🚀 Tech Stack

### Backend
- **Laravel 10.x** - PHP Framework
- **Hocuspocus** - WebSocket Server untuk kolaborasi real-time
- **MySQL/MariaDB** - Database

### Frontend
- **TipTap 2.x** - Rich text editor berbasis ProseMirror
- **Yjs 13.x** - CRDT library untuk sync data real-time
- **Vue.js 3.x** - JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework

### Real-Time Collaboration
- **Yjs** - Shared data types untuk collaborative editing
- **Hocuspocus Provider** - WebSocket client untuk koneksi ke server
- **Awareness Protocol** - Tracking presence dan cursor pengguna

## 📋 Prerequisites

Sebelum menginstall, pastikan sistem Anda memiliki:

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm atau yarn
- MySQL/MariaDB
- Git

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Fachrurrazy/Laravel-Real-Time_Collaborative_Document_Editor_aryanadocs.git
cd Laravel-Real-Time_Collaborative_Document_Editor_aryanadocs