import slugify from "slugify";

export function cleanText(value = "") {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function makeSlug(value) {
  return slugify(cleanText(value) || "untitled", {
    lower: true,
    strict: true,
  });
}

export function normalizeUrl(value, baseUrl) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, baseUrl);
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function imageKey(value, baseUrl) {
  const normalized = normalizeUrl(value, baseUrl);

  if (!normalized) {
    return "";
  }

  const url = new URL(normalized);
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function getArticleSlug(url) {
  const parsed = new URL(url);
  return parsed.pathname.split("/").filter(Boolean).at(-1) || "";
}

export function isArticleUrl(value, baseUrl) {
  const url = normalizeUrl(value, baseUrl);

  if (!url) {
    return false;
  }

  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);

  return (
    parsed.hostname === new URL(baseUrl).hostname &&
    parts[0] === "articles" &&
    parts.length === 2 &&
    parts[1] !== "category" &&
    parts[1] !== "tag"
  );
}

export function topicNameFromListingUrl(value) {
  const parsed = new URL(value);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const markerIndex = parts.findIndex((part) => part === "category" || part === "tag");

  if (markerIndex === -1 || !parts[markerIndex + 1]) {
    return "";
  }

  return cleanText(decodeURIComponent(parts[markerIndex + 1].replace(/\+/g, " ")));
}

export function estimateReadTime(blocks) {
  const words = blocks
    .filter((block) => block.type === "paragraph")
    .map((block) => block.text)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 225))} min read`;
}

export function toPublishedDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function getJsonLdObjects($) {
  const objects = [];

  $("script[type='application/ld+json']").each((_, element) => {
    const text = $(element).text();

    try {
      const parsed = JSON.parse(text);
      objects.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore malformed structured data and fall back to visible page markup.
    }
  });

  return objects;
}

export function uniqueSorted(values) {
  return [...new Set(values.map(cleanText).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
}

export function isLikelyContentImage(src) {
  const lower = src.toLowerCase();

  return (
    src &&
    !lower.includes("memberaccountavatars") &&
    !lower.includes("thirdpartymemberavatar") &&
    !lower.includes("favicon") &&
    !lower.includes("logo")
  );
}
