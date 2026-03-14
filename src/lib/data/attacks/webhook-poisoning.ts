import { Attack } from "@/lib/types";

export const webhookPoisoning: Attack = {
  slug: "webhook-poisoning",
  name: "Webhook Poisoning",
  categoryId: "api-infra",
  severity: "high",
  summary:
    "L'attaquant envoie de faux webhooks à ton serveur pour déclencher des actions non autorisées.",
  explanation: `Les webhooks sont des callbacks HTTP que des services externes (Stripe, GitHub, Supabase) envoient à ton serveur quand un événement se produit. Le problème : n'importe qui connaissant l'URL de ton webhook peut envoyer une requête qui ressemble à un webhook légitime.

Si ton serveur ne vérifie pas l'authenticité du webhook (signature HMAC, timestamp), un attaquant peut forger de faux événements. Par exemple, envoyer un faux webhook Stripe \`payment_intent.succeeded\` pour simuler un paiement, ou un faux webhook GitHub pour déclencher un déploiement malveillant.

L'attaque est particulièrement vicieuse car les webhooks sont souvent traités automatiquement sans intervention humaine — le serveur fait confiance au contenu et exécute des actions critiques : valider des commandes, accorder des accès, modifier des données.`,
  realWorldScenario: `Dans ton stack, si un workflow n8n écoute un webhook Stripe sur \`/webhook/stripe\` sans vérifier la signature \`stripe-signature\`, un attaquant peut envoyer un faux événement \`checkout.session.completed\` pour valider une commande sans payer. Même chose pour un endpoint Next.js \`/api/webhooks/supabase\` qui traite les événements Auth sans vérifier le secret — l'attaquant peut simuler la création de comptes admin.`,
  exploitSteps: [
    "L'attaquant découvre l'URL du webhook (documentation publique, scan, fuite)",
    "Il analyse le format attendu en observant les requêtes légitimes ou la documentation de l'API",
    "Il forge un webhook avec un événement critique (paiement validé, commande confirmée)",
    "Le serveur reçoit le faux webhook sans vérifier la signature",
    "L'action non autorisée est exécutée (commande validée sans paiement, accès accordé)",
  ],
  protections: [
    {
      title: "Vérification de la signature HMAC",
      description:
        "Toujours vérifier la signature du webhook avec le secret partagé. Chaque service (Stripe, GitHub, Supabase) fournit un mécanisme de signature — ne jamais l'ignorer.",
      codeExample: `// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature")!;

  try {
    // Vérifier la signature avant de traiter
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    // Traiter l'événement vérifié
    switch (event.type) {
      case "checkout.session.completed":
        // ...
    }
  } catch (err) {
    return new Response("Signature invalide", { status: 400 });
  }
}`,
      language: "typescript",
    },
    {
      title: "Vérifier le timestamp et l'idempotence",
      description:
        "Rejeter les webhooks dont le timestamp est trop ancien (> 5 min) pour empêcher les attaques par rejeu. Stocker les IDs d'événements déjà traités pour éviter les doublons.",
      codeExample: `// Vérifier le timestamp du webhook
const webhookTimestamp = parseInt(
  headers().get("webhook-timestamp") ?? "0"
);
const now = Math.floor(Date.now() / 1000);
const TOLERANCE = 300; // 5 minutes

if (Math.abs(now - webhookTimestamp) > TOLERANCE) {
  return new Response("Webhook expiré", { status: 400 });
}

// Vérifier l'idempotence
const eventId = body.id;
const alreadyProcessed = await db
  .from("processed_webhooks")
  .select("id")
  .eq("event_id", eventId)
  .single();

if (alreadyProcessed.data) {
  return new Response("Déjà traité", { status: 200 });
}`,
      language: "typescript",
    },
  ],
  animationSteps: [
    {
      id: "legit-webhook",
      label: "Webhook légitime Stripe arrive sur le serveur",
      duration: 2000,
    },
    {
      id: "forged-webhook",
      label: "L'attaquant envoie un faux webhook identique",
      duration: 2500,
    },
    {
      id: "no-verify",
      label: "Le serveur traite les deux sans vérifier la signature",
      duration: 2500,
    },
    {
      id: "unauthorized",
      label: "Action non autorisée exécutée (commande validée sans paiement)",
      duration: 2500,
    },
  ],
  resources: [
    {
      label: "Stripe — Vérifier les signatures webhook",
      url: "https://stripe.com/docs/webhooks/signatures",
    },
    {
      label: "OWASP — Webhook Security",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html",
    },
  ],
  quiz: [
    {
      question:
        "Quel mécanisme permet de vérifier qu'un webhook provient bien du service légitime ?",
      options: [
        "Vérifier l'adresse IP source",
        "La signature HMAC avec un secret partagé",
        "Le header User-Agent",
        "Le certificat SSL du client",
      ],
      correctIndex: 1,
      explanation:
        "La signature HMAC est calculée à partir du body du webhook et d'un secret partagé. Seul le service légitime connaît ce secret et peut générer une signature valide.",
    },
    {
      question:
        "Pourquoi vérifier le timestamp d'un webhook est-il important ?",
      options: [
        "Pour mesurer la latence réseau",
        "Pour empêcher les attaques par rejeu (replay attack)",
        "Pour synchroniser les horloges serveur",
        "Pour trier les événements par date",
      ],
      correctIndex: 1,
      explanation:
        "Un attaquant qui intercepte un webhook valide peut le renvoyer plus tard. Rejeter les webhooks dont le timestamp est trop ancien (> 5 min) bloque ces attaques par rejeu.",
    },
    {
      question:
        "Quel est le risque principal d'un webhook non vérifié qui traite des événements de paiement ?",
      options: [
        "Des erreurs de formatage JSON",
        "Un attaquant peut simuler un paiement réussi sans payer",
        "Les notifications de paiement sont en retard",
        "Le serveur consomme trop de mémoire",
      ],
      correctIndex: 1,
      explanation:
        "Sans vérification de signature, un attaquant peut envoyer un faux événement 'payment_intent.succeeded' pour valider une commande sans jamais avoir payé.",
    },
  ],
};
