import { Attack } from "@/lib/types";

export const dependencyConfusion: Attack = {
  slug: "dependency-confusion",
  name: "Dependency Confusion",
  categoryId: "client-social",
  severity: "high",
  summary:
    "L'attaquant publie un package malveillant sur npm avec le même nom qu'un package interne privé, mais avec une version supérieure.",
  explanation: `La Dependency Confusion (ou substitution de dépendance) exploite la façon dont les gestionnaires de paquets résolvent les dépendances. Quand un projet utilise un package privé (@company/utils v1.2.0), npm cherche d'abord dans le registre public avant le registre privé. Si l'attaquant publie un package public du même nom avec une version supérieure (v99.0.0), c'est le package malveillant qui est installé.

L'attaque est redoutable car elle est automatisée : un simple \`npm install\` suffit. Le package malveillant contient généralement un script \`postinstall\` qui s'exécute immédiatement après l'installation — sans aucune intervention humaine. Ce script peut exfiltrer des variables d'environnement, des fichiers de config, ou installer une backdoor.

Cette vulnérabilité a touché des géants comme Apple, Microsoft, et PayPal en 2021. Elle reste pertinente pour toute équipe qui utilise des packages privés sans avoir configuré correctement la résolution de registre.`,
  realWorldScenario: `Ton projet Next.js utilise \`@mycompany/supabase-helpers\` hébergé sur un registre npm privé. Un attaquant repère ce nom dans un fichier package.json exposé sur GitHub, puis publie \`@mycompany/supabase-helpers\` v99.0.0 sur le npm public avec un \`postinstall\` qui exfiltre tes \`.env\`, tes clés Supabase, et tes tokens n8n vers son serveur.`,
  exploitSteps: [
    "L'attaquant identifie le nom d'un package privé (@company/utils) dans un package.json exposé",
    "Il publie un package du même nom sur le registre npm public avec une version supérieure",
    "Le package malveillant contient un script postinstall avec du code d'exfiltration",
    "Un développeur exécute npm install — le package public (version supérieure) est choisi",
    "Le script postinstall s'exécute et exfiltre les secrets de l'environnement",
  ],
  protections: [
    {
      title: "Configurer le scope npm vers votre registre privé",
      description:
        "Forcer npm à résoudre les packages @company/* uniquement depuis votre registre privé.",
      codeExample: `# .npmrc — Forcer le scope vers le registre privé
@mycompany:registry=https://npm.mycompany.com/
//npm.mycompany.com/:_authToken=\${NPM_TOKEN}

# Optionnel : bloquer complètement le registre public pour ce scope
# Empêche toute résolution vers npmjs.org pour @mycompany/*`,
      language: "bash",
    },
    {
      title: "Verrouiller les dépendances avec un lockfile",
      description:
        "Utiliser package-lock.json ou pnpm-lock.yaml et les vérifier en CI. Désactiver les scripts postinstall par défaut.",
      codeExample: `# .npmrc — Désactiver les scripts postinstall par défaut
ignore-scripts=true

# package.json — Autoriser uniquement les scripts de confiance
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["bcrypt", "sharp"]
  }
}`,
      language: "json",
    },
  ],
  animationSteps: [
    {
      id: "package",
      label: "package.json avec @company/utils",
      duration: 2500,
    },
    {
      id: "search",
      label: "npm install cherche dans le registre public",
      duration: 3000,
    },
    {
      id: "malicious",
      label: "Package malveillant v99.0.0 trouvé",
      duration: 2500,
    },
    {
      id: "install",
      label: "Le package malveillant est installé",
      duration: 2500,
    },
    { id: "exfil", label: "postinstall exfiltre les secrets", duration: 2500 },
  ],
  resources: [
    {
      label: "Alex Birsan — Dependency Confusion (article original)",
      url: "https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610",
    },
    {
      label: "npm — Configuring scoped packages",
      url: "https://docs.npmjs.com/cli/v10/using-npm/scope",
    },
  ],
  quiz: [
    {
      question:
        "Comment npm choisit-il entre un package privé v1.2.0 et un package public du même nom v99.0.0 ?",
      options: [
        "Il choisit toujours le package privé",
        "Il choisit la version la plus élevée, donc le package public malveillant",
        "Il demande confirmation à l'utilisateur",
        "Il refuse d'installer en cas de conflit",
      ],
      correctIndex: 1,
      explanation:
        "Par défaut, npm résout les dépendances en cherchant la version la plus élevée. Le package public v99.0.0 sera choisi avant le package privé v1.2.0.",
    },
    {
      question:
        "Quel script npm est exploité pour exécuter du code malveillant automatiquement après l'installation ?",
      options: ["prestart", "postinstall", "prebuild", "posttest"],
      correctIndex: 1,
      explanation:
        "Le script postinstall s'exécute automatiquement après npm install, sans intervention humaine. C'est le vecteur idéal pour exfiltrer des secrets ou installer une backdoor.",
    },
    {
      question:
        "Quelle configuration .npmrc empêche la dependency confusion pour les packages @company/* ?",
      options: [
        "registry=https://registry.npmjs.org",
        "@company:registry=https://npm.company.com/",
        "strict-ssl=true",
        "save-exact=true",
      ],
      correctIndex: 1,
      explanation:
        "Configurer le scope @company vers votre registre privé force npm à résoudre tous les packages @company/* uniquement depuis votre registre, ignorant le registre public.",
    },
  ],
};
