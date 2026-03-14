import { Attack } from "@/lib/types";

export const privilegeEscalation: Attack = {
  slug: "privilege-escalation",
  name: "Privilege Escalation",
  categoryId: "access-control",
  severity: "critical",
  summary:
    "L'attaquant modifie sa requête pour s'attribuer des droits administrateur en exploitant un serveur qui accepte tous les champs sans filtrage.",
  explanation: `L'escalade de privilèges se produit quand un utilisateur normal parvient à obtenir des droits supérieurs (admin, modérateur, etc.) en exploitant une faille dans la gestion des rôles. La forme la plus courante est le mass assignment : le serveur accepte et applique tous les champs envoyés par le client sans filtrer ceux qui sont sensibles.

Par exemple, un endpoint \`PUT /api/profile\` qui permet de mettre à jour son nom. Si le serveur fait un spread naïf (\`...req.body\`) et l'enregistre en base, l'attaquant peut ajouter \`"role": "admin"\` ou \`"isAdmin": true\` dans le body de sa requête. Le serveur ne filtre pas et le champ est écrit en base.

C'est une erreur de conception fondamentale : faire confiance aux données envoyées par le client. Le serveur doit toujours définir explicitement quels champs peuvent être modifiés par l'utilisateur, jamais l'inverse.`,
  realWorldScenario: `Ton API Next.js a un endpoint \`PUT /api/profile\` qui met à jour le profil via Supabase. Si le handler fait \`supabase.from('profiles').update(req.body).eq('id', user.id)\`, l'attaquant peut envoyer \`{"name": "Bob", "role": "admin"}\` et le champ \`role\` est écrit en base. Pareil si un webhook n8n reçoit un body JSON et fait un UPDATE sans filtrer les colonnes — l'attaquant peut modifier n'importe quel champ de la table.`,
  exploitSteps: [
    'L\'attaquant envoie une requête normale : PUT /profile {name: "Bob"}',
    'Il intercepte la requête et ajoute un champ : {name: "Bob", isAdmin: true}',
    "Le serveur fait un spread naïf : ...req.body sans filtrer les champs",
    "Le champ isAdmin est écrit en base de données",
    "L'attaquant a maintenant les droits administrateur",
  ],
  protections: [
    {
      title: "Whitelist des champs modifiables avec Zod",
      description:
        "Définir explicitement les champs autorisés. Tout champ non listé est ignoré automatiquement.",
      codeExample: `import { z } from 'zod';

// Seuls ces champs sont acceptés — "role" ou "isAdmin" sont ignorés
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
});

const safeData = updateProfileSchema.parse(req.body);
await supabase.from('profiles').update(safeData).eq('id', user.id);`,
      language: "typescript",
    },
    {
      title: "Ne jamais spread le body dans un UPDATE",
      description:
        "Extraire uniquement les champs autorisés au lieu de passer l'objet entier. Le destructuring est ton ami.",
      codeExample: `// MAL — Spread naïf, mass assignment possible
await supabase.from('profiles').update(req.body).eq('id', user.id);

// BIEN — Extraction explicite des champs
const { name, avatar_url } = req.body;
await supabase.from('profiles').update({ name, avatar_url }).eq('id', user.id);`,
      language: "typescript",
    },
    {
      title: "Protéger les colonnes sensibles avec des policies RLS",
      description:
        "Configurer des policies Supabase qui empêchent un utilisateur de modifier certaines colonnes comme role ou is_admin, même si le code applicatif a un bug.",
    },
  ],
  animationSteps: [
    {
      id: "normal",
      label: 'Requête normale : PUT /profile {name: "Bob"}',
      duration: 2000,
    },
    { id: "tamper", label: "L'attaquant ajoute isAdmin: true", duration: 2500 },
    {
      id: "spread",
      label: "Le serveur spread tout : ...req.body",
      duration: 2500,
    },
    { id: "write", label: "isAdmin: true écrit en base", duration: 2500 },
    { id: "crown", label: "Droits admin obtenus", duration: 2000 },
  ],
  resources: [
    {
      label: "OWASP — Mass Assignment",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html",
    },
    {
      label: "CWE-269 — Improper Privilege Management",
      url: "https://cwe.mitre.org/data/definitions/269.html",
    },
  ],
  quiz: [
    {
      question:
        "Quelle pratique de code rend possible l'escalade de privilèges via mass assignment ?",
      options: [
        "Utiliser TypeScript strict",
        "Faire un spread naïf du body (...req.body) dans un UPDATE",
        "Valider les entrées avec Zod",
        "Utiliser des UUIDs",
      ],
      correctIndex: 1,
      explanation:
        "Le spread naïf passe tous les champs du body à la base, y compris des champs sensibles comme 'role' ou 'isAdmin' ajoutés par l'attaquant.",
    },
    {
      question: "Comment Zod protège-t-il contre l'escalade de privilèges ?",
      options: [
        "Il chiffre les données envoyées",
        "Il définit une whitelist de champs autorisés et ignore les autres",
        "Il bloque toutes les requêtes PUT",
        "Il ajoute automatiquement un token CSRF",
      ],
      correctIndex: 1,
      explanation:
        "Zod parse uniquement les champs définis dans le schéma. Tout champ non listé (comme 'role' ou 'isAdmin') est automatiquement ignoré.",
    },
    {
      question:
        'Un attaquant envoie {name: "Bob", isAdmin: true}. Quelle méthode d\'extraction est sécurisée ?',
      options: [
        "const data = req.body;",
        "const data = {...req.body};",
        "const { name } = req.body;",
        "const data = JSON.parse(req.body);",
      ],
      correctIndex: 2,
      explanation:
        "Le destructuring explicite (const { name } = req.body) extrait uniquement les champs nommés, ignorant 'isAdmin' et tout autre champ non prévu.",
    },
  ],
};
