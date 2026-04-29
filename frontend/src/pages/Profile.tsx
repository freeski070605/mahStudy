import { Link } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { AuthUser } from '../utils/api';

interface ProfileProps {
  user: AuthUser;
  onLogout: () => void;
}

const Profile = ({ user, onLogout }: ProfileProps) => (
  <div className="space-y-6 pb-24">
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-peach-100 text-2xl font-black text-peach-700">
        {user.name.slice(0, 1).toUpperCase()}
      </div>
      <h1 className="mt-4 text-3xl font-bold text-stone-950">{user.name}</h1>
      <p className="mt-1 text-stone-600">{user.email}</p>
      {user.localOnly && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Local study mode is active because the API was unavailable. Progress is saved on this device.
        </p>
      )}
    </section>
    <Link to="/admin" className="flex items-center justify-between rounded-2xl bg-white p-5 font-semibold text-stone-900 shadow-sm">
      <span className="flex items-center gap-3">
        <Settings className="text-peach-700" size={20} />
        Question admin
      </span>
      <span className="text-stone-400">Open</span>
    </Link>
    <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-4 font-bold text-white">
      <LogOut size={19} />
      Logout
    </button>
  </div>
);

export default Profile;
