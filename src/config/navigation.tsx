import { 
  Home, Building2, FileText, Info, 
  LayoutDashboard, Megaphone, Map, History, 
  Landmark, Users, Briefcase, Calculator, 
  ScrollText, Phone, TreePine
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  { 
    label: "Acasă", 
    href: "/",
    icon: Home 
  },
  { 
    label: "Despre Comună", 
    href: "/despre", // Link virtual pentru grupare
    icon: TreePine,
    children: [
      { label: "Istoric & Tradiție", href: "/istoric", icon: History },
      { label: "Cultură & Religie", href: "/cultura", icon: Landmark },
      { label: "Oportunități Dezvoltare", href: "/oportunitati", icon: Briefcase },
      { label: "Harta Digitală", href: "/harta", icon: Map },
    ]
  },
  { 
    label: "Instituție", 
    href: "/primaria",
    icon: Building2,
    children: [
      { label: "Primar", href: "/primaria/primar", icon: Users },
      { label: "Viceprimar", href: "/primaria/viceprimar", icon: Users },
      { label: "Secretar General", href: "/primaria/secretar", icon: FileText },
      { label: "Consiliul Local", href: "/consiliul-local", icon: Users },
      { label: "Organigramă", href: "/organigrama", icon: LayoutDashboard }, // Note: check capitalization locally
      { label: "Cariere / Angajări", href: "/transparenta/cariere", icon: Briefcase },
    ]
  },
  { 
    label: "Servicii Publice", 
    href: "/servicii",
    icon: LayoutDashboard,
    children: [
      { label: "Impozite și Taxe", href: "/servicii/taxe", icon: Calculator },
      { label: "Urbanism", href: "/servicii/urbanism", icon: Building2 },
      { label: "Stare Civilă", href: "/servicii/stare-civila", icon: Users },
      { label: "Registru Agricol", href: "/servicii/registru-agricol", icon: ScrollText },
      { label: "Asistență Socială", href: "/servicii/asistenta-sociala", icon: Users },
      { label: "Fond Locativ", href: "/servicii/fond-locativ", icon: Home },
    ]
  },
  {
    label: "Informații Publice",
    href: "/transparenta",
    icon: FileText,
    children: [
      { label: "Monitorul Oficial", href: "/monitorul-oficial", icon: ScrollText },
      { label: "Anunțuri & Știri", href: "/anunturi", icon: Megaphone },
      { label: "Hotărâri (HCL)", href: "/transparenta/hcl", icon: FileText },
      { label: "Buget și Achiziții", href: "/transparenta/buget", icon: Calculator },
      { label: "Contact", href: "/contact", icon: Phone },
    ]
  },
];