import { Attack } from "@/lib/types";

export const credentialStuffing: Attack = {
  slug: "credential-stuffing",
  name: "Credential Stuffing",
  categoryId: "auth",
  severity: "high",
  summary:
    "L'attaquant teste massivement des identifiants volés lors de fuites de données sur d'autres sites pour trouver des comptes réutilisant les mêmes mots de passe.",
  explanation: `Le credential stuffing exploite un comportement humain universel : la réutilisation des mots de passe. Quand une base de données est piratée (LinkedIn, Adobe, etc.), les couples email/mot de passe se retrouvent en vente sur le dark web. L'attaquant achète ces listes et les teste automatiquement sur d'autres services.

Contrairement au brute force qui essaie des combinaisons aléatoires, le credential stuffing utilise de vrais identifiants déjà compromis. Le taux de succès est faible (1-3%) mais sur des millions de tentatives, ça représente des milliers de comptes piratés.

L'attaque est difficile à détecter car chaque tentative utilise un couple email/mot de passe différent — ce n'est pas le même compte attaqué en boucle. Les bots utilisent des proxies rotatifs et des délais aléatoires pour imiter un comportement humain.`,
  realWorldScenario: `Ton app Next.js avec Supabase Auth est une cible idéale si tu n'as pas de rate limiting. Un attaquant utilise un bot qui teste 100 000 couples email/mot de passe contre ton endpoint \`/auth/v1/token\`. Supabase a un rate limiting par défaut, mais si tu as un workflow n8n qui expose un endpoint d'authentification personnalisé sans protection, l'attaquant peut contourner les limites de Supabase et compromettre les comptes qui réutilisent leurs mots de passe.`,
  exploitSteps: [
    "L'attaquant achète une liste de millions d'identifiants volés sur le dark web",
    "Un bot envoie des requêtes de connexion rapides avec chaque paire email/mot de passe",
    "La majorité des tentatives échouent (identifiants non réutilisés)",
    "Quelques comptes répondent avec succès (mêmes identifiants réutilisés)",
    "L'attaquant accède aux comptes compromis et exfiltre les données",
  ],
  protections: [
    {
      title: "Rate limiting et détection de bots",
      description:
        "Limiter le nombre de tentatives de connexion par IP et par compte. Ajouter un CAPTCHA après plusieurs échecs.",
      codeExample: `// Middleware Next.js — Rate limiting simple
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 tentatives / minute
});

// Dans le handler d'auth
const { success } = await ratelimit.limit(ip);
if (!success) return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 });`,
      language: "typescript",
    },
    {
      title: "Authentification multi-facteurs (MFA)",
      description:
        "Même si le mot de passe est correct, le MFA bloque l'accès sans le second facteur. Supabase supporte le TOTP nativement.",
      codeExample: `// Activer MFA avec Supabase
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Authenticator App',
});`,
      language: "typescript",
    },
    {
      title: "Vérification des mots de passe compromis (HaveIBeenPwned)",
      description:
        "Vérifier à l'inscription et au changement de mot de passe si le mot de passe a déjà fuité dans une brèche connue.",
    },
  ],
  animationSteps: [
    { id: "list", label: "Liste d'identifiants volés chargée", duration: 2000 },
    {
      id: "fire",
      label: "Le bot envoie les requêtes en rafale",
      duration: 3000,
    },
    {
      id: "fail",
      label: "La majorité échoue (identifiants invalides)",
      duration: 2500,
    },
    { id: "success", label: "Quelques comptes matchent", duration: 2500 },
    {
      id: "breach",
      label: "Comptes compromis, données exfiltrées",
      duration: 2000,
    },
  ],
  resources: [
    {
      label: "OWASP — Credential Stuffing",
      url: "https://owasp.org/www-community/attacks/Credential_stuffing",
    },
    {
      label: "Have I Been Pwned — API",
      url: "https://haveibeenpwned.com/API/v3",
    },
  ],
  quiz: [
    {
      question:
        "Quelle est la différence entre le credential stuffing et le brute force ?",
      options: [
        "Le brute force est plus rapide",
        "Le credential stuffing utilise des identifiants déjà volés lors de fuites",
        "Le credential stuffing ne cible qu'un seul compte",
        "Il n'y a aucune différence",
      ],
      correctIndex: 1,
      explanation:
        "Le credential stuffing teste des couples email/mot de passe réels provenant de fuites de données, tandis que le brute force essaie des combinaisons aléatoires.",
    },
    {
      question:
        "Quelle protection reste efficace même si le mot de passe de l'utilisateur a fuité ?",
      options: [
        "Un mot de passe plus long",
        "Le rate limiting",
        "L'authentification multi-facteurs (MFA)",
        "Le CAPTCHA",
      ],
      correctIndex: 2,
      explanation:
        "Le MFA exige un second facteur (code TOTP, SMS) en plus du mot de passe. Même avec le bon mot de passe, l'attaquant ne peut pas se connecter sans ce second facteur.",
    },
    {
      question: "Pourquoi le credential stuffing est-il difficile à détecter ?",
      options: [
        "Les requêtes sont chiffrées",
        "Chaque tentative utilise un couple email/mot de passe différent",
        "L'attaquant utilise un VPN",
        "Les logs ne sont pas activés",
      ],
      correctIndex: 1,
      explanation:
        "Contrairement au brute force qui martèle un seul compte, le credential stuffing teste des identifiants différents à chaque requête, ce qui ressemble à du trafic normal.",
    },
  ],
};
