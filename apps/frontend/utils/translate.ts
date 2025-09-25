export const CHUNK_SIZE = 5000;

const CONCURRENCY = 1;
const DELAY = 2500;

async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function runWithThrottle<T>(
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];
  let i = 0;

  while (i < tasks.length) {
    const slice = tasks.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(slice.map((t) => t()));
    results.push(...batchResults);

    i += CONCURRENCY;

    if (i < tasks.length) {
      await delay(DELAY);
    }
  }

  return results;
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
}

async function translateChunk(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const url = `${
    process.env.NEXT_PUBLIC_LINGVA_URL || "https://lingva.ml"
  }/api/v1/${source.toLowerCase()}/${target.toLowerCase()}/${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translation failed for ${target}`);
  const data = await res.json();
  return data.translation;
}

export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const chunks = chunkText(text);
  const translatedChunks = await Promise.all(
    chunks.map((c) => translateChunk(c, source, target))
  );
  return translatedChunks.join("");
}

type TiptapNode = {
  type?: string;
  text?: string;
  content?: TiptapNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

async function translateBlockNode(
  node: TiptapNode,
  source: string,
  target: string
): Promise<TiptapNode> {
  if (!node.content || node.content.length === 0) return node;

  // Collect inline text nodes
  const texts: string[] = [];
  const textNodes: TiptapNode[] = [];
  node.content.forEach((child) => {
    if (child.text) {
      texts.push(child.text);
      textNodes.push(child);
    }
  });

  if (texts.length > 0) {
    // Join into one string
    const joined = texts.join(" ␞ "); // safe separator

    // Translate the block's text together
    const translatedJoined = await translateText(joined, source, target);

    // Split back
    const translatedParts = translatedJoined.split("␞");

    // Rebuild children with translated text
    let i = 0;
    const newContent = node.content.map((child) => {
      if (child.text) {
        return { ...child, text: translatedParts[i++]?.trim() ?? "" };
      }
      return child;
    });

    return { ...node, content: newContent };
  }

  // If no inline text, recurse deeper (nested lists, etc.)
  const translatedChildren = await Promise.all(
    node.content.map((child) => translateBlockNode(child, source, target))
  );

  return { ...node, content: translatedChildren };
}

/**
 * Translate an entire Tiptap document
 */
export async function translateTiptapJSON(
  doc: TiptapNode,
  source: string,
  target: string
): Promise<TiptapNode> {
  if (!doc.content) return doc;

  const tasks = doc.content.map(
    (block) => async () => translateBlockNode(block, source, target)
  );

  const translatedContent = await runWithThrottle(tasks);

  return { ...doc, content: translatedContent };
}

export function sanitizeNode(node: TiptapNode): TiptapNode | null {
  if (!node) return null;

  // If it's a text node, drop if empty
  if (node.type === "text") {
    if (!node.text || node.text.trim() === "") {
      return null;
    }
    return node;
  }

  // If it has children, sanitize them recursively
  if (node.content) {
    const cleanContent = node.content
      .map(sanitizeNode)
      .filter((child): child is TiptapNode => child !== null);

    // Drop empty paragraphs or headings with no content
    if (
      (node.type === "paragraph" || node.type === "heading") &&
      cleanContent.length === 0
    ) {
      return null;
    }

    return { ...node, content: cleanContent };
  }

  return node;
}

export function sanitizeDoc(doc: TiptapNode): TiptapNode {
  const clean = sanitizeNode(doc);
  if (!clean) {
    // Fallback to an empty doc if all content was invalid
    return { type: "doc", content: [] };
  }
  return clean;
}
