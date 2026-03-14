import { Attack } from "@/lib/types";

export const securityMisconfig: Attack = {
  slug: "security-misconfig",
  name: "Security Misconfiguration",
  categoryId: "data-config",
  severity: "high",
  summary:
    "Des configurations serveur par défaut ou mal ajustées ouvrent des portes d'entrée aux attaquants.",
  explanation: `La mauvaise configuration de sécurité est l'une des vulnérabilités les plus fréquentes selon le Top 10 OWASP. Elle se produit quand un serveur, un framework, ou un service cloud est déployé avec des paramètres par défaut non sécurisés : CORS ouvert à tous les domaines, mode debug activé en production, headers de sécurité manquants.

Chaque paramètre mal configuré est une porte ouverte. CORS: * permet à n'importe quel site d'appeler tes API avec les cookies de tes utilisateurs. Le mode debug expose les stack traces complètes avec les chemins de fichiers, les variables d'environnement, et la structure interne de ton app. Les headers manquants (CSP, HSTS, X-Content-Type-Options) laissent le navigateur vulnérable aux attaques par injection.

Le problème est systémique : ces configurations sont souvent "temporaires" pendant le développement mais oubliées au déploiement. Sans audit régulier, elles s'accumulent et créent une surface d'attaque large et facile à exploiter.`,
  realWorldScenario: `Ton app Next.js est en production avec CORS: * sur tes API Routes, le mode debug de Next.js activé (NEXT_PUBLIC_DEBUG=true), et aucun header de sécurité configuré. Un attaquant crée un site malveillant qui appelle tes API Supabase via le navigateur de tes utilisateurs (les cookies sont envoyés automatiquement grâce au CORS permissif). Les erreurs debug lui révèlent la structure de ta DB, et l'absence de CSP lui permet d'injecter du JavaScript arbitraire.`,
  exploitSteps: [
    "L'attaquant scanne le serveur pour détecter les configurations par défaut",
    "CORS: * permet les requêtes cross-origin avec credentials",
    "Le mode debug expose les stack traces et la structure interne",
    "Les headers de sécurité manquants facilitent les injections",
    "L'attaquant exploite chaque faille de configuration pour pénétrer le système",
  ],
  protections: [
    {
      title: "Configurer les headers de sécurité dans Next.js",
      description:
        "Ajouter systématiquement les headers de sécurité recommandés dans la config Next.js.",
      codeExample: `// next.config.ts — Headers de sécurité complets
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  },
];

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};`,
      language: "typescript",
    },
    {
      title: "Restreindre CORS aux domaines autorisés",
      description:
        "Ne jamais utiliser CORS: * en production. Lister explicitement les origines autorisées.",
      codeExample: `// app/api/data/route.ts — CORS restrictif
const ALLOWED_ORIGINS = [
  'https://monapp.com',
  'https://admin.monapp.com',
];

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return NextResponse.json({ data }, {
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}`,
      language: "typescript",
    },
    {
      title: "Désactiver le debug en production",
      description:
        "S'assurer que le mode debug est désactivé et que les erreurs ne révèlent pas de détails internes.",
      codeExample: `// Middleware de gestion d'erreurs — Ne jamais exposer les détails
export function middleware(request: NextRequest) {
  try {
    return NextResponse.next();
  } catch (error) {
    // Log l'erreur côté serveur uniquement
    console.error('Internal error:', error);

    // Retourner un message générique au client
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 },
    );
  }
}`,
      language: "typescript",
    },
  ],
  animationSteps: [
    {
      id: "server",
      label: "Serveur avec checklist de configuration",
      duration: 2500,
    },
    { id: "cors", label: "CORS: * — Porte ouverte", duration: 2500 },
    { id: "debug", label: "Debug: ON — Porte ouverte", duration: 2500 },
    {
      id: "headers",
      label: "Headers: manquants — Porte ouverte",
      duration: 2500,
    },
    {
      id: "breach",
      label: "L'attaquant entre par chaque faille",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — Security Misconfiguration",
      url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
    },
    {
      label: "Next.js — Security Headers",
      url: "https://nextjs.org/docs/app/api-reference/next-config-js/headers",
    },
  ],
  quiz: [
    {
      question:
        "Quel risque pose la configuration CORS: * (Access-Control-Allow-Origin: *) en production ?",
      options: [
        "Les images ne se chargent pas",
        "N'importe quel site peut appeler vos API avec les cookies de vos utilisateurs",
        "Le site est plus lent",
        "Les polices de caractères ne s'affichent pas",
      ],
      correctIndex: 1,
      explanation:
        "CORS: * autorise tout domaine à effectuer des requêtes vers vos API. Combiné aux cookies envoyés automatiquement, un site malveillant peut agir au nom de vos utilisateurs.",
    },
    {
      question: "Pourquoi le mode debug est-il dangereux en production ?",
      options: [
        "Il ralentit le serveur",
        "Il expose les stack traces, chemins de fichiers et variables d'environnement",
        "Il consomme trop de mémoire",
        "Il désactive le cache",
      ],
      correctIndex: 1,
      explanation:
        "Le mode debug révèle la structure interne de l'application (chemins, variables, dépendances), donnant à l'attaquant des informations précieuses pour exploiter d'autres failles.",
    },
    {
      question:
        "Quel header de sécurité empêche le navigateur de deviner le type MIME d'une réponse ?",
      options: [
        "X-Frame-Options",
        "Referrer-Policy",
        "X-Content-Type-Options: nosniff",
        "X-XSS-Protection",
      ],
      correctIndex: 2,
      explanation:
        "X-Content-Type-Options: nosniff empêche le navigateur d'interpréter un fichier avec un type MIME différent de celui déclaré, bloquant certaines attaques par injection de contenu.",
    },
  ],
};
