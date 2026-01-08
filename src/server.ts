import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log("prisma connected successfully");
    app.listen(PORT, () => {
      console.log("server is running port", PORT);
    });
  } catch (error) {
    console.log(error);
    console.log("prisma connected unsuccessfully");
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
