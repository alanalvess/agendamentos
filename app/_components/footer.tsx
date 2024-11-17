import { Card, CardContent } from "@/app/_components/ui/card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400">
            © 2023 Projeto Integrador II - Univesp | <span className="font-bold">Alunos DRP01-PJI240-SALA-006GRUPO-009</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
