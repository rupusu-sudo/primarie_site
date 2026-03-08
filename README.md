# 🏛️ Portal Digital – Primăria Comunei Almăj

![Status](https://img.shields.io/badge/status-active-success)
![Framework](https://img.shields.io/badge/framework-React-blue)
![Language](https://img.shields.io/badge/language-TypeScript-blue)
![Build](https://img.shields.io/badge/build-Vite-purple)
![Styling](https://img.shields.io/badge/style-TailwindCSS-38BDF8)
![License](https://img.shields.io/badge/license-public--institutional-lightgrey)

Acest proiect reprezintă **platforma digitală oficială a Comunei Almăj (județul Dolj)**, dezvoltată pentru a moderniza comunicarea dintre administrația locală și cetățeni prin servicii digitale rapide, accesibile și transparente.

Portalul urmărește implementarea unor principii moderne de **e-guvernare**, facilitând accesul la informații publice și servicii administrative printr-o experiență digitală optimizată pentru toate dispozitivele.

---

# 📌 Obiectivele Proiectului

Platforma este construită pentru a îndeplini următoarele obiective:

- creșterea transparenței administrative
- digitalizarea serviciilor publice locale
- acces facil la documente și informații oficiale
- optimizarea comunicării dintre instituție și cetățeni
- modernizarea infrastructurii digitale a administrației locale

---

# ⚙️ Stack Tehnologic

Proiectul utilizează tehnologii moderne din ecosistemul JavaScript pentru a asigura performanță ridicată și mentenanță ușoară.

## Frontend

- **React**  
  https://react.dev  
  arhitectură component-based pentru interfețe interactive

- **Vite**  
  https://vitejs.dev  
  build tool modern pentru dezvoltare rapidă și încărcare instant

- **TypeScript**  
  https://www.typescriptlang.org  
  tipare statice pentru cod robust și scalabil

- **Tailwind CSS**  
  https://tailwindcss.com  
  design system utilitar pentru layout responsive și stilizare rapidă

---

## UI Components

- **shadcn/ui**  
  https://ui.shadcn.com  
  set modern de componente accesibile și reutilizabile

---

## Iconografie

- **Lucide React**  
  https://lucide.dev  
  iconografie minimalistă și consistentă

---

## Interactivitate

- **EmailJS**  
  https://www.emailjs.com  

utilizat pentru transmiterea formularelor fără backend dedicat.

---

# 🎨 Design și Experiență Utilizator

Portalul utilizează o interfață modernă inspirată din platformele instituționale europene.

Principii de design aplicate:

- design **mobile-first**
- layout complet **responsive**
- interfață **dark premium**
- animații subtile optimizate pentru performanță
- componente reutilizabile
- accesibilitate îmbunătățită

---

# 🧩 Elemente UX implementate

Platforma include multiple optimizări de experiență utilizator:

- footer instituțional modern
- bannere oficiale ANPC și ODR
- sistem de consimțământ pentru cookie-uri
- pagini dedicate pentru politici legale
- navigație clară pentru servicii administrative
- interfață optimizată pentru mobil și desktop

---

# 📂 Structura Portalului

Platforma este organizată modular pentru a reflecta structura administrativă a instituției.

---

# 👤 Conducere și Administrație

## Primar
Prezentarea primarului, atribuții legale și mesaj oficial.

## Viceprimar
Responsabilități administrative și coordonarea activităților executive.

## Secretar General
Coordonarea actelor administrative și garantarea legalității procedurilor.

## Consiliul Local

- componență actuală
- mandat 2024 – 2028
- apartenență politică
- comisii de specialitate

## Organigramă

Structura aparatului de specialitate al primarului prezentată vizual.

---

# 📑 Transparență Instituțională

Portalul include secțiuni dedicate accesului public la informații administrative.

- Hotărâri ale Consiliului Local (HCL)
- Declarații de avere și interese
- Buget și execuție bugetară
- Achiziții publice
- Concursuri și angajări

Aceste secțiuni respectă principiile **transparenței decizionale și accesului la informații publice**.

---

# 🧾 Servicii pentru Cetățeni

Platforma oferă informații utile pentru cetățeni privind procedurile administrative.

## Urbanism

- certificate de urbanism
- autorizații de construire
- formulare tipizate

## Taxe și Impozite

Integrare informativă cu platforma:

https://ghiseul.ro

pentru plata taxelor și impozitelor locale.

## Stare Civilă

Proceduri pentru:

- naștere
- căsătorie
- deces
- alte acte administrative

---

# 🍪 Politici și Conformitate

Platforma include pagini dedicate pentru:

- Politica de Confidențialitate
- Politica de Cookies
- Termeni și Condiții

Portalul utilizează un **sistem de consimțământ pentru cookie-uri** optimizat pentru mobil și desktop.

---

# ⚖️ Cadru Legislativ

Platforma este concepută pentru a respecta legislația românească relevantă pentru administrația publică.

- OUG 57/2019 – Codul Administrativ
- Legea 544/2001 – Accesul la informații publice
- Legea 176/2010 – Integritate în exercitarea funcțiilor publice
- Regulamentul GDPR (UE) 2016/679 – Protecția datelor personale

---

# 🧑‍💻 Dezvoltare Locală

Pentru rularea proiectului în mediul local:

## 1️⃣ Clonarea repository-ului

```bash
git clone <URL_REPOSITORY>
```

---

## 2️⃣ Instalarea dependențelor

```bash
npm install
```

---

## 3️⃣ Pornirea serverului de dezvoltare

```bash
npm run dev
```

---

## 4️⃣ Build pentru producție

```bash
npm run build
```

---

# 📩 Configurare Formulare

Formularele de contact și audiență utilizează **EmailJS**.

Pentru configurare trebuie completate următoarele chei:

```
YOUR_SERVICE_ID
YOUR_TEMPLATE_ID
YOUR_PUBLIC_KEY
```

Aceste valori se introduc în fișierele de configurare ale formularelor.

---

# 🗂️ Arhitectura Proiectului

Structura generală a aplicației:

```
src
 ├── components
 │   ├── layout
 │   ├── navigation
 │   ├── footer
 │   └── ui
 │
 ├── pages
 │   ├── primar
 │   ├── viceprimar
 │   ├── consiliu-local
 │   ├── transparenta
 │   ├── urbanism
 │   └── legal
 │
 ├── assets
 │
 ├── hooks
 │
 └── utils
```

---

# 🚀 Deployment

Proiectul este optimizat pentru deploy automat pe platforme moderne:

- **Vercel**
- **Netlify**

Deploymentul se poate realiza prin conectarea repository-ului Git.

---

# 🌐 Domeniu

Domeniul oficial vizat pentru platformă:

```
primariaalmaj.ro
```

---

# 🛣️ Roadmap

Extensii planificate pentru viitor:

- sistem digital de solicitări administrative
- integrare servicii publice electronice
- sistem de notificări pentru cetățeni
- integrare API-uri guvernamentale
- arhivă digitală pentru documente

---

# 🤝 Contribuții

Acest proiect este dezvoltat pentru **Primăria Comunei Almăj** și poate fi extins în viitor pentru a include noi servicii digitale.

---

# 🧑‍💻 Credite

Design și dezvoltare:

**rupusu-sudo**

Implementare tehnică și suport:

**Tech Consult**

---

© Primăria Comunei Almăj – Platformă digitală administrativă.