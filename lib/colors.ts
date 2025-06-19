export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
  if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
  return "bg-red-100 dark:bg-red-900/20";
};