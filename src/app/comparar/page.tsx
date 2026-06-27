import { Comparator } from "./comparator";
import { Container, PageHeader } from "@/components/ui";

export default function CompararPage() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Series nacionales" title="Comparar elecciones">
          <p>Evolución a nivel nacional 2011–2023: participación y porcentaje por agrupación, elección a elección.</p>
        </PageHeader>
        <Comparator />
      </Container>
    </main>
  );
}
