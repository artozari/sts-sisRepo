"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGameTablePartition = ensureGameTablePartition;
exports.startPartitionManager = startPartitionManager;
const node_cron_1 = __importDefault(require("node-cron"));
const supabaseConnectClient_1 = require("../supabaseConnect/supabaseConnectClient");
const supabase = (0, supabaseConnectClient_1.getSupabaseClient)();
function toDateString(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
async function ensureGameTablePartition(monthDate) {
    const targetMonth = toDateString(monthDate);
    const { error } = await supabase.rpc("create_game_table_partition", { target_month: targetMonth });
    if (error) {
        console.error(`Error al crear/verificar la partición de game_table para ${targetMonth}:`, error);
    }
    else {
        console.log(`Partición de game_table garantizada para el mes ${targetMonth}.`);
    }
}
function ensureNextMonthPartition() {
    const now = new Date();
    if (now.getDate() >= 25) {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        console.log("Mes próximo a finalizar: creando partición del mes siguiente...");
        ensureGameTablePartition(nextMonth);
    }
}
function startPartitionManager() {
    const now = new Date();
    ensureGameTablePartition(new Date(now.getFullYear(), now.getMonth(), 1));
    ensureNextMonthPartition();
    node_cron_1.default.schedule("0 0 * * *", () => {
        const current = new Date();
        ensureGameTablePartition(new Date(current.getFullYear(), current.getMonth(), 1));
        ensureNextMonthPartition();
    });
}
