'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function revalidateSiteSettings() {
  revalidatePath('/', 'layout')
}

export async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function addAnnouncement(emoji: string, content: string) {
  const res = await prisma.announcement.create({
    data: { emoji, content }
  })
  revalidatePath('/')
  revalidatePath('/home')
  return res
}

export async function updateAnnouncement(id: number, emoji: string, content: string, is_active: boolean) {
  const res = await prisma.announcement.update({
    where: { id },
    data: { emoji, content, is_active }
  })
  revalidatePath('/')
  revalidatePath('/home')
  return res
}

export async function deleteAnnouncement(id: number) {
  const res = await prisma.announcement.delete({
    where: { id }
  })
  revalidatePath('/')
  revalidatePath('/home')
  return res
}
