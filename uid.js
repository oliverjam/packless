export function cuid() {
  let timestamp = new Date().getTime().toString(36).slice(0, 5);
  let random = crypto.randomUUID().slice(-4);
  return timestamp + random;
}
