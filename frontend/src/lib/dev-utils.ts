export function decodeJwt(token: string): { header: object; payload: object; signature: string } | { error: string } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { error: "Invalid JWT format (expected 3 parts)" };
  try {
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      header: decode(parts[0]),
      payload: decode(parts[1]),
      signature: parts[2],
    };
  } catch {
    return { error: "Failed to decode JWT payload" };
  }
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string
): { matches: RegExpMatchArray | null; error: string | null; groups: string[] } {
  try {
    const re = new RegExp(pattern, flags);
    const matches = text.match(re);
    const groups: string[] = [];
    if (matches) {
      const g = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let m: RegExpExecArray | null;
      while ((m = g.exec(text)) !== null) {
        groups.push(m[0]);
        if (!flags.includes("g")) break;
      }
    }
    return { matches, error: null, groups };
  } catch (e) {
    return { matches: null, error: e instanceof Error ? e.message : "Invalid regex", groups: [] };
  }
}

export function generatePassword(length: number, options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  const sets: string[] = [];
  if (options.lowercase) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (options.uppercase) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (options.numbers) sets.push("0123456789");
  if (options.symbols) sets.push("!@#$%^&*()-_=+[]{}|;:,.<>?");
  if (!sets.length) sets.push("abcdefghijklmnopqrstuvwxyz");

  const all = sets.join("");
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += all[arr[i] % all.length];
  }
  return pwd;
}

export function analyzeHeadings(html: string) {
  if (typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings: { level: number; tag: string; text: string }[] = [];
  doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
    headings.push({
      level: parseInt(el.tagName[1], 10),
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || "",
    });
  });
  return headings;
}

export function metaDescriptionStats(text: string) {
  const len = text.length;
  const pixels = Math.round(len * 0.55);
  let status: "short" | "good" | "long" = "good";
  if (len < 120) status = "short";
  else if (len > 160) status = "long";
  return { length: len, pixels, status };
}
