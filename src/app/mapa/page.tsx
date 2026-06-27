import { MapaClient } from "./mapa-client";
import { Container, PageHeader } from "@/components/ui";

export default function MapaPage() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Geografía del voto" title="Mapa por provincia">
          <p>Agrupación ganadora en cada distrito. Pasá el mouse por una provincia para ver el detalle.</p>
        </PageHeader>
        <MapaClient />
      </Container>
    </main>
  );
}
