import { ArrowRight, Compass, Heart, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="page-content welcome-page">
      <section className="welcome-card">
        <div className="welcome-decoration welcome-circle-one" /><div className="welcome-decoration welcome-circle-two" />
        <div className="welcome-brand"><span><Compass size={24} /></span><b>FOUND</b></div>
        <div className="welcome-main"><div className="welcome-spark"><Sparkles size={16} /></div><div className="eyebrow light-eyebrow">CAMPUS LOST + FOUND</div><h1>Missing something?<br /><em>Let’s find it.</em></h1><p>A friendly little corner of campus for lost things, found things, and the people looking for them.</p><div className="welcome-cta"><Link to="/profile?setup=1" className="button-light">Create your profile <ArrowRight size={15} /></Link><Link to="/home" className="welcome-guest-link">Continue as a guest</Link></div></div>
        <div className="welcome-bottomline"><span><ShieldCheck size={14} /> Community-powered</span><span><MapPin size={14} /> Hyderabad campus</span><span><Heart size={14} /> Always free</span></div>
      </section>
      <section className="welcome-steps"><div><span>01</span><Search size={18} /><strong>Search the board</strong><p>Look by item, category, or campus spot.</p></div><div><span>02</span><MapPin size={18} /><strong>Share a good find</strong><p>Post a detail so the right person can spot it.</p></div><div><span>03</span><Heart size={18} /><strong>Help it get home</strong><p>Reach out and arrange a safe campus handoff.</p></div></section>
    </div>
  );
}
