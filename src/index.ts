import express, { Express, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port = parseInt(process.env.PORT || "8080")

const isProduction = process.env.NODE_ENV === "production"

app.set("etag", isProduction)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.removeHeader("X-Powered-By")
  next()
})

app.get("/", (req: Request, res: Response) =>
  res.send("Hello World! Express + TypeScript 22")
)

app.listen(port, () =>
  console.log(`⚡️[server]: Started at http://localhost:${port}`)
)
