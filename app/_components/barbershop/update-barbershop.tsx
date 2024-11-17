"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { updateBarbershop } from "../../_data/barbershop/update-barbershop"; // Função de atualização
import { useRouter } from "next/navigation";

const EditBarbershop = ({ barbershopData, onClose }: any) => {
  const [barbershop, setBarbershop] = useState(barbershopData);

  const router = useRouter()


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarbershop((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBarbershop = async () => {
    const { name, address, phone, description, imageUrl } = barbershop;
    if (!name || !address || !phone || !description || !imageUrl) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await updateBarbershop({ barbershop });
      toast.success("Empresa atualizada com sucesso!");
      router.refresh
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      toast.error("Erro ao atualizar empresa!");
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="h-full overflow-y-auto">
        <SheetHeader>
          <SheetClose asChild>
            <SheetTitle>Editar Empresa</SheetTitle>
          </SheetClose>
        </SheetHeader>

        <CardContent>
          <div className="space-y-4">
            <Input
              name="name"
              value={barbershop.name}
              onChange={handleInputChange}
              placeholder="Nome da Empresa"
              required
            />
            <Input
              name="address"
              value={barbershop.address}
              onChange={handleInputChange}
              placeholder="Endereço"
              required
            />
            <Input
              name="phone"
              value={barbershop.phone}
              onChange={handleInputChange}
              placeholder="Telefone"
              required
            />
            <Input
              name="description"
              value={barbershop.description}
              onChange={handleInputChange}
              placeholder="Descrição"
              required
            />
            <Input
              name="imageUrl"
              value={barbershop.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL"
              required
            />
          </div>
        </CardContent>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleUpdateBarbershop}>Salvar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditBarbershop;
