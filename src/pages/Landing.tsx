import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import heroBg from '@/assets/hero-bg.jpg';
import { ArrowRight, Shield, Activity, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Activity, title: 'Real-Time Drift Detection', desc: 'Instantly detect when real-world data changes and AI answers become stale.' },
  { icon: Shield, title: 'AI Trust Scoring', desc: 'Confidence scores and severity ratings for every detected drift event.' },
  { icon: Clock, title: 'Complete History', desc: 'Full audit trail of every state change, analysis, and recommended action.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual overview of entity health, drift frequency, and system reliability.' },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition">Login</Link>
                <Link to="/register" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            AI Systems Fail When<br />
            <span className="text-primary">Reality Changes</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Detect real-world data drift in real-time. Track history. Ensure AI answers reflect current truth.
          </p>
          <p className="text-muted-foreground mb-8">
            Professional AI Trust & Drift Monitoring Platform.
          </p>
          <Link
            to={user ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition glow-primary"
          >
            Start Monitoring <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Why Reality-Drift?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
            >
              <f.icon className="text-primary mb-4" size={28} />
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Reality-Drift Intelligence Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
