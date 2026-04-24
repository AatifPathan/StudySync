import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const supportOptions = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a message and we\'ll get back to you within 24 hours.',
    detail: 'support@studysync.app',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team in real time during business hours.',
    detail: 'Available Mon–Fri, 9am–6pm EST',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We aim to respond to all inquiries within one business day.',
    detail: 'Usually within a few hours',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <title>Contact & Support — StudySync</title>
      <meta
        name="description"
        content="Get in touch with the StudySync team. We're here to help with any questions, feedback, or support needs."
      />

      {/* Hero */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.p
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Get In Touch
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            We're Here to Help
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Have a question, feedback, or need support? Reach out and our team will get back to you quickly.
          </motion.p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                className="bg-card border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' as const }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <opt.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{opt.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{opt.description}</p>
                <p className="text-sm font-medium text-primary">{opt.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                    <p className="text-muted-foreground text-sm">
                      Fill out the form below and we'll respond as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@university.edu"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
