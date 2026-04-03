import toast from "react-hot-toast";

/**
 * Web Share API when available; otherwise copy to clipboard; fallback prompt.
 */
export async function shareOrCopyLink(url, { title = "DL Stream" } = {}) {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title, text: title, url });
      return;
    }
  } catch (e) {
    if (e?.name === "AbortError") return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  } catch {
    window.prompt("Copy this link:", url);
  }
}

export function joinMeetingUrl(roomName) {
  const base =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/JoinMeeting/${encodeURIComponent(roomName)}`;
}

export function watchStreamUrl(streamKey) {
  const base =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/watch/${encodeURIComponent(streamKey)}`;
}
