import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Heart, ImagePlus, MapPin, Search, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORIES, getProfile } from '../lib.js';

function localDateTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function ReportPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ type: params.get('type') === 'found' ? 'found' : 'lost', title: '', category: 'Electronics', location: '', dateOccurred: localDateTime(), description: '', posterName: getProfile()?.name || '', contactEmail: getProfile()?.email || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const nextType = params.get('type') === 'found' ? 'found' : 'lost';
    setForm((current) => current.type === nextType ? current : { ...current, type: nextType });
  }, [params]);
  useEffect(() => {
    if (!photo) { setPreviewUrl(''); return undefined; }
    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handlePhotoPick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];
    if (!supported.includes(file.type)) { setPhotoError('Choose a JPG, PNG, WebP, AVIF, or HEIC photo.'); return; }
    if (file.size > 5 * 1024 * 1024) { setPhotoError('Choose an image smaller than 5 MB.'); return; }
    setPhotoError('');
    setPhoto(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = new FormData();
      Object.entries({ ...form, dateOccurred: new Date(form.dateOccurred).toISOString() }).forEach(([key, value]) => payload.append(key, value));
      if (photo) payload.append('photo', photo);
      const response = await fetch('/api/items', { method: 'POST', body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Your post could not be submitted.');
      setCreated(data.item);
    } catch (submitError) {
      setError(submitError.message || 'Your post could not be submitted.');
    } finally { setSaving(false); }
  };

  if (created) return (
    <div className="page-content report-page">
      <div className="report-success"><span className="success-check"><ShieldCheck size={28} /></span><div className="eyebrow dark-eyebrow">POSTED TO THE CAMPUS BOARD</div><h1>Your post is live.</h1><p>Thanks for looking out for the campus community. Your email stays private on the public board.</p><div className="success-preview">{created.imageUrl && <img src={created.imageUrl} alt={created.title} />}<span className={`item-status ${created.type}`}><i />{created.type === 'found' ? 'FOUND' : 'LOST'}</span><strong>{created.title}</strong><small><MapPin size={12} /> {created.location}</small></div><div className="success-actions"><button type="button" className="button-teal" onClick={() => navigate(`/item/${created.id}`)}>View your post <ArrowRight size={14} /></button><button type="button" className="text-button" onClick={() => navigate('/home')}>Back to the board</button></div></div>
    </div>
  );

  return (
    <div className="page-content report-page">
      <div className="page-back-row"><Link to="/home"><ArrowLeft size={15} /> Back to campus board</Link><span><Sparkles size={13} /> A little help goes a long way</span></div>
      <div className="report-layout">
        <section className="report-intro"><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot" /> SHARE WITH YOUR CAMPUS</div><h1>Put it on<br /><em>the board.</em></h1><p>Lost something or found something? Add a few details and help it find its way home.</p><div className="report-tip"><span><ShieldCheck size={17} /></span><div><strong>Keep it safe</strong><p>Your email stays private. Arrange handoffs in a public campus spot.</p></div></div><div className="report-step"><span>1</span> Add item details</div><div className="report-step"><span>2</span> Someone spots your post</div><div className="report-step"><span>3</span> Reunite on campus</div></section>
        <section className="report-form-card">
          <div className="form-card-heading"><span className="form-card-icon"><Upload size={17} /></span><div><h2>Create a post</h2><p>All fields marked * are required.</p></div></div>
          <form className="page-form" onSubmit={submit}>
            <div className="report-choice"><button type="button" className={form.type === 'lost' ? 'selected lost' : ''} onClick={() => update('type', 'lost')}><Search size={16} /><span><strong>I lost an item</strong><small>Help me find it</small></span></button><button type="button" className={form.type === 'found' ? 'selected found' : ''} onClick={() => update('type', 'found')}><Heart size={16} /><span><strong>I found an item</strong><small>Help it get home</small></span></button></div>
            <div className="form-grid-two"><label className="page-field full"><span>Item name *</span><input required maxLength={90} value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Black leather wallet" /></label><label className="page-field"><span>Category *</span><select required value={form.category} onChange={(event) => update('category', event.target.value)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label className="page-field"><span>When? *</span><input required type="datetime-local" value={form.dateOccurred} onChange={(event) => update('dateOccurred', event.target.value)} /></label><label className="page-field full"><span>Campus location *</span><span className="input-with-leading"><MapPin size={15} /><input required maxLength={120} value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Building, room, or nearby landmark" /></span></label><label className="page-field full"><span>Helpful details *</span><textarea required maxLength={700} rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Color, marks, or another detail that helps identify it." /></label></div>
            <div className="photo-upload-field">
              <div className="photo-field-heading"><span>Item photo <small>OPTIONAL</small></span><span>JPG, PNG, WebP, HEIC · up to 5 MB</span></div>
              <div className={`photo-upload-panel ${previewUrl ? 'has-image' : ''}`}>
                <input ref={uploadInputRef} className="hidden-file-input" type="file" accept="image/*" onChange={handlePhotoPick} />
                <input ref={cameraInputRef} className="hidden-file-input" type="file" accept="image/*" capture="environment" onChange={handlePhotoPick} />
                {previewUrl ? <div className="photo-preview"><img src={previewUrl} alt="Preview of the item you selected" /><button type="button" aria-label="Remove selected photo" onClick={() => { setPhoto(null); setPhotoError(''); }}><X size={14} /></button></div> : <div className="photo-placeholder-box"><ImagePlus size={21} /><span>Photo helps others recognize it</span></div>}
                <div className="photo-upload-content"><strong>{photo ? photo.name : 'Add a photo of the item'}</strong><p>{photo ? `${(photo.size / 1024 / 1024).toFixed(2)} MB · ready to upload` : 'Choose an existing photo or take one now.'}</p><div className="photo-action-buttons"><button type="button" onClick={() => uploadInputRef.current?.click()}><Upload size={13} /> Upload photo</button><button type="button" className="camera-button" onClick={() => cameraInputRef.current?.click()}><Camera size={13} /> Take a photo</button></div></div>
              </div>
              {photoError && <div className="photo-error" role="alert">{photoError}</div>}
            </div>
            <div className="form-contact-heading"><span>How can someone reach you?</span><i /></div>
            <div className="form-grid-two"><label className="page-field"><span>Your name *</span><input required maxLength={70} value={form.posterName} onChange={(event) => update('posterName', event.target.value)} placeholder="First name is fine" /></label><label className="page-field"><span>Campus email *</span><input required type="email" maxLength={180} value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} placeholder="you@campus.edu" /></label></div>
            <div className="form-privacy"><ShieldCheck size={16} /><span>Your email is kept private and will not appear on the public board.</span></div>
            {error && <div className="form-error-message" role="alert">{error}</div>}
            <button type="submit" className="button-teal form-submit" disabled={saving || !!photoError}>{saving ? 'Posting…' : 'Post to campus board'}{!saving && <ArrowRight size={15} />}</button>
          </form>
        </section>
      </div>
    </div>
  );
}
