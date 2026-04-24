import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen size={14} className="text-primary-foreground" />
              </div>
              StudySync
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The all-in-one study platform built for students who want to achieve more.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Docs</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StudySync. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Study Smarter. Stay Consistent. Achieve More.
          </p>
        </div>
      </div>
    </footer>
  );
}
