import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing!");
      return NextResponse.json({ error: 'API Key is missing dari konfigurasi (.env)' }, { status: 500 });
    }

    // Inisialisasi menggunakan Google GenAI SDK Resmi (Tanpa LangChain)
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const { message, entries } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    // Persiapkan konteks dari jurnal pengguna
    let contextString = "";
    if (entries && entries.length > 0) {
      entries.forEach((entry: any) => {
        const date = new Date(entry.created_at).toLocaleString('id-ID');
        contextString += `[${date}] Mood: ${entry.mood || 'netral'} - Isi: "${entry.content}"\n`;
      });
    } else {
      contextString = "Pengguna ini belum menulis jurnal apa pun.";
    }

    // Buat pesan sistem (System Prompt)
    const systemInstruction = `Anda adalah AI Asisten Jurnal bernama 'Lumina'. Tugas Anda adalah mendengarkan pengguna dan membantu mereka menganalisis perasaan mereka berdasarkan tulisan jurnal mereka. Selalu bersikap hangat, empatik, dan mendukung. Gunakan bahasa Indonesia yang santai dan ramah.

Berikut adalah daftar jurnal terbaru yang ditulis oleh pengguna ini (sebagai konteks):
${contextString}

Gunakan jurnal-jurnal di atas untuk memahami perasaan pengguna jika mereka bertanya tentang masa lalu atau pola pikir mereka. Jika mereka hanya menyapa, sapa balik dengan ramah.`;

    const fullPrompt = `${systemInstruction}\n\nPertanyaan/Pesan Pengguna Saat Ini: ${message}`;

    // Memanggil model asli Google (gemini-2.5-flash) secara langsung
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const replyText = response.text || "Maaf, saya sedang tidak bisa berpikir dengan jernih saat ini.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating AI response via Official SDK:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat menghubungi otak AI (Lumina). Cek log server.' },
      { status: 500 }
    );
  }
}
