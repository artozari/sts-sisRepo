export interface StsCasinoInterface {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  casinoCode: string;
  name: string;
  country: string;
  province: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  mqtt_url: string;
  mqtt_port: string;
  mqtt_protocol: string;
  mqtt_tls: boolean;
  mqtt_user: string;
  mqtt_password: string;
  mqtt_refresh_time_msec: number;
}