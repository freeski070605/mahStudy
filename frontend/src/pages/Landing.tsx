import { Link } from 'react-router-dom';
import { BookOpenCheck, CalendarCheck, ShieldCheck } from 'lucide-react';

const Landing = () => (
  <div className="pb-10">
    <section className="relative min-h-[82vh] overflow-hidden rounded-b-[2rem] bg-[url('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center px-5 py-8 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-950/35 to-stone-950/70" />
      <div className="relative mx-auto flex min-h-[74vh] max-w-5xl flex-col justify-between">
        <nav className="flex items-center justify-between">
          <span className="text-lg font-bold">Esthetics Study Pro</span>
          <Link to="/auth" className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-stone-950">
            Login
          </Link>
        </nav>
        <div className="max-w-xl pb-10">
          <h1 className="text-5xl font-black leading-none sm:text-6xl">Esthetics Study Pro</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-stone-100">
            Mobile-first flashcards, spaced repetition, and timed exam-style practice for esthetician state board preparation.
          </p>
          <Link to="/auth" className="mt-8 inline-flex rounded-xl bg-peach-600 px-6 py-4 font-bold text-white shadow-lg shadow-stone-950/20">
            Start studying
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto -mt-8 grid max-w-5xl gap-3 px-5 sm:grid-cols-3">
      {[
        { icon: BookOpenCheck, title: '855 practice items', body: 'Definitions, scenarios, contraindications, ingredients, procedures, and mock exam questions.' },
        { icon: CalendarCheck, title: 'Smart review', body: 'Missed cards return sooner while mastered cards appear less often.' },
        { icon: ShieldCheck, title: 'Board-style safety', body: 'Original educational wording focused on sanitation, scope, and service decisions.' },
      ].map((item) => (
        <article key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
          <item.icon className="text-peach-700" size={24} />
          <h2 className="mt-4 text-lg font-bold text-stone-950">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{item.body}</p>
        </article>
      ))}
    </section>
  </div>
);

export default Landing;
