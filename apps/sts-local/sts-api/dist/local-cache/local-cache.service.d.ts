import { Cache } from 'cache-manager';
export declare class LocalCacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    set: (p_key: string, p_value: unknown, p_ttl: number | void) => Promise<void>;
    get: (p_key: string) => Promise<unknown>;
    del: (p_key: string) => Promise<void>;
    reset: () => Promise<void>;
    getKey: (p_key: string, p_id: string | number | void | null | undefined) => string;
}
