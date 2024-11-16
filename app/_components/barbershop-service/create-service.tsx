"use client"

import { BarbershopService, Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/app/_components/ui/button"
import { CardContent } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/app/_components/ui/sheet"

import { createService } from "@/app/_data/barbershop-service/create-service"

const CreateService = ({ barbershopId }: { barbershopId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    price: new Prisma.Decimal(0),
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCreateService = async () => {
    const { name, description, price } = serviceData;

    if (!name || !description || Number(price) <= 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await createService({
        barbershopId,
        serviceData: {
          ...serviceData,
        },
      });

      toast.success("Serviço criado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao criar serviço!");
    }
  };

  const [services, setServices] = useState<BarbershopService[]>([]);

  const fetchServices = async () => {
    const response = await fetch(`/api/services?barbershopId=${barbershopId}`);
    if (response.ok) {
      const data = await response.json();
      setServices(data);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [barbershopId]);


  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Criar Serviço
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="h-full overflow-y-auto px-0">
          <SheetHeader>
            <SheetClose asChild>

              <SheetTitle className="mx-3">Criar Serviço</SheetTitle>
            </SheetClose>
          </SheetHeader>

          <CardContent className="my-3">

            <div className="space-y-4">
              <Input
                name="name"
                value={serviceData.name}
                onChange={handleInputChange}
                placeholder="Nome do serviço"
                required
              />
              <Input
                name="description"
                value={serviceData.description}
                onChange={handleInputChange}
                placeholder="Descrição do serviço"
                required
              />
              <Input
                name="price"
                value={serviceData.price.toString()}
                onChange={handleInputChange}
                placeholder="Preço do serviço"
                type="number"
                required
              />
            </div>

          </CardContent>

          <SheetFooter>
            <SheetClose asChild>
              <Button className="mx-6" onClick={handleCreateService}>Criar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default CreateService
