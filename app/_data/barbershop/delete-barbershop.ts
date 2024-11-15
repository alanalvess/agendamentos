"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteBarbershop = async (barbershopId: string) => {
  try {
    // Deletando a barbearia e seus serviços (e outros dados relacionados, se necessário)
    await db.barbershop.delete({
      where: { id: barbershopId }
    })
  } catch (error) {
    throw new Error("Erro ao excluir a barbearia")
  }
}
