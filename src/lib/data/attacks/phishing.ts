import { Attack } from "@/lib/types";

export const phishing: Attack = {
  slug: "phishing",
  name: "Phishing",
  categoryId: "client-social",
  severity: "high",
  summary:
    "L'attaquant envoie un faux email imitant un service légitime pour voler les identifiants de la victime.",
  explanation: `Le phishing est la technique d'ingénierie sociale la plus répandue. L'attaquant crée un email qui imite parfaitement un service connu (banque, plateforme SaaS, fournisseur cloud) et l'envoie à sa cible. Le message contient un lien vers une page de login clonée, visuellement identique à l'originale.

La clé de l'attaque réside dans l'URL. Le domaine semble légitime au premier coup d'œil mais contient une subtilité : un sous-domaine trompeur (supabase.co.evil.com), un caractère unicode similaire, ou une extension différente. L'utilisateur pressé ne vérifie pas et entre ses identifiants.

Une fois les credentials capturés, l'attaquant a un accès complet au compte de la victime. Il peut exfiltrer des données, pivoter vers d'autres services (si les mots de passe sont réutilisés), ou installer une persistance dans le système.`,
  realWorldScenario: `Tu reçois un email qui semble venir de Supabase : "Alerte de sécurité — Connexion suspecte à votre projet". Le lien pointe vers supabase.co.evil-security.com/login. La page est un clone parfait du dashboard Supabase. Tu entres tes credentials → l'attaquant a maintenant accès à ton projet Supabase, tes clés API, ta base PostgreSQL, et potentiellement à ton app Next.js déployée sur Vercel via les variables d'environnement partagées.`,
  exploitSteps: [
    "L'attaquant clone la page de login du service ciblé (ex : Supabase Dashboard)",
    "Il héberge le clone sur un domaine trompeur (supabase.co.evil.com)",
    "Il envoie un email alarmiste avec un lien vers le faux site",
    "La victime clique et entre ses identifiants sur la page clonée",
    "Les credentials sont envoyés au serveur de l'attaquant en temps réel",
  ],
  protections: [
    {
      title: "Activer le MFA (Multi-Factor Authentication)",
      description:
        "Même si les credentials sont volés, le 2FA bloque l'accès. Supabase supporte le MFA nativement.",
      codeExample: `// Activer le MFA dans Supabase Auth
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Mon Authenticator',
});

// Vérifier le MFA au login
const { data: challenge } = await supabase.auth.mfa.challenge({
  factorId: data.id,
});
await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challenge.id,
  code: userOtpCode,
});`,
      language: "typescript",
    },
    {
      title: "Vérifier systématiquement les URLs",
      description:
        "Former les équipes à inspecter le domaine complet avant toute saisie de credentials. Utiliser un gestionnaire de mots de passe qui ne remplira pas les champs sur un faux domaine.",
    },
    {
      title: "Implémenter DMARC/SPF/DKIM",
      description:
        "Configurer les enregistrements DNS pour empêcher l'usurpation de votre domaine d'email.",
      codeExample: `# Enregistrements DNS à ajouter
# SPF — Autoriser uniquement vos serveurs d'envoi
TXT  @  "v=spf1 include:_spf.google.com ~all"

# DMARC — Rejeter les emails non authentifiés
TXT  _dmarc  "v=DMARC1; p=reject; rua=mailto:dmarc@votredomaine.com"`,
      language: "bash",
    },
  ],
  animationSteps: [
    { id: "email", label: "Email officiel reçu", duration: 2500 },
    { id: "url", label: "L'URL masque un faux domaine", duration: 3000 },
    { id: "click", label: "La victime clique sur le lien", duration: 2000 },
    {
      id: "clone",
      label: "Page de login clonée à l'identique",
      duration: 2500,
    },
    {
      id: "captured",
      label: "Identifiants capturés par l'attaquant",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "OWASP — Phishing",
      url: "https://owasp.org/www-community/attacks/Phishing",
    },
    {
      label: "Supabase — Multi-Factor Authentication",
      url: "https://supabase.com/docs/guides/auth/auth-mfa",
    },
  ],
  quiz: [
    {
      question: "Quel est l'élément clé qui trahit un email de phishing ?",
      options: [
        "Le logo de l'entreprise est flou",
        "L'URL du lien pointe vers un domaine différent du service légitime",
        "L'email est envoyé le week-end",
        "Le texte contient des fautes d'orthographe",
      ],
      correctIndex: 1,
      explanation:
        "L'URL est l'indicateur le plus fiable. Un domaine comme supabase.co.evil.com n'est pas supabase.com, même si la page clonée est visuellement identique.",
    },
    {
      question:
        "Pourquoi un gestionnaire de mots de passe protège-t-il contre le phishing ?",
      options: [
        "Il génère des mots de passe plus longs",
        "Il ne remplit pas automatiquement les champs sur un faux domaine",
        "Il chiffre les mots de passe en transit",
        "Il bloque les emails suspects",
      ],
      correctIndex: 1,
      explanation:
        "Un gestionnaire de mots de passe vérifie le domaine exact avant de remplir les identifiants. Sur un faux domaine de phishing, il ne proposera pas d'autocomplétion.",
    },
    {
      question:
        "Quel protocole DNS empêche l'usurpation de votre domaine d'email ?",
      options: ["HTTPS", "HSTS", "DMARC", "CSP"],
      correctIndex: 2,
      explanation:
        "DMARC (Domain-based Message Authentication, Reporting & Conformance) vérifie que l'expéditeur est autorisé à envoyer des emails pour le domaine, bloquant l'usurpation.",
    },
  ],
};
