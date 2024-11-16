"use server"

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

interface GetBookingsProps {
  userId: string,
  serviceId: string;
  barbershopId: string;
  date: Date;
}

export const getBookings = async ({ userId, serviceId, barbershopId, date }: GetBookingsProps) => {

  return db.booking.findMany({
    where: {
      userId,
      barbershopId,
      serviceId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
    include: {
      user: true,
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  });

  
};

