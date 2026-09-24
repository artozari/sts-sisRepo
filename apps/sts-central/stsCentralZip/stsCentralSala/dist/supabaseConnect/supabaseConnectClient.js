"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClient = getSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
let supabaseInstance = null;
function getSupabaseClient() {
    if (!supabaseInstance) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error("Faltan variables de entorno SUPABASE_URL o SUPABASE_KEY. Copie .env.example a .env y rellénelos.");
        }
        try {
            supabaseInstance = (0, supabase_js_1.createClient)(url, key);
            console.log("Cliente Supabase creado exitosamente.");
        }
        catch (error) {
            console.error("Error al crear el cliente Supabase:", error);
            throw error;
        }
    }
    return supabaseInstance;
}
