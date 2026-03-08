import { FileText } from "lucide-react";

import PublicInfoDocumentsPage from "@/components/PublicInfoDocumentsPage";

export default function PublicatiiVanzare() {
  return (
    <PublicInfoDocumentsPage
      title="Publicații de vânzare"
      badge="Informații publice"
      heroLabel="Arhivă actualizată cu documentele publicate pentru procedurile de vânzare."
      description="Secțiunea reunește publicațiile de vânzare publicate de administrația locală, încărcate direct din baza de date. Documentele pot fi căutate, ordonate și deschise rapid, atât pe desktop, cât și pe mobil."
      category="publicatii-vanzare"
      emptyMessage="Nu există publicații de vânzare pentru filtrul curent."
      icon={FileText}
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Informații Publice", href: "/transparenta" },
        { label: "Publicații de vânzare" },
      ]}
    />
  );
}
