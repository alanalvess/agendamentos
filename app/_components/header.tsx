import Link from "next/link"

import { MenuIcon } from "lucide-react"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"

import SidebarSheet from "@/app/_components/sidebar-sheet"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <h1 className="font-bold text-primary text-3xl">AGENDAMENTOS</h1>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
