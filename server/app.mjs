import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  const newAssignment = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(), 
  }

  if (!newAssignment.title || !newAssignment.content || !newAssignment.category) {
      return res.status(400).json({
          message: "Server could not create assignment because there are missing data from client",
      });
  }

  try {
  
      await connectionPool.query(
          `insert into assignments (user_id,title, content, category) VALUES ($1, $2, $3,$4)`,
          [1,
            newAssignment.title, 
            newAssignment.content,
            newAssignment.category
          ]
      );

      res.status(201).json({ message: "Created assignment successfully" });

  } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({
          message: "Server could not create assignment because database connection",
      });
  }
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
