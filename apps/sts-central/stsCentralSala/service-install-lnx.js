// service-install-lnx.js - stscentralsala (corregido: no se rompe en cada install)
// Ejecutar SIEMPRE con: /usr/local/bin/node22 ./service-install-lnx.js (requiere root)
// Requiere Node22 por @supabase/supabase-js (WebSocket nativo). v20 crashea.
let Service = require("node-linux").Service;
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Carga .env del mismo directorio sin dependencias externas.
// Los secretos NUNCA se commitean: ver .env.example. El .env real esta gitignoreado.
function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Quita comillas simples/dobles envolventes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv();

function req(name) {
  const v = process.env[name];
  if (!v) {
    console.error('[error] Falta variable de entorno requerida: ' + name + '. Copie .env.example a .env y complete los valores.');
    process.exit(1);
  }
  return v;
}
function opt(name, fallback) {
  return process.env[name] || fallback;
}

const SERVICE_NAME = "stscentralsala";
const FIX_NODE = "/usr/local/bin/node22";
const FIX_USER = "admsielcon";
const FIX_GROUP = "admsielcon";

function patchService() {
  const svcPath = "/etc/systemd/system/" + SERVICE_NAME + ".service";
  if (!fs.existsSync(svcPath)) {
    console.warn("[patch] no existe " + svcPath + " (node-linux aun no lo creo?)");
    return;
  }
  let txt = fs.readFileSync(svcPath, "utf8");
  const orig = txt;
  // 1) ExecStart: forzar node accesible (evita /root/.nvm/... -> 203/EXEC Permission denied)
  txt = txt.replace(/^ExecStart=.*\/bin\/node\s+/m, "ExecStart=" + FIX_NODE + " ");
  // 2) User/Group correctos
  txt = txt.replace(/^User=.*$/m, "User=" + FIX_USER);
  txt = txt.replace(/^Group=.*$/m, "Group=" + FIX_GROUP);
  // 3) Des-escapear comillas HTML que rompen JSON.parse de MQTT_CASINOS (&quot; -> ")
  // node-linux escapa " como &quot; en Environment -> JSON.parse falla
  txt = txt.replace(/&quot;/g, '"');
  txt = txt.replace(/&#39;|&apos;/g, "'");
  txt = txt.replace(/&amp;/g, "&");
  // 4) Robustez
  if (!/^After=/m.test(txt)) txt = txt.replace("[Unit]", "[Unit]\nAfter=network.target");
  if (!/^RestartSec=/m.test(txt)) txt = txt.replace(/^Restart=always$/m, "Restart=always\nRestartSec=5");
  if (txt !== orig) {
    const bak = svcPath + ".bak." + new Date().toISOString().slice(0, 10).replace(/-/g, "");
    fs.copyFileSync(svcPath, bak);
    console.log("[patch] backup en " + bak);
    fs.writeFileSync(svcPath, txt);
    console.log("[patch] " + svcPath + " corregido. Node=" + FIX_NODE + " User=" + FIX_USER);
    try { execSync("systemctl daemon-reload", { stdio: "inherit" }); console.log("[patch] daemon-reload OK"); }
    catch (e) { console.warn("[patch] daemon-reload fallo: " + e.message); }
  } else {
    console.log("[patch] sin cambios necesarios");
  }
  try {
    const v = execSync(FIX_NODE + " --version").toString().trim();
    console.log("[patch] node OK: " + FIX_NODE + " " + v);
  } catch (e) { console.warn("[patch] WARN " + FIX_NODE + " no ejecutable."); }
}

if (process.execPath !== FIX_NODE) {
  console.warn("[warn] Ejecutando con " + process.execPath + " - se recomienda " + FIX_NODE + ". Igual se auto-parcheara el .service.");
}

// Create a new service object
// Secretos (SUPABASE_*, MQTT_CASINOS) se leen de process.env / .env local, no hardcodeados.
let svc = new Service({
  name: SERVICE_NAME,
  description: "STS Central Sala",
  script: "./dist/mainService.js",
  user: FIX_USER,
  group: FIX_GROUP,
  env: [
    { name: "NODE_ENV", value: opt("NODE_ENV", "production") },
    { name: "SUPABASE_URL", value: req("SUPABASE_URL") },
    { name: "SUPABASE_ANON_KEY", value: req("SUPABASE_ANON_KEY") },
    { name: "SUPABASE_SERVICE_KEY", value: req("SUPABASE_SERVICE_KEY") },
    { name: "MQTT_TOPIC_GAME", value: opt("MQTT_TOPIC_GAME", "STS-MESAS/game/#") },
    { name: "MQTT_TOPIC_CONFIG", value: opt("MQTT_TOPIC_CONFIG", "SimuSts/STS-Casino/Cli/Config/#") },
    { name: "MQTT_TOPIC_CONFIG_SRV", value: opt("MQTT_TOPIC_CONFIG_SRV", "SimuSts/STS-Casino/Srv/Config") },
    { name: "MQTT_TOPIC_GAME_SYNC", value: opt("MQTT_TOPIC_GAME_SYNC", "STS-MESAS/STS-Casino/GameSync/") },
    { name: "MQTT_TOPIC_GAME_SYNC_SUB", value: opt("MQTT_TOPIC_GAME_SYNC_SUB", "STS-MESAS/GameSync/#") },
    { name: "MQTT_CASINOS", value: req("MQTT_CASINOS") },
  ],
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  try { patchService(); } catch (e) { console.error("[patch] error: " + (e && e.message)); }
  svc.start();
});

svc.install();