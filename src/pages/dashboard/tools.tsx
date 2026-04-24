import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Layers, Plus, Save, Download, Tag, X,
  Brain, Check, Pencil, Trash2, ChevronLeft, Shuffle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const SUBJECTS = ['Mathematics', 'Chemistry', 'Art History', 'English', 'Physics'];
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700 border-blue-200',
  Chemistry: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Art History': 'bg-violet-100 text-violet-700 border-violet-200',
  English: 'bg-amber-100 text-amber-700 border-amber-200',
  Physics: 'bg-red-100 text-red-700 border-red-200',
};

type Note = { id: number; title: string; content: string; subject: string; updatedAt: string };
type Flashcard = { id: number; front: string; back: string };
type Deck = { id: number; name: string; subject: string; cards: Flashcard[] };

const INIT_NOTES: Note[] = [];

const INIT_DECKS: Deck[] = [];

// ── Notes Section ──
function NotesSection() {
  const [notes, setNotes] = useState<Note[]>(INIT_NOTES);
  const [selected, setSelected] = useState<Note | null>(INIT_NOTES[0] ?? null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: selected?.title ?? '', content: selected?.content ?? '', subject: selected?.subject ?? 'Mathematics' });
  const [saved, setSaved] = useState(false);

  const selectNote = (note: Note) => {
    setSelected(note);
    setDraft({ title: note.title, content: note.content, subject: note.subject });
    setEditing(false);
  };

  const saveNote = () => {
    if (!selected) return;
    const updated = { ...selected, ...draft, updatedAt: 'Just now' };
    setNotes(prev => prev.map(n => n.id === selected.id ? updated : n));
    setSelected(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addNote = () => {
    const n: Note = { id: Date.now(), title: 'New Note', content: '', subject: 'Mathematics', updatedAt: 'Just now' };
    setNotes(prev => [...prev, n]);
    selectNote(n);
    setEditing(true);
  };

  const deleteNote = (id: number) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (selected?.id === id) {
      const next = remaining[0] ?? null;
      setSelected(next);
      setDraft({ title: next?.title ?? '', content: next?.content ?? '', subject: next?.subject ?? 'Mathematics' });
      setEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Sidebar */}
      <div className="md:col-span-1 flex flex-col gap-2">
        <Button onClick={addNote} size="sm" className="gap-2 w-full"><Plus size={14} /> New Note</Button>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground px-2">
              <BookOpen size={28} className="mb-2 opacity-30" />
              <p className="text-xs">No notes yet. Click "New Note" to get started.</p>
            </div>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-3 rounded-lg border cursor-pointer transition-all group ${selected?.id === note.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}
            >
              <div className="flex items-start justify-between gap-1">
                <p className="text-sm font-medium text-foreground truncate flex-1">{note.title}</p>
                <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${SUBJECT_COLORS[note.subject] ?? ''}`}>{note.subject}</Badge>
                <span className="text-[10px] text-muted-foreground">{note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selected ? (
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex-1 min-w-0">
              {editing ? (
                <Input value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
                  className="font-semibold text-base h-8 border-0 p-0 focus-visible:ring-0 bg-transparent" />
              ) : (
                <h3 className="font-semibold text-base text-foreground truncate">{selected.title}</h3>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {editing ? (
                <>
                  <Select value={draft.subject} onValueChange={v => setDraft(p => ({ ...p, subject: v }))}>
                    <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button size="sm" onClick={saveNote} className="h-7 gap-1 text-xs">
                    {saved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
                  </Button>
                </>
              ) : (
                <>
                  <Badge variant="outline" className={`text-xs ${SUBJECT_COLORS[selected.subject] ?? ''}`}>
                    <Tag size={10} className="mr-1" />{selected.subject}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-7 gap-1 text-xs">
                    <Pencil size={12} /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                    <Download size={12} /> Export
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {editing ? (
              <Textarea
                value={draft.content}
                onChange={e => setDraft(p => ({ ...p, content: e.target.value }))}
                className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 p-4 text-sm font-mono"
                placeholder="Start writing your notes..."
              />
            ) : (
              <div className="h-full overflow-y-auto p-4">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {selected.content || <span className="text-muted-foreground italic">No content yet. Click Edit to start writing.</span>}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="md:col-span-2 flex flex-col items-center justify-center text-center text-muted-foreground">
          <BookOpen size={40} className="mb-3 opacity-20" />
          <p className="font-medium text-foreground">No note selected</p>
          <p className="text-sm mt-1">Create a new note to get started.</p>
          <Button onClick={addNote} size="sm" className="gap-2 mt-4"><Plus size={14} /> New Note</Button>
        </Card>
      )}
    </div>
  );
}

// ── Flashcards Section ──
function FlashcardsSection() {
  const [decks, setDecks] = useState<Deck[]>(INIT_DECKS);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', subject: 'Mathematics' });
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [quizDone, setQuizDone] = useState(false);

  const startQuiz = (deck: Deck) => {
    setSelectedDeck(deck);
    setQuizMode(true);
    setCardIndex(0);
    setFlipped(false);
    setQuizResults({});
    setQuizDone(false);
  };

  const markCard = (knew: boolean) => {
    const card = selectedDeck!.cards[cardIndex];
    setQuizResults(p => ({ ...p, [card.id]: knew }));
    if (cardIndex + 1 >= selectedDeck!.cards.length) {
      setQuizDone(true);
    } else {
      setCardIndex(i => i + 1);
      setFlipped(false);
    }
  };

  const addDeck = () => {
    if (!newDeck.name) return;
    const d: Deck = { id: Date.now(), name: newDeck.name, subject: newDeck.subject, cards: [] };
    setDecks(p => [...p, d]);
    setNewDeck({ name: '', subject: 'Mathematics' });
    setShowAddDeck(false);
  };

  const addCard = () => {
    if (!newCard.front || !newCard.back || !selectedDeck) return;
    const card: Flashcard = { id: Date.now(), front: newCard.front, back: newCard.back };
    const updated = { ...selectedDeck, cards: [...selectedDeck.cards, card] };
    setDecks(p => p.map(d => d.id === selectedDeck.id ? updated : d));
    setSelectedDeck(updated);
    setNewCard({ front: '', back: '' });
    setShowAddCard(false);
  };

  if (quizMode && selectedDeck) {
    if (quizDone) {
      const correct = Object.values(quizResults).filter(Boolean).length;
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain size={36} className="text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">Quiz Complete!</h3>
            <p className="text-muted-foreground mt-1">{selectedDeck.name}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-3xl font-bold text-emerald-600">{correct}</p><p className="text-sm text-muted-foreground">Knew it</p></div>
            <div><p className="text-3xl font-bold text-red-500">{selectedDeck.cards.length - correct}</p><p className="text-sm text-muted-foreground">Review</p></div>
            <div><p className="text-3xl font-bold text-primary">{Math.round((correct / selectedDeck.cards.length) * 100)}%</p><p className="text-sm text-muted-foreground">Score</p></div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setQuizMode(false); setSelectedDeck(null); }}>Back to Decks</Button>
            <Button onClick={() => startQuiz(selectedDeck)}>Retry Quiz</Button>
          </div>
        </div>
      );
    }

    const card = selectedDeck.cards[cardIndex];
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="flex items-center justify-between w-full max-w-lg">
          <Button variant="ghost" size="sm" onClick={() => { setQuizMode(false); setSelectedDeck(null); }} className="gap-1 text-muted-foreground">
            <ChevronLeft size={15} /> Exit Quiz
          </Button>
          <span className="text-sm text-muted-foreground font-medium">{cardIndex + 1} / {selectedDeck.cards.length}</span>
          <Button variant="ghost" size="sm" onClick={() => { setCardIndex(0); setFlipped(false); setQuizResults({}); }} className="gap-1 text-muted-foreground">
            <Shuffle size={15} /> Restart
          </Button>
        </div>

        {/* Flip card */}
        <div className="w-full max-w-lg cursor-pointer" onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px' }}>
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' as const }}
            style={{ transformStyle: 'preserve-3d', position: 'relative', height: '220px' }}
          >
            {/* Front */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-violet-50 flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Question</p>
              <p className="text-lg font-semibold text-foreground">{card.front}</p>
              <p className="text-xs text-muted-foreground mt-6">Click to reveal answer</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-4">Answer</p>
              <pre className="text-base font-sans text-foreground whitespace-pre-wrap">{card.back}</pre>
            </div>
          </motion.div>
        </div>

        {flipped && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <Button variant="outline" onClick={() => markCard(false)} className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
              <X size={16} /> Still Learning
            </Button>
            <Button onClick={() => markCard(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Check size={16} /> Knew It!
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{decks.length} decks · {decks.reduce((a, d) => a + d.cards.length, 0)} cards total</p>
        <Button size="sm" onClick={() => setShowAddDeck(true)} className="gap-2"><Plus size={14} /> New Deck</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Layers size={36} className="mb-3 opacity-20" />
            <p className="font-medium text-foreground">No flashcard decks yet</p>
            <p className="text-sm mt-1">Create your first deck to start studying with flashcards.</p>
            <Button size="sm" onClick={() => setShowAddDeck(true)} className="gap-2 mt-4"><Plus size={14} /> New Deck</Button>
          </div>
        )}
          <Card key={deck.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{deck.name}</CardTitle>
                  <Badge variant="outline" className={`text-xs mt-1 ${SUBJECT_COLORS[deck.subject] ?? ''}`}>{deck.subject}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{deck.cards.length}</p>
                  <p className="text-xs text-muted-foreground">cards</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs"
                onClick={() => { setSelectedDeck(deck); setShowAddCard(true); }}>
                <Plus size={12} /> Add Card
              </Button>
              <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => startQuiz(deck)}
                disabled={deck.cards.length === 0}>
                <Brain size={12} /> Quiz Me
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Deck Dialog */}
      <Dialog open={showAddDeck} onOpenChange={setShowAddDeck}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Create New Deck</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label>Deck Name</Label>
              <Input placeholder="e.g. Calculus Formulas" value={newDeck.name} onChange={e => setNewDeck(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5"><Label>Subject</Label>
              <Select value={newDeck.subject} onValueChange={v => setNewDeck(p => ({ ...p, subject: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeck(false)}>Cancel</Button>
            <Button onClick={addDeck} disabled={!newDeck.name}>Create Deck</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Flashcard to "{selectedDeck?.name}"</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label>Front (Question)</Label>
              <Textarea placeholder="Enter the question..." value={newCard.front} onChange={e => setNewCard(p => ({ ...p, front: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-1.5"><Label>Back (Answer)</Label>
              <Textarea placeholder="Enter the answer..." value={newCard.back} onChange={e => setNewCard(p => ({ ...p, back: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
            <Button onClick={addCard} disabled={!newCard.front || !newCard.back}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StudyToolsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Study Tools</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Digital notes and flashcard creator</p>
      </div>

      <Tabs defaultValue="notes">
        <TabsList className="mb-4">
          <TabsTrigger value="notes" className="gap-2"><BookOpen size={15} /> Digital Notes</TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2"><Layers size={15} /> Flashcards</TabsTrigger>
        </TabsList>
        <TabsContent value="notes"><NotesSection /></TabsContent>
        <TabsContent value="flashcards"><FlashcardsSection /></TabsContent>
      </Tabs>
    </div>
  );
}
