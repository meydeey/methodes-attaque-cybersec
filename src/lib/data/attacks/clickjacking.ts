import { Attack } from "@/lib/types";

export const clickjacking: Attack = {
  slug: "clickjacking",
  name: "Clickjacking",
  categoryId: "client-social",
  severity: "medium",
  summary:
    "L'attaquant superpose une page invisible par-dessus un contenu attractif pour piéger les clics de la victime.",
  explanation: `Le clickjacking (ou UI Redressing) consiste à superposer un élément interactif invisible (souvent un iframe) par-dessus un contenu visible et attractif. L'utilisateur pense cliquer sur un bouton anodin — "Gagner 1000€", "Voir la vidéo" — mais en réalité, il clique sur un bouton caché qui exécute une action sensible.

L'iframe invisible contient la page légitime de la victime (son compte bancaire, son dashboard d'administration, un formulaire de suppression). L'attaquant positionne le vrai bouton d'action exactement sous le faux bouton visible. L'opacité de l'iframe est à 0 — totalement transparent.

Cette attaque est particulièrement vicieuse car elle exploite la session active de l'utilisateur. Si la victime est déjà connectée à son dashboard Next.js, le clic sur le bouton invisible exécute l'action avec ses propres permissions, sans aucune alerte.`,
  realWorldScenario: `Un attaquant crée une page "Jeu concours — Gagnez un iPhone". En réalité, un iframe invisible charge ton dashboard Supabase avec le formulaire de suppression de projet. Le bouton "Participer" est aligné exactement avec "Confirmer la suppression". Tu cliques, pensant jouer — mais tu viens de supprimer ton projet Supabase en production.`,
  exploitSteps: [
    "L'attaquant crée une page web attractive (concours, vidéo virale)",
    "Il charge la cible légitime dans un iframe invisible (opacity: 0)",
    "Le bouton d'action sensible est positionné sous le bouton visible",
    "La victime clique sur le contenu attractif, pensant interagir avec la page visible",
    "L'action sensible est exécutée avec la session active de la victime",
  ],
  protections: [
    {
      title: "Header X-Frame-Options / CSP frame-ancestors",
      description:
        "Empêcher votre site d'être chargé dans un iframe sur un domaine tiers.",
      codeExample: `// next.config.ts — Headers de sécurité
const nextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'none'",
        },
      ],
    }];
  },
};

export default nextConfig;`,
      language: "typescript",
    },
    {
      title: "Confirmation en deux étapes pour les actions critiques",
      description:
        "Demander une re-saisie du mot de passe ou un code de confirmation avant toute action destructive (suppression de compte, changement d'email).",
      codeExample: `// Middleware de confirmation pour actions critiques
export async function confirmDangerousAction(
  userId: string,
  action: string,
) {
  const { data } = await supabase
    .from('action_confirmations')
    .insert({
      user_id: userId,
      action,
      confirmed: false,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
    })
    .select()
    .single();

  // Envoyer un email/SMS de confirmation
  return data.id;
}`,
      language: "typescript",
    },
  ],
  animationSteps: [
    { id: "bait", label: "Page attractive : Gagnez 1000€ !", duration: 2500 },
    { id: "overlay", label: "L'overlay invisible se révèle", duration: 3000 },
    {
      id: "real-button",
      label: "Le vrai bouton : Supprimer mon compte",
      duration: 2500,
    },
    { id: "click", label: "La victime clique sans savoir", duration: 2000 },
    { id: "executed", label: "Action destructive exécutée", duration: 2500 },
  ],
  resources: [
    {
      label: "OWASP — Clickjacking",
      url: "https://owasp.org/www-community/attacks/Clickjacking",
    },
    {
      label: "MDN — X-Frame-Options",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options",
    },
  ],
  quiz: [
    {
      question:
        "Comment l'attaquant rend-il l'iframe invisible dans une attaque de clickjacking ?",
      options: [
        "Il utilise display: none",
        "Il met l'opacité (opacity) à 0",
        "Il place l'iframe hors de l'écran",
        "Il utilise visibility: hidden",
      ],
      correctIndex: 1,
      explanation:
        "L'opacité à 0 rend l'iframe totalement transparente mais toujours cliquable. display: none ou visibility: hidden désactiveraient les interactions.",
    },
    {
      question:
        "Quel header HTTP empêche votre site d'être chargé dans un iframe ?",
      options: [
        "Content-Security-Policy: script-src 'self'",
        "X-Frame-Options: DENY",
        "Strict-Transport-Security",
        "X-Content-Type-Options: nosniff",
      ],
      correctIndex: 1,
      explanation:
        "X-Frame-Options: DENY indique au navigateur de ne jamais charger la page dans un iframe, quelle que soit l'origine, bloquant le clickjacking.",
    },
    {
      question:
        "Pourquoi la confirmation en deux étapes protège-t-elle contre le clickjacking ?",
      options: [
        "Elle ralentit l'attaquant",
        "Elle nécessite deux clics que l'attaquant ne peut pas aligner tous les deux",
        "Elle ajoute un CAPTCHA",
        "Elle vérifie l'adresse IP",
      ],
      correctIndex: 1,
      explanation:
        "Une action en deux étapes (clic + confirmation par mot de passe ou code) rend le clickjacking impraticable car l'attaquant ne peut piéger qu'un seul clic.",
    },
  ],
};
