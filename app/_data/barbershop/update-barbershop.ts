"use server"

import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";
import { Barbershop } from "@prisma/client";
import { getServerSession } from "next-auth";

interface UpdateBarbershopParams {
  barbershop: Omit<Barbershop, "userId" | "createdAt" | "updatedAt">;
}

export const updateBarbershop = async (params: UpdateBarbershopParams) => {
  const user = await getServerSession(authOptions);
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const barbershopId = params.barbershop.id; // Você deve garantir que o ID seja passado

  await db.barbershop.update({
    where: { id: barbershopId },
    data: {
      ...params.barbershop,
      userId: (user.user as any).id,
    },
  });
};
