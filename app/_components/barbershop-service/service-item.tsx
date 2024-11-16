"use client"

import { Barbershop, BarbershopService, Booking, User } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { isPast, isToday, set } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { Button } from "@/app/_components/ui/button"
import { Calendar } from "@/app/_components/ui/calendar"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Dialog, DialogContent } from "@/app/_components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet"

import BookingSummary from "@/app/_components/booking/booking-summary"
import SignInDialog from "@/app/_components/sign-in-dialog"
import { createBooking } from "@/app/_data/booking/create-booking"
import { getBookings } from "@/app/_data/booking/get-bookings"
import { deleteBarbershopService } from "@/app/_data/barbershop-service/delete-service"
import { XIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import Link from "next/link"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Barbershop
}

const TIME_LIST = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    )
    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()

  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  const isOwner = data?.user.id === barbershop.userId;

  const handleDeleteService = async () => {
    try {
      await deleteBarbershopService(service.id, barbershop.id)
      toast.success("Serviço excluído com sucesso!")
      // Revalida a página da barbearia para atualizar a lista de serviços
      router.push(`/barbershops/${barbershop.id}`)
    } catch (error) {
      console.error("Erro ao excluir serviço", error)
      toast.error("Erro ao excluir serviço")
    }
  }

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || !data?.user) return; // Certifique-se de que o usuário está autenticado antes de prosseguir
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
        barbershopId: barbershop.id,
        userId: data.user.id, // Agora usamos o ID do usuário da sessão
      });
      setDayBookings(bookings);
    };
    fetch();
  }, [selectedDay, service.id, data?.user]);


  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate || !data?.user) return // Certifique-se de que o usuário está autenticado
      await createBooking({
        userId: data.user.id, // Agora estamos utilizando data?.user.id corretamente
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: selectedDate,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }


  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  return (
    <>
      <Card className="flex items-center">
  <div className="flex justify-center items-center text-center border-r border-solid w-auto h-full">
    {isOwner && (
      <button
        onClick={handleDeleteService}
        className="text-red-500 hover:text-red-700 p-2"
        aria-label="Excluir serviço"
      >
        <XIcon className="h-5 w-5" />
      </button>
    )}
  </div>

  <CardContent className="flex flex-1 flex-col h-full gap-4 p-3">
    {/* Nome e descrição do serviço */}
    <div className="flex-1 space-y-2">
      <h3
        className="text-sm font-semibold sm:truncate sm:w-72"
        title={service.name}
      >
        {service.name}
      </h3>
      <p className="text-sm text-gray-400">{service.description}</p>
    </div>

    {/* Preço e botões */}
    <div className="mt-auto flex items-center justify-between">
      {/* Preço */}
      <p className="text-sm font-bold text-gray-400">
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(service.price))}
      </p>

      {/* Botões: Editar Serviço e Reservar */}
      <div className="flex gap-3">
        {isOwner && (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/services/edit/${service.id}`}>Editar</Link>
          </Button>
        )}

        <Sheet
          open={bookingSheetIsOpen}
          onOpenChange={handleBookingSheetOpenChange}
        >
          <Button
            className="ml-auto"
            variant="secondary"
            size="sm"
            onClick={handleBookingClick}
          >
            Reservar
          </Button>

          <SheetContent className="h-full overflow-y-auto px-0">
            <SheetHeader>
              <SheetTitle className="px-3">Fazer Reserva</SheetTitle>
            </SheetHeader>

            {/* Calendário */}
            <div className="border-b border-solid py-5">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={selectedDay}
                onSelect={handleDateSelect}
                fromDate={new Date()}
                styles={{
                  head_cell: { width: "100%", textTransform: "capitalize" },
                  cell: { width: "100%" },
                  button: { width: "100%" },
                  nav_button_previous: { width: "32px", height: "32px" },
                  nav_button_next: { width: "32px", height: "32px" },
                  caption: { textTransform: "capitalize" },
                }}
              />
            </div>

            {/* Lista de horários */}
            {selectedDay && (
              <div className="grid grid-cols-5 gap-3 p-5">
                {timeList.length > 0 ? (
                  timeList.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-5 text-xs">
                    Não há horários disponíveis para este dia.
                  </p>
                )}
              </div>
            )}

            {/* Resumo da reserva */}
            {selectedDate && data?.user && (
              <div className="p-5">
                <BookingSummary
                  user={{
                    name: data?.user?.name || null, // Garantindo que seja string ou null
                  }}
                  barbershop={barbershop}
                  service={service}
                  selectedDate={selectedDate}
                />
              </div>
            )}

            <SheetFooter className="mt-5 px-5">
              <Button
                onClick={handleCreateBooking}
                disabled={!selectedDay || !selectedTime}
              >
                Confirmar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </CardContent>
</Card>



      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
