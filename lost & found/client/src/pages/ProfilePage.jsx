import { useState } from 'react';
import { ArrowRight, Check, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProfile, saveProfile } from '../lib.js';

export default function ProfilePage() {
  const [params] = useSearchParams();
  const [profile, setProfileState] = useState(() => getProfile() || { name: '', email: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const isSetup = params.get('setup') === '1';

  const submit = (event) => {
    event.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) { setError('Add your name and campus email.'); return; }
    saveProfile({ name: profile.name.trim(), email: profile.email.trim() });
    setProfileState({ name: profile.name.trim(), email: profile.email.trim() });
    setSaved(true); setError('');
    window.setTimeout(() => setSaved(false), 3200);
  };

  return (
    <div className="page-content profile-page">
      <div className="profile-hero"><span className="profile-hero-icon"><UserRound size={22} /></span><div><div className="eyebrow light-eyebrow">YOUR CAMPUS PROFILE</div><h1>{isSetup ? 'Make it yours.' : 'A little about you.'}</h1><p>Keep a name and campus email handy when you post an item or send a note.</p></div></div>
      <div className="profile-settings-card"><div className="profile-settings-heading"><div><span className="eyebrow dark-eyebrow">LOCAL DEMO PROFILE</span><h2>Contact details</h2><p>This profile is saved in this browser only. It is not an account or sign-in service.</p></div><span className="profile-settings-badge"><ShieldCheck size={14} /> Private</span></div><form className="profile-form" onSubmit={submit}><label className="page-field"><span>Your name</span><span className="input-with-leading"><UserRound size={15} /><input required maxLength={70} value={profile.name} onChange={(event) => setProfileState({ ...profile, name: event.target.value })} placeholder="First name is fine" /></span></label><label className="page-field"><span>Campus email</span><span className="input-with-leading"><Mail size={15} /><input required type="email" maxLength={180} value={profile.email} onChange={(event) => setProfileState({ ...profile, email: event.target.value })} placeholder="you@campus.edu" /></span></label>{error && <div className="form-error-message" role="alert">{error}</div>}{saved && <div className="profile-saved"><Check size={14} /> Profile saved on this device.</div>}<button type="submit" className="button-teal">Save profile <ArrowRight size={14} /></button></form></div>
      <div className="profile-links"><Link to="/report"><span className="profile-link-icon">+</span><span><strong>Your posts</strong><small>Report a lost or found item</small></span><ArrowRight size={15} /></Link><Link to="/inbox"><span className="profile-link-icon"><Mail size={15} /></span><span><strong>Your messages</strong><small>Notes you’ve sent from this device</small></span><ArrowRight size={15} /></Link></div>
    </div>
  );
}
