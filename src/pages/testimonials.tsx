import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    school: 'Stanford University',
    major: 'Computer Science',
    quote:
      'StudySync completely changed how I prepare for finals. My GPA went from 3.1 to 3.8 in one semester. The Smart Planner is genuinely magic — it knows when I need to study before I do.',
    rating: 5,
    highlight: 'GPA from 3.1 → 3.8',
  },
  {
    name: 'Marcus Thompson',
    school: 'New York University',
    major: 'Business Administration',
    quote:
      'The Pomodoro timer and smart planner together are a game changer. I actually look forward to studying now. I used to procrastinate for hours — now I just open StudySync and get to work.',
    rating: 5,
    highlight: 'Eliminated procrastination',
  },
  {
    name: 'Aisha Kamara',
    school: 'University of Michigan',
    major: 'Pre-Med',
    quote:
      'Virtual study rooms made remote studying feel social. I found my study group through StudySync and we meet every day. The shared notes feature alone is worth it.',
    rating: 5,
    highlight: 'Found her study group',
  },
  {
    name: 'Diego Reyes',
    school: 'UCLA',
    major: 'Psychology',
    quote:
      'The flashcard system with spaced repetition is incredible. I used to re-read chapters over and over. Now I spend half the time and remember twice as much.',
    rating: 5,
    highlight: '2x memory retention',
  },
  {
    name: 'Sophie Chen',
    school: 'University of Toronto',
    major: 'Engineering',
    quote:
      'Performance analytics showed me I was spending too much time on easy topics and not enough on hard ones. That insight alone helped me pass my hardest exam.',
    rating: 5,
    highlight: 'Passed her hardest exam',
  },
  {
    name: 'James Okafor',
    school: 'Howard University',
    major: 'Political Science',
    quote:
      'I was juggling 5 courses and two part-time jobs. StudySync\'s task manager kept me sane. I never missed a deadline the entire semester.',
    rating: 5,
    highlight: 'Zero missed deadlines',
  },
  {
    name: 'Mei Lin',
    school: 'Boston University',
    major: 'Biochemistry',
    quote:
      'As an international student, staying organized was a huge challenge. StudySync made it simple. The interface is clean, fast, and just works.',
    rating: 5,
    highlight: 'Stayed organized all semester',
  },
  {
    name: 'Tyler Brooks',
    school: 'Georgia Tech',
    major: 'Mechanical Engineering',
    quote:
      'I recommended StudySync to my entire study group. Now all 8 of us use it together in virtual rooms. It\'s become part of our daily routine.',
    rating: 5,
    highlight: 'Whole group adopted it',
  },
  {
    name: 'Fatima Al-Hassan',
    school: 'University of Edinburgh',
    major: 'Law',
    quote:
      'Law school is intense. StudySync helped me break down massive reading lists into manageable daily chunks. I finally feel in control of my workload.',
    rating: 5,
    highlight: 'Conquered law school workload',
  },
];

const stats = [
  { value: '50K+', label: 'Students Using StudySync' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '94%', label: 'Report Improved Grades' },
  { value: '2M+', label: 'Study Sessions Completed' },
];

export default function TestimonialsPage() {
  return (
    <>
      <title>Student Testimonials — StudySync</title>
      <meta
        name="description"
        content="Read real success stories from students who improved their grades and study habits with StudySync."
      />

      {/* Hero */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.p
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Student Stories
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            Real Students. Real Results.
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Thousands of students have transformed their study habits with StudySync. Here's what they have to say.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
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

      {/* Testimonials Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-card border border-border rounded-xl p-6 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.1, ease: 'easeOut' as const }}
              >
                <Quote size={20} className="text-primary/30 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4 flex-1">"{t.quote}"</p>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.school} · {t.major}</p>
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {t.highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Write Your Own Success Story
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join thousands of students already achieving more with StudySync.
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
