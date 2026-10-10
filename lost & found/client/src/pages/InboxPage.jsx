import { useEffect, useState } from 'react';
import { ArrowRight, Inbox, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalNotes } from '../lib.js';

export default function InboxPage() {
  const [notes, setNotes] = useState(() => getLocalNotes());
  useEffect(() => {
    const refresh = () => setNotes(getLocalNotes());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, []);

  return (
    <div className="page-content inbox-page">
      <div className="page-heading"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS MESSAGES</div><h1>Inbox</h1><p>Notes you’ve sent about items on the campus board.</p></div><Link to="/home" className="soft-action">Browse posts <ArrowRight size={14} /></Link></div>
      {notes.length ? <div className="inbox-list">{notes.map((note) => <Link className="inbox-note" key={note.id} to={`/chat/${note.itemId}`}><span className="inbox-note-icon"><MessageCircle size={17} /></span><div className="inbox-note-main"><span className="inbox-note-item">{note.itemTitle}</span><p>{note.message}</p><small><MapPin size={11} /> {note.itemLocation}</small></div><span className="inbox-note-date">{new Date(note.createdAt).toLocaleDateString()}</span><ArrowRight size={15} className="inbox-arrow" /></Link>)}</div> : <div className="inbox-empty"><span><Inbox size={25} /></span><h2>Your inbox is waiting.</h2><p>When you send a note about a lost or found item, you’ll see it here.</p><Link to="/home" className="button-teal">Browse the board <ArrowRight size={14} /></Link></div>}
      <div className="inbox-privacy"><ShieldCheck size={15} /><span>Demo notes are stored locally for your session and in the API. Automatic email delivery is not configured.</span></div>
    </div>
  );
}
