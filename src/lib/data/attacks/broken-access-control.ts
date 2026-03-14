import { Attack } from "@/lib/types";

export const brokenAccessControl: Attack = {
  slug: "broken-access-control",
  name: "Broken Access Control (IDOR)",
  categoryId: "access-control",
  severity: "critical",
  summary:
    "L'attaquant modifie un identifiant dans l'URL ou le body pour accéder aux données d'un autre utilisateur sans autorisation.",
  explanation: `Le Broken Access Control (souvent via IDOR — Insecure Direct Object Reference) est la vulnérabilité #1 du classement OWASP Top 10. Elle se produit quand le serveur ne vérifie pas que l'utilisateur connecté a le droit d'accéder à la ressource demandée.

Concrètement, si l'API expose \`/api/users/123/data\` et que le serveur retourne les données de l'utilisateur 123 sans vérifier que c'est bien lui qui fait la requête, n'importe quel utilisateur authentifié peut accéder aux données des autres en changeant simplement l'ID dans l'URL.

L'attaque est triviale — il suffit d'incrémenter l'ID dans l'URL ou d'utiliser un script pour itérer sur tous les IDs possibles. C'est d'autant plus dangereux que les IDs séquentiels (1, 2, 3...) rendent l'énumération facile. Le bug est courant car les développeurs pensent souvent que "l'utilisateur ne verra pas cet endpoint" — ce qui n'est jamais une protection.`,
  realWorldScenario: `Ton app Next.js a une API route \`/api/users/[id]/invoices\` qui récupère les factures via Supabase. Si le handler fait un simple \`supabase.from('invoices').select('*').eq('user_id', params.id)\` sans vérifier que \`params.id\` correspond au JWT de l'utilisateur connecté, n'importe qui peut lire les factures des autres. Si un workflow n8n expose un webhook \`/webhook/user-data?userId=123\`, le même problème s'applique.`,
  exploitSteps: [
    "L'attaquant se connecte normalement et accède à /api/users/123/data",
    "Il change l'ID dans l'URL : /api/users/124/data",
    "Le serveur ne vérifie pas que l'utilisateur connecté est bien l'ID 124",
    "Les données d'un autre utilisateur sont retournées",
    "L'attaquant itère sur tous les IDs pour extraire toute la base",
  ],
  protections: [
    {
      title: "Vérifier l'ownership côté serveur",
      description:
        "Toujours comparer l'ID demandé avec l'ID de l'utilisateur authentifié extrait du JWT. Ne jamais faire confiance au paramètre d'URL.",
      codeExample: `// API Route Next.js — Vérification d'ownership
import { createServerClient } from '@supabase/ssr';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();

  // CRITIQUE : vérifier que l'utilisateur demande SES données
  if (user?.id !== params.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data } = await supabase.from('invoices').select('*').eq('user_id', params.id);
  return Response.json(data);
}`,
      language: "typescript",
    },
    {
      title: "Utiliser les Row Level Security (RLS) de Supabase",
      description:
        "Les policies RLS filtrent automatiquement les données au niveau de la base. Même si le code oublie une vérification, la DB bloque l'accès.",
      codeExample: `-- Policy RLS — Un utilisateur ne voit que SES données
CREATE POLICY "Users can only access their own data"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);`,
      language: "sql",
    },
    {
      title: "Utiliser des UUIDs au lieu d'IDs séquentiels",
      description:
        "Les UUIDs sont impossibles à deviner ou itérer, ce qui réduit drastiquement la surface d'attaque par énumération.",
    },
  ],
  animationSteps: [
    {
      id: "normal",
      label: "Requête normale : /api/users/123/data",
      duration: 2000,
    },
    {
      id: "tamper",
      label: "L'attaquant change l'ID : 123 → 124",
      duration: 2500,
    },
    {
      id: "nocheck",
      label: "Le serveur ne vérifie pas l'ownership",
      duration: 2500,
    },
    {
      id: "leak",
      label: "Données d'un autre utilisateur retournées",
      duration: 2500,
    },
    { id: "enumerate", label: "Itération sur tous les IDs", duration: 2000 },
  ],
  resources: [
    {
      label: "OWASP — Broken Access Control",
      url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
    },
    {
      label: "Supabase — Row Level Security",
      url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
    },
  ],
  quiz: [
    {
      question: "Que signifie IDOR ?",
      options: [
        "Internal Data Object Request",
        "Insecure Direct Object Reference",
        "Input Data Override Risk",
        "Indirect Domain Object Retrieval",
      ],
      correctIndex: 1,
      explanation:
        "IDOR (Insecure Direct Object Reference) désigne l'accès direct à un objet via son identifiant sans vérification d'autorisation.",
    },
    {
      question:
        "Quelle fonctionnalité Supabase protège automatiquement contre l'accès non autorisé aux données ?",
      options: [
        "Supabase Realtime",
        "Row Level Security (RLS)",
        "Supabase Storage",
        "Supabase Edge Functions",
      ],
      correctIndex: 1,
      explanation:
        "Les policies RLS filtrent les données au niveau de la base de données. Même si le code applicatif oublie une vérification, la DB bloque l'accès non autorisé.",
    },
    {
      question:
        "Pourquoi les UUIDs sont-ils préférables aux IDs séquentiels (1, 2, 3) ?",
      options: [
        "Ils sont plus rapides à indexer",
        "Ils sont impossibles à deviner ou à itérer",
        "Ils prennent moins de place en base",
        "Ils sont compatibles avec tous les navigateurs",
      ],
      correctIndex: 1,
      explanation:
        "Les UUIDs sont aléatoires et non prédictibles, rendant l'énumération des ressources impossible contrairement aux IDs séquentiels.",
    },
  ],
};
