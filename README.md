# 🏛️ Portal Digital - Primăria Comunei Almăj

Acest proiect reprezintă platforma digitală oficială a **Comunei Almăj**, județul Dolj. Este un portal modern, performant și transparent, construit pentru a facilita comunicarea dintre administrația locală și cetățeni.

---

## 🚀 Tehnologii și Performanță

Proiectul este dezvoltat folosind cele mai noi standarde web pentru a asigura o experiență de utilizare fluidă:

* **Framework:** [React](https://reactjs.org/) cu [Vite](https://vitejs.dev/) (pentru viteză de încărcare ultra-rapidă)
* **Limbaj:** [TypeScript](https://www.typescriptlang.org/) (cod robust și scalabil)
* **Stilizare:** [Tailwind CSS](https://tailwindcss.com/) (design adaptabil pe orice dispozitiv)
* **Componente:** [shadcn/ui](https://ui.shadcn.com/) (interfață curată și accesibilă)
* **Iconițe:** [Lucide React](https://lucide.dev/) (vizualuri administrative intuitive)
* **Interactivitate:** [EmailJS](https://www.emailjs.com/) (gestionarea digitală a audiențelor)

---

## 📂 Structura Portalului

Proiectul este organizat în module clare pentru a respecta legislația în vigoare:

### 👤 Conducere și Administrație
- **Primar / Viceprimar / Secretar:** Pagini dedicate cu atribuții legale, mesaje oficiale și program de audiențe.
- **Consiliul Local:** Componența actuală (Mandat 2024-2028), partide politice și comisii de specialitate.
- **Organigramă:** Structura ierarhică a aparatului de specialitate, reprezentată vizual și prin documente oficiale.

### 📄 Servicii pentru Cetățeni
- **Urbanism:** Ghid complet pentru dosare (C.U. / A.C.) și formulare tipizate pentru descărcare.
- **Taxe și Impozite:** Integrare cu platforma Ghișeul.ro și informații despre termenele de plată.
- **Stare Civilă:** Proceduri pentru evenimente de viață (Naștere, Căsătorie, Deces).

---

## 💻 Dezvoltare și Mentenanță

Dacă dorești să lucrezi local pe acest proiect, urmează instrucțiunile:

### Pași pentru instalare locală:
1. **Clonare:** `git clone <URL_REPOS_GIT>`
2. **Instalare dependențe:** `npm install`
3. **Rulare în mod dezvoltare:** `npm run dev`
4. **Build pentru producție:** `npm run build`

### Configurare Formulare:
Pentru ca solicitările de audiență să ajungă la secretariat, configurează cheile EmailJS în fișierele corespunzătoare:
- `YOUR_SERVICE_ID`
- `YOUR_TEMPLATE_ID`
- `YOUR_PUBLIC_KEY`

---

## ⚖️ Conformitate și Transparență

Site-ul este conceput să respecte:
- **OUG 57/2019** privind Codul Administrativ.
- **Legea nr. 176/2010** privind integritatea în exercitarea funcțiilor publice (afișare declarații ANI).
- **GDPR** privind protecția datelor cu caracter personal în formularele de contact.

---

## 🌐 Publicare

Proiectul este optimizat pentru a fi publicat prin **Vercel** sau **Netlify** cu un singur click din platforma Lovable.

**Domeniu oficial vizat:** `primariaalmaj.ro`