import { error } from "node:console";
import { prisma } from "../lib/prisma";
import { json } from "node:stream/consumers";

async function createAdmin() {
  const data = {
    name: "admin3",
    email: "admin3@gmail.com",
    password: "admin1234",
  };
  console.log("data=> ", data);
  const isExist = await prisma.user.findUnique({
    where: {
      email: "admin3@gmail.com",
    },
  });
  if (isExist) {
    return console.log("user already exists!!");
  }
  console.log("pass user exits");
  const res = await fetch("http://localhost:5000/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    console.log("update user role ###########");
    const res = await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        role: "ADMIN",
      },
    });
    console.log(res);
  }
  console.log("success user role ###########");
}
createAdmin();
