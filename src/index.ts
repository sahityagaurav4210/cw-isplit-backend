import { runServer } from "./app";

(async function () {
  try {
    await runServer();
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
})();
