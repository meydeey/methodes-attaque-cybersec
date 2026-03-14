import { Attack } from "@/lib/types";

export const envLeak: Attack = {
  slug: "env-leak",
  name: "Fuite de Variables d'Environnement",
  categoryId: "data-config",
  severity: "critical",
  summary:
    "Des clés API et secrets sont exposés publiquement après un push accidentel du fichier .env sur GitHub.",
  explanation: `L'exposition de données sensibles via les fichiers .env est l'une des erreurs les plus courantes et les plus coûteuses en développement web. Un fichier .env contient les clés d'accès à tous tes services : base de données, API tierces, tokens d'authentification, clés de chiffrement.

Le scénario classique : un développeur fait \`git add .\` sans avoir configuré de .gitignore (ou après l'avoir supprimé accidentellement). Le .env est commité et pushé sur un repo GitHub public. En quelques minutes, des bots automatisés scannent les nouveaux commits publics et extraient toute chaîne qui ressemble à une clé API.

Le problème ne s'arrête pas au push initial. Même si tu supprimes le fichier dans un commit suivant, il reste dans l'historique Git. Il faut réécrire l'historique complet et révoquer immédiatement toutes les clés exposées — ce qui est souvent oublié.`,
  realWorldScenario: `Tu travailles sur ton app Next.js + Supabase. Ton .env contient la SUPABASE_SERVICE_ROLE_KEY (accès admin complet à la DB), ta clé API n8n, et ta NEXT_PUBLIC_STRIPE_SECRET_KEY. Tu fais \`git add . && git commit -m "deploy" && git push\` sur un repo public. Un bot GitHub détecte tes clés en moins de 5 minutes. L'attaquant utilise la service_role_key pour dump toute ta base Supabase et la clé Stripe pour faire des remboursements frauduleux.`,
  exploitSteps: [
    "Le développeur crée un fichier .env avec toutes les clés API du projet",
    "Il exécute git add . sans .gitignore configuré pour .env",
    "Le push envoie le .env sur un repo GitHub public",
    "Des bots automatisés scannent GitHub et détectent les clés en quelques minutes",
    "L'attaquant exploite les clés pour accéder aux services (DB, paiement, API)",
  ],
  protections: [
    {
      title: "Configurer .gitignore dès le premier commit",
      description:
        "Toujours ajouter .env* dans .gitignore AVANT le premier commit du projet. Utiliser un template .gitignore adapté.",
      codeExample: `# .gitignore — Fichiers sensibles
.env
.env.local
.env.production
.env*.local

# Clés et certificats
*.pem
*.key
*.p12

# Dossiers sensibles
.vercel
.supabase`,
      language: "bash",
    },
    {
      title: "Scanner les secrets avant chaque commit",
      description:
        "Utiliser un hook pre-commit qui détecte les secrets potentiels dans le code.",
      codeExample: `# Installer gitleaks comme pre-commit hook
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

# Ou directement en CI (GitHub Actions)
- name: Scan secrets
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
      language: "yaml",
    },
    {
      title: "Utiliser un gestionnaire de secrets",
      description:
        "Stocker les secrets dans un vault (Vercel Environment Variables, Supabase Vault, ou Infisical) plutôt que dans des fichiers locaux.",
      codeExample: `// Supabase Vault — Stocker un secret côté serveur
const { data } = await supabase.rpc('vault_create_secret', {
  new_secret: process.env.STRIPE_SECRET_KEY,
  new_name: 'stripe_key',
});

// Récupérer le secret dans une Edge Function
const { data: secret } = await supabase.rpc('vault_read_secret', {
  secret_name: 'stripe_key',
});`,
      language: "typescript",
    },
  ],
  animationSteps: [
    { id: "env-file", label: "Fichier .env avec les clés API", duration: 2500 },
    { id: "git-add", label: "git add . sans .gitignore", duration: 2500 },
    { id: "push", label: "Push sur GitHub public", duration: 2000 },
    {
      id: "bot-scan",
      label: "Bot scanne GitHub et trouve les clés",
      duration: 3000,
    },
    {
      id: "exploit",
      label: "Clés exploitées en quelques minutes",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "GitGuardian — State of Secrets Sprawl",
      url: "https://www.gitguardian.com/state-of-secrets-sprawl-report",
    },
    {
      label: "GitHub — Secret scanning",
      url: "https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning",
    },
  ],
  quiz: [
    {
      question:
        "Supprimer un fichier .env dans un nouveau commit suffit-il à le protéger ?",
      options: [
        "Oui, le fichier est définitivement supprimé",
        "Non, il reste accessible dans l'historique Git",
        "Oui, si on fait un force push ensuite",
        "Non, mais seulement sur les repos publics",
      ],
      correctIndex: 1,
      explanation:
        "Git conserve l'historique complet. Même supprimé dans un commit suivant, le fichier .env est toujours accessible via git log et git show sur les commits précédents.",
    },
    {
      question:
        "Quel outil peut détecter automatiquement les secrets avant chaque commit ?",
      options: [
        "ESLint",
        "Prettier",
        "Gitleaks (pre-commit hook)",
        "TypeScript compiler",
      ],
      correctIndex: 2,
      explanation:
        "Gitleaks est un scanner de secrets qui peut être configuré comme pre-commit hook. Il détecte les clés API, tokens et autres secrets avant qu'ils ne soient commités.",
    },
    {
      question:
        "En combien de temps les bots automatisés peuvent-ils détecter des clés API sur un repo GitHub public ?",
      options: [
        "Environ 24 heures",
        "Moins de 5 minutes",
        "Environ 1 heure",
        "Seulement si quelqu'un les signale",
      ],
      correctIndex: 1,
      explanation:
        "Des bots scannent en continu les nouveaux commits publics sur GitHub. Une clé API exposée peut être détectée et exploitée en moins de 5 minutes.",
    },
  ],
};
