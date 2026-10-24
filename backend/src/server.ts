import { app } from "./app.ts";
import { createTable } from "./db.ts";

const port = Number(process.env.PORT ?? 3001);

await createTable();

app.listen(port, () => {
  console.log(`backend listening on ${port}`);
});
