import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { UserPlus, LayoutDashboard, TrendingUp, ArrowRight, Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up Free',
    description:
      'Create your StudySync account in under 60 seconds. No credit card required. Just your email and you\'re in.',
    details: [
      'Sign up with email or Google',
      'Set up your student profile',
      'Add your university and courses',
      'Choose your study goals',
    ],
  },
  {
    number: '02',
    icon: LayoutDashboard,
    title: 'Build Your Plan',
    description:
      'Enter your courses, upcoming exams, and assignment deadlines. StudySync\'s Smart Planner builds a personalized study schedule automatically.',
    details: [
      'Import or manually add your courses',
      'Set exam dates and assignment deadlines',
      'StudySync generates your weekly plan',
      'Customize your preferred study hours',
    ],
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Study Smarter',
    description:
      'Follow your personalized schedule, use the built-in tools, and watch your productivity and grades improve week over week.',
    details: [
      'Follow your daily study plan',
      'Use Pomodoro timer for focus sessions',
      'Review flashcards and notes',
      'Track progress with analytics',
    ],
  },
];

const faqs = [
  {
    q: 'Is StudySync really free?',
    a: 'Yes! StudySync has a generous free plan with access to the core features. Premium plans unlock advanced analytics, unlimited study rooms, and more.',
  },
  {
    q: 'Can I use StudySync on my phone?',
    a: 'Absolutely. StudySync is fully responsive and works great on mobile, tablet, and desktop.',
  },
  {
    q: 'Does it work for any university?',
    a: 'Yes — StudySync works for any college or university student, regardless of your school or program.',
  },
  {
    q: 'Can I study with friends?',
    a: 'Yes! Virtual Study Rooms let you invite classmates to study together in real time, share notes, and run group Pomodoro sessions.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <title>How It Works — StudySync</title>
      <meta
        name="description"
        content="Learn how StudySync works in 3 simple steps: Sign Up, Build Your Plan, and Study Smarter."
      />

      {/* Hero */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.p
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Simple Process
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            From Sign Up to Studying Smarter in Minutes
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            StudySync is designed to get out of your way and let you focus on what matters — learning.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block -translate-x-1/2" />

            <div className="flex flex-col gap-20">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: 'easeOut' as const }}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon size={20} className="text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step.number}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-5">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                          <Check size={15} className="text-primary mt-0.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step number visual */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="text-4xl font-bold text-primary-foreground">{step.number}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions.</p>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: 'easeOut' as const }}
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            It only takes a minute to set up. Your smarter study life starts now.
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
