# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Plateforme éducative de cybersécurité pour la formation ELITE du Labo IA. Catalogue de 19 méthodes d'attaque réparties en 6 catégories, avec animations interactives Framer Motion et navigation clavier pour présentation live.

## Commandes

```bash
npm run dev      # Dev server (Next.js 16, React 19)
npm run build    # Build production — TOUJOURS exécuter avant de considérer une tâche terminée
npm run lint     # ESLint
```

Pas de tests configurés pour le moment.

## Stack

- Next.js 16 App Router (SSG) + React 19 + TypeScript strict
- Tailwind CSS 4 + shadcn/ui (style base-nova) + CVA
- Framer Motion (animations des scènes d'attaque)
- Lucide React (icônes)
- Path alias : `@/*` → `./src/*`

## Architecture

### Data-driven

Toute l'app est pilotée par les données dans `src/lib/data/`. Les types sont dans `src/lib/types.ts`.

- **Catégories** : `src/lib/data/categories.ts` — 6 catégories (injection, auth, access-control, api-infra, client-social, data-config)
- **Attaques** : `src/lib/data/attacks/*.ts` — 1 fichier par attaque, exportées via `src/lib/data/attacks/index.ts`
- **Helpers** : `getAttackBySlug()`, `getAttacksByCategory()`, `getAdjacentAttacks()` dans `attacks/index.ts`

### Routing

- `/` → Dashboard (`CategoryGrid` affiche toutes les catégories et attaques)
- `/attack/[slug]` → Détail d'une attaque (SSG via `generateStaticParams()`)

### Animations

Système modulaire en 3 couches :

1. **State machine** : `src/hooks/useAnimationStep.ts` — gère step, play/pause, auto-play, raccourcis clavier (Espace, R)
2. **Router** : `src/components/animations/AttackAnimation.tsx` — charge dynamiquement la scène par slug
3. **Scènes** : `src/components/animations/scenes/*.tsx` — 18 scènes, chacune reçoit `currentStep` et rend conditionnellement avec `AnimatePresence`
4. **Primitives** : `src/components/animations/primitives/` — Browser, ServerBox, Database, DataFlow, Attacker (réutilisables entre scènes)

### Navigation clavier (mode présentation)

`PresenterControls.tsx` : ← → pour naviguer entre attaques, Espace pour step suivant, R pour reset, Esc pour retour dashboard.

## Ajouter une nouvelle attaque

1. Créer le fichier data dans `src/lib/data/attacks/nom-attaque.ts` (type `Attack`)
2. L'importer et l'ajouter au tableau `ALL_ATTACKS` dans `src/lib/data/attacks/index.ts`
3. Créer la scène d'animation dans `src/components/animations/scenes/NomAttaqueScene.tsx`
4. Ajouter le case dans le switch de `src/components/animations/AttackAnimation.tsx`

## Conventions

- Français pour l'UI et la communication, anglais pour le code et les commits
- shadcn/ui AVANT tout composant custom
- `cn()` de `src/lib/utils.ts` pour merger les classes Tailwind
- Composants UI shadcn dans `src/components/ui/`
- Dark mode uniquement (`<html className="dark">`)
