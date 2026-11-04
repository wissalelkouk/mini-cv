const { execSync } = require("child_process");

let out;
try {
  out = execSync("npm audit --json", { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
} catch (e) {
  out = e.stdout;
}

const report = JSON.parse(out);
if (report.error) {
  console.error("Erreur npm audit :", report.error);
  process.exit(1);
}

// npm embarqué dans @semantic-release/npm : plugin non chargé par .releaserc.json
const EMBEDDED = "node_modules/npm/node_modules/";
const blocking = [];

for (const [name, v] of Object.entries(report.vulnerabilities || {})) {
  if (!["high", "critical"].includes(v.severity)) continue;
  const nodes = v.nodes || [];
  const outside = nodes.filter((n) => !n.startsWith(EMBEDDED));
  if (nodes.length === 0 || outside.length > 0) {
    blocking.push(`${name} (${v.severity}) ${outside.join(", ")}`);
  } else {
    console.log(`Ignoré (npm embarqué, non exécuté) : ${name} (${v.severity})`);
  }
}

if (blocking.length > 0) {
  console.error("Vulnérabilités bloquantes :\n" + blocking.join("\n"));
  process.exit(1);
}
console.log("Aucune vulnérabilité high/critical hors npm embarqué.");
