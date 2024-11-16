"use client"

import { Prisma } from "@prisma/client"
import { DialogClose } from "@radix-ui/react-dialog"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarImage } from "@/app/_components/ui/avatar"
import { Badge } from "@/app/_components/ui/badge"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet"

import PhoneItem from "@/app/_components/barbershop/phone-item"
import BookingSummary from "@/app/_components/booking/booking-summary"

import { deleteBooking } from "@/app/_data/booking/delete-booking"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      user: true,
      service: {
        include: {
          barbershop: true,
        }
      }
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { user, service: { barbershop } } = booking

  const isConfirmed = isFuture(booking.date)

  const handleCancelBooking = async () => {
    setIsSheetOpen(true);

    try {
      await deleteBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    } finally {
      setIsSheetOpen(false);
    }
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }

  console.log(booking);
  console.log(user); // aqui está vindo como indefinido


  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%]">
        <Card className="min-w-[90%] h-full ">
          <CardContent className="flex justify-between items-center p-0">

            <div className="flex flex-col gap-2 py-5 pl-5 ">
              <h3 className="font-semibold  text-start">{booking.service.name}</h3>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-start">
                  Empresa: <span className="font-bold  text-primary">{booking.service.barbershop.name}</span>
                </p>

                <p className="text-sm text-start">
                  Agendado por: <span className="font-bold text-primary">{booking.user?.name || "Nome não disponível"}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l-2 border-solid p-5">
              <Badge
                className="w-fit mb-4"
                variant={isConfirmed ? "default" : "secondary"}
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <p className="text-sm capitalize">{format(booking.date, "MMMM", { locale: ptBR })}</p>
              <p className="text-2xl">{format(booking.date, "dd", { locale: ptBR })}</p>
              <p className="text-sm">{format(booking.date, "HH:mm", { locale: ptBR })}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-[85%] h-full overflow-y-auto px-0">
        <SheetHeader>
          <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="relative mt-6 w-full h-[20vh]">
          <img
            alt={`Mapa da barbearia ${booking.service.barbershop.name}`}
            src="/map.png"
            className="absolute inset-0 w-full h-full rounded-xl object-cover"
          />

          <Card className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 w-11/12 rounded-xl bg-opacity-75 backdrop-blur-lg">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <Avatar>
                <AvatarImage src={barbershop.imageUrl} />
              </Avatar>
              <div className="w-full">
                <h3 className="font-bold w-full">{barbershop.name}</h3>
                <p className="text-xs w-full">{barbershop.address}</p>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="mt-6">
          <Badge
            className="w-fit"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <div className="mb-3 mt-6">
            <BookingSummary
              user={user}
              barbershop={barbershop}
              service={booking.service}
              selectedDate={booking.date}
            />
          </div>

          <div className="space-y-3">
            <PhoneItem phone={barbershop.phone} />
          </div>
        </div>
        <SheetFooter className="mt-6">
          <div className="flex items-center gap-3">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Voltar
              </Button>
            </SheetClose>

            <Dialog>
              <DialogTrigger className="w-full">
                <Button variant="destructive" className="w-full">
                  {isConfirmed ? "Cancelar Reserva" : "Excluir Reserva"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <DialogHeader>
                  <DialogTitle>
                    Você deseja {isConfirmed ? "cancelar" : "excluir"} sua reserva?
                  </DialogTitle>
                  <DialogDescription>
                    {isConfirmed
                      ? "Ao cancelar, você perderá sua reserva e não poderá recuperá-la. Essa ação é irreversível."
                      : "Ao excluir, todos os dados da reserva serão permanentemente removidos. Essa ação é irreversível."}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-3">
                  <DialogClose asChild>
                    <Button variant="secondary" className="w-full">
                      Voltar
                    </Button>
                  </DialogClose>
                  <DialogClose className="w-full">
                    <Button
                      variant="destructive"
                      onClick={handleCancelBooking}
                      className="w-full"
                    >
                      Confirmar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
