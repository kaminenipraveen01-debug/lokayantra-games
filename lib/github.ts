/**
 * Minimal GitHub Contents API helper for pushing a base64-encoded
 * zip file to the lokayantra-games repository.
 *
 * Requires a GitHub Personal Access Token (classic) with `repo` scope,
 * stored server-side only as GITHUB_TOKEN.
 */

const GITHUB_API = "https://api.github.com";

interface GithubConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

function getConfig(): GithubConfig {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO || "lokayantra-games";
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!owner || !token) {
    throw new Error("GITHUB_OWNER and GITHUB_TOKEN env vars are required.");
  }

  return { owner, repo, token, branch };
}

/**
 * Creates or updates a file in the repo via the Contents API.
 * If the file already exists, fetches its current SHA first (required
 * by GitHub for updates).
 */
export async function pushFileToGithub(
  path: string,
  base64Content: string,
  commitMessage: string
): Promise<{ commitSha: string }> {
  const { owner, repo, token, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  // Check if file already exists, to get its SHA for an update.
  let existingSha: string | undefined;
  const existingRes = await fetch(`${url}?ref=${branch}`, {
    headers: githubHeaders(token),
  });

  if (existingRes.ok) {
    const existing = await existingRes.json();
    existingSha = existing.sha;
  } else if (existingRes.status !== 404) {
    const err = await existingRes.text();
    throw new Error(`GitHub API error checking existing file: ${err}`);
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error pushing file: ${err}`);
  }

  const data = await res.json();
  return { commitSha: data.commit?.sha as string };
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/**
 * Recursively deletes a folder (e.g. "games/{slug}") by building a new
 * tree without it and committing that tree as the new HEAD of `branch`.
 * The Contents API has no folder-delete operation, so this uses the
 * lower-level Git Data API (trees + commits + refs).
 */
export async function deleteGameFolder(slug: string): Promise<void> {
  const { owner, repo, token, branch } = getConfig();
  const folderPath = `games/${slug}`;

  // 1. Get the latest commit on the branch
  const refRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    { headers: githubHeaders(token) }
  );
  if (!refRes.ok) throw new Error(`Failed to get ref: ${await refRes.text()}`);
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Get the tree for that commit (recursive)
  const commitRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
    { headers: githubHeaders(token) }
  );
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${await commitRes.text()}`);
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${baseTreeSha}?recursive=1`,
    { headers: githubHeaders(token) }
  );
  if (!treeRes.ok) throw new Error(`Failed to get tree: ${await treeRes.text()}`);
  const treeData = await treeRes.json();

  // 3. Filter out every blob under games/{slug}/, mark each for deletion
  const deletions = (treeData.tree as Array<{ path: string; type: string }>)
    .filter((item) => item.type === "blob" && item.path.startsWith(`${folderPath}/`))
    .map((item) => ({
      path: item.path,
      mode: "100644",
      type: "blob",
      sha: null, // null sha = delete this path
    }));

  if (deletions.length === 0) return; // nothing to delete

  // 4. Create a new tree with those deletions applied on top of base_tree
  const newTreeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees`, {
    method: "POST",
    headers: githubHeaders(token),
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: deletions,
    }),
  });
  if (!newTreeRes.ok) throw new Error(`Failed to create tree: ${await newTreeRes.text()}`);
  const newTreeData = await newTreeRes.json();

  // 5. Create a new commit pointing at the new tree
  const newCommitRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/commits`, {
    method: "POST",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: `Delete game: ${slug}`,
      tree: newTreeData.sha,
      parents: [latestCommitSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${await newCommitRes.text()}`);
  const newCommitData = await newCommitRes.json();

  // 6. Move the branch ref to the new commit
  const updateRefRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: "PATCH",
      headers: githubHeaders(token),
      body: JSON.stringify({ sha: newCommitData.sha }),
    }
  );
  if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${await updateRefRes.text()}`);
}



/**
 * Assumes Pages is serving from the repo root of `branch` (or a
 * `gh-pages` branch produced by the workflow) — see deploy-games.yml.
 */
export function getPagesUrl(slug: string): string {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO || "lokayantra-games";
  return `https://${owner}.github.io/${repo}/games/${slug}/index.html`;
}
