import { FormEvent, useMemo, useState } from 'react';
import { Plus, Save, Search, Trash2 } from 'lucide-react';
import { EstheticsQuestion, categories, Difficulty, QuestionType } from '../data/estheticsQuestionBank';

interface AdminQuestionsProps {
  questions: EstheticsQuestion[];
  onQuestionsChange: (questions: EstheticsQuestion[]) => void;
}

const blankQuestion: EstheticsQuestion = {
  id: '',
  type: 'multiple_choice',
  category: 'Infection Control',
  difficulty: 'medium',
  question: '',
  answer: '',
  choices: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  tags: [],
};

const AdminQuestions = ({ questions, onQuestionsChange }: AdminQuestionsProps) => {
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [type, setType] = useState('All');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<EstheticsQuestion>(blankQuestion);

  const filtered = useMemo(
    () =>
      questions.filter((question) => {
        const matchesCategory = category === 'All' || question.category === category;
        const matchesDifficulty = difficulty === 'All' || question.difficulty === difficulty;
        const matchesType = type === 'All' || question.type === type;
        const matchesQuery = [question.question, question.answer, question.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesType && matchesQuery;
      }),
    [category, difficulty, query, questions, type],
  );

  const saveQuestion = (event: FormEvent) => {
    event.preventDefault();
    const id = editing.id || `${editing.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const cleaned: EstheticsQuestion = {
      ...editing,
      id,
      correctAnswer: editing.correctAnswer || editing.answer,
      choices: editing.choices.map((choice) => choice.trim()).filter(Boolean).slice(0, 4),
      tags: editing.tags.map((tag) => tag.trim()).filter(Boolean),
    };
    const exists = questions.some((question) => question.id === id);
    const next = exists ? questions.map((question) => (question.id === id ? cleaned : question)) : [cleaned, ...questions];
    onQuestionsChange(next);
    localStorage.setItem('esthetics-custom-question-bank', JSON.stringify(next));
    setEditing(blankQuestion);
  };

  const deleteQuestion = (id: string) => {
    const next = questions.filter((question) => question.id !== id);
    onQuestionsChange(next);
    localStorage.setItem('esthetics-custom-question-bank', JSON.stringify(next));
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-sm font-semibold text-peach-700">Internal content tools</p>
        <h1 className="mt-1 text-3xl font-bold text-stone-950">Question admin</h1>
        <p className="mt-3 text-stone-600">Add, edit, delete, and filter exam-style practice content.</p>
      </div>

      <form onSubmit={saveQuestion} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          {editing.id ? <Save className="text-peach-700" size={20} /> : <Plus className="text-peach-700" size={20} />}
          <h2 className="text-lg font-bold text-stone-950">{editing.id ? 'Edit question' : 'Add question'}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={editing.category}
            onChange={(event) => setEditing((value) => ({ ...value, category: event.target.value }))}
            className="rounded-xl border border-stone-200 bg-white px-3 py-3"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={editing.type}
            onChange={(event) => setEditing((value) => ({ ...value, type: event.target.value as QuestionType }))}
            className="rounded-xl border border-stone-200 bg-white px-3 py-3"
          >
            <option value="flashcard">flashcard</option>
            <option value="multiple_choice">multiple_choice</option>
            <option value="scenario">scenario</option>
          </select>
          <select
            value={editing.difficulty}
            onChange={(event) => setEditing((value) => ({ ...value, difficulty: event.target.value as Difficulty }))}
            className="rounded-xl border border-stone-200 bg-white px-3 py-3"
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
        <textarea
          required
          value={editing.question}
          onChange={(event) => setEditing((value) => ({ ...value, question: event.target.value }))}
          placeholder="Question"
          className="min-h-24 w-full rounded-xl border border-stone-200 px-3 py-3"
        />
        <input
          required
          value={editing.answer}
          onChange={(event) => setEditing((value) => ({ ...value, answer: event.target.value, correctAnswer: event.target.value }))}
          placeholder="Correct answer"
          className="w-full rounded-xl border border-stone-200 px-3 py-3"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {editing.choices.map((choice, index) => (
            <input
              key={index}
              value={choice}
              onChange={(event) => {
                const choices = [...editing.choices];
                choices[index] = event.target.value;
                setEditing((value) => ({ ...value, choices }));
              }}
              placeholder={`Choice ${index + 1}`}
              className="rounded-xl border border-stone-200 px-3 py-3"
            />
          ))}
        </div>
        <textarea
          required
          value={editing.explanation}
          onChange={(event) => setEditing((value) => ({ ...value, explanation: event.target.value }))}
          placeholder="Explanation"
          className="min-h-20 w-full rounded-xl border border-stone-200 px-3 py-3"
        />
        <input
          value={editing.tags.join(', ')}
          onChange={(event) => setEditing((value) => ({ ...value, tags: event.target.value.split(',') }))}
          placeholder="Tags separated by commas"
          className="w-full rounded-xl border border-stone-200 px-3 py-3"
        />
        <button type="submit" className="w-full rounded-xl bg-peach-600 px-5 py-3 font-bold text-white">
          Save question
        </button>
      </form>

      <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Search className="text-peach-700" size={20} />
          <h2 className="text-lg font-bold text-stone-950">Filter bank</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="rounded-xl border border-stone-200 px-3 py-3 sm:col-span-1"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3">
            <option>All</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3">
            <option>All</option>
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3">
            <option>All</option>
            <option>flashcard</option>
            <option>multiple_choice</option>
            <option>scenario</option>
          </select>
        </div>
        <p className="text-sm text-stone-500">{filtered.length} questions shown</p>
      </section>

      <div className="space-y-3">
        {filtered.slice(0, 80).map((question) => (
          <article key={question.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-peach-700">{question.category}</p>
                <h3 className="mt-2 font-bold text-stone-950">{question.question}</h3>
                <p className="mt-2 text-sm text-stone-600">{question.answer}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteQuestion(question.id)}
                aria-label="Delete question"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <button type="button" onClick={() => setEditing(question)} className="mt-4 rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold">
              Edit
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminQuestions;
