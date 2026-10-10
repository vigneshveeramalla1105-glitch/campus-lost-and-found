import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock3, Heart, MapPin, MessageCircle, ShieldCheck, Tag, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapArtwork from '../components/MapArtwork.jsx';
import { CATEGORY_EMOJI, formatDate, photoForItem, relativeTime } from '../lib.js';

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch(`/api/items/${id}`, { signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'This post could not be found.'); return data.item; })
      .then(setItem)
      .catch((requestError) => { if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load this post.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="page-content centered-state"><span className="loading-spinner" /><p>Loading item details…</p></div>;
  if (error || !item) return <div className="page-content centered-state"><span className="state-icon">?</span><h1>We couldn’t find that post.</h1><p>{error || 'It may have been removed or marked as returned.'}</p><Link className="button-teal" to="/home">Back to the board <ArrowRight size={14} /></Link></div>;

  const image = photoForItem(item);
  const isFound = item.type === 'found';
  return (
    <div className="page-content item-detail-page">
      <div className="page-back-row"><button type="button" className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back</button><span className="breadcrumb">Campus board <i>/</i> {isFound ? 'Found item' : 'Lost item'}</span></div>
      <div className="detail-layout">
        <section className="detail-visual-column">
          <div className="detail-map"><MapArtwork /><div className="detail-map-label"><MapPin size={13} fill="currentColor" /> {item.location}</div><span className="detail-pin"><MapPin size={20} fill="currentColor" /></span></div>
          <div className="detail-photo">{image ? <img src={image} alt={item.title} /> : <span>{emojiForItem(item)}</span>}<span className={`item-status ${item.type}`}><i />{isFound ? 'FOUND' : 'LOST'}</span></div>
        </section>
        <section className="detail-info-card">
          <div className="detail-status-row"><span className={`large-status ${item.type}`}><i />{isFound ? 'Found item' : 'Lost item'}</span><span className="posted-time"><Clock3 size={13} /> Posted {relativeTime(item.createdAt)}</span></div>
          <h1>{item.title}</h1>
          <p className="detail-subtitle">{isFound ? 'Someone on campus found this item.' : 'A campus member is looking for this item.'} A detail can help make the match.</p>
          <div className="detail-facts"><div><span className="fact-icon"><MapPin size={16} /></span><div><small>{isFound ? 'FOUND AT' : 'LAST SEEN AT'}</small><strong>{item.location}</strong></div></div><div><span className="fact-icon"><Clock3 size={16} /></span><div><small>{isFound ? 'FOUND ON' : 'LAST SEEN'}</small><strong>{formatDate(item.dateOccurred)}</strong></div></div><div><span className="fact-icon"><Tag size={16} /></span><div><small>CATEGORY</small><strong>{item.category}</strong></div></div></div>
          <div className="detail-description"><span>ITEM DETAILS</span><p>{item.description}</p></div>
          <div className="poster-profile"><span className="poster-avatar">{(item.posterName || 'C').charAt(0)}</span><div><small>POSTED BY</small><strong>{item.posterName || 'Campus member'}</strong></div><span className="private-chip"><ShieldCheck size={12} /> Contact details private</span></div>
          <div className="detail-actions"><Link to={`/chat/${item.id}`} className="button-teal"><MessageCircle size={16} />{isFound ? 'I think this is mine' : 'I may have found it'}<ArrowRight size={15} /></Link><Link to="/report?type=found" className="secondary-action"><Heart size={15} /> I found something else</Link></div>
          <div className="detail-safety"><ShieldCheck size={15} /><span>Meet in a public campus spot. Confirm item details before arranging a handoff.</span></div>
        </section>
      </div>
      <div className="detail-related"><div><span className="eyebrow dark-eyebrow">MORE FROM YOUR CAMPUS</span><p>Head back to the board to see other recent posts.</p></div><Link to="/home">Browse all items <ArrowRight size={14} /></Link></div>
    </div>
  );
}
