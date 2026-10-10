import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="page-content centered-state"><span className="state-icon"><Compass size={23} /></span><h1>This page wandered off.</h1><p>Let’s get you back to the campus board.</p><Link className="button-teal" to="/home"><ArrowLeft size={14} /> Return home</Link></div>;
}
