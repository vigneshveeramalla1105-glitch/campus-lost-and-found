import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Clock3, MapPin, MessageCircle, Paperclip, Send, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getLocalNotes, getProfile, photoForItem, saveLocalNote } from '../lib.js';

export default function ChatPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [notes, setNotes] = useState(() => getLocalNotes().filter((note) => note.itemId === id));
  const profile = getProfile();
  const [form, setForm] = useState({ name: profile?.name || '', email: profile?.email || '', message: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setNotes(getLocalNotes().filter((note) => note.itemId === id));
    setSuccess('');
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/items/${id}`, { signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'This item is no longer active.'); return data.item; })
      .then(setItem)
      .catch((requestError) => { if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load this conversation.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    if (!item) return;
    setSending(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`/api/items/${item.id}/claims`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Your message could not be saved.');
      const note = { id: data.receiptId, itemId: item.id, itemTitle: item.title, itemLocation: item.location, message: form.message.trim(), name: form.name.trim(), createdAt: new Date().toISOString() };
      saveLocalNote(note);
      setNotes((current) => [note, ...current]);
      setForm((current) => ({ ...current, message: '' }));
      setSuccess('Your note was saved. The poster’s email stays private.');
    } catch (submitError) {
      setError(submitError.message || 'Your message could not be saved.');
    } finally { setSending(false); }
  };

  if (loading) return <div className="page-content centered-state"><span className="loading-spinner" /><p>Opening the conversation…</p></div>;
  if (error && !item) return <div className="page-content centered-state"><span className="state-icon">?</span><h1>Conversation unavailable</h1><p>{error}</p><Link className="button-teal" to="/home">Back to the board</Link></div>;

  const image = photoForItem(item);
  return (
    <div className="page-content chat-page">
      <div className="page-back-row"><Link to={`/item/${item.id}`}><ArrowLeft size={15} /> Back to item</Link><span className="breadcrumb">Messages <i>/</i> {item.title}</span></div>
      <div className="chat-page-grid">
        <aside className="chat-context-card"><div className="chat-context-cover">{image ? <img src={image} alt={item.title} /> : <span>{emojiForItem(item)}</span>}<span className={`item-status ${item.type}`}><i />{item.type === 'found' ? 'FOUND' : 'LOST'}</span></div><div className="chat-context-body"><span className="eyebrow dark-eyebrow">ABOUT THIS POST</span><h2>{item.title}</h2><p><MapPin size={13} />{item.location}</p><div className="context-poster"><span>{(item.posterName || 'C').charAt(0)}</span><div><small>POSTED BY</small><strong>{item.posterName || 'Campus member'}</strong></div></div><Link to={`/item/${item.id}`} className="context-view-link">View item details <ArrowLeft size={13} /></Link></div><div className="chat-context-tip"><ShieldCheck size={15} /><span>Keep personal details private and arrange handoffs in public.</span></div></aside>
        <section className="conversation-card">
          <header className="conversation-header"><div className="conversation-avatar">{(item.posterName || 'C').charAt(0)}</div><div><h1>{item.posterName || 'Campus member'}</h1><p>Conversation about {item.title}</p></div><span className="private-status"><i /> Email private</span></header>
          <div className="conversation-thread">
            <div className="thread-date"><span />ABOUT THIS ITEM<span /></div>
            <div className="thread-item-summary"><span className={`tiny-status ${item.type}`}>{item.type === 'found' ? 'FOUND' : 'LOST'}</span><strong>{item.title}</strong><small><MapPin size={11} /> {item.location}</small></div>
            {notes.length === 0 ? <div className="thread-empty"><span><MessageCircle size={20} /></span><strong>Start the conversation</strong><p>Send a note with one detail that helps confirm the match. Your email won’t be shown publicly.</p><div className="suggested-message">“Hi, I think this might be mine. I can share a detail to confirm.”</div></div> : notes.map((note) => <div className="message-outgoing" key={note.id}><p>{note.message}</p><small>{new Date(note.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} <Check size={11} /></small></div>)}
            {success && <div className="message-confirmation"><Check size={13} /> {success}</div>}
          </div>
          <form className="conversation-form" onSubmit={submit}>
            <div className="conversation-form-fields"><label><span>Your name</span><input required maxLength={70} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="First name" /></label><label><span>Campus email</span><input required type="email" maxLength={180} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@campus.edu" /></label></div>
            <label className="message-field"><span>Your note</span><textarea required maxLength={500} rows={3} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Share a helpful detail…" /></label>
            <div className="conversation-form-footer"><span><ShieldCheck size={13} /> Saved to the demo API · no email is sent</span><button type="submit" className="button-teal" disabled={sending}>{sending ? 'Sending…' : 'Send note'}<Send size={14} /></button></div>
            {error && <div className="form-error-message" role="alert">{error}</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
