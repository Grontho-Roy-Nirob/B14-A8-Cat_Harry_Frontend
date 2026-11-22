// The API has no rating/review field, so cards use a deterministic
// pseudo-rating derived from the studio id.
export function rating(id: string) {
  const sum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (4 + (sum % 10) / 10).toFixed(1);
}
