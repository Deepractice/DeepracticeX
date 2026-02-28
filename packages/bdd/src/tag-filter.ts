import type * as messages from "@cucumber/messages";

export function matchesTags(
  tags: readonly messages.PickleTag[],
  tagExpression: string | undefined
): boolean {
  if (!tagExpression) return true;

  const tagNames = new Set(tags.map((t) => t.name));
  return evaluateTagExpression(tagExpression, tagNames);
}

function evaluateTagExpression(
  expression: string,
  tags: Set<string>
): boolean {
  const tokens = tokenize(expression);
  return parseOr(tokens, 0, tags).result;
}

interface ParseResult {
  result: boolean;
  pos: number;
}

function tokenize(expression: string): string[] {
  return expression
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function parseOr(
  tokens: string[],
  pos: number,
  tags: Set<string>
): ParseResult {
  let { result, pos: nextPos } = parseAnd(tokens, pos, tags);
  while (nextPos < tokens.length && tokens[nextPos] === "or") {
    const right = parseAnd(tokens, nextPos + 1, tags);
    result = result || right.result;
    nextPos = right.pos;
  }
  return { result, pos: nextPos };
}

function parseAnd(
  tokens: string[],
  pos: number,
  tags: Set<string>
): ParseResult {
  let { result, pos: nextPos } = parseNot(tokens, pos, tags);
  while (nextPos < tokens.length && tokens[nextPos] === "and") {
    const right = parseNot(tokens, nextPos + 1, tags);
    result = result && right.result;
    nextPos = right.pos;
  }
  return { result, pos: nextPos };
}

function parseNot(
  tokens: string[],
  pos: number,
  tags: Set<string>
): ParseResult {
  if (pos < tokens.length && tokens[pos] === "not") {
    const { result, pos: nextPos } = parsePrimary(tokens, pos + 1, tags);
    return { result: !result, pos: nextPos };
  }
  return parsePrimary(tokens, pos, tags);
}

function parsePrimary(
  tokens: string[],
  pos: number,
  tags: Set<string>
): ParseResult {
  if (pos >= tokens.length) {
    return { result: true, pos };
  }

  if (tokens[pos] === "(") {
    const { result, pos: nextPos } = parseOr(tokens, pos + 1, tags);
    // skip closing paren
    return { result, pos: nextPos + 1 };
  }

  const tag = tokens[pos];
  return { result: tags.has(tag), pos: pos + 1 };
}
