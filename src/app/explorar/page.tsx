import { Explorer } from "./explorer";
import { Container, PageHeader } from "@/components/ui";

export default function ExplorarPage() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Resultados en vivo" title="Explorar resultados">
          <p>Elegí año, elección, cargo y distrito. Bajá a sección cuando quieras el detalle fino. Datos del API DINE.</p>
        </PageHeader>
        <Explorer />
      </Container>
    </main>
  );
}
