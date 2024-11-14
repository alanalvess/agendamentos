"use client"

import Link from "next/link"
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Avatar, AvatarImage } from "@/app/_components/ui/avatar"
import { Button } from "@/app/_components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/app/_components/ui/dialog"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/app/_components/ui/sheet"

import SignInDialog from "@/app/_components/sign-in-dialog"
import CreateBarbershop from "@/app/_components/barbershop/create-barbershop"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

const SidebarSheet = () => {
  const { data } = useSession()
  const handleLogoutClick = () => signOut()

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
          {data?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={data?.user?.image ?? ""} />
              </Avatar>

              <div>
                <p className="font-bold">{data.user.name}</p>
                <p className="text-xs">{data.user.email}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold">Olá, faça seu login!</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon">
                    <LogInIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <SignInDialog />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </SheetHeader>


      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>
        </SheetClose>

      </div>
      <div className="flex flex-col gap-2 border-b border-solid py-1">
        {data?.user && (
          <div className="flex flex-col gap-2 py-5">
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={handleLogoutClick}
              >
                <LogOutIcon size={18} />
                Sair da conta
              </Button>
            </SheetClose>
          </div>
        )}
      </div>

      {data?.user && (
        <div className="flex flex-col gap-2 py-5">
          <SheetClose asChild>

            <CreateBarbershop />
          </SheetClose>
        </div>
      )}

    </SheetContent>
  )
}

export default SidebarSheet
