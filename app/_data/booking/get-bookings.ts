"use server"

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

interface GetBookingsProps {
  serviceId: string
  barbershopId: string;
  date: Date;
}

export const getBookings = async ({ serviceId, barbershopId, date }: GetBookingsProps) => {
  return db.booking.findMany({
    where: {
      barbershopId,
      serviceId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  });
};

