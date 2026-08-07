import * as http from "node:http";
import * as https from "node:https";
import { URL } from "node:url";

export interface HealthCheckConfig {
    baseUrl: string; // ej: "http://10.0.0.147:3000"
    path?: string; // ej: "/health" (por defecto "/")
    interval: number; // ms
    timeout: number; // ms por petición
}

export class ApiCheckClass {
    private readonly cfg: HealthCheckConfig;
    private intervalId: NodeJS.Timeout | null = null;
    private healthy = false;

    constructor(cfg: HealthCheckConfig) {
        this.cfg = { path: "/", ...cfg };
    }

    public start(): void {
        if (this.intervalId) return;
        this.check();
        console.info(`[HealthCheck] iniciado (${this.cfg.baseUrl}${this.cfg.path})`);
    }

    public stop(): void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.info("[HealthCheck] detenido");
    }

    public isHealthy(): boolean {
        return this.healthy;
    }

    //--> Método para consultar el endpoint y obtener la respuesta pero obtiene todas las jugadas ganadoras, no solo la última ⚠
    public async queryEndpoint(endpoint: string): Promise<{ success: boolean; statusCode: number; data: string; error: string | null }> {
        try {
            const { statusCode, body } = await this.doRequestWithBody(endpoint);
            console.log(`\x1b[1;36;48;2;29;67;113m Datos de respuesta de la API: ${body} \x1b[0m`);

            return { success: statusCode >= 200 && statusCode < 300, statusCode, data: body, error: null };
        } catch (err) {
            console.error(`[Query] ERROR: ${(err as Error).message}`);
            return { success: false, error: (err as Error).message, statusCode: 400, data: "" };
        }
    }

    private async check(): Promise<void> {
        try {
            const status = await this.doRequest();
            this.healthy = status >= 200 && status < 300;
            if (this.healthy) {
                console.log(`\x1b[42m[HealthCheck] OK ${status} \x1b[0m\x1b[32m\x1b[0m`);
            } else {
                console.warn(`[HealthCheck] RESPUESTA ${status}`);
            }
        } catch (err) {
            this.healthy = false;
            console.error(`[HealthCheck] ERROR: ${(err as Error).message}`);
        }
    }

    private doRequest(customPath?: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                const fullUrl = new URL(this.cfg.baseUrl);
                const pathToUse = customPath || this.cfg.path || "/";

                // --- CHANGED: separar path y query para evitar que '?' quede en pathname ---
                const qIdx = pathToUse.indexOf("?");
                const pathPart = qIdx >= 0 ? pathToUse.slice(0, qIdx) : pathToUse;
                const queryPart = qIdx >= 0 ? pathToUse.slice(qIdx) : "";

                fullUrl.pathname = (fullUrl.pathname.replace(/\/$/, "") || "") + pathPart;
                // combinar search si ya existe
                if (queryPart) {
                    fullUrl.search = fullUrl.search ? `${fullUrl.search}&${queryPart.slice(1)}` : queryPart;
                }
                // --- END CHANGED ---

                const isHttps = fullUrl.protocol === "https:";
                const lib = isHttps ? https : http;

                const options: http.RequestOptions = {
                    hostname: fullUrl.hostname,
                    port: fullUrl.port ? Number(fullUrl.port) : undefined,
                    path: fullUrl.pathname + fullUrl.search,
                    method: "GET",
                    timeout: this.cfg.timeout,
                };

                const req = lib.request(options, (res) => {
                    res.on("data", () => {
                        /* noop */
                    });
                    res.on("end", () => resolve(res.statusCode ?? 0));
                });

                req.on("timeout", () => {
                    req.destroy(new Error("timeout"));
                });

                req.on("error", (err) => reject(err));
                req.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    private doRequestWithBody(customPath?: string): Promise<{ statusCode: number; body: string }> {
        return new Promise((resolve, reject) => {
            try {
                const fullUrl = new URL(this.cfg.baseUrl);
                const pathToUse = customPath || this.cfg.path || "/";

                // --- CHANGED: separar path y query para evitar que '?' quede en pathname ---
                const qIdx = pathToUse.indexOf("?");
                const pathPart = qIdx >= 0 ? pathToUse.slice(0, qIdx) : pathToUse;
                const queryPart = qIdx >= 0 ? pathToUse.slice(qIdx) : "";

                fullUrl.pathname = (fullUrl.pathname.replace(/\/$/, "") || "") + pathPart;
                if (queryPart) {
                    fullUrl.search = fullUrl.search ? `${fullUrl.search}&${queryPart.slice(1)}` : queryPart;
                }
                // --- END CHANGED ---

                const isHttps = fullUrl.protocol === "https:";
                const lib = isHttps ? https : http;

                const options: http.RequestOptions = {
                    hostname: fullUrl.hostname,
                    port: fullUrl.port ? Number(fullUrl.port) : undefined,
                    path: fullUrl.pathname + fullUrl.search,
                    method: "GET",
                    timeout: this.cfg.timeout,
                };

                const req = lib.request(options, (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });
                    res.on("end", () => {
                        resolve({ statusCode: res.statusCode ?? 0, body: data });
                    });
                });

                req.on("timeout", () => {
                    req.destroy(new Error("timeout"));
                });

                req.on("error", (err) => reject(err));
                req.end();
            } catch (err) {
                reject(err);
            }
        });
    }
}
