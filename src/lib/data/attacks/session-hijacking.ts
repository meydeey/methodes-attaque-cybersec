import { Attack } from "@/lib/types";

export const sessionHijacking: Attack = {
  slug: "session-hijacking",
  name: "Session Hijacking",
  categoryId: "auth",
  severity: "high",
  summary:
    "L'attaquant vole le cookie de session d'un utilisateur pour usurper son identité sans connaître ses identifiants.",
  explanation: `Le session hijacking consiste à voler ou intercepter le token de session (cookie) d'un utilisateur légitime pour prendre le contrôle de son compte. Le serveur ne voit aucune différence entre l'utilisateur réel et l'attaquant — le cookie est la seule preuve d'identité.

L'interception peut se faire de plusieurs manières : sniffing sur un réseau Wi-Fi public non chiffré, attaque XSS qui exfiltre le cookie via JavaScript, ou accès physique à la machine de la victime. Une fois le cookie récupéré, l'attaquant le colle dans son propre navigateur et il est instantanément connecté.

C'est particulièrement dangereux car l'attaque est silencieuse — la victime reste connectée normalement et ne voit rien. L'attaquant peut agir en parallèle avec les mêmes droits, modifier des données, ou escalader ses privilèges.`,
  realWorldScenario: `Ton app Next.js utilise Supabase Auth qui stocke un JWT dans un cookie. Si un utilisateur se connecte depuis un café avec un Wi-Fi public sans HTTPS, un attaquant sur le même réseau peut intercepter le cookie avec un simple outil de sniffing. Il colle le JWT dans son navigateur et accède au dashboard Supabase avec les mêmes droits. Si ton workflow n8n déclenche des actions basées sur l'identité de l'utilisateur, l'attaquant peut les exploiter.`,
  exploitSteps: [
    "L'utilisateur A se connecte et reçoit un cookie de session",
    "L'attaquant et la victime sont sur le même réseau Wi-Fi public",
    "L'attaquant intercepte le cookie de session via sniffing réseau",
    "Il injecte le cookie volé dans son propre navigateur",
    "L'attaquant est maintenant connecté comme l'utilisateur A",
  ],
  protections: [
    {
      title: "Forcer HTTPS partout (HSTS)",
      description:
        "Chiffrer tout le trafic empêche le sniffing des cookies en transit. Activer le header Strict-Transport-Security.",
      codeExample: `// next.config.js — Headers de sécurité
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ],
  }];
}`,
      language: "javascript",
    },
    {
      title: "Attributs de cookie sécurisés",
      description:
        "Configurer les cookies avec HttpOnly (pas d'accès JS), Secure (HTTPS only), et SameSite=Strict (pas d'envoi cross-origin).",
      codeExample: `// Configurer le cookie de session
res.setHeader('Set-Cookie', [
  \`session=\${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600\`,
]);`,
      language: "typescript",
    },
    {
      title: "Rotation des tokens et détection d'anomalies",
      description:
        "Régénérer le token de session après chaque action sensible. Détecter les connexions simultanées depuis des IP ou user-agents différents.",
    },
  ],
  animationSteps: [
    {
      id: "connect",
      label: "L'utilisateur A se connecte (cookie reçu)",
      duration: 2000,
    },
    { id: "wifi", label: "Réseau Wi-Fi partagé", duration: 2000 },
    {
      id: "intercept",
      label: "L'attaquant intercepte le cookie",
      duration: 2500,
    },
    {
      id: "paste",
      label: "Cookie injecté dans le navigateur de l'attaquant",
      duration: 2500,
    },
    { id: "hijacked", label: "Connecté comme l'utilisateur A", duration: 2000 },
  ],
  resources: [
    {
      label: "OWASP — Session Hijacking",
      url: "https://owasp.org/www-community/attacks/Session_hijacking_attack",
    },
    {
      label: "MDN — Set-Cookie (HttpOnly, Secure, SameSite)",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie",
    },
  ],
  quiz: [
    {
      question:
        "Quel attribut de cookie empêche JavaScript d'accéder au cookie de session ?",
      options: ["Secure", "SameSite", "HttpOnly", "Path"],
      correctIndex: 2,
      explanation:
        "L'attribut HttpOnly rend le cookie inaccessible via document.cookie en JavaScript, bloquant l'exfiltration par XSS.",
    },
    {
      question:
        "Sur quel type de réseau le sniffing de cookies est-il le plus facile ?",
      options: [
        "Un réseau 5G",
        "Un Wi-Fi public sans chiffrement",
        "Un VPN d'entreprise",
        "Un réseau fibre optique domestique",
      ],
      correctIndex: 1,
      explanation:
        "Sur un Wi-Fi public non chiffré, le trafic HTTP est visible par tous les appareils connectés, facilitant l'interception des cookies.",
    },
    {
      question:
        "Quel header HTTP force le navigateur à toujours utiliser HTTPS ?",
      options: [
        "X-Frame-Options",
        "Content-Security-Policy",
        "Strict-Transport-Security (HSTS)",
        "X-Content-Type-Options",
      ],
      correctIndex: 2,
      explanation:
        "Le header HSTS (Strict-Transport-Security) indique au navigateur de toujours utiliser HTTPS, empêchant l'interception du trafic en clair.",
    },
  ],
};
