"use server"

import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";
import { BarbershopService } from "@prisma/client";
import { getServerSession } from "next-auth";

interface CreateServiceProps {
  barbershopId: string;
  serviceData: Omit<BarbershopService, 'id'| "barbershopId">;

}

export const createService = async ({ barbershopId, serviceData }: CreateServiceProps) => {
  const user = await getServerSession(authOptions);
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  return db.barbershopService.create({
    data: {
      ...serviceData,  
      barbershopId,
    },
  });
};
