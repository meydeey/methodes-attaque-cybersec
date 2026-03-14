# Refonte UI Hacker Terminal + Gamification

## Contexte

La plateforme éducative cybersécurité ELITE fonctionne mais manque d'engagement : pas de progression, pas de validation de l'apprentissage, design standard sans immersion. L'objectif est de transformer l'expérience en auto-formation ludique et immersive pour que chaque membre comprenne les attaques et sache s'en protéger.

## Décisions

- **Usage** : Auto-formation solo (pas de mode présentation)
- **Gamification** : Heavy — quiz, badges, progression, scoring
- **Persistance** : localStorage (pas de backend)
- **Visuel** : Hacker Terminal (vert/noir, monospace, glow, scan lines)
- **Police** : Inter (remplace Geist)
- **Approche** : Parallel blast (fondations → parallélisation → polish)

## Architecture technique

### Nouveaux types (`src/lib/types.ts`)

```typescript
type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type QuizResult = {
  attackSlug: string;
  score: number;
  total: number;
  completedAt: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
};

type UserBadge = {
  badgeId: string;
  unlockedAt: string;
};

type UserProgress = {
  completedAttacks: string[]; // slugs
  quizResults: QuizResult[];
  badges: UserBadge[];
  totalScore: number;
};
```

Le type `Attack` existant reçoit un champ `quiz: QuizQuestion[]` (2-3 questions par attaque).

### Nouveaux hooks (`src/hooks/`)

- **`useProgress()`** : lecture/écriture localStorage, marquer attaque comme lue, calcul score global, % complétion par catégorie
- **`useQuiz(slug)`** : état du quiz (question courante, réponses données, scoring, résultat final)
- **`useBadges()`** : calcul badges débloqués en fonction de UserProgress, notification nouveau badge

### Nouveaux composants

**Quiz** (`src/components/quiz/`) :

- `QuizSection.tsx` — section quiz en bas de page attaque
- `QuizQuestion.tsx` — une question avec 4 options, feedback correct/incorrect
- `QuizResult.tsx` — résultat final + explications des erreurs

**Progression** (`src/components/dashboard/`) :

- `ProgressBar.tsx` — barre de progression par catégorie (gradient vert)
- `StatsPanel.tsx` — stats globales (attaques lues, quiz validés, badges)
- `BadgeShowcase.tsx` — grille de badges (débloqués + verrouillés grisés)

**Feedback** (`src/components/ui/`) :

- `BadgeNotification.tsx` — toast animé quand badge débloqué
- `TerminalText.tsx` — texte avec effet de typing (titres de section)

## Thème visuel Hacker Terminal

### Palette

| Rôle       | Couleur         | Hex       |
| ---------- | --------------- | --------- |
| Background | Noir profond    | `#0a0a0a` |
| Primary    | Vert terminal   | `#00ff41` |
| Critical   | Rouge           | `#ef4444` |
| High       | Orange          | `#f97316` |
| Medium     | Jaune           | `#fbbf24` |
| Badges     | Violet          | `#a78bfa` |
| Border     | Vert sombre     | `#1a3a1a` |
| Surface    | Gris très foncé | `#111111` |

### Effets visuels

- **Typing effect** : titres qui s'écrivent lettre par lettre (Framer Motion)
- **Scan lines** : overlay CSS subtil façon CRT sur les zones d'animation
- **Glow hover** : cards avec box-shadow vert diffus au survol
- **Progress pulse** : animation pulse sur les barres de progression actives

### Font

Remplacer Geist par Inter (`next/font/google`). Conserver une font monospace pour les éléments terminaux (code, labels, prompts).

## Dashboard redesign

- **Header** : logo `> CYBERSEC_ELITE`, score + % complétion
- **Stats panel** : 3 cartes (attaques lues, quiz validés, badges)
- **Catégories** : chaque catégorie avec barre de progression et compteur
- **Cards attaque** : badge severity + indicateur lu/non-lu, opacity réduite si non lu

## Page attaque redesign

- **Header** : prompt terminal + titre + badges severity/catégorie + indicateurs progression (4 carrés : lu/animé/protégé/quiz)
- **Navigation par tabs** : Comprendre | Démo | Se protéger | Quiz
- **Tab Quiz** : point jaune si non complété
- **Navigation footer** : attaque précédente ← → suivante, raccourcis clavier

## Système de badges (12)

| Badge             | Condition                          |
| ----------------- | ---------------------------------- |
| Premier Pas       | 1re attaque lue                    |
| Injection Master  | Catégorie Injection 100%           |
| Auth Expert       | Catégorie Auth 100%                |
| API Guardian      | Catégorie API 100%                 |
| Access Controller | Catégorie Access Control 100%      |
| Social Shield     | Catégorie Client & Social 100%     |
| Config Warrior    | Catégorie Data & Config 100%       |
| Sans Faute        | Quiz 100% au 1er essai             |
| Speed Run         | 5 attaques en 1 session            |
| Défenseur         | Toutes les protections lues        |
| Chercheur         | Toutes les animations vues         |
| ELITE Complet     | 19/19 attaques + tous quiz validés |

## Flux utilisateur

Dashboard → Lire attaque (tab Comprendre) → Jouer animation (tab Démo) → Lire protections (tab Se protéger) → Quiz (tab Quiz) → Badge notification si débloqué → Attaque suivante

## Fichiers modifiés

### Existants à modifier

- `src/lib/types.ts` — ajout types Quiz, Badge, Progress
- `src/lib/data/attacks/*.ts` — ajout champ `quiz` à chaque attaque (19 fichiers)
- `src/app/layout.tsx` — Inter font, thème CSS hacker
- `src/app/globals.css` — variables couleurs hacker, scan lines, glow effects
- `src/app/page.tsx` — intégration StatsPanel + ProgressBar
- `src/app/attack/[slug]/page.tsx` — tabs, quiz section, progression
- `src/components/layout/Header.tsx` — refonte hacker avec score
- `src/components/dashboard/CategoryGrid.tsx` — ajout barres progression
- `src/components/dashboard/CategoryCard.tsx` — refonte hacker
- `src/components/dashboard/AttackCard.tsx` — indicateur lu/non-lu
- `src/components/attack-detail/AttackHeader.tsx` — refonte hacker + progression
- `src/components/attack-detail/ExplanationSection.tsx` — style hacker
- `src/components/attack-detail/DemoSection.tsx` — style hacker
- `src/components/attack-detail/ProtectionSection.tsx` — style hacker
- `src/components/attack-detail/CodeSnippet.tsx` — style terminal

### Nouveaux fichiers

- `src/hooks/useProgress.ts`
- `src/hooks/useQuiz.ts`
- `src/hooks/useBadges.ts`
- `src/lib/data/badges.ts` — définitions des 12 badges
- `src/components/quiz/QuizSection.tsx`
- `src/components/quiz/QuizQuestion.tsx`
- `src/components/quiz/QuizResult.tsx`
- `src/components/dashboard/ProgressBar.tsx`
- `src/components/dashboard/StatsPanel.tsx`
- `src/components/dashboard/BadgeShowcase.tsx`
- `src/components/ui/BadgeNotification.tsx`
- `src/components/ui/TerminalText.tsx`
