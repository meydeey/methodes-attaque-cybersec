import { Attack } from "@/lib/types";

export const csrf: Attack = {
  slug: "csrf",
  name: "CSRF (Cross-Site Request Forgery)",
  categoryId: "access-control",
  severity: "medium",
  summary:
    "L'attaquant force un utilisateur authentifié à exécuter une action non voulue sur un site où il est connecté.",
  explanation: `Le Cross-Site Request Forgery (CSRF) exploite la confiance qu'un site accorde au navigateur de l'utilisateur. Quand tu es connecté à un site (par ex. ta banque), ton navigateur envoie automatiquement tes cookies d'authentification à chaque requête. Un attaquant peut créer une page piégée qui déclenche une requête vers ce site — et ton navigateur y ajoutera tes cookies sans que tu le saches.

Concrètement, l'attaquant crée un formulaire HTML invisible sur son site malveillant. Quand tu visites sa page, le formulaire s'envoie automatiquement via JavaScript. Le serveur cible reçoit la requête avec tes cookies valides et l'exécute comme si tu l'avais initiée toi-même.

Le résultat : un virement bancaire, un changement de mot de passe, une suppression de compte — tout ce que l'attaquant a configuré dans son formulaire piégé, exécuté avec tes permissions.`,
  realWorldScenario: `Dans ton app Next.js avec Supabase, si tes API Routes acceptent des requêtes POST sans vérifier un token CSRF, un attaquant peut créer une page qui soumet un formulaire vers \`/api/update-profile\` ou \`/api/transfer\`. Le navigateur de la victime envoie automatiquement le cookie de session Supabase, et l'action s'exécute. C'est particulièrement dangereux sur les endpoints qui modifient des données sensibles sans double vérification.`,
  exploitSteps: [
    "La victime est connectée à son application bancaire (session active avec cookie)",
    "L'attaquant crée une page web contenant un formulaire invisible ciblant l'API de la banque",
    "La victime visite le site de l'attaquant (lien dans un email, publicité, etc.)",
    "Le formulaire caché s'envoie automatiquement — le navigateur ajoute les cookies de session",
    "Le serveur bancaire traite la requête comme légitime et exécute le virement",
  ],
  protections: [
    {
      title: "Token CSRF (Double Submit Cookie)",
      description:
        "Générer un token unique par session et le vérifier à chaque requête POST/PUT/DELETE. Le token doit être envoyé dans le body ou un header custom, pas dans un cookie.",
      codeExample: `// middleware.ts — Générer un token CSRF
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export function middleware(request: Request) {
  const response = NextResponse.next();
  if (!request.cookies.get("csrf-token")) {
    const token = randomBytes(32).toString("hex");
    response.cookies.set("csrf-token", token, {
      httpOnly: false, // Le JS doit pouvoir le lire
      sameSite: "strict",
    });
  }
  return response;
}`,
      language: "typescript",
    },
    {
      title: "SameSite Cookie Attribute",
      description:
        "Configurer les cookies de session avec SameSite=Strict ou Lax pour empêcher leur envoi automatique depuis un site tiers.",
      codeExample: `// Configuration Supabase Auth
const supabase = createClient(url, key, {
  auth: {
    cookieOptions: {
      sameSite: "lax", // Bloque les requêtes cross-site POST
      secure: true,
      httpOnly: true,
    },
  },
});`,
      language: "typescript",
    },
    {
      title: "Vérifier l'en-tête Origin/Referer",
      description:
        "Vérifier que l'en-tête Origin ou Referer de la requête correspond à ton domaine avant de traiter les mutations.",
    },
  ],
  animationSteps: [
    {
      id: "logged-in",
      label: "La victime est connectée à sa banque",
      duration: 2000,
    },
    {
      id: "malicious-site",
      label: "Elle visite un site malveillant",
      duration: 2500,
    },
    {
      id: "hidden-form",
      label: "Un formulaire invisible envoie un POST à la banque",
      duration: 2500,
    },
    {
      id: "cookie-sent",
      label: "Le navigateur ajoute automatiquement le cookie de session",
      duration: 2000,
    },
    {
      id: "transfer",
      label: "Virement exécuté sans le consentement de la victime",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — CSRF",
      url: "https://owasp.org/www-community/attacks/csrf",
    },
    {
      label: "MDN — SameSite cookies",
      url: "https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie/SameSite",
    },
  ],
  quiz: [
    {
      question:
        "Pourquoi le navigateur envoie-t-il automatiquement les cookies lors d'une attaque CSRF ?",
      options: [
        "L'attaquant a volé les cookies",
        "Le navigateur attache les cookies à toute requête vers le domaine cible, quel que soit le site d'origine",
        "Le serveur partage les cookies avec tous les domaines",
        "Le JavaScript de l'attaquant lit les cookies",
      ],
      correctIndex: 1,
      explanation:
        "Le navigateur envoie automatiquement les cookies associés à un domaine pour chaque requête vers ce domaine, même si la requête est initiée depuis un site tiers.",
    },
    {
      question:
        "Quel attribut de cookie bloque l'envoi automatique lors de requêtes cross-site ?",
      options: ["HttpOnly", "Secure", "SameSite=Strict", "Path=/"],
      correctIndex: 2,
      explanation:
        "SameSite=Strict empêche le navigateur d'envoyer le cookie lors de requêtes provenant d'un autre site, bloquant les attaques CSRF.",
    },
    {
      question:
        "Pourquoi un token CSRF doit-il être envoyé dans le body ou un header custom, et pas dans un cookie ?",
      options: [
        "Les cookies sont trop petits",
        "Un cookie serait envoyé automatiquement par le navigateur, annulant la protection",
        "Les headers custom sont plus rapides",
        "Le body est chiffré par HTTPS",
      ],
      correctIndex: 1,
      explanation:
        "Si le token CSRF était dans un cookie, il serait envoyé automatiquement comme les autres cookies, rendant la protection inutile. Il doit être dans un endroit que l'attaquant ne peut pas remplir automatiquement.",
    },
  ],
};
