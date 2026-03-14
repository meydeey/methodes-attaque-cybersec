export type Severity = "critical" | "high" | "medium";

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

export type AnimationStep = {
  id: string;
  label: string;
  duration: number;
};

export type Protection = {
  title: string;
  description: string;
  codeExample?: string;
  language?: string;
};

export type Resource = {
  label: string;
  url: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Attack = {
  slug: string;
  name: string;
  categoryId: string;
  severity: Severity;
  summary: string;
  explanation: string;
  realWorldScenario: string;
  exploitSteps: string[];
  protections: Protection[];
  animationSteps: AnimationStep[];
  resources: Resource[];
  quiz: QuizQuestion[];
};

export type QuizResult = {
  attackSlug: string;
  score: number;
  total: number;
  completedAt: string;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type UserBadge = {
  badgeId: string;
  unlockedAt: string;
};

export type UserProgress = {
  completedAttacks: string[];
  viewedAnimations: string[];
  viewedProtections: string[];
  quizResults: QuizResult[];
  badges: UserBadge[];
  totalScore: number;
};
