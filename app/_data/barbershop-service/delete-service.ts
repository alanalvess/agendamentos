"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteBarbershopService = async (serviceId: string, barbershopId: string) => {
  await db.barbershopService.delete({
    where: {
      id: serviceId,
    },
  })
  revalidatePath(`/barbershops/${barbershopId}`)
}