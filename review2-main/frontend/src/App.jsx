import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./components/Login";
import Register from "./components/Register";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ExternalTasks from "./components/ExternalTasks";

import {
  fetchTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI
} from "./features/tasks/taskSlice";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Redux state
  const tasks = useSelector((state) => state.tasks.tasks);

  // User state
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [showRegister, setShowRegister] = useState(false);

  // Application state
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks using Redux
  const loadTasks = () => {
    dispatch(fetchTasks());
  };

  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      loadTasks();
    }
  }, [user]);

  // Login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setEditingTask(null);
  };

  // Add task using Redux
  const addTask = async (task) => {
    try {
      await dispatch(createTask(task)).unwrap();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update task using Redux
  const updateTask = async (id, task) => {
    try {
      await dispatch(updateTaskAPI({ id, task })).unwrap();
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task using Redux
  const deleteTask = async (id) => {
    try {
      await dispatch(deleteTaskAPI(id)).unwrap();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Complete task
  const toggleComplete = (task) => {
    updateTask(task._id, {
      ...task,
      status:
        task.status === "Completed" ? "Pending" : "Completed"
    });
  };

  // Search and filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const importantTasks = tasks.filter(
    (task) => task.priority === "High"
  );

  const calendarTasks = tasks;

  // Login and Register pages
  if (!user) {
    return showRegister ? (
      <Register
        onRegister={handleLogin}
        onShowLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // Main application
  return (
    <div className="app-container">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-content">

        <Navbar
          user={user}
          onLogout={handleLogout}
          search={search}
          setSearch={setSearch}
        />

        {activePage === "dashboard" && (
          <Dashboard
            tasks={tasks}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "tasks" && (
          <>
            <TaskForm
              onAddTask={addTask}
              editingTask={editingTask}
              onUpdateTask={updateTask}
              setEditingTask={setEditingTask}
            />

            <TaskList
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
            />
          </>
        )}

        {activePage === "important" && (
          <TaskList
            tasks={importantTasks}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
          />
        )}

        {activePage === "calendar" && (
          <TaskList
            tasks={calendarTasks}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
          />
        )}

        {/* Third-party API integration */}
        {activePage === "external" && (
          <ExternalTasks />
        )}

      </div>
    </div>
  );
}

export default App;
