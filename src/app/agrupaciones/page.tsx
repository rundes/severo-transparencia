import { AgrupacionesIndex } from "./index-client";
import { Container, PageHeader } from "@/components/ui";

export default function AgrupacionesPage() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Índice histórico" title="Agrupaciones">
          <p>
            Generado automáticamente desde los resultados nacionales (Generales 2011–2023). Logo oficial cuando el API
            lo provee; si no, un avatar derivado del nombre.
          </p>
        </PageHeader>
        <AgrupacionesIndex />
      </Container>
    </main>
  );
}
