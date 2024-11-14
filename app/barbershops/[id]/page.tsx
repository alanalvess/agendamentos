import Link from "next/link"

import { notFound } from "next/navigation"

import BookingItem from "@/app/_components/booking/booking-item"
import CreateService from "@/app/_components/barbershop-service/create-service"
import PhoneItem from "@/app/_components/barbershop/phone-item"
import ServiceItem from "@/app/_components/barbershop-service/service-item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { authOptions } from "@/app/_lib/auth"
import { Button } from "@/app/_components/ui/button"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {

  const session = await getServerSession(authOptions);

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
      bookings: {
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
      },
    },
  })

  if (!barbershop) {
    return notFound()
  }

  const isOwner = session?.user.id === barbershop.userId;

  return (
    <div>
      <div className="relative w-full h-[30vh]">
        <img
          alt={barbershop.name}
          src={barbershop?.imageUrl}
          className="w-full h-full object-cover"
          />

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-4 top-4"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </div>

      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop.name}</h1>
        <div className="mb-2 flex items-center gap-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop?.address}</p>
        </div>
      </div>

      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop?.description}</p>
      </div>

      <div className="space-y-2 border-b border-solid p-5">
        <PhoneItem phone={barbershop.phone} />
      </div>

      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbershop.services.length === 0 ? (
            <p className="text-sm text-gray-500">Ainda não há serviços disponíveis para esta barbearia.</p>
          ) : (
            barbershop.services.map((service) => (
              <ServiceItem
                key={service.id}
                barbershop={JSON.parse(JSON.stringify(barbershop))}
                service={JSON.parse(JSON.stringify(service))}
              />
            ))
          )}
        </div>
      </div>

      {isOwner && (
        <>
          <div className="p-5">
            <CreateService barbershopId={barbershop.id} />
          </div>

          <div className="space-y-3 border-b border-solid p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">Agendamentos</h2>
            {barbershop.bookings.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum agendamento encontrado para esta barbearia.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {barbershop.bookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>

        </>
      )}
    </div>
  )
}

export default BarbershopPage
