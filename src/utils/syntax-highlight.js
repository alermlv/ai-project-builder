import { escapeHtml } from "./formatters.js";

export function highlightCode(code = "", language = "") {
  const normalizedLanguage = String(language || "").toLowerCase();
  const source = String(code ?? "");

  if (normalizedLanguage === "javascript" || normalizedLanguage === "js") {
    return highlightJavaScript(source);
  }

  if (normalizedLanguage === "html") {
    return highlightHtml(source);
  }

  if (normalizedLanguage === "css") {
    return highlightCss(source);
  }

  if (
    normalizedLanguage === "bash" ||
    normalizedLanguage === "sh" ||
    normalizedLanguage === "shell"
  ) {
    return highlightBash(source);
  }

  return escapeHtml(source);
}

function highlightJavaScript(code) {
  let html = escapeHtml(code);

  html = wrapStrings(html);
  html = wrapSingleLineComments(html);
  html = wrapKeywords(html, [
    "import",
    "from",
    "export",
    "default",
    "return",
    "const",
    "let",
    "var",
    "function",
    "if",
    "else",
    "try",
    "catch",
    "await",
    "async",
    "new",
    "throw",
    "null",
    "true",
    "false",
  ]);
  html = wrapNumbers(html);
  html = wrapJavaScriptProperties(html, [
    "log",
    "error",
    "json",
    "stringify",
    "parse",
    "map",
    "find",
    "join",
    "trim",
    "slice",
    "replaceAll",
    "setTimeout",
    "writeText",
    "getElementById",
    "addEventListener",
    "textContent",
  ]);

  return html;
}

function highlightHtml(code) {
  return escapeHtml(code).replace(
    /(&lt;\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?&gt;)/g,
    (_, open, tagName, attributes, close) => {
      const highlightedAttributes = attributes.replace(
        /([a-zA-Z:-]+)=(&quot;.*?&quot;|&#039;.*?&#039;)/g,
        '<span class="token-attr">$1</span>=<span class="token-string">$2</span>',
      );

      return `${open}<span class="token-tag">${tagName}</span>${highlightedAttributes}${close}`;
    },
  );
}

function highlightCss(code) {
  let html = escapeHtml(code);

  html = html.replace(
    /([.#]?[a-zA-Z][\w\-:\s>#.*[\]"=()]+)\s*(\{)/g,
    '<span class="token-selector">$1</span> $2',
  );

  html = html.replace(
    /([a-zA-Z-]+)(:\s*)([^;]+)(;)/g,
    '<span class="token-property">$1</span>$2<span class="token-value">$3</span>$4',
  );

  html = wrapNumbers(html);

  return html;
}

function highlightBash(code) {
  let html = escapeHtml(code);

  html = html.replace(/(#.*$)/gm, '<span class="token-comment">$1</span>');
  html = wrapKeywords(html, ["npm", "node", "cd", "mkdir", "touch", "git"]);
  html = wrapStrings(html);
  html = wrapNumbers(html);

  return html;
}

function wrapStrings(html) {
  return html.replace(
    /(&quot;.*?&quot;|&#039;.*?&#039;|`[\s\S]*?`)/g,
    '<span class="token-string">$1</span>',
  );
}

function wrapSingleLineComments(html) {
  return html.replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>');
}

function wrapKeywords(html, keywords) {
  const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  return html.replace(pattern, '<span class="token-keyword">$1</span>');
}

function wrapNumbers(html) {
  return html.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="token-number">$1</span>',
  );
}

function wrapJavaScriptProperties(html, properties) {
  const pattern = new RegExp(`(?<=\\.)(${properties.join("|")})\\b`, "g");
  return html.replace(pattern, '<span class="token-property">$1</span>');
}
