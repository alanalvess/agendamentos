"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "../ui/sheet";

import { createBarbershop } from "../../_data/barbershop/create-barbershop";

const CreateBarbershop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [barbershop, setBarbershop] = useState({
    name: "",
    address: "",
    expedient: "",
    phone: "",
    description: "",
    imageUrl: ""
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBarbershop((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateBarbershop = async () => {
    const { name, address, expedient, phone, description, imageUrl } = barbershop;
    if (!name || !address || !expedient || !phone || !description || !imageUrl) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createBarbershop({ barbershop });
      toast.success("Barbearia criada com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao criar barbearia:", error);
      toast.error("Erro ao criar barbearia!");
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Criar Barbearia
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="h-full overflow-y-auto">
          <SheetHeader>
            <SheetClose asChild>

              <SheetTitle>Criar Barbearia</SheetTitle>
            </SheetClose>
          </SheetHeader>

          <CardContent className="my-3">
            <div className="space-y-4">
              <Input
                name="name"
                value={barbershop.name}
                onChange={handleInputChange}
                placeholder="Nome da Barbearia"
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
                name="expedient"
                value={barbershop.expedient}
                onChange={handleInputChange}
                placeholder="Expediente"
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
              <Button onClick={handleCreateBarbershop}>Criar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default CreateBarbershop;
