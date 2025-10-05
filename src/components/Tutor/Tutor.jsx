import { useState, useEffect, useRef } from 'react';
import { useAI } from '../../hooks/useAI.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';
import { Button } from '../ui/Button.jsx';

export default function Tutor() {
  const { profile } = useProfile();
  const { askTutor, loading, error } = useAI();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your EcoSkill tutor. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const reply = await askTutor(text, profile);
    if (reply) setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">EcoSkill Tutor</h2>
          <div className="text-sm text-slate-600">{profile?.full_name ? `For ${profile.full_name}` : 'Personalized tips'}</div>
        </div>
        <div ref={listRef} className="h-[50vh] overflow-y-auto rounded-xl border border-emerald-100 p-3">
          {messages.map((m, idx) => (
            <div key={idx} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-slate-900 border border-emerald-100'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="mt-2 text-center text-sm text-slate-500">Thinking…</div>
          )}
          {error && (
            <div className="mt-2 text-center text-sm text-red-600">{String(error.message || error)}</div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="Ask for tips, goals, or lesson ideas…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <Button variant="primary" onClick={sendMessage} disabled={loading}>Send</Button>
        </div>
      </div>
    </div>
  );
}