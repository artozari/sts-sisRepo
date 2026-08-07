import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class LocalCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public set = async (
    p_key: string,
    p_value: unknown,
    p_ttl: number | void,
  ): Promise<void> => {
    const ttl: number | undefined = p_ttl || undefined;
    await this.cacheManager.set(p_key, p_value, ttl);
  };

  public get = async (p_key: string): Promise<unknown> => {
    try {
      const resp: unknown = await this.cacheManager.get(p_key);
      return resp;
    } catch (error) {
      return null;
    }
  };

  public del = async (p_key: string): Promise<void> => {
    try {
      await this.cacheManager.del(p_key);
    } catch (error) {
      // do nothing
    }
  };

  public reset = async (): Promise<void> => {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      // do nothing
    }
  };

  public getKey = (
    p_key: string,
    p_id: string | number | void | null | undefined,
  ): string => {
    let resp: string;
    if (p_id) {
      resp = `${p_key}_${p_id}`;
    } else {
      resp = p_key;
    }
    return resp;
  };
}
