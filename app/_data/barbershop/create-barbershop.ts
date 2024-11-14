"use server"

import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";
import { Barbershop } from "@prisma/client";
import { getServerSession } from "next-auth";

interface CreateBarbershopParams {
  barbershop: Omit<Barbershop, "id" | "userId" | "createdAt" | "updatedAt">;
}

export const createBarbershop = async (params: CreateBarbershopParams) => {
  const user = await getServerSession(authOptions);
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.barbershop.create({
    data: {
      ...params.barbershop,
      userId: (user.user as any).id,
    },
  });
};

