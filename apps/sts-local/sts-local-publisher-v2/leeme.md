# sts-local-publisher-v2 — casinoCode desde DB local

Versión separada de `sts-local-publisher` que no depende de `.env` para identificar el casino. Pensada para **un solo broker + un solo servidor central** para N casinos/clientes.

**Diferencias vs v1 (`src/index.ts:129-188`):**
- `casinoCode` y `broker MQTT casino` se obtienen de **DB local** `GET /api/v1/casino?q=1` (`src/casino/casino.service.ts:36` orden `id desc` → último). Si `Casino_table` está vacía → WARN y no publica a casino (evita colisión).
- Tópicos firmados: `STS-MESAS/{casinoCode}/game/{tableNumber}`, `STS-MESAS/{casinoCode}/GameSync/{tableNumber}`, `STS-MESAS/{casinoCode}/statusTableServices/{tableNumber}` en `src/index.ts:157-177`.
- Payloads enriquecidos con `{casinoCode, tableNumber}` para validar `topic vs payload`.
- `MQTT local` (sala) sigue via `ConfigClass` `src/config/config.class.ts:14` (archivo/env). `MQTT casino` se reconfigura dinámicamente si `Casino_table.mqtt_url/port/protocol/user/pass` cambian (`recreateCasinoMqttIfNeeded`).
- `CasinoPublisherClass` `src/Casino-publisher-class/Casino.publisher.class.ts:20` suscrito a `STS-MESAS/+/STS-Casino/GameSync/#` (wildcard por casinoCode) en vez de `+NUMERO_MAQUINA`. No usa `NUMERO_MAQUINA` de `.env`.

**Config:**
- `API_URL` bootstrap en `.env` (o `http://127.0.0.1:8023` por defecto) para alcanzar `sts-api`.
- `CASINO_*` en `.env` solo fallback si DB no responde al arrancar.

**Verificación:**
```bash
curl http://127.0.0.1:8023/api/v1/casino?q=1
curl http://127.0.0.1:8023/api/v1/table/1
mosquitto_sub -h sts.sielcon.net -p 9105 -t 'STS-MESAS/#' -v
```
Debe verse `STS-MESAS/CA_STFE/game/15` con JSON `{casinoCode:"CA_STFE",...}`.

**v1 intacto:** no modificar `../sts-local-publisher/` — máquinas actuales siguen con tópicos sin casino en brokers separados.
