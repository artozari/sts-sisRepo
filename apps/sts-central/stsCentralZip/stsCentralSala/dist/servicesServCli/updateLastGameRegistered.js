"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastGameRegistered = updateLastGameRegistered;
const supabaseConnectClient_1 = require("../supabaseConnect/supabaseConnectClient");
const supabase = (0, supabaseConnectClient_1.getSupabaseClient)();
async function updateLastGameRegistered(fk_table, game_number) {
    const { error } = await supabase
        .from("table_table")
        .update({ last_game_registered: game_number })
        .eq("id", fk_table)
        .lt("last_game_registered", game_number);
    if (error) {
        console.error("Error al actualizar last_game_registered en table_table:", error);
    }
}
