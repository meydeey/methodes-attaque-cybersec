import { Attack } from "@/lib/types";

export const rateLimitBypass: Attack = {
  slug: "rate-limit-bypass",
  name: "API Rate Limiting Bypass",
  categoryId: "api-infra",
  severity: "medium",
  summary:
    "L'attaquant contourne les limites de débit d'une API en manipulant ses identifiants de requête (IP, headers).",
  explanation: `Le rate limiting est un mécanisme de défense qui limite le nombre de requêtes qu'un client peut envoyer dans un intervalle de temps. Mais si l'implémentation se base uniquement sur l'adresse IP ou un header facilement modifiable, un attaquant peut contourner cette protection.

Les techniques courantes incluent : la rotation d'IP via des proxies, la modification de headers comme \`X-Forwarded-For\` ou \`X-Real-IP\` pour simuler différentes adresses, l'utilisation de variations d'URL (paramètres inutiles, casse différente), ou encore le ralentissement intelligent des requêtes juste en dessous du seuil.

Les conséquences sont multiples : brute-force de mots de passe, scraping massif de données, abus d'API coûteuses (IA, SMS), ou déni de service applicatif par saturation des ressources backend.`,
  realWorldScenario: `Dans ton app Next.js, si tu utilises un rate limiter basé sur \`X-Forwarded-For\` dans tes API Routes (ce que font beaucoup de packages comme \`next-rate-limit\`), un attaquant peut simplement changer ce header à chaque requête. Il peut ainsi brute-forcer ton endpoint \`/api/auth/login\` Supabase, ou abuser un workflow n8n exposé via webhook sans être bloqué.`,
  exploitSteps: [
    "L'attaquant identifie un endpoint protégé par rate limiting (login, API, webhook)",
    "Il envoie des requêtes jusqu'à être bloqué (429 Too Many Requests)",
    "Il analyse comment l'API identifie les clients (IP, headers, tokens)",
    "Il contourne en rotant les IPs ou en falsifiant X-Forwarded-For à chaque requête",
    "Les requêtes passent à nouveau — le brute-force ou l'abus continue sans limite",
  ],
  protections: [
    {
      title: "Rate limiting multi-critères",
      description:
        "Ne jamais se baser uniquement sur l'IP. Combiner IP + User-Agent + fingerprint de session + token d'authentification pour identifier un client.",
      codeExample: `// middleware.ts — Rate limiting robuste
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export async function middleware(request: Request) {
  // Combiner plusieurs identifiants
  const ip = request.headers.get("x-real-ip") ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const identifier = \`\${ip}:\${ua.slice(0, 50)}\`;

  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
}`,
      language: "typescript",
    },
    {
      title: "Ignorer X-Forwarded-For non fiable",
      description:
        "Ne jamais faire confiance à X-Forwarded-For envoyé par le client. Utiliser uniquement l'IP réelle du socket TCP, ou configurer correctement le nombre de proxies de confiance.",
      codeExample: `// next.config.ts — Configurer les proxies de confiance
// Utiliser l'IP réelle, pas le header X-Forwarded-For
// En production derrière un reverse proxy connu :
const config = {
  // Nombre de proxies de confiance (CDN, load balancer)
  // Prendre la Nième IP depuis la fin de X-Forwarded-For
  experimental: {
    trustHostHeader: false,
  },
};`,
      language: "typescript",
    },
  ],
  animationSteps: [
    {
      id: "rate-wall",
      label: "L'API est protégée par un rate limiter",
      duration: 2000,
    },
    {
      id: "blocked",
      label: "L'attaquant est bloqué après trop de requêtes",
      duration: 2000,
    },
    {
      id: "bypass",
      label: "Il change d'IP et falsifie les headers",
      duration: 2500,
    },
    {
      id: "flood",
      label: "Les requêtes passent à nouveau sans restriction",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — Rate Limiting",
      url: "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/12-Testing_for_Client-side_Resource_Manipulation",
    },
    {
      label: "Upstash — Rate Limiting Next.js",
      url: "https://upstash.com/blog/nextjs-rate-limiting",
    },
  ],
  quiz: [
    {
      question:
        "Quel header HTTP est souvent falsifié pour contourner un rate limiter basé sur l'IP ?",
      options: [
        "Content-Type",
        "Authorization",
        "X-Forwarded-For",
        "Accept-Language",
      ],
      correctIndex: 2,
      explanation:
        "X-Forwarded-For est un header qui indique l'IP d'origine. Un attaquant peut le modifier à chaque requête pour simuler des IP différentes et contourner le rate limiting.",
    },
    {
      question:
        "Pourquoi ne faut-il pas se baser uniquement sur l'IP pour le rate limiting ?",
      options: [
        "Les IP changent tous les jours",
        "L'attaquant peut utiliser des proxies rotatifs ou falsifier X-Forwarded-For",
        "Les IP ne sont pas fiables sur mobile",
        "Le RGPD interdit la collecte d'IP",
      ],
      correctIndex: 1,
      explanation:
        "Un attaquant peut changer d'IP via des proxies rotatifs ou falsifier le header X-Forwarded-For, rendant le rate limiting par IP seul inefficace.",
    },
  ],
};
