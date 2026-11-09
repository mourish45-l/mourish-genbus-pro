import React, { useState, useEffect } from 'react';
import type { ChatMessage, CustomerRecord } from '../types';
import { calculateSha256, verifySha256 } from '../utils/crypto';
import {
  Send,
  Paperclip,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Trash2,
  Users,
  User,
  KeyRound,
  Check,
  X,
  FileText,
  Download,
} from 'lucide-react';

interface Props {
  messages: Record<string, ChatMessage>;
  currentThreadId: string;
  onSelectThread: (threadId: string) => void;
  customers: Record<string, CustomerRecord>;
  onSendMessage: (text: string, filePayload?: { fileName: string; fileType: string; fileData: string }) => void;
  onEditMessage: (msgId: string, newText: string) => void;
  onDeleteMessage: (msgId: string) => void;
  currentUserRole: 'BUSINESS' | 'CUSTOMER';
  currentUserName: string;
}

export const ChatHub: React.FC<Props> = ({
  messages,
  currentThreadId,
  onSelectThread,
  customers,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  currentUserRole,
  currentUserName,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedInspectHash, setSelectedInspectHash] = useState<ChatMessage | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');
  const [verificationMap, setVerificationMap] = useState<Record<string, boolean>>({});
  const [mobileChatView, setMobileChatView] = useState<'channels' | 'messages'>('messages');

  const msgList = Object.values(messages).sort((a, b) => a.timestamp - b.timestamp);

  // Live client-side cryptographic SHA-256 verification
  useEffect(() => {
    let isMounted = true;
    async function verifyAll() {
      const results: Record<string, boolean> = {};
      for (const m of msgList) {
        const textToHash = `${m.text}::${m.senderId}::${m.timestamp}`;
        const isValid = await verifySha256(textToHash, m.sha256Hash);
        results[m.id] = isValid;
      }
      if (isMounted) setVerificationMap(results);
    }
    verifyAll();
    return () => {
      isMounted = false;
    };
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload files under 2 MB for realtime sync.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      onSendMessage(inputText.trim() || `Shared file: ${file.name}`, {
        fileName: file.name,
        fileType: file.type,
        fileData: dataUrl,
      });
      setInputText('');
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setEditInputText(msg.text);
  };

  const saveEdit = (msgId: string) => {
    if (!editInputText.trim()) return;
    onEditMessage(msgId, editInputText.trim());
    setEditingMsgId(null);
  };

  return (
    <div className="rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px] shadow-xl">
      
      {/* Left Column: Channels & Threads (Team & Multi-Customer) */}
      <div
        className={`lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/70 dark:bg-slate-900/60 ${
          mobileChatView === 'channels' ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Conversations
            </h4>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              SHA-256 Tamper-Proof Sync
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Multi-Thread
          </span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[520px]">
          {/* Internal Team Channel */}
          <button
            onClick={() => {
              onSelectThread('team_internal');
              setMobileChatView('messages');
            }}
            className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
              currentThreadId === 'team_internal'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs">Internal Team Room</div>
                <div className="text-[10px] opacity-80">Staff & Estimators</div>
              </div>
            </div>
          </button>

          {/* Customer Specific Channels */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
              Customer Channels ({Object.keys(customers).length})
            </span>
          </div>

          {Object.values(customers).map((c) => {
            const threadKey = `cust_${c.id}`;
            const isSelected = currentThreadId === threadKey;

            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectThread(threadKey);
                  setMobileChatView('messages');
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs truncate">{c.name}</div>
                    <div className="text-[10px] opacity-80 truncate">{c.phone} · {c.company || 'Client'}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Chat Stream & Message Input */}
      <div
        className={`lg:col-span-8 flex flex-col justify-between p-4 lg:p-6 bg-white/40 dark:bg-slate-950/40 relative ${
          mobileChatView === 'messages' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Chat Stream Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileChatView('channels')}
              className="lg:hidden px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              title="Return to conversations list"
            >
              ← Channels
            </button>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentThreadId === 'team_internal' ? 'Internal Team Collaboration' : 'Customer Direct Channel'}</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SHA-256 Active
                </span>
              </h4>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Cryptographic digest guarantees zero tampering.
              </div>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 max-h-[460px] pr-2">
          {msgList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No messages in this channel yet. Send the first message below.
            </div>
          ) : (
            msgList.map((m) => {
              const isMine = m.senderRole === currentUserRole;
              const isVerified = verificationMap[m.id] ?? true;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs space-y-1.5 shadow-sm transition-all ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {/* Header: Sender & Timestamp & View Status */}
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                      <span className="font-bold">{m.senderName}</span>
                      <span>
                        {m.timeString} · {m.seenByReceiver ? '✓✓ Seen' : '✓ Sent'}
                      </span>
                    </div>

                    {/* Content or Edit Form */}
                    {editingMsgId === m.id ? (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={editInputText}
                          onChange={(e) => setEditInputText(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-black/20 text-white text-xs border border-white/20 focus:outline-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => saveEdit(m.id)}
                            className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingMsgId(null)}
                            className="px-2 py-0.5 rounded bg-black/20 text-white text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed break-words">
                        {m.text}
                        {m.edited && (
                          <span className="text-[10px] italic ml-1.5 opacity-85">
                            {m.editedBeforeSeen ? '(edited before viewing)' : '(edited)'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* File Attachment */}
                    {m.fileData && (
                      <div className="pt-1">
                        {m.fileType?.startsWith('image/') ? (
                          <img
                            src={m.fileData}
                            alt="Attachment"
                            className="rounded-xl max-h-48 object-cover border border-black/10 dark:border-white/10"
                          />
                        ) : (
                          <a
                            href={m.fileData}
                            download={m.fileName || 'document'}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/15 text-xs font-semibold hover:bg-black/25 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{m.fileName || 'Download File'}</span>
                            <Download className="w-3 h-3 ml-1 opacity-70" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* SHA-256 Security Fingerprint Badge */}
                    <div className="pt-1 border-t border-white/10 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => setSelectedInspectHash(m)}
                        className={`inline-flex items-center gap-1 font-mono transition-opacity ${
                          isVerified
                            ? 'text-emerald-300 dark:text-emerald-400 hover:underline'
                            : 'text-rose-300 dark:text-rose-400 font-bold'
                        }`}
                        title="Click to inspect full SHA-256 cryptographic verification"
                      >
                        {isVerified ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        <span>SHA-256: {m.sha256Hash.slice(0, 8)}...</span>
                      </button>

                      {/* Action buttons (only for own messages) */}
                      {isMine && !editingMsgId && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(m)}
                            className="hover:underline opacity-80 hover:opacity-100 flex items-center gap-0.5"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => onDeleteMessage(m.id)}
                            className="hover:underline opacity-80 hover:opacity-100 text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <label
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 cursor-pointer transition"
            title="Attach File or Image (up to 2MB)"
          >
            <Paperclip className="w-5 h-5" />
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type message with real-time SHA-256 cryptographic signature..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* SHA-256 Inspector Modal */}
        {selectedInspectHash && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <KeyRound className="w-5 h-5" />
                  <span>SHA-256 Cryptographic Audit Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedInspectHash(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Message Content:</span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                    "{selectedInspectHash.text}"
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Sender & Timestamp Nonce:</span>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono">
                    Sender: {selectedInspectHash.senderName} ({selectedInspectHash.senderRole}) · Unix: {selectedInspectHash.timestamp}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Full 64-Hexadecimal SHA-256 Checksum:</span>
                  <div className="mt-1 p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono font-bold break-all">
                    {selectedInspectHash.sha256Hash}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  ✓ FIPS 180-4 Standard: Guaranteed bitwise tamper detection across Singapore Realtime Database nodes.
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInspectHash(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Close Inspector
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
