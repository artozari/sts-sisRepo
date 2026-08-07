# cambios para funcionamiento en dev

los archivos [config.class.ts](./src/config/config.class.ts) y [configCasino.class.ts](./src/config/configCasino.class.ts) fueron editados para cambiar usar la IP local de la máquina y la del servidor mqtt en linea de desarrollo, además se agregaron nuevos campos para el funcionamiento del servicio en dev.

y la IP de la API debe ser la local, es decir la de la máquina porque es donde se consulta los datos de la máquina: [`src/index.ts:64`](./src/index.ts#L64):

```typescript
const HEALTH_CHECK = new ApiCheckClass({
    baseUrl: "http://10.0.0.147:8023", //--> Ip a cambiar por la local
    path: "/api/v1/game",
    interval: 10000,
    timeout: 10000,
});
```
