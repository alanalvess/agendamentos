import Header from "@/app/_components/header"
import BarbershopItem from "@/app/_components/barbershop/barbershop-item"
import Search from "@/app/_components/barbershop/search"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "bem vindo"}!
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>

        <div className="mt-6">
          <Search />
        </div>



        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Barbearias e salões de beleza
        </h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id}>
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
