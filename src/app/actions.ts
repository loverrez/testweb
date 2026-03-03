'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateSiteSettings() {
  revalidatePath('/', 'layout')
}
