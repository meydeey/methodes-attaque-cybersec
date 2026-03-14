import { Attack } from "@/lib/types";

export const ssrf: Attack = {
  slug: "ssrf",
  name: "SSRF (Server-Side Request Forgery)",
  categoryId: "api-infra",
  severity: "critical",
  summary:
    "L'attaquant force le serveur à effectuer des requêtes HTTP vers des ressources internes normalement inaccessibles.",
  explanation: `Le Server-Side Request Forgery (SSRF) exploite une fonctionnalité du serveur qui effectue des requêtes HTTP à partir d'une URL fournie par l'utilisateur. Au lieu de fournir une URL légitime, l'attaquant envoie une URL pointant vers des ressources internes — comme le service de métadonnées cloud, des bases de données internes ou des API privées.

Le serveur, qui a accès au réseau interne, exécute la requête et retourne le résultat à l'attaquant. C'est comme donner les clés de ton réseau interne à un inconnu : il peut scanner des ports, lire des fichiers de configuration, récupérer des credentials AWS/GCP stockés dans le service de métadonnées.

Cette attaque est classée critique car elle permet souvent une escalade massive : accès aux credentials cloud, pivoting vers d'autres services internes, et potentiellement la compromission totale de l'infrastructure.`,
  realWorldScenario: `Dans ton app Next.js, si tu as une fonctionnalité "importer une image par URL" qui utilise \`fetch(userProvidedUrl)\` côté serveur (API Route ou Server Action), un attaquant peut entrer \`http://169.254.169.254/latest/meta-data/\` pour récupérer les credentials AWS/GCP du serveur. Même un webhook n8n qui fetch une URL externe sans validation est vulnérable — l'attaquant peut cibler les services Supabase internes via leur IP privée.`,
  exploitSteps: [
    "L'attaquant identifie une fonctionnalité qui fetch une URL côté serveur (import d'image, preview de lien)",
    "Au lieu d'une URL normale, il entre http://169.254.169.254/latest/meta-data/iam/security-credentials/",
    "Le serveur effectue la requête vers le service de métadonnées cloud (accessible uniquement en interne)",
    "Les credentials IAM (AccessKeyId, SecretAccessKey) sont retournés au serveur",
    "L'attaquant récupère les credentials et prend le contrôle de l'infrastructure cloud",
  ],
  protections: [
    {
      title: "Whitelist d'URLs autorisées",
      description:
        "Valider et filtrer les URLs côté serveur. Bloquer les IP privées (10.x, 172.16.x, 192.168.x), localhost, et les adresses de métadonnées cloud (169.254.169.254).",
      codeExample: `// lib/url-validator.ts
import { URL } from "url";
import { isIP } from "net";

const BLOCKED_HOSTS = [
  "169.254.169.254", // AWS/GCP metadata
  "metadata.google.internal",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
];

export function isUrlSafe(input: string): boolean {
  try {
    const url = new URL(input);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (BLOCKED_HOSTS.includes(url.hostname)) return false;
    // Bloquer les IP privées
    if (url.hostname.startsWith("10.")) return false;
    if (url.hostname.startsWith("192.168.")) return false;
    if (url.hostname.startsWith("172.")) return false;
    return true;
  } catch {
    return false;
  }
}`,
      language: "typescript",
    },
    {
      title: "Réseau isolé et IMDSv2",
      description:
        "Activer IMDSv2 sur AWS (requiert un token pour accéder aux métadonnées). Isoler les services dans des sous-réseaux séparés avec des Security Groups stricts.",
      codeExample: `# Activer IMDSv2 sur une instance EC2
aws ec2 modify-instance-metadata-options \\
  --instance-id i-1234567890abcdef \\
  --http-tokens required \\
  --http-endpoint enabled`,
      language: "bash",
    },
  ],
  animationSteps: [
    {
      id: "feature",
      label: "Fonctionnalité « Importer une image par URL »",
      duration: 2000,
    },
    {
      id: "malicious-url",
      label: "L'attaquant entre l'URL du service de métadonnées cloud",
      duration: 2500,
    },
    {
      id: "server-fetch",
      label: "Le serveur fetch l'URL interne (accès réseau privilégié)",
      duration: 2500,
    },
    {
      id: "metadata",
      label: "Les credentials cloud sont exposés",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — SSRF",
      url: "https://owasp.org/www-community/attacks/Server_Side_Request_Forgery",
    },
    {
      label: "PortSwigger — SSRF",
      url: "https://portswigger.net/web-security/ssrf",
    },
  ],
  quiz: [
    {
      question:
        "Quelle adresse IP est ciblée par un SSRF pour récupérer les credentials cloud AWS/GCP ?",
      options: ["127.0.0.1", "192.168.1.1", "169.254.169.254", "10.0.0.1"],
      correctIndex: 2,
      explanation:
        "L'adresse 169.254.169.254 est le service de métadonnées des providers cloud (AWS, GCP). Accessible uniquement depuis le réseau interne, il expose les credentials IAM.",
    },
    {
      question:
        "Quelle fonctionnalité applicative est la plus souvent exploitée pour un SSRF ?",
      options: [
        "Un formulaire de login",
        "Une fonctionnalité d'import d'image par URL",
        "Un bouton de partage sur les réseaux sociaux",
        "Un système de pagination",
      ],
      correctIndex: 1,
      explanation:
        "Les fonctionnalités qui fetchent une URL fournie par l'utilisateur (import d'image, preview de lien) sont le vecteur principal du SSRF car le serveur effectue la requête.",
    },
    {
      question: "Quelle est la première mesure de protection contre le SSRF ?",
      options: [
        "Ajouter un CAPTCHA",
        "Chiffrer les URLs",
        "Valider et filtrer les URLs en bloquant les IP privées et localhost",
        "Limiter la taille de la réponse",
      ],
      correctIndex: 2,
      explanation:
        "Bloquer les IP privées (10.x, 172.16.x, 192.168.x), localhost et les adresses de métadonnées cloud empêche le serveur d'accéder aux ressources internes.",
    },
  ],
};
