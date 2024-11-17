import { Barbershop, BarbershopService, User } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent } from "@/app/_components/ui/card"

interface BookingSummaryProps {
  user: Pick<User, "name">
  service: Pick<BarbershopService, "name" | "price">
  barbershop: Pick<Barbershop, "name">
  selectedDate: Date
}

const BookingSummary = ({
  user,
  service,
  barbershop,
  selectedDate,
}: BookingSummaryProps) => {

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm font-bold">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Data</h2>
          <p className="text-sm">
            {format(selectedDate, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Horário</h2>
          <p className="text-sm">{format(selectedDate, "HH:mm")}</p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Empresa</h2>
          <p className="text-sm">{barbershop.name}</p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Usuário</h2>
          <p className="text-sm">{user.name || "Nome não disponível"}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingSummary
