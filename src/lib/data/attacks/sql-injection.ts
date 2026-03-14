import { Attack } from "@/lib/types";

export const sqlInjection: Attack = {
  slug: "sql-injection",
  name: "SQL Injection",
  categoryId: "injection",
  severity: "critical",
  summary:
    "L'attaquant injecte du SQL dans un champ de formulaire pour lire ou modifier la base de données.",
  explanation: `L'injection SQL est l'une des vulnérabilités les plus anciennes et les plus dangereuses du web. Elle se produit quand une application construit des requêtes SQL en concaténant directement les entrées utilisateur, sans les assainir.

Concrètement, au lieu de taper un vrai nom d'utilisateur dans un formulaire de login, l'attaquant tape un bout de code SQL comme \`' OR 1=1 --\`. Ce texte est injecté directement dans la requête SQL du serveur, ce qui modifie complètement sa logique.

Le résultat : l'attaquant peut contourner l'authentification, lire toute la base de données, modifier ou supprimer des données, et parfois même exécuter des commandes système sur le serveur.`,
  realWorldScenario: `Imagine ton app Next.js qui utilise Supabase. Si tu construis une requête RPC avec des paramètres non-sanitisés, ou si tu utilises \`.rpc('search_users', { query: userInput })\` où la fonction PostgreSQL concatène le paramètre directement dans du SQL dynamique, un attaquant peut injecter du SQL via ton formulaire de recherche et extraire toutes les données de ta base.`,
  exploitSteps: [
    "L'attaquant identifie un formulaire de login ou de recherche",
    "Il tape `' OR 1=1 --` dans le champ username",
    "Le serveur construit la requête : SELECT * FROM users WHERE username = '' OR 1=1 --'",
    "La condition OR 1=1 est toujours vraie → tous les utilisateurs sont retournés",
    "L'attaquant est connecté comme le premier utilisateur (souvent l'admin)",
  ],
  protections: [
    {
      title: "Requêtes paramétrées (Prepared Statements)",
      description:
        "Ne jamais concaténer les entrées utilisateur dans du SQL. Utiliser des placeholders.",
      codeExample: `// MAL — Concaténation directe
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// BIEN — Requête paramétrée
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);`,
      language: "typescript",
    },
    {
      title: "Utiliser un ORM ou Query Builder",
      description:
        "Prisma, Drizzle, ou le client Supabase gèrent automatiquement l'échappement des paramètres.",
    },
    {
      title: "Validation des entrées",
      description:
        "Valider le type et le format des entrées côté serveur avec Zod avant toute requête.",
      codeExample: `import { z } from 'zod';

const schema = z.object({
  userId: z.string().uuid(),
});

const { userId } = schema.parse(req.body);`,
      language: "typescript",
    },
  ],
  animationSteps: [
    { id: "form", label: "Formulaire de login normal", duration: 2000 },
    { id: "inject", label: "L'attaquant tape ' OR 1=1 --", duration: 2500 },
    {
      id: "query",
      label: "La requête SQL se construit avec le code malicieux",
      duration: 3000,
    },
    {
      id: "result",
      label: "La DB retourne TOUS les utilisateurs",
      duration: 2500,
    },
    { id: "access", label: "Accès admin obtenu", duration: 2000 },
  ],
  resources: [
    {
      label: "OWASP — SQL Injection",
      url: "https://owasp.org/www-community/attacks/SQL_Injection",
    },
    {
      label: "Supabase — Security Best Practices",
      url: "https://supabase.com/docs/guides/database/security",
    },
  ],
  quiz: [
    {
      question: "Quelle est la meilleure protection contre l'injection SQL ?",
      options: [
        "Échapper les caractères spéciaux",
        "Utiliser des requêtes paramétrées (prepared statements)",
        "Valider la longueur des champs",
        "Utiliser HTTPS",
      ],
      correctIndex: 1,
      explanation:
        "Les prepared statements séparent le code SQL des données utilisateur, rendant l'injection impossible.",
    },
    {
      question: "Que fait la payload ' OR 1=1 -- dans un formulaire de login ?",
      options: [
        "Elle supprime la base de données",
        "Elle rend la condition WHERE toujours vraie",
        "Elle chiffre les données",
        "Elle désactive le firewall",
      ],
      correctIndex: 1,
      explanation:
        "OR 1=1 est toujours vrai, donc la requête retourne tous les utilisateurs. Le -- commente le reste de la requête.",
    },
    {
      question:
        "Quel outil Supabase protège nativement contre l'injection SQL ?",
      options: [
        "Supabase Storage",
        "Supabase Realtime",
        "Le client Supabase (query builder)",
        "Supabase Edge Functions",
      ],
      correctIndex: 2,
      explanation:
        "Le client Supabase utilise un query builder qui paramétrise automatiquement les requêtes, empêchant l'injection SQL.",
    },
  ],
};
