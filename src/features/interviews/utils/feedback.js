export function calculateOverallRating(feedbackList) {
  if (!feedbackList.length) {
    return '0';
  }

  const totalRating = feedbackList.reduce(
    (sum, item) => sum + Number(item.rating ?? 0),
    0
  );

  return (totalRating / feedbackList.length).toFixed(1);
}
