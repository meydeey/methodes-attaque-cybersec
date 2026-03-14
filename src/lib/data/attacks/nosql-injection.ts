import { Attack } from "@/lib/types";

export const nosqlInjection: Attack = {
  slug: "nosql-injection",
  name: "NoSQL Injection",
  categoryId: "injection",
  severity: "high",
  summary:
    "L'attaquant injecte des opérateurs NoSQL dans une requête pour contourner l'authentification ou extraire des données.",
  explanation: `L'injection NoSQL est le pendant de l'injection SQL pour les bases de données non-relationnelles comme MongoDB. Au lieu d'injecter du SQL, l'attaquant injecte des objets JSON contenant des opérateurs spéciaux comme \`$gt\`, \`$ne\`, ou \`$regex\` qui modifient la logique de la requête.

Le problème survient quand l'application accepte des objets JSON directement depuis l'utilisateur et les passe tels quels au driver de base de données. Par exemple, au lieu d'envoyer un simple mot de passe, l'attaquant envoie \`{"$ne": ""}\` qui signifie "différent de vide" — ce qui matche tous les documents.

Le résultat est similaire à l'injection SQL : contournement d'authentification, extraction massive de données, et parfois exécution de code arbitraire via des opérateurs comme \`$where\` qui acceptent du JavaScript.`,
  realWorldScenario: `Imagine une API Next.js qui interroge un service MongoDB via un webhook n8n. Si le endpoint accepte le body JSON brut et le transmet directement dans un \`db.collection.find()\`, un attaquant peut envoyer \`{"username": "admin", "password": {"$ne": ""}}\` et se connecter sans connaître le mot de passe. Même si tu utilises Supabase en base principale, un microservice n8n connecté à MongoDB est un vecteur d'attaque.`,
  exploitSteps: [
    "L'attaquant identifie un endpoint d'authentification qui utilise MongoDB",
    'Il envoie un payload JSON avec des opérateurs : {"password": {"$ne": ""}}',
    'Le serveur construit la requête : db.users.find({username: "admin", password: {$ne: ""}})',
    "L'opérateur $ne matche tous les documents dont le mot de passe n'est pas vide",
    "L'attaquant est authentifié comme admin sans connaître le mot de passe",
  ],
  protections: [
    {
      title: "Valider et typer les entrées avec Zod",
      description:
        "Ne jamais passer un objet JSON brut dans une requête. Forcer chaque champ à être une string simple.",
      codeExample: `import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1), // string, pas object
});

// Rejette automatiquement {"password": {"$ne": ""}}
const { username, password } = loginSchema.parse(req.body);`,
      language: "typescript",
    },
    {
      title: "Sanitiser les opérateurs MongoDB",
      description:
        "Supprimer récursivement toute clé commençant par $ dans les entrées utilisateur avant de les passer au driver.",
      codeExample: `function sanitize(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, val]) => [key, sanitize(val)])
  );
}`,
      language: "typescript",
    },
    {
      title: "Utiliser un ORM typé (Mongoose avec strict mode)",
      description:
        "Mongoose en mode strict rejette les champs non définis dans le schéma, ce qui bloque les opérateurs injectés.",
    },
  ],
  animationSteps: [
    { id: "search", label: "Champ de recherche normal", duration: 2000 },
    {
      id: "inject",
      label: "Injection du payload JSON malicieux",
      duration: 2500,
    },
    {
      id: "query",
      label: "La requête MongoDB est transformée",
      duration: 3000,
    },
    {
      id: "result",
      label: "Tous les documents sont retournés",
      duration: 2500,
    },
    { id: "breach", label: "Données sensibles exposées", duration: 2000 },
  ],
  resources: [
    {
      label: "OWASP — NoSQL Injection",
      url: "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection",
    },
    {
      label: "HackTricks — NoSQL Injection",
      url: "https://book.hacktricks.wiki/en/pentesting-web/nosql-injection.html",
    },
  ],
  quiz: [
    {
      question:
        "Quel opérateur MongoDB est couramment utilisé pour contourner l'authentification ?",
      options: ["$eq", "$ne", "$set", "$push"],
      correctIndex: 1,
      explanation:
        "L'opérateur $ne (not equal) avec une chaîne vide matche tous les documents dont le champ n'est pas vide, contournant la vérification du mot de passe.",
    },
    {
      question:
        "Comment empêcher un attaquant d'envoyer des opérateurs MongoDB dans un champ de formulaire ?",
      options: [
        "Utiliser HTTPS",
        "Valider que chaque champ est une string simple avec Zod",
        "Ajouter un CAPTCHA",
        "Limiter la taille du mot de passe",
      ],
      correctIndex: 1,
      explanation:
        'En forçant le type string avec Zod, tout objet JSON contenant des opérateurs comme {$ne: ""} est automatiquement rejeté.',
    },
    {
      question:
        "Quelle est la différence principale entre l'injection SQL et l'injection NoSQL ?",
      options: [
        "L'injection NoSQL est moins dangereuse",
        "L'injection NoSQL utilise des objets JSON au lieu de chaînes SQL",
        "L'injection NoSQL ne fonctionne qu'en JavaScript",
        "L'injection SQL n'existe plus avec les bases modernes",
      ],
      correctIndex: 1,
      explanation:
        "L'injection NoSQL exploite des opérateurs JSON ($ne, $gt, $regex) injectés dans les requêtes, tandis que l'injection SQL manipule des chaînes de requête SQL.",
    },
  ],
};
