import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { emojiForItem, photoForItem, relativeTime } from '../lib.js';

export default function ItemCard({ item }) {
  const image = photoForItem(item);
  return (
    <Link className="item-card" to={`/item/${item.id}`}>
      <div className={`item-photo ${image ? '' : 'photo-placeholder'}`}>
        {image ? <img src={image} alt={item.title} /> : <span className="placeholder-emoji" aria-hidden="true">{emojiForItem(item)}</span>}
        <span className={`item-status ${item.type}`}><i />{item.type === 'found' ? 'FOUND' : 'LOST'}</span>
        <span className="item-card-open"><ArrowUpRight size={16} /></span>
      </div>
      <div className="item-card-body">
        <div className="item-card-meta"><span className="item-category">{item.category}</span><span><Clock3 size={12} />{relativeTime(item.createdAt)}</span></div>
        <h3>{item.title}</h3>
        <p className="item-card-location"><MapPin size={13} />{item.location}</p>
        <div className="item-card-footer"><span className="avatar-small">{(item.posterName || 'C')[0]}</span><span>Posted by <strong>{item.posterName || 'Campus member'}</strong></span><span className="item-arrow"><ArrowUpRight size={15} /></span></div>
      </div>
    </Link>
  );
}
