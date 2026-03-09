const fs = require("fs");
const path = require("path");
const express = require("express");

const burgersRouter = require("./routes/burgers");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/burgers", burgersRouter);

const clientDistPath = path.resolve(__dirname, "../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get(["/", "/burgers"], (_req, res) => {
    res.sendFile(clientIndexPath);
  });

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(clientIndexPath);
  });
} else {
  app.get(["/", "/burgers"], (_req, res) => {
    res.status(200).json({
      message: "Frontend is not built yet. Run `npm run dev` for local development."
    });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
