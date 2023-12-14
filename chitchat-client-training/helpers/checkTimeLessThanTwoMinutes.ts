export default function checkTimeLessThanTwoMinutes(previousTime, currentTime) {
  const diffInMilliseconds = Math.abs(currentTime - previousTime);
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  return diffInMinutes < 2;
}
