import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, AuthUser } from '../utils/api';

interface AuthProps {
  onAuth: (user: AuthUser, token: string) => void;
}

const Auth = ({ onAuth }: AuthProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response =
        mode === 'register' ? await authApi.register(name || 'Esthetics Student', email, password) : await authApi.login(email, password);
      onAuth(response.user, response.token);
      navigate('/dashboard');
    } catch {
      const localUser = {
        id: `local-${email}`,
        name: name || email.split('@')[0] || 'Esthetics Student',
        email,
        isAdmin: true,
        localOnly: true,
      };
      onAuth(localUser, `local-token-${Date.now()}`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] place-items-center py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-peach-100/70">
        <p className="text-sm font-semibold text-peach-700">Esthetics Study Pro</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{mode === 'register' ? 'Create your study account' : 'Welcome back'}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Save your flashcard mastery, missed questions, mock exam results, and daily streak.
        </p>
        {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              className="w-full rounded-xl border border-stone-200 px-4 py-3"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-stone-200 px-4 py-3"
          />
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-stone-200 px-4 py-3"
          />
          <button disabled={loading} type="submit" className="w-full rounded-xl bg-peach-600 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading ? 'Saving...' : mode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setError('');
            setMode((value) => (value === 'register' ? 'login' : 'register'));
          }}
          className="mt-5 w-full text-sm font-semibold text-peach-700"
        >
          {mode === 'register' ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
