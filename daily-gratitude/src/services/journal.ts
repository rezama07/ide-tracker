import { createClient } from '@/lib/supabase/client'

export const journalService = {
  // Mengambil daftar jurnal
  async getEntries() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Menyimpan jurnal baru
  async addEntry(content: string, mood: string = 'peaceful') {
    const supabase = createClient()
    
    // Karena RLS aktif dan butuh user_id, kita cek dulu apakah ada user yang login
    const { data: authData } = await supabase.auth.getUser()
    
    // Untuk PoC super sederhana, jika belum ada sistem Auth, insert bisa saja gagal jika Supabase Anda memaksa user_id.
    const { data, error } = await supabase
      .from('entries')
      .insert([{ 
        content, 
        mood,
        user_id: authData?.user?.id || undefined // Supabase akan menolak jika table di set NOT NULL tanpa user
      }])
      .select()
    
    if (error) throw error
    return data
  }
}
