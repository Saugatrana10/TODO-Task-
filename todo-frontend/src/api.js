
const API = "http://127.0.0.1:8000/api";

// LOGIN
export async function login(username, password) {
  const response = await fetch(`${API}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  sessionStorage.setItem("access", data.access);

  return data;
}

// REGISTER
export async function register(username, email, password) {
  const response = await fetch(`${API}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// GET TODOS
export async function getTodos() {
  const response = await fetch(`${API}/todos/`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// ADD TODO
export async function addTodo(title) {
  const response = await fetch(`${API}/todos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("access")}`,
    },
    body: JSON.stringify({
      title,
      completed: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// UPDATE TODO
export async function updateTodo(id, updates) {
  const response = await fetch(`${API}/todos/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("access")}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// DELETE TODO
export async function deleteTodo(id) {
  const response = await fetch(`${API}/todos/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not delete todo.");
  }
}
