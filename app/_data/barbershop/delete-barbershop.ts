"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteBarbershop = async (barbershopId: string) => {
  try {
    await db.barbershop.delete({
      where: { id: barbershopId }
    })
  } catch (error) {
    throw new Error("Erro ao excluir a empresa")
  }
}
