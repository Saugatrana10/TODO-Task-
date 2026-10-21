
import { useEffect, useState } from "react";
import {
  login,
  register,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "./api";

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loggedIn, setLoggedIn] = useState(
    Boolean(sessionStorage.getItem("access"))
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      loadTodos();
    }
  }, [loggedIn]);

  function clearAuthFields() {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  function switchPage(nextPage) {
    clearAuthFields();
    setPage(nextPage);
  }

  async function loadTodos() {
    try {
      setError("");
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(
        "Could not load tasks. Please log in again if your session expired."
      );
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(username, password);
      setLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(username, email, password);
      clearAuthFields();
      setPage("login");
      setSuccess("Account created successfully! You can now log in.");
    } catch (err) {
      setError(
        "Registration failed. Your username may already exist, or your details may be invalid."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const newTodo = await addTodo(title.trim());
      setTodos((previous) => [...previous, newTodo]);
      setTitle("");
      setSuccess("Task added successfully!");
    } catch (err) {
      setError("Could not add task. Please try again.");
    }
  }

  async function handleComplete(todo) {
    try {
      setError("");
      const updated = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos((previous) =>
        previous.map((item) => (item.id === todo.id ? updated : item))
      );
    } catch (err) {
      setError("Could not update task.");
    }
  }

  async function handleEdit(todo) {
    const newTitle = window.prompt("Edit your task:", todo.title);

    if (newTitle === null || !newTitle.trim()) return;

    try {
      setError("");
      const updated = await updateTodo(todo.id, {
        title: newTitle.trim(),
      });

      setTodos((previous) =>
        previous.map((item) => (item.id === todo.id ? updated : item))
      );
      setSuccess("Task updated successfully!");
    } catch (err) {
      setError("Could not edit task.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");
      await deleteTodo(id);
      setTodos((previous) => previous.filter((todo) => todo.id !== id));
      setSuccess("Task deleted successfully!");
    } catch (err) {
      setError("Could not delete task.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    setLoggedIn(false);
    setTodos([]);
    setTitle("");
    setFilter("all");
    switchPage("login");
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (loggedIn) {
    return (
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <span className="navbar-brand fw-bold">TaskFlow</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="container py-5">
          <div className="mb-4">
            <h2 className="fw-bold">My Tasks</h2>
            <p className="text-secondary">
              Stay organized and get things done.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
              <button
                className="btn-close float-end"
                onClick={() => setSuccess("")}
                aria-label="Close"
              />
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-secondary mb-1">Total tasks</p>
                  <h3 className="fw-bold">{todos.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-secondary mb-1">Pending</p>
                  <h3 className="fw-bold text-warning">{pendingCount}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-secondary mb-1">Completed</p>
                  <h3 className="fw-bold text-success">{completedCount}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add a new task</h5>

              <form onSubmit={handleAddTodo}>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you need to do?"
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h5 className="fw-bold mb-0">Your task list</h5>

            <div className="btn-group" role="group">
              {["all", "pending", "completed"].map((item) => (
                <button
                  key={item}
                  className={`btn ${
                    filter === item ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h6 className="text-secondary">No tasks found</h6>
                <p className="text-secondary mb-0">
                  Add a task or select another filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="list-group shadow-sm">
              {filteredTodos.map((todo) => (
                <div key={todo.id} className="list-group-item p-3">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={Boolean(todo.completed)}
                      onChange={() => handleComplete(todo)}
                      aria-label={`Toggle ${todo.title}`}
                    />

                    <div className="flex-grow-1">
                      <div
                        className={`fw-semibold ${
                          todo.completed
                            ? "text-decoration-line-through text-secondary"
                            : ""
                        }`}
                      >
                        {todo.title}
                      </div>

                      <small className="text-secondary">
                        {todo.created_at
                          ? `Created: ${new Date(
                              todo.created_at
                            ).toLocaleString()}`
                          : "Creation date unavailable"}
                      </small>

                      <div className="mt-1">
                        <span
                          className={`badge ${
                            todo.completed
                              ? "text-bg-success"
                              : "text-bg-warning"
                          }`}
                        >
                          {todo.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div
        className="card border-0 shadow p-4 w-100"
        style={{ maxWidth: 430 }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">TaskFlow</h2>
          <p className="text-secondary">
            {page === "login"
              ? "Welcome back! Please log in."
              : "Create your account to get started."}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form
          key={page}
          onSubmit={page === "login" ? handleLogin : handleRegister}
          autoComplete="off"
        >
          <div className="mb-3">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="form-control"
              type="text"
              name={page === "login" ? "login-username" : "register-username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="off"
              required
            />
          </div>

          {page === "register" && (
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="form-control"
                type="email"
                name="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="off"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              name={page === "login" ? "login-password" : "register-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : page === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          {page === "login" ? (
            <p className="mb-0">
              Don't have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => switchPage("register")}
              >
                Register
              </button>
            </p>
          ) : (
            <p className="mb-0">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => switchPage("login")}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
