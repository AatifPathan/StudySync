import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Timer,
  FileText,
  Users,
  BarChart2,
  CheckSquare,
  ArrowRight,
  Check,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Planner',
    tagline: 'Your schedule, intelligently managed.',
    description:
      'The Smart Planner analyzes your upcoming exams, assignment due dates, and available study time to automatically build an optimized schedule. It adapts in real time as your priorities shift.',
    bullets: [
      'Auto-generates daily study blocks',
      'Syncs with your course calendar',
      'Sends smart reminders before deadlines',
      'Adjusts when you fall behind or get ahead',
    ],
    image: '/airo-assets/images/pages/features/planner',
    imageAlt: 'Smart Planner interface showing a study schedule',
    reverse: false,
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    tagline: 'Focus in sprints. Rest with purpose.',
    description:
      'The built-in Pomodoro Timer breaks your study sessions into focused 25-minute intervals with short breaks in between. Proven to reduce mental fatigue and increase retention.',
    bullets: [
      'Customizable work and break intervals',
      'Session history and streak tracking',
      'Ambient sound modes (rain, café, lo-fi)',
      'Auto-logs completed sessions to analytics',
    ],
    image: null,
    imageAlt: null,
    reverse: true,
  },
  {
    icon: FileText,
    title: 'Digital Notes & Flashcards',
    tagline: 'Capture fast. Remember longer.',
    description:
      'Take rich notes with markdown support, then convert them into flashcards with one click. Our spaced repetition algorithm surfaces cards right when you need to review them.',
    bullets: [
      'Markdown and rich text editor',
      'One-click note-to-flashcard conversion',
      'Spaced repetition scheduling',
      'Organize by course, topic, or tag',
    ],
    image: null,
    imageAlt: null,
    reverse: false,
  },
  {
    icon: Users,
    title: 'Virtual Study Rooms',
    tagline: 'Study together, wherever you are.',
    description:
      'Create or join virtual study rooms with classmates. Share notes, work on problems together, and stay accountable with live presence indicators.',
    bullets: [
      'Real-time collaboration on notes',
      'Live presence and focus status',
      'Built-in group Pomodoro sessions',
      'Chat and resource sharing',
    ],
    image: '/airo-assets/images/pages/features/study-room',
    imageAlt: 'Students collaborating in a virtual study room',
    reverse: true,
  },
  {
    icon: BarChart2,
    title: 'Performance Analytics',
    tagline: 'Know exactly how you study.',
    description:
      'Get detailed insights into your study patterns — how long you focus, which subjects need more attention, and how your productivity trends over time.',
    bullets: [
      'Weekly and monthly study reports',
      'Subject-by-subject breakdown',
      'Productivity score and trends',
      'Goal setting and progress tracking',
    ],
    image: null,
    imageAlt: null,
    reverse: false,
  },
  {
    icon: CheckSquare,
    title: 'Task & Assignment Manager',
    tagline: 'Never miss a deadline again.',
    description:
      'Manage all your assignments, projects, and tasks in one place. Set priorities, track progress, and get notified before things are due.',
    bullets: [
      'Drag-and-drop task prioritization',
      'Deadline alerts and reminders',
      'Progress tracking per assignment',
      'Integrates with your Smart Planner',
    ],
    image: null,
    imageAlt: null,
    reverse: true,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <title>Features — StudySync</title>
      <meta
        name="description"
        content="Explore all StudySync features: Smart Planner, Pomodoro Timer, Notes, Flashcards, Virtual Study Rooms, Analytics, and Task Manager."
      />

      {/* Hero */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.p
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Platform Features
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            Built for How Students Actually Learn
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Every feature in StudySync is designed to reduce friction and help you focus on what matters — learning.
          </motion.p>
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started Free <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, i) => (
        <section
          key={feature.title}
          className={`py-20 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
        >
          <div className="container mx-auto px-4">
            <div
              className={`flex flex-col ${feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 max-w-5xl mx-auto`}
            >
              {/* Text */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: feature.reverse ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: 'easeOut' as const }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                  {feature.tagline}
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">{feature.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual */}
              <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, x: feature.reverse ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: 'easeOut' as const }}
              >
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.imageAlt ?? ''}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl border border-border shadow-lg"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                    <feature.icon size={64} className="text-primary/30" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Use All These Features?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Sign up free and get instant access to every tool in StudySync.
          </p>
          <Button size="lg" variant="secondary" asChild className="px-10 font-semibold">
            <Link to="/signup">
              Get Started Free <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
