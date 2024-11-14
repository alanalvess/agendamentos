"use server"

import { db } from "@/app/_lib/prisma"

interface GetServicesProps {
  barbershopId: string
}

export const getServices = async ({ barbershopId }: GetServicesProps) => {
  return db.barbershopService.findMany({
    where: {
      barbershopId,
    },
  })
}
