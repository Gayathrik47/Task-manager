const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const auth = require("../middleware/authMiddleware");


// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,

      // ✅ IMPORTANT FIX
      dueDate: req.body.dueDate,

      userId: req.user.id,
      userName: req.user.name
    });

    await task.save();
    res.send("Task created");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating task");
  }
});


// GET TASKS (RBAC)
router.get("/", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ userId: req.user.id });
    }

    res.json(tasks);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching tasks");
  }
});


// UPDATE TASK (owner or admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (
      req.user.role !== "admin" &&
      task.userId.toString() !== req.user.id
    ) {
      return res.status(403).send("Not allowed");
    }

    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.send("Updated");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating task");
  }
});


// DELETE TASK (owner or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (
      req.user.role !== "admin" &&
      task.userId.toString() !== req.user.id
    ) {
      return res.status(403).send("Not allowed");
    }

    await task.deleteOne();
    res.send("Deleted");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting task");
  }
});

module.exports = router;