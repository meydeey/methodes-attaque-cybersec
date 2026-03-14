import { Attack } from "@/lib/types";

export const jwtManipulation: Attack = {
  slug: "jwt-manipulation",
  name: "JWT Manipulation",
  categoryId: "auth",
  severity: "critical",
  summary:
    "L'attaquant modifie un token JWT pour changer ses permissions ou son identité.",
  explanation: `Un JWT (JSON Web Token) est composé de 3 parties séparées par des points : le header (algorithme), le payload (données utilisateur), et la signature (vérification). Le tout est encodé en Base64, pas chiffré — n'importe qui peut lire le contenu.

L'attaque consiste à décoder le JWT, modifier le payload (ex: changer \`"role": "user"\` en \`"role": "admin"\`), puis le re-signer. Si le serveur ne vérifie pas correctement la signature ou accepte l'algorithme "none", le token modifié est accepté.

C'est une attaque critique car elle donne un accès admin complet sans connaître aucun mot de passe.`,
  realWorldScenario: `Avec Supabase Auth, les JWT sont signés côté serveur. Mais si tu crées ton propre système de tokens pour une API interne ou un workflow n8n, et que tu ne vérifies pas la signature à chaque requête, un attaquant peut forger un token avec des permissions élevées et accéder à tous tes endpoints protégés.`,
  exploitSteps: [
    "L'attaquant récupère son JWT (visible dans les cookies ou le localStorage)",
    "Il décode le payload en Base64 — le contenu est lisible en clair",
    "Il modifie le payload : role: 'user' → role: 'admin'",
    "Il change l'algorithme en 'none' dans le header",
    "Il envoie le token modifié — si le serveur ne vérifie pas la signature, l'accès admin est accordé",
  ],
  protections: [
    {
      title: "Toujours vérifier la signature",
      description:
        "Utiliser une librairie comme jose pour vérifier la signature du JWT à chaque requête. Ne jamais faire confiance au contenu sans vérification.",
      codeExample: `import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

try {
  const { payload } = await jwtVerify(token, secret);
  // Le token est valide et non modifié
} catch {
  // Token invalide ou expiré
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}`,
      language: "typescript",
    },
    {
      title: "Rejeter l'algorithme 'none'",
      description:
        "Configurer explicitement l'algorithme attendu (HS256, RS256) et rejeter tout token avec alg: 'none'.",
    },
    {
      title: "Expiration courte + Refresh token",
      description:
        "Access token de 15 minutes max. Refresh token de 7 jours en HttpOnly cookie. Rotation automatique.",
    },
  ],
  animationSteps: [
    {
      id: "token",
      label: "Token JWT en 3 parties : Header . Payload . Signature",
      duration: 2500,
    },
    {
      id: "decode",
      label: "L'attaquant décode le payload en Base64",
      duration: 2000,
    },
    {
      id: "modify",
      label: "Il change role: 'user' → role: 'admin'",
      duration: 2500,
    },
    {
      id: "resign",
      label: "Il change l'algorithme en 'none' (pas de signature)",
      duration: 2500,
    },
    {
      id: "accept",
      label: "Le serveur accepte le token → accès admin accordé",
      duration: 2000,
    },
  ],
  resources: [
    { label: "JWT.io — Debugger", url: "https://jwt.io" },
    {
      label: "OWASP — JWT Attacks",
      url: "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/10-Testing_JSON_Web_Tokens",
    },
  ],
  quiz: [
    {
      question: "Quelles sont les 3 parties d'un JWT ?",
      options: [
        "Username, Password, Token",
        "Header, Payload, Signature",
        "Public Key, Private Key, Hash",
        "Issuer, Audience, Expiration",
      ],
      correctIndex: 1,
      explanation:
        "Un JWT est composé de 3 parties encodées en Base64 : le Header (algorithme), le Payload (données) et la Signature (vérification d'intégrité).",
    },
    {
      question: "Pourquoi l'algorithme 'none' est-il dangereux dans un JWT ?",
      options: [
        "Il chiffre le token en clair",
        "Il désactive la vérification de la signature",
        "Il rend le token permanent",
        "Il expose la clé secrète",
      ],
      correctIndex: 1,
      explanation:
        "L'algorithme 'none' indique qu'aucune signature n'est requise, permettant à l'attaquant de modifier le payload sans que le serveur détecte la falsification.",
    },
    {
      question:
        "Pourquoi un JWT avec une durée de vie courte (15 min) améliore-t-il la sécurité ?",
      options: [
        "Il est plus rapide à vérifier",
        "Il limite la fenêtre d'exploitation d'un token volé ou modifié",
        "Il prend moins de place en mémoire",
        "Il empêche le décodage Base64",
      ],
      correctIndex: 1,
      explanation:
        "Un token à courte durée de vie réduit le temps pendant lequel un attaquant peut exploiter un token compromis avant son expiration.",
    },
  ],
};
