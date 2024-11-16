"use client"

import Link from "next/link"

import { Barbershop } from "@prisma/client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import { toast } from "sonner"
import { deleteBarbershop } from "@/app/_data/barbershop/delete-barbershop"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { XIcon } from "lucide-react"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {

  const { data } = useSession()
  const router = useRouter()
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false)

  // Verificar se o usuário é o dono da barbearia
  const isOwner = data?.user?.id === barbershop.userId

  // Função para abrir a confirmação de exclusão
  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationIsOpen(true)
  }

  // Função para excluir a barbearia
  const handleDeleteBarbershop = async () => {
    try {
      // Deletar a barbearia
      await deleteBarbershop(barbershop.id)
      toast.success("Barbearia excluída com sucesso!")
      // Redirecionar ou recarregar a página após a exclusão
      router.push("/")
    } catch (error) {
      console.error("Erro ao excluir barbearia", error)
      toast.error("Erro ao excluir barbearia")
    }
  }

  return (
    <Card className="min-w-[167px] h-full rounded-2xl">
      <CardContent className="p-0 flex h-full flex-col">
        {/* Imagem no topo */}
        <div className="relative w-full h-[20vh]">
          <img
            alt={barbershop.name}
            className="w-full h-full rounded-tl-2xl rounded-tr-2xl object-cover"
            src={barbershop.imageUrl}
          />
        </div>

        {/* Conteúdo do card */}
        <div className="flex h-full">
          {/* Botão de excluir */}
          {isOwner && (
            <div className="flex justify-center items-center text-center border-r border-solid p-3">
              <button
                onClick={handleOpenDeleteConfirmation}
                className="text-red-500 hover:text-red-700"
                aria-label="Excluir barbearia"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="flex-1 p-3 flex flex-col">
            <div>
              <h3 className="font-semibold">{barbershop.name}</h3>
              <p className="text-sm text-gray-400">{barbershop.address}</p>
            </div>

            {/* Botões na parte inferior */}
            <div className="flex gap-3 mt-auto pt-5">
              {isOwner && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/barbershops/edit/${barbershop.id}`}>Editar</Link>
                </Button>
              )}
              <Button variant="secondary" size="sm" className="flex-1" asChild>
                <Link href={`/barbershops/${barbershop.id}`}>Ver mais...</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Modal de confirmação de exclusão */}
      {deleteConfirmationIsOpen && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-background p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Excluir</h2>
            <p>Tem certeza de que deseja excluir este estabelecimento?</p>
            <div className="mt-4 flex gap-4 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmationIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteBarbershop}>
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>



  )
}

export default BarbershopItem
