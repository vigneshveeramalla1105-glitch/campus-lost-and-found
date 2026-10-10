import { useEffect, useState } from 'react';
import { ArrowRight, Backpack, BookOpen, Check, ChevronDown, Clock3, CreditCard, Heart, KeyRound, Laptop, MapPin, MoreHorizontal, Search, Shirt, Smartphone, Sparkles, Wallet } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard.jsx';
import { CATEGORIES } from '../lib.js';

const categoryIcon = {
  'Electronics': Laptop,
  'Bags': Backpack,
  'Books & Notes': BookOpen,
  'IDs & Cards': CreditCard,
  'Clothing': Shirt,
  'Accessories': KeyRound,
  'Other': MoreHorizontal
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'found';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const [searchDraft, setSearchDraft] = useState(query);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ active: 0, lost: 0, found: 0, reunited: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearchDraft(query), [query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft === query) return;
      const next = new URLSearchParams(searchParams);
      if (searchDraft.trim()) next.set('q', searchDraft.trim());
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchDraft, query, searchParams, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q: query, type, category, sort, status: 'active' });
    setLoading(true);
    setError('');
    fetch(`/api/items?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load posts.');
        return data;
      })
      .then((data) => { setItems(data.items || []); setTotal(data.total || 0); })
      .catch((requestError) => { if (requestError.name !== 'AbortError') setError(requestError.message || 'The board could not be reached.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, type, category, sort]);

  useEffect(() => {
    fetch('/api/stats').then((response) => response.ok ? response.json() : null).then((data) => { if (data) setStats(data); }).catch(() => {});
  }, [total]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all' || value === '' || (key === 'type' && value === 'found') || (key === 'sort' && value === 'newest')) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="page-content home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="eyebrow light-eyebrow"><Sparkles size={13} /> CAMPUS LOST + FOUND</div>
          <h1>Lost it? Let’s<br /><em>bring it back.</em></h1>
          <p>Search things found around campus, or share a post and help someone reconnect with what’s theirs.</p>
          <div className="home-hero-actions"><Link to="/report" className="button-light"><Search size={15} /> I’m looking for something</Link><Link to="/report?type=found" className="hero-text-link">I found an item <ArrowRight size={14} /></Link></div>
        </div>
        <div className="hero-activity-card">
          <div className="hero-activity-top"><span><i /> LIVE CAMPUS BOARD</span><span><MapPin size={12} /> Hyderabad</span></div>
          <div className="hero-activity-map"><span className="hero-map-ring ring-one" /><span className="hero-map-ring ring-two" /><span className="hero-map-road road-one" /><span className="hero-map-road road-two" /><span className="hero-map-park" /><span className="hero-map-pin"><MapPin size={18} fill="currentColor" /></span><span className="hero-map-label">CAMPUS</span></div>
          <div className="hero-activity-bottom"><div><strong>{stats.active}</strong><span>active posts</span></div><span className="activity-divider" /><div><strong>{stats.found}</strong><span>items found</span></div><span className="activity-heart"><Heart size={16} fill="currentColor" /></span></div>
        </div>
        <div className="hero-note"><span className="hero-note-icon"><Check size={12} /></span>Free for your campus community</div>
      </section>

      <section className="board-section" aria-labelledby="board-title">
        <div className="board-heading"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot" /> FIND IT ON THE BOARD</div><h2 id="board-title">Good things find their way back.</h2><p>Browse recent posts from your campus community.</p></div><div className="board-updated"><span /><span>Updated as people post</span></div></div>
        <div className="search-row"><label className="board-search"><Search size={18} /><input aria-label="Search posts" type="search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search an item, place, or detail…" /><span>⌘ K</span></label><label className="sort-select"><span>Sort</span><span className="select-wrap"><select aria-label="Sort posts" value={sort} onChange={(event) => updateParam('sort', event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><ChevronDown size={14} /></span></label></div>

        <div className="board-filters">
          <div className="type-tabs" role="tablist" aria-label="Filter by lost or found">
            {[['found', 'Found', stats.found], ['lost', 'Lost', stats.lost], ['all', 'Everything', stats.active]].map(([value, label, count]) => <button type="button" key={value} className={type === value ? `active ${value}` : ''} aria-selected={type === value} role="tab" onClick={() => updateParam('type', value)}>{label}<span>{count}</span></button>)}
          </div>
          <div className="category-chips" aria-label="Filter by category">
            <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => updateParam('category', 'all')}><span className="all-category-dot" /> All categories</button>
            {CATEGORIES.map((name) => { const Icon = categoryIcon[name]; return <button type="button" key={name} className={category === name ? 'active' : ''} onClick={() => updateParam('category', name)}><Icon size={14} />{name}</button>; })}
          </div>
        </div>

        <div className="results-head"><div><h3>{type === 'lost' ? 'Lost items' : type === 'found' ? 'Found nearby' : 'All recent posts'}</h3><span>{loading ? 'Loading…' : `${total} ${total === 1 ? 'post' : 'posts'}`}</span></div>{(query || category !== 'all' || type !== 'found') && <button type="button" className="clear-filters" onClick={() => { setSearchDraft(''); setSearchParams({}); }}>Clear filters <span>×</span></button>}</div>

        {error ? <div className="board-error"><span>!</span><div><strong>The campus board isn’t responding.</strong><p>{error}. Make sure the Express API is running and try again.</p></div></div> : loading && items.length === 0 ? <div className="item-grid skeleton-grid"><i /><i /><i /></div> : items.length ? <div className="item-grid">{items.map((item) => <ItemCard key={item.id} item={item} />)}</div> : <div className="empty-board"><span className="empty-search"><Search size={22} /></span><h3>No matching posts yet</h3><p>Try another search or category, or add the first post for this item.</p><Link className="button-teal" to="/report"><span>+</span> Post an item</Link></div>}
        <div className="board-kindness"><span><Heart size={15} fill="currentColor" /></span><p>Found something? A thoughtful post can make someone’s day.</p><Link to="/report?type=found">Post a found item <ArrowRight size={13} /></Link></div>
      </section>
    </div>
  );
}
