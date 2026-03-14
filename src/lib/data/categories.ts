import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "injection",
    name: "Injection & Manipulation de Requêtes",
    icon: "Syringe",
    description:
      "Attaques qui injectent du code malicieux dans les requêtes vers la base de données ou le serveur.",
    color: "red",
  },
  {
    id: "auth",
    name: "Authentification & Sessions",
    icon: "KeyRound",
    description:
      "Attaques qui ciblent les mécanismes de login, les tokens et les sessions utilisateur.",
    color: "orange",
  },
  {
    id: "access-control",
    name: "Contrôle d'Accès & Autorisation",
    icon: "ShieldOff",
    description:
      "Attaques qui contournent les permissions pour accéder à des données ou actions non autorisées.",
    color: "yellow",
  },
  {
    id: "api-infra",
    name: "Attaques API & Infrastructure",
    icon: "Server",
    description:
      "Attaques ciblant les endpoints API, les webhooks et l'infrastructure serveur.",
    color: "purple",
  },
  {
    id: "client-social",
    name: "Client & Social Engineering",
    icon: "UserX",
    description:
      "Attaques qui manipulent l'utilisateur ou exploitent le navigateur côté client.",
    color: "pink",
  },
  {
    id: "data-config",
    name: "Exposition de Données & Configuration",
    icon: "FileWarning",
    description:
      "Fuites de données sensibles et erreurs de configuration serveur.",
    color: "cyan",
  },
];
