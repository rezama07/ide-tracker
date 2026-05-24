import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Inisialisasi klien Gemini dengan API Key dari environment variables
// Jika tidak ada parameter yang diberikan, SDK secara otomatis akan mencari process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { message, entries } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    // Persiapkan konteks dari jurnal pengguna
    let contextPrompt = "Anda adalah AI Asisten Jurnal bernama 'Lumina'. Tugas Anda adalah mendengarkan pengguna dan membantu mereka menganalisis perasaan mereka berdasarkan tulisan jurnal mereka. Selalu bersikap hangat, empatik, dan mendukung.\n\n";
    
    if (entries && entries.length > 0) {
      contextPrompt += "Berikut adalah daftar jurnal terbaru yang ditulis oleh pengguna ini (sebagai konteks):\n";
      entries.forEach((entry: any, index: number) => {
        const date = new Date(entry.created_at).toLocaleString('id-ID');
        contextPrompt += `[${date}] Mood: ${entry.mood || 'netral'} - Isi: "${entry.content}"\n`;
      });
      contextPrompt += "\nGunakan jurnal-jurnal di atas untuk memahami perasaan pengguna jika mereka bertanya tentang masa lalu atau pola pikir mereka. Jika mereka hanya menyapa, sapa balik dengan ramah.\n\n";
    } else {
      contextPrompt += "Pengguna ini belum menulis jurnal apa pun. Dorong mereka untuk mulai menulis jurnal pertama mereka.\n\n";
    }

    contextPrompt += `Pesan pengguna saat ini: "${message}"\n\nBalasan Anda (gunakan bahasa Indonesia yang santai dan ramah):`;

    // Panggil model Gemini (menggunakan gemini-2.5-flash yang ringan dan cerdas)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { error: 'Maaf, otak AI saya sedang bermasalah atau API Key belum diatur dengan benar.' },
      { status: 500 }
    );
  }
}
