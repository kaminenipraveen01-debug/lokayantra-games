/**
 * Converts a standard YouTube URL (watch, shorts, youtu.be, embed, etc.)
 * into a valid embed URL for use in an iframe.
 */
export default function getYouTubeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  let videoId: string | null = null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2];
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2];
      } else if (parsed.pathname.startsWith("/live/")) {
        videoId = parsed.pathname.split("/")[2];
      } else if (parsed.pathname.startsWith("/v/")) {
        videoId = parsed.pathname.split("/")[2];
      }
    }
  } catch {
    return null;
  }

  if (!videoId) return null;

  videoId = videoId.split(/[?&#]/)[0];

  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}
