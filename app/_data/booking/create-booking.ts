"use server"

import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface CreateBookingParams {
  userId: string;
  barbershopId: string;
  serviceId: string;
  date: Date;
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Usuário não autenticado")
  }
  await db.booking.create({
    data: { ...params, userId: (user.user as any).id },
  })
  
  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
