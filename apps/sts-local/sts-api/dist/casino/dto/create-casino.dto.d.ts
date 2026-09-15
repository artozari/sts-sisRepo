import { CasinoEntityInterface } from '../entities/casino.entity';
type CreateCasinoType = Omit<CasinoEntityInterface, 'id' | 'createdAt' | 'updatedAt'>;
export declare class CreateCasinoDto implements CreateCasinoType {
    casinoCode: string;
    name: string;
    country: string;
    province: string;
    city: string;
    address: string;
    mqtt_url: string;
    mqtt_port: string;
    mqtt_protocol: string;
    mqtt_tls: boolean;
    mqtt_user: string;
    mqtt_password: string;
    mqtt_refresh_time_msec: number;
}
export {};
