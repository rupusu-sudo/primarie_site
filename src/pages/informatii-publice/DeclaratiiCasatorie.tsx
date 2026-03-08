import { FileText } from "lucide-react";

import PublicInfoDocumentsPage from "@/components/PublicInfoDocumentsPage";

export default function DeclaratiiCasatorie() {
  return (
    <PublicInfoDocumentsPage
      title="Declarații de căsătorie"
      badge="Informații publice"
      heroLabel="Documente publicate pentru consultare publică în procedurile de stare civilă."
      description="Aici sunt afișate declarațiile de căsătorie încărcate din sistemul de documente al primăriei. Pagina urmează același model clar de consultare folosit pentru celelalte arhive publice: căutare rapidă, sortare, listă simplă și acces direct la fișiere."
      category="declaratii-casatorie"
      emptyMessage="Nu există declarații de căsătorie pentru filtrul curent."
      icon={FileText}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Informații Publice", href: "/transparenta" },
        { label: "Declarații de căsătorie" },
      ]}
    />
  );
}
