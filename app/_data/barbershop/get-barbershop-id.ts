// No arquivo de API ou no arquivo get-barbershop-id.ts
import { db } from "@/app/_lib/prisma"; // Certifique-se de que o db esteja correto

export const getBarbershopById = async (id: string) => {
  try {
    const barbershop = await db.barbershop.findUnique({
      where: { id },
    });

    if (!barbershop) {
      throw new Error("Empresa não encontrada");
    }

    return barbershop;
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw error; 
  }
};
