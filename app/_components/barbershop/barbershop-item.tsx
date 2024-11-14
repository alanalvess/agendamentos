import Image from "next/image"
import Link from "next/link"

import { Barbershop } from "@prisma/client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] rounded-2xl">
      <CardContent className="p-0 ">
        <div className="relative h-[159px] w-full">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-tl-2xl rounded-tr-2xl object-cover"
            src={barbershop.imageUrl}
          />
        </div>

        <div className="px-3 py-3">
          <h3 className="truncate font-semibold">{barbershop.name}</h3>

          <p className="truncate text-sm text-gray-400">{barbershop.address}</p>

          <Button variant="secondary" className="mt-3 w-full" asChild>
            <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
