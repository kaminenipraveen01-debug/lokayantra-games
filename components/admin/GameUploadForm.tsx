"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminPostJSON } from "@/lib/admin-fetch";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";
import getYouTubeEmbedUrl from "@/lib/youtube";
import { Game } from "@/types/game";

interface UploadProgress {
  current: number;
  total: number;
  currentFile: string;
}

type Status =
  | { state: "idle" }
  | { state: "extracting" }
  | { state: "uploading"; progress: UploadProgress }
  | { state: "saving" }
  | { state: "success" }
  | { state: "error"; message: string };

type SourceType = "zip" | "html" | "external";

export default function GameUploadForm() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [howToPlay, setHowToPlay] = useState("");
  const [tipsText, setTipsText] = useState("");
  const [faqsText, setFaqsText] = useState("");
  const [category, setCategory] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Desktop"]);
  const [controls, setControls] = useState("");
  const [developer, setDeveloper] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  // Edit mode lo Firebase lo already unna URL store chestamu
  const [existingGameUrl, setExistingGameUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const [sourceType, setSourceType] = useState<SourceType>("zip");
  const [externalUrl, setExternalUrl] = useState("");

  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const isEditMode = !!editSlug;
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);

  useEffect(() => {
    if (!editSlug) return;

    let cancelled = false;

    (async () => {
      setLoadingExisting(true);
      try {
        const snap = await getDoc(doc(db, "games", editSlug));
        if (cancelled) return;

        if (!snap.exists()) {
          setStatus({ state: "error", message: `No game found with id "${editSlug}".` });
          return;
        }

        const data = snap.data() as Game;

        setSlug(editSlug);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setHowToPlay(data.howToPlay ?? "");
        setTipsText((data.tips ?? []).join("\n"));
        setFaqsText(serializeFaqs(data.faqs ?? []));
        setCategory(data.category ?? "");
        setPlatforms(data.platforms && data.platforms.length > 0 ? data.platforms : ["Desktop"]);
        setControls(data.controls ?? "");
        setDeveloper(data.developer ?? "");
        setReleaseDate(data.releaseDate ?? "");
        setThumbnailUrl(data.thumbnail ?? "");
        setYoutubeUrl(data.youtubeEmbedUrl ?? "");
        setGameUrl(data.gameUrl ?? null);
        // existing URL save — new file upload cheyyakapote idi fallback ga use avutundi
        // || use chestamu ?? kaadu — empty string "" ni || skip chestundi
        setExistingGameUrl(data.gameUrl || data.embedUrl || null);

        if (data.gameUrl && !data.gameUrl.includes("github.io")) {
          setSourceType("external");
          setExternalUrl(data.gameUrl);
        } else {
          setSourceType("zip");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus({
            state: "error",
            message: err instanceof Error ? err.message : "Failed to load game data.",
          });
        }
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editSlug]);

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleZipChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".zip")) {
        setStatus({ state: "error", message: "Please upload a .zip file." });
        return;
      }

      if (!slug) {
        setStatus({ state: "error", message: "Enter a game slug before uploading the zip." });
        return;
      }

      setGameUrl(null);
      setStatus({ state: "extracting" });

      try {
        setStatus({
          state: "uploading",
          progress: { current: 0, total: 1, currentFile: "Reading zip..." },
        });

        const base64 = await fileToBase64(file);

        setStatus({
          state: "uploading",
          progress: { current: 1, total: 2, currentFile: "Pushing to GitHub..." },
        });

        const result = await adminPostJSON<{ ok: boolean; gameUrl: string }>(
          "/api/admin/upload-zip",
          { slug, zipBase64: base64 }
        );

        setStatus({
          state: "uploading",
          progress: { current: 2, total: 2, currentFile: "Done" },
        });

        setGameUrl(result.gameUrl);
        setStatus({ state: "idle" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error during zip upload.";
        setStatus({ state: "error", message });
      }
    },
    [slug]
  );

  const handleHtmlFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".html")) {
        setStatus({ state: "error", message: "Please upload a .html file." });
        return;
      }

      if (!slug) {
        setStatus({ state: "error", message: "Enter a game slug before uploading the file." });
        return;
      }

      setGameUrl(null);
      setStatus({
        state: "uploading",
        progress: { current: 1, total: 1, currentFile: "Pushing to GitHub..." },
      });

      try {
        const base64 = await fileToBase64(file);

        const result = await adminPostJSON<{ ok: boolean; gameUrl: string }>(
          "/api/admin/upload-html",
          { slug, htmlBase64: base64 }
        );

        setGameUrl(result.gameUrl);
        setStatus({ state: "idle" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error during upload.";
        setStatus({ state: "error", message });
      }
    },
    [slug]
  );

  const handleSourceTypeChange = (type: SourceType) => {
    setSourceType(type);
    setGameUrl(null);
    setExternalUrl("");
    setStatus({ state: "idle" });
  };

  const handleExternalUrlChange = (value: string) => {
    setExternalUrl(value);
    setGameUrl(value.trim() || null);
  };

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  // edit mode lo new upload chesthe gameUrl, lekapothe existingGameUrl fallback
  const effectiveGameUrl = gameUrl || (isEditMode ? existingGameUrl : null);

  const canSave =
    !!slug &&
    !!title.trim() &&
    // edit mode lo game URL already Firebase lo undi — new upload mandatory kaadu
    // new game lo: file upload chesina taruvate enable avvaali
    (isEditMode ? true : !!(gameUrl || externalUrl)) &&
    (sourceType !== "external" || isValidUrl(externalUrl)) &&
    !loadingExisting &&
    status.state !== "uploading" &&
    status.state !== "extracting" &&
    status.state !== "saving";

  const handleSave = async () => {
    // edit mode lo: new upload cheyyakapote effectiveGameUrl null avvachu
    // kaani faqs/tips/description anni save avutayi — gameUrl block cheyyakunda
    // new game lo: gameUrl mandatory
    if (!isEditMode && !effectiveGameUrl) return;

    setStatus({ state: "saving" });

    try {
      const youtubeEmbed = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : null;

      if (youtubeUrl && !youtubeEmbed) {
        throw new Error("YouTube URL is invalid — could not extract a video ID.");
      }

      const baseFields = {
        id: slug,
        title: title.trim(),
        description: description.trim(),
        howToPlay: howToPlay.trim(),
        tips: parseTips(tipsText),
        faqs: parseFaqs(faqsText),
        category: category.trim() || "Uncategorized",
        platforms: platforms.length > 0 ? platforms : ["Desktop"],
        controls: controls.trim(),
        developer: developer.trim(),
        releaseDate: releaseDate.trim(),
        thumbnail: thumbnailUrl || "",
        youtubeEmbedUrl: youtubeEmbed || "",

        // effectiveGameUrl null aithe (edit mode, no new upload) — gameUrl fields skip cheyyadam
        // existing Firebase values overwrite avvaavu
        ...(effectiveGameUrl !== null && {
          gameUrl: sourceType === "external" ? "" : effectiveGameUrl,
          embedUrl: sourceType === "external" ? effectiveGameUrl : "",
        }),

        updatedAt: serverTimestamp(),
      };

      if (isEditMode) {
        await updateDoc(doc(db, "games", slug), baseFields);
      } else {
        await setDoc(doc(db, "games", slug), {
          ...baseFields,
          playCount: 0,
          likes: 0,
          createdAt: serverTimestamp(),
        });
      }

      try {
        await adminPostJSON("/api/revalidate", { gameId: slug });
      } catch (revalErr) {
        console.error("Revalidation failed:", revalErr);
      }

      setStatus({ state: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save game.";
      setStatus({ state: "error", message });
    }
  };

  return (
    <div className="max-w-xl space-y-5 text-[var(--t)]">
      <h2 className="text-xl font-bold">{isEditMode ? "Edit Game" : "Upload New Game"}</h2>

      {loadingExisting && (
        <p className="text-sm text-[var(--t3)]">Loading game data...</p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Game Slug (ID)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="e.g. snake-x"
          disabled={isEditMode}
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-[var(--t3)] mt-1">
          {isEditMode
            ? "The slug can't be changed after creation — it's the Firestore document ID and storage path."
            : "Lowercase letters, numbers, and hyphens only. This becomes the storage folder and Firestore document ID."}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Snake X"
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Short summary shown on the game card, search results, and at the top of the game page..."
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">How to Play</label>
        <textarea
          value={howToPlay}
          onChange={(e) => setHowToPlay(e.target.value)}
          rows={4}
          placeholder={"Explain the controls and objective. Each line becomes its own paragraph.\nExample:\nUse arrow keys to move the snake.\nEat the red apples to grow longer."}
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm resize-none"
        />
        <p className="text-xs text-[var(--t3)] mt-1">
          Each line is rendered as its own paragraph on the game page.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tips &amp; Tricks</label>
        <textarea
          value={tipsText}
          onChange={(e) => setTipsText(e.target.value)}
          rows={4}
          placeholder={"One tip per line. Example:\nCollect power-ups before tackling tougher levels.\nWatch the timer in the top-right corner."}
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm resize-none"
        />
        <p className="text-xs text-[var(--t3)] mt-1">
          One tip per line — rendered as a bulleted list.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">FAQs (Questions &amp; Answers)</label>
        <textarea
          value={faqsText}
          onChange={(e) => setFaqsText(e.target.value)}
          rows={6}
          placeholder={"Q: Is this game free to play?\nA: Yes, completely free, no downloads needed.\n\nQ: Does it work on mobile?\nA: Yes, it's fully responsive."}
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm resize-none font-mono"
        />
        <p className="text-xs text-[var(--t3)] mt-1">
          Use "Q:" and "A:" prefixes, one pair per block, separated by a blank line.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Arcade, Puzzle"
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Platforms</label>
        <div className="flex flex-wrap gap-4">
          {(["Desktop", "Mobile", "Tablet"] as const).map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2 text-sm text-[var(--t2)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={platforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="w-4 h-4 rounded border-[var(--b)] bg-[var(--bg2)] accent-[var(--red)] cursor-pointer"
              />
              {platform}
            </label>
          ))}
        </div>
        <p className="text-xs text-[var(--t3)] mt-1">
          Select all device types this game works well on.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Controls</label>
        <input
          type="text"
          value={controls}
          onChange={(e) => setControls(e.target.value)}
          placeholder="e.g. Use Arrow Keys to move, Space to jump"
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Developer</label>
          <input
            type="text"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            placeholder="e.g. Lokayantra"
            className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Thumbnail</label>

        {thumbnailUrl && (
          <div className="relative w-full max-w-xs aspect-video rounded overflow-hidden border border-[var(--b)]">
            <Image src={thumbnailUrl} alt="Thumbnail preview" fill className="object-cover" />
          </div>
        )}

        <CloudinaryUploadButton
          onUploaded={(url) => setThumbnailUrl(url)}
          label={thumbnailUrl ? "Replace Thumbnail" : "Upload Thumbnail"}
          folder="thumbnails"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">YouTube Trailer URL (optional)</label>
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Game Source</label>

        <div className="flex gap-2">
          {(["zip", "html", "external"] as SourceType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSourceTypeChange(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition ${
                sourceType === type
                  ? "bg-[var(--red)] text-white border-[var(--red)]"
                  : "bg-[var(--bg2)] text-[var(--t2)] border-[var(--b)] hover:border-[var(--red)]"
              }`}
            >
              {type === "zip" && "ZIP File"}
              {type === "html" && "Single HTML File"}
              {type === "external" && "External URL"}
            </button>
          ))}
        </div>

        {sourceType === "zip" && (
          <>
            <input
              type="file"
              accept=".zip"
              onChange={handleZipChange}
              disabled={status.state === "extracting" || status.state === "uploading" || status.state === "saving"}
              className="block w-full text-sm text-[var(--t2)] file:mr-3 file:py-2 file:px-4
                         file:rounded file:border-0 file:bg-[var(--red)] file:text-white
                         file:text-sm file:font-medium hover:file:opacity-90
                         file:cursor-pointer disabled:opacity-50"
            />
            <p className="text-xs text-[var(--t3)]">
              Upload a .zip containing your game's index.html and all assets. Folder structure is preserved.
            </p>
            {isEditMode && existingGameUrl && !gameUrl && (
              <p className="text-xs text-green-400">✓ Existing game files will be kept. Upload a new zip only to replace them.</p>
            )}
          </>
        )}

        {sourceType === "html" && (
          <>
            <input
              type="file"
              accept=".html"
              onChange={handleHtmlFileChange}
              disabled={status.state === "extracting" || status.state === "uploading" || status.state === "saving"}
              className="block w-full text-sm text-[var(--t2)] file:mr-3 file:py-2 file:px-4
                         file:rounded file:border-0 file:bg-[var(--red)] file:text-white
                         file:text-sm file:font-medium hover:file:opacity-90
                         file:cursor-pointer disabled:opacity-50"
            />
            <p className="text-xs text-[var(--t3)]">
              Upload a single self-contained .html file (all CSS/JS inlined). It will be saved as index.html.
            </p>
            {isEditMode && existingGameUrl && !gameUrl && (
              <p className="text-xs text-green-400">✓ Existing game files will be kept. Upload a new file only to replace them.</p>
            )}
          </>
        )}

        {sourceType === "external" && (
          <>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => handleExternalUrlChange(e.target.value)}
              placeholder="https://username.github.io/game/ or https://username.itch.io/game/embed"
              className="w-full px-3 py-2 rounded bg-[var(--bg2)] border border-[var(--b)] text-sm"
            />
            <p className="text-xs text-[var(--t3)]">
              Paste a direct link to a playable HTML5 game (e.g. GitHub Pages, itch.io embed URL). This URL is used directly as the iframe source — no files are uploaded.
            </p>
          </>
        )}

        {status.state === "extracting" && (
          <p className="text-xs text-[var(--t3)]">Cleaning up old files and reading file...</p>
        )}

        {status.state === "uploading" && (
          <div className="space-y-1">
            <div className="w-full bg-[var(--bg3)] rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-[var(--red)] transition-all"
                style={{
                  width: `${(status.progress.current / status.progress.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-[var(--t3)]">
              Uploading {status.progress.current}/{status.progress.total}: {status.progress.currentFile}
            </p>
          </div>
        )}

        {gameUrl && sourceType !== "external" && (
          <p className="text-sm text-green-400">✓ Game files uploaded. index.html ready.</p>
        )}

        {gameUrl && sourceType === "external" && isValidUrl(gameUrl) && (
          <p className="text-sm text-green-400">✓ External URL looks valid.</p>
        )}

        {gameUrl && sourceType === "external" && !isValidUrl(gameUrl) && (
          <p className="text-sm text-[var(--red)]">⚠ Enter a valid http(s) URL.</p>
        )}
      </div>

      {status.state === "error" && (
        <p className="text-sm text-[var(--red)]">⚠ {status.message}</p>
      )}

      {status.state === "success" && (
        <p className="text-sm text-green-400">
          {isEditMode ? "✓ Game updated successfully." : "✓ Game saved successfully."}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="px-4 py-2 bg-[var(--red)] text-white rounded text-sm font-medium disabled:opacity-50"
      >
        {status.state === "saving"
          ? isEditMode ? "Updating..." : "Saving..."
          : isEditMode ? "Update Game" : "Upload Game"}
      </button>
    </div>
  );
}

function parseTips(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseFaqs(text: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  let pendingQuestion: string | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^q[:.]/i.test(line)) {
      pendingQuestion = line.replace(/^q[:.]\s*/i, "").trim();
    } else if (/^a[:.]/i.test(line) && pendingQuestion) {
      const answer = line.replace(/^a[:.]\s*/i, "").trim();
      faqs.push({ question: pendingQuestion, answer });
      pendingQuestion = null;
    }
  }

  return faqs;
}

function serializeFaqs(faqs: { question: string; answer: string }[]): string {
  return faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}