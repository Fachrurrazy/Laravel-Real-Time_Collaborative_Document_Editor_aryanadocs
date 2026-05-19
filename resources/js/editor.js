import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TextStyle from '@tiptap/extension-text-style';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

function initEditor(documentId, userName, userId) {
    const ydoc = new Y.Doc();
    const userColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const activityState = new Map();
    let activitySaveTimer = null;

    const provider = new HocuspocusProvider({
        url: 'ws://localhost:1234',
        name: documentId.toString(),
        document: ydoc
    });

    provider.setAwarenessField('user', {
        name: userName,
        color: userColor
    });

    const editor = new Editor({
        element: document.querySelector('#editor'),
        extensions: [
            StarterKit.configure({ history: false }),
            TextStyle,
            Collaboration.configure({ document: ydoc }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: userName,
                    color: userColor
                }
            })
        ],
        content: '<p>Mulai ketik di sini...</p>',
        immediatelyRender: false
    });

    editor.commands.focus('start', { scrollIntoView: true });

    const btnBold = document.getElementById('btnBold');
    const btnItalic = document.getElementById('btnItalic');
    const btnUnderline = document.getElementById('btnUnderline');
    const btnH1 = document.getElementById('btnH1');
    const btnH2 = document.getElementById('btnH2');
    const fontSize = document.getElementById('fontSize');
    const btnHistory = document.getElementById('btnHistory');
    const btnActivity = document.getElementById('btnActivity');
    const btnActivityFixed = document.getElementById('btnActivityFixed');
    const btnCloseHistory = document.getElementById('btnCloseHistory');
    const btnCloseActivity = document.getElementById('btnCloseActivity');
    const btnRefreshActivity = document.getElementById('btnRefreshActivity');
    const btnSaveVersion = document.getElementById('btnSaveVersion');
    const historyModal = document.getElementById('historyModal');
    const activityModal = document.getElementById('activityModal');
    const activityList = document.getElementById('activityList');
    const activityStatus = document.getElementById('activityStatus');
    const onlineUsers = document.getElementById('onlineUsers');
    const statusLabel = document.getElementById('connectionStatus');
    const activityApiUrl = `/api/documents/${documentId}/activity`;

    const buildKey = (id, name) => `${id ?? 'guest'}:${name}`;

    const updateLocalActivity = (id, name, color, edits = 1, timestamp = new Date()) => {
        const key = buildKey(id, name);
        const existing = activityState.get(key) || {
            user_id: id,
            user_name: name,
            user_color: color,
            edits: 0,
            last_edited_at: timestamp.toISOString()
        };
        existing.user_color = color || existing.user_color;
        existing.edits += edits;
        existing.last_edited_at = timestamp.toISOString();
        activityState.set(key, existing);
        renderActivityList();
    };

    const renderActivityList = () => {
        if (!activityList) return;
        const items = Array.from(activityState.values())
            .sort((a, b) => new Date(b.last_edited_at) - new Date(a.last_edited_at));

        activityList.innerHTML = items.length
            ? items.map(item => `
                <div class="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
                    <div class="w-3 h-3 rounded-full" style="background:${item.user_color || '#6b7280'}"></div>
                    <div class="flex-1 text-sm">
                        <div class="font-semibold">${item.user_name}</div>
                        <div class="text-xs text-gray-500">Last edit: ${new Date(item.last_edited_at).toLocaleString()}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold">${item.edits}</div>
                        <div class="text-xs text-gray-500">edits</div>
                    </div>
                </div>`).join('')
            : '<p class="text-gray-500 text-center">Belum ada aktivitas.</p>';
    };

    const fetchActivity = async () => {
        if (!activityList) return;
        try {
            const response = await fetch(activityApiUrl);
            const activities = await response.json();
            activityState.clear();
            activities.forEach(activity => {
                activityState.set(buildKey(activity.user_id, activity.user_name), {
                    ...activity,
                    user_color: activity.user_color || '#6b7280'
                });
            });
            renderActivityList();
            if (activityStatus) {
                activityStatus.textContent = 'Realtime';
            }
        } catch (error) {
            console.error('Failed to fetch activity', error);
            if (activityStatus) {
                activityStatus.textContent = 'Offline';
            }
        }
    };

    const saveActivity = async (edits = 1) => {
        try {
            await fetch('/api/documents/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_id: documentId,
                    user_id: userId,
                    user_name: userName,
                    color: userColor,
                    edits,
                })
            });
        } catch (error) {
            console.error('Failed to save activity', error);
        }
    };

    const enqueueActivitySave = (edits = 1) => {
        updateLocalActivity(userId, userName, userColor, edits);
        if (activitySaveTimer) {
            clearTimeout(activitySaveTimer);
        }
        activitySaveTimer = setTimeout(() => saveActivity(edits), 500);
    };

    editor.on('transaction', ({ transaction }) => {
        if (transaction.docChanged) {
            enqueueActivitySave(1);
        }

        if (btnBold) btnBold.classList.toggle('active', editor.isActive('bold'));
        if (btnItalic) btnItalic.classList.toggle('active', editor.isActive('italic'));
        if (btnUnderline) btnUnderline.classList.toggle('active', editor.isActive('underline'));
    });

    provider.on('status', ({ status }) => {
        if (statusLabel) {
            statusLabel.textContent = status === 'connected' ? '🟢 Connected' : '🔴 Disconnected';
        }
    });

    provider.on('awarenessUpdate', ({ states }) => {
        const users = Array.from(states.values())
            .filter(s => s.user)
            .map(s => s.user)
            .filter(u => u.name !== userName);

        if (onlineUsers) {
            onlineUsers.textContent = users.length
                ? '👥 ' + users.map(u => u.name).join(', ')
                : '🟢 Online';
        }

        fetchActivity();
    });

    if (btnBold) btnBold.addEventListener('click', () => editor.chain().focus().toggleBold().run());
    if (btnItalic) btnItalic.addEventListener('click', () => editor.chain().focus().toggleItalic().run());
    if (btnUnderline) btnUnderline.addEventListener('click', () => editor.chain().focus().toggleUnderline().run());
    if (btnH1) btnH1.addEventListener('click', () => editor.chain().focus().toggleHeading({ level: 1 }).run());
    if (btnH2) btnH2.addEventListener('click', () => editor.chain().focus().toggleHeading({ level: 2 }).run());
    if (fontSize) fontSize.addEventListener('change', (e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run());

    if (btnHistory) {
        btnHistory.addEventListener('click', async () => {
            if (!historyModal) return;
            historyModal.classList.remove('hidden');
            const listContainer = document.getElementById('historyList');
            if (!listContainer) return;
            listContainer.innerHTML = '<p class="text-gray-500 text-center">Loading...</p>';
            try {
                const response = await fetch(`/documents/${documentId}/versions`);
                const versions = await response.json();
                listContainer.innerHTML = '';
                if (versions.length === 0) {
                    listContainer.innerHTML = '<p class="text-gray-500 text-center">Belum ada history.</p>';
                    return;
                }
                versions.forEach(v => {
                    const date = new Date(v.created_at).toLocaleString();
                    const item = document.createElement('div');
                    item.className = 'flex justify-between items-center p-2 border rounded hover:bg-gray-50';
                    item.innerHTML = `
                            <div class="text-sm">
                                <span class="font-semibold">${date}</span><br>
                                <span class="text-xs text-gray-500">User ID: ${v.user_id || 'System'}</span>
                            </div>
                            <button class="text-blue-600 text-xs font-bold hover:underline restore-btn" data-id="${v.id}">Restore</button>
                        `;
                    item.querySelector('.restore-btn')?.addEventListener('click', () => restoreVersion(v.id));
                    listContainer.appendChild(item);
                });
            } catch (error) {
                console.error(error);
                listContainer.innerHTML = '<p class="text-red-500 text-center">Gagal load history.</p>';
            }
        });
    }

    const titleElement = document.getElementById('documentTitle');
    const btnSaveTitle = document.getElementById('btnSaveTitle');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    let initialTitle = titleElement?.textContent.trim() || '';

    if (btnCloseHistory) btnCloseHistory.addEventListener('click', () => historyModal?.classList.add('hidden'));
    if (btnActivity) btnActivity.addEventListener('click', async () => {
        activityModal?.classList.remove('hidden');
        await fetchActivity();
    });
    if (btnActivityFixed) btnActivityFixed.addEventListener('click', async () => {
        activityModal?.classList.remove('hidden');
        await fetchActivity();
    });
    if (btnCloseActivity) btnCloseActivity.addEventListener('click', () => activityModal?.classList.add('hidden'));
    if (btnRefreshActivity) btnRefreshActivity.addEventListener('click', () => fetchActivity());

    if (titleElement && btnSaveTitle) {
        titleElement.addEventListener('input', () => {
            const currentTitle = titleElement.textContent.trim();
            const isChanged = currentTitle !== '' && currentTitle !== initialTitle;
            btnSaveTitle.classList.toggle('hidden', !isChanged);
        });

        btnSaveTitle.addEventListener('click', async () => {
            const newTitle = titleElement.textContent.trim();
            if (!newTitle) {
                alert('Judul tidak boleh kosong.');
                titleElement.textContent = initialTitle;
                return;
            }

            btnSaveTitle.textContent = 'Menyimpan...';
            btnSaveTitle.disabled = true;

            try {
                const response = await fetch(`/documents/${documentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({ title: newTitle })
                });
                const data = await response.json();
                if (!response.ok || data.status !== 'updated') {
                    throw new Error(data.message || 'Gagal update judul');
                }

                initialTitle = data.title;
                document.title = `${data.title} - AryanaDocs`;
                btnSaveTitle.textContent = 'Tersimpan';
                setTimeout(() => {
                    btnSaveTitle.classList.add('hidden');
                    btnSaveTitle.textContent = 'Simpan';
                    btnSaveTitle.disabled = false;
                }, 1500);
            } catch (error) {
                console.error(error);
                alert('Gagal menyimpan judul. Coba lagi.');
                titleElement.textContent = initialTitle;
                btnSaveTitle.textContent = 'Simpan';
                btnSaveTitle.disabled = false;
            }
        });
    }

    async function restoreVersion(versionId) {
        if (!confirm('Yakin mau restore?')) return;
        try {
            const response = await fetch(`/documents/${documentId}/versions/${versionId}/restore`);
            const data = await response.json();
            const update = new Uint8Array(data.state);
            Y.applyUpdate(ydoc, update);
            historyModal?.classList.add('hidden');
            alert('Versi berhasil direstore!');
        } catch (error) {
            console.error(error);
            alert('Gagal restore.');
        }
    }

    if (btnSaveVersion) {
        btnSaveVersion.addEventListener('click', async () => {
            btnSaveVersion.textContent = 'Saving...';
            btnSaveVersion.disabled = true;
            try {
                const state = Y.encodeStateAsUpdate(ydoc);
                await fetch('/api/documents/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' },
                    body: JSON.stringify({ document_id: documentId, state: Array.from(state), user_id: userId })
                });
                btnSaveVersion.textContent = '💾 Saved!';
                setTimeout(() => { btnSaveVersion.textContent = '💾 Save'; btnSaveVersion.disabled = false; }, 2000);
                alert('Version tersimpan!');
            } catch (error) {
                console.error(error);
                alert('Gagal simpan!');
                btnSaveVersion.textContent = '💾 Save';
                btnSaveVersion.disabled = false;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const config = window.aryanaDocsEditorData;
    if (!config || !config.documentId) {
        return;
    }

    initEditor(config.documentId, config.userName, config.userId);
});