'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use Service Role client to bypass RLS for admin tasks
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Need to ensure this is in .env.local or server context
)

export async function generateBypassCode() {
    const code = 'ADMIN-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Expiration: 1 hour from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    const { data, error } = await supabaseAdmin
        .from('bypass_codes')
        .insert([{
            code,
            expires_at: expiresAt.toISOString(),
            is_active: true
        }])
        .select()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, code: data[0] }
}

export async function deactivateBypassCode(id) {
    const { error } = await supabaseAdmin
        .from('bypass_codes')
        .update({ is_active: false })
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}
