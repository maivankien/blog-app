import mysql from "mysql"

export const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  port: 3307,
  password: "123456",
  database:"blog"
})