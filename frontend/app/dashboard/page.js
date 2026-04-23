"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "../globals.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: token }
      });

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Load page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchTasks();

      const userRole = localStorage.getItem("role");
      setRole(userRole);

      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }
  }, []);

  // 🔔 Notification logic
  useEffect(() => {
    const today = new Date();

    tasks.forEach((task) => {
      if (task.dueDate) {
        const due = new Date(task.dueDate);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        if ((diff === 1 || diff === 0) && Notification.permission === "granted") {
          new Notification(`Reminder: ${task.title} is due soon`);
        }
      }
    });
  }, [tasks]);

  // Create task
  const createTask = async () => {
    if (!title || !description) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://task-manager-backend-yw8r.onrender.com/tasks",
        { title, description, priority, dueDate },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setDescription("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(`https://task-manager-backend-yw8r.onrender.com/tasks/${id}`, {
      headers: { Authorization: token }
    });

    fetchTasks();
  };

  // Mark done
  const markDone = async (id) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://task-manager-backend-yw8r.onrender.com/tasks/${id}`,
      { status: "done" },
      { headers: { Authorization: token } }
    );

    fetchTasks();
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Task Manager</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {role === "admin" && <h4>Admin Mode</h4>}

      {/* Add Task */}
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        className="input"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button className="button" onClick={createTask}>
        Add Task
      </button>

      {/* Search */}
      <input
        className="input"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Tasks</h3>

      {/* Task List */}
      {tasks
        .filter((t) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((t) => (
          <div
            key={t._id}
            className="task"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* LEFT */}
            <div>
              <b>{t.title}</b> - {t.description}

              {/* Due date */}
              <p style={{ fontSize: "12px", color: "gray" }}>
                Due: {t.dueDate
                  ? new Date(t.dueDate).toLocaleDateString("en-GB")
                  : "No date"}
              </p>

              {/* 🔥 Countdown */}
              {t.dueDate && (
                <p style={{ fontSize: "12px", color: "red" }}>
                  {(() => {
                    const diff = Math.ceil(
                      (new Date(t.dueDate) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    );

                    if (diff > 1) return diff + " days left";
                    if (diff === 1) return "Due tomorrow";
                    if (diff === 0) return "Due today";
                    return "Overdue";
                  })()}
                </p>
              )}

              {/* Created by */}
              {t.userName && (
                <p style={{ fontSize: "12px", color: "gray" }}>
                  Created by: {t.userName}
                </p>
              )}

              {/* Priority */}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background:
                    t.priority === "high"
                      ? "red"
                      : t.priority === "medium"
                      ? "orange"
                      : "green",
                  color: "white"
                }}
              >
                {t.priority}
              </span>

              {/* Done */}
              {t.status === "done" && (
                <span style={{ marginLeft: "10px", color: "green" }}>
                  ✔ Done
                </span>
              )}
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => markDone(t._id)}>Done</button>

              <button
                style={{
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px"
                }}
                onClick={() => deleteTask(t._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}