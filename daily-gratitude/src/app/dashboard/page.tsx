"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { journalService } from '@/services/journal';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await journalService.getEntries();
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    
    setSubmitting(true);
    try {
      await journalService.addEntry(newEntry);
      setNewEntry('');
      fetchEntries(); // refresh list
    } catch (error) {
      console.error('Error adding entry', error);
      alert('Gagal menyimpan jurnal. Pastikan Anda memiliki koneksi dan Supabase diatur dengan benar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Kita langsung panggil Supabase client disini untuk kemudahan PoC,
      // Idealnya fungsi ini ditaruh di journalService.
      await supabase.from('entries').delete().eq('id', id);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">My Journal</h1>
        <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
          Log Out
        </button>
      </nav>

      <main className="max-w-3xl mx-auto py-10 px-6">
        {/* Form Input Baru */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10 transform transition-all hover:shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">What are you grateful for today?</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all resize-none"
              rows={4}
              placeholder="Type your idea or gratitude here..."
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              disabled={submitting}
            />
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                disabled={submitting || !newEntry.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
              >
                {submitting ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>

        {/* List Jurnal */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Recent Entries
            <span className="text-sm font-normal text-slate-400 bg-slate-200 px-2.5 py-0.5 rounded-full">{entries.length}</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-400 italic">No entries yet. Start writing your first gratitude above!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow relative">
                
                {/* Tombol Hapus */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all rounded-full"
                  title="Hapus Jurnal"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap pr-8">{entry.content}</p>
                
                <div className="mt-4 flex items-center gap-3">
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(entry.created_at).toLocaleString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                    })}
                  </div>
                  {entry.mood && (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                      #{entry.mood}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
