import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; // Simpler path

    // Optimization: Try both in parallel to avoid sequential timeout lag
    try {
      const [macrosRes, avatarsRes] = await Promise.allSettled([
        supabase.storage.from('macros').upload(filePath, buffer, { contentType: file.type, upsert: true }),
        supabase.storage.from('avatars').upload(filePath, buffer, { contentType: file.type, upsert: true })
      ]);

      let successfulUpload = null;
      let bucketUsed = '';

      if (macrosRes.status === 'fulfilled' && !macrosRes.value.error) {
        successfulUpload = macrosRes.value.data;
        bucketUsed = 'macros';
      } else if (avatarsRes.status === 'fulfilled' && !avatarsRes.value.error) {
        successfulUpload = avatarsRes.value.data;
        bucketUsed = 'avatars';
      }

      if (!successfulUpload) {
        const macrosError = macrosRes.status === 'fulfilled' ? macrosRes.value.error?.message : 'Timeout';
        const avatarsError = avatarsRes.status === 'fulfilled' ? avatarsRes.value.error?.message : 'Timeout';
        
        return NextResponse.json({ 
          error: `Storage sync failed. Macros Error: ${macrosError}. Avatars Error: ${avatarsError}. Please ensure the 'macros' bucket exists and is set to PUBLIC.` 
        }, { status: 500 });
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketUsed)
        .getPublicUrl(filePath);

      return NextResponse.json({ url: publicUrl });
    } catch (err) {
      console.error('Parallel upload catch:', err);
      return NextResponse.json({ error: 'Strategic storage synchronization interrupted.' }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
