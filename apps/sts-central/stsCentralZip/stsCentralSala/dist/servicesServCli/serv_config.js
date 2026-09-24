"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMessage = ConfigMessage;
require("dotenv/config");
const supabaseConnectClient_1 = require("../supabaseConnect/supabaseConnectClient");
const utils_1 = require("../utils");
const resolveTable_1 = require("./resolveTable");
const supabase = (0, supabaseConnectClient_1.getSupabaseClient)();
async function ConfigMessage(casino, inFkConfigTable, inIdTable) {
    console.log("Datos de configuración en Raw:", `fk_config: ${typeof inFkConfigTable}`, inFkConfigTable, `id_table: ${typeof inIdTable}`, inIdTable);
    // Resolver la mesa real por casino. Primero se intenta por número de mesa,
    // y si no existe, por id real de table_table.
    let resolved = await (0, resolveTable_1.resolveTableByCasinoAndNumber)(casino.casinoCode, inIdTable);
    if (!resolved) {
        resolved = await (0, resolveTable_1.resolveTableByCasinoAndId)(casino.casinoCode, inIdTable);
    }
    if (!resolved) {
        console.warn(`[AVISO] Mesa ${inIdTable} no resuelta en el casino ${casino.casinoCode}. Se ignora la configuración.`);
        return;
    }
    const { data: outFkConfigTable, error: errorOutFkConfigTable } = await supabase.from("table_table").select("*").eq("id", resolved.id).maybeSingle();
    if (errorOutFkConfigTable) {
        console.error("Error al obtener datos de table_table:", errorOutFkConfigTable);
        return;
    }
    if (!outFkConfigTable?.fk_config) {
        console.log("out_fk_config_table es indefinido o null");
        return;
    }
    if (inFkConfigTable === null || inFkConfigTable < outFkConfigTable.fk_config) {
        (0, utils_1.publicarDatos)(casino.client, casino.topicSrvConfig, outFkConfigTable);
    }
    else {
        console.log("No se envía nada porque in_fk_config_table es mayor o igual a out_fk_config_table");
    }
}
