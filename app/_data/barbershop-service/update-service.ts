"use server";

import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";

interface UpdateServiceProps {
  serviceId: string;
  serviceData: Partial<{
    name: string;
    description: string;
    price: number;
  }>;
}

export const updateService = async ({ serviceId, serviceData }: UpdateServiceProps) => {
  const user = await getServerSession(authOptions);
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Validações de permissão, se necessário (por exemplo, verificar se o usuário é o dono da barbearia).
  const existingService = await db.barbershopService.findUnique({
    where: { id: serviceId },
    include: { barbershop: true },
  });

  if (!existingService) {
    throw new Error("Serviço não encontrado");
  }

  if (existingService.barbershop.userId !== user.user.id) {
    throw new Error("Usuário não autorizado");
  }

  return db.barbershopService.update({
    where: { id: serviceId },
    data: {
      ...serviceData,
    },
  });
};
