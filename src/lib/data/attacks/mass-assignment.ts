import { Attack } from "@/lib/types";

export const massAssignment: Attack = {
  slug: "mass-assignment",
  name: "Mass Assignment",
  categoryId: "api-infra",
  severity: "high",
  summary:
    "L'attaquant ajoute des champs non prévus dans une requête pour modifier des propriétés sensibles (rôle, solde, permissions).",
  explanation: `Le Mass Assignment (ou "affectation en masse") exploite les API qui acceptent aveuglément tous les champs envoyés par le client et les utilisent pour mettre à jour un objet en base de données. Si le serveur ne filtre pas les champs autorisés, l'attaquant peut ajouter des propriétés qui ne sont pas dans le formulaire mais qui existent dans le modèle de données.

Par exemple, un formulaire de profil ne montre que "nom" et "email", mais le modèle utilisateur en base contient aussi "role" et "balance". L'attaquant ouvre les DevTools, modifie le body de la requête pour ajouter \`"role": "admin"\` ou \`"balance": 999999\`, et le serveur met à jour ces champs sans broncher.

C'est un problème fréquent avec les ORM et les frameworks qui facilitent le binding automatique des requêtes vers les modèles — pratique pour le développeur, dangereux si aucun filtrage n'est en place.`,
  realWorldScenario: `Dans ton app Next.js avec Supabase, si ton API Route \`/api/profile\` fait un \`supabase.from('users').update(req.body)\` directement avec le body de la requête, un attaquant peut ajouter \`"role": "admin"\` ou \`"is_verified": true\` dans le body. Supabase exécutera l'update sur tous les champs fournis. Même avec les RLS (Row Level Security), si la policy autorise l'utilisateur à modifier sa propre ligne, tous les champs de cette ligne sont modifiables.`,
  exploitSteps: [
    "L'attaquant utilise normalement le formulaire de profil (nom, email)",
    "Il ouvre les DevTools et intercepte la requête POST/PUT",
    "Il ajoute des champs supplémentaires au body : role, balance, is_admin",
    "Le serveur accepte le body complet et met à jour tous les champs en base",
    "L'attaquant a maintenant le rôle admin et un solde de 999999",
  ],
  protections: [
    {
      title: "Whitelist des champs autorisés",
      description:
        "Ne jamais passer le body de la requête directement à la base de données. Extraire explicitement les champs autorisés avant l'update.",
      codeExample: `// app/api/profile/route.ts

// MAL — Tous les champs du body sont envoyés à la DB
await supabase.from("users").update(body).eq("id", userId);

// BIEN — Seuls les champs autorisés sont extraits
const { name, email, avatar_url } = body;
await supabase
  .from("users")
  .update({ name, email, avatar_url })
  .eq("id", userId);`,
      language: "typescript",
    },
    {
      title: "Validation avec Zod",
      description:
        "Utiliser un schéma de validation strict qui rejette tout champ non prévu. Zod avec .strict() lève une erreur si des champs supplémentaires sont présents.",
      codeExample: `// lib/validations/profile.ts
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  avatar_url: z.string().url().optional(),
}).strict(); // Rejette tout champ supplémentaire

// Dans l'API Route
export async function PUT(request: Request) {
  const body = await request.json();
  const result = updateProfileSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "Champs non autorisés détectés" },
      { status: 400 },
    );
  }

  await supabase
    .from("users")
    .update(result.data) // Seuls les champs validés
    .eq("id", userId);
}`,
      language: "typescript",
    },
  ],
  animationSteps: [
    {
      id: "form",
      label: "Formulaire de profil avec nom et email",
      duration: 2000,
    },
    {
      id: "devtools",
      label: "L'attaquant ouvre les DevTools et modifie le body",
      duration: 2500,
    },
    {
      id: "extra-fields",
      label: "Il ajoute role: admin et balance: 999999",
      duration: 2500,
    },
    {
      id: "server-accepts",
      label: "Le serveur accepte tous les champs sans filtrer",
      duration: 2000,
    },
    {
      id: "escalation",
      label: "L'attaquant est maintenant admin avec 999999 de solde",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — Mass Assignment",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html",
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce que le mass assignment exploite fondamentalement ?",
      options: [
        "Une faille dans le chiffrement",
        "Un serveur qui accepte et applique tous les champs du body sans filtrage",
        "Un bug dans le navigateur",
        "Une mauvaise configuration DNS",
      ],
      correctIndex: 1,
      explanation:
        "Le mass assignment exploite les API qui passent le body de la requête directement à la base sans filtrer les champs autorisés, permettant la modification de propriétés sensibles.",
    },
    {
      question: "Que fait z.object({...}).strict() dans Zod ?",
      options: [
        "Il active le mode TypeScript strict",
        "Il rend tous les champs obligatoires",
        "Il lève une erreur si des champs non définis sont présents",
        "Il chiffre les données validées",
      ],
      correctIndex: 2,
      explanation:
        "Le mode .strict() de Zod rejette les objets contenant des champs non définis dans le schéma, détectant ainsi les tentatives de mass assignment.",
    },
    {
      question:
        "Un formulaire de profil affiche 'nom' et 'email'. L'attaquant ajoute 'balance: 999999' dans le body. Que se passe-t-il si le serveur utilise supabase.update(req.body) ?",
      options: [
        "Supabase ignore les champs inconnus",
        "Le champ balance est mis à jour en base avec 999999",
        "La requête est bloquée par les RLS",
        "Supabase retourne une erreur de validation",
      ],
      correctIndex: 1,
      explanation:
        "Supabase exécute l'update sur tous les champs fournis. Sans filtrage côté code, le champ 'balance' est écrit en base. Les RLS ne filtrent pas les colonnes, seulement les lignes.",
    },
  ],
};
