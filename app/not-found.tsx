export default function NotFound() {
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
  return null;
}
