import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Timer,
  FileText,
  Users,
  BarChart2,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Planner',
    description: 'Auto-adjusts your study schedule based on upcoming exams and deadlines.',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Built-in focus timer to power through sessions without burning out.',
  },
  {
    icon: FileText,
    title: 'Notes & Flashcards',
    description: 'Capture ideas fast and reinforce memory with smart flashcard reviews.',
  },
  {
    icon: Users,
    title: 'Virtual Study Rooms',
    description: 'Collaborate and study with peers in real-time, anywhere.',
  },
  {
    icon: BarChart2,
    title: 'Performance Analytics',
    description: 'Track your study habits and get insights to improve productivity.',
  },
  {
    icon: CheckSquare,
    title: 'Task Manager',
    description: 'Set deadlines, prioritize tasks, and monitor your daily progress.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '4.9', label: 'App Rating' },
  { value: '2M+', label: 'Study Sessions' },
  { value: '94%', label: 'Improved Grades' },
];

const testimonials = [
  {
    name: 'Priya S.',
    school: 'Stanford University',
    quote: 'StudySync completely changed how I prepare for finals. My GPA went from 3.1 to 3.8 in one semester.',
    rating: 5,
  },
  {
    name: 'Marcus T.',
    school: 'NYU',
    quote: 'The Pomodoro timer and smart planner together are a game changer. I actually look forward to studying now.',
    rating: 5,
  },
  {
    name: 'Aisha K.',
    school: 'University of Michigan',
    quote: 'Virtual study rooms made remote studying feel social. I found my study group through StudySync.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <title>StudySync — Study Smarter. Stay Consistent. Achieve More.</title>
      <meta
        name="description"
        content="StudySync is the all-in-one study platform for college students. Smart planner, Pomodoro timer, flashcards, virtual study rooms, and analytics — all in one place."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
                <Sparkles size={13} className="mr-1.5 text-primary" />
                AI-Powered Study Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' as const }}
            >
              Study Smarter.{' '}
              <span className="text-primary">Stay Consistent.</span>{' '}
              Achieve More.
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' as const }}
            >
              StudySync brings your planner, timer, notes, flashcards, and study rooms into one focused workspace — built for students who want results.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' as const }}
            >
              <Button size="lg" asChild className="px-8 text-base">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 text-base">
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.p
              className="text-xs text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              No credit card required. Free forever plan available.
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div
            className="mt-16 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' as const }}
          >
            <img
              src="https://isteam.wsimg.com/genai-assistant/images/60e2aa1b-d8d9-4d4e-bec5-0cf3a6bb4ed0/ebb85193-d058-4827-9c1e-acc1859ed8d9/bdcbafbc-original.png"
              alt="StudySync dashboard interface showing study planner and analytics"
              className="w-full h-72 md:h-96 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const }}
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p
              className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Everything You Need
            </motion.p>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              All Your Study Tools in One Place
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Stop juggling apps. StudySync gives you a complete toolkit designed around how students actually learn.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/features">
                Explore All Features
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Teaser */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              Up and Running in Minutes
            </motion.h2>
            <p className="text-muted-foreground">Three simple steps to transform how you study.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in seconds — no credit card needed.' },
              { step: '02', title: 'Build Your Plan', desc: 'Add your courses, exams, and deadlines. Let StudySync do the rest.' },
              { step: '03', title: 'Study Smarter', desc: 'Use your personalized schedule, tools, and insights to hit your goals.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' as const }}
              >
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/signup">
                Get Started Free
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              Students Love StudySync
            </motion.h2>
            <p className="text-muted-foreground">Real results from real students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' as const }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.school}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="ghost" asChild>
              <Link to="/testimonials">Read More Stories <ArrowRight size={14} className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            Ready to Transform How You Study?
          </motion.h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join 50,000+ students already using StudySync to study smarter and achieve more.
          </p>
          <Button size="lg" variant="secondary" asChild className="px-10 text-base font-semibold">
            <Link to="/signup">
              Get Started Free
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <p className="text-primary-foreground/60 text-xs mt-4">No credit card required.</p>
        </div>
      </section>
    </>
  );
}
