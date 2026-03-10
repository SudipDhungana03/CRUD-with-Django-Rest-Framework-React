import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "https://crud-with-django-rest-framework-react.onrender.com/api/grocery";

function App() {
  const [items, setItems] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [editId, setEditId] = useState(null);

  // Load items from server on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        toast.error("Could not load grocery list");
      }
    };
    fetchItems();
  }, []);

  const addItem = async (itemName) => {
    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, completed: false }),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem.data]);
      toast.success("Grocery item added");
    } catch {
      toast.error("Could not add item");
    }
  };

  const editCompleted = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/${itemId}/toggle/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated.data : item))
      );
    } catch {
      toast.error("Could not update item");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/${itemId}/`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item deleted");
    } catch {
      toast.error("Could not delete item");
    }
  };

  const updateItemName = async (newName) => {
    try {
      const res = await fetch(`${BASE_URL}/${editId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === editId ? updated.data : item))
      );
      setEditId(null);
      toast.success("Item updated");
    } catch {
      toast.error("Could not update item");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return toast.error("Please enter an item");
    if (editId) {
      updateItemName(inputVal);
    } else {
      addItem(inputVal);
    }
    setInputVal("");
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "0 1rem" }}>
      <Toaster />
      <h1>🛒 Grocery Bud</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="e.g. eggs"
          style={{ flex: 1, padding: "8px 12px", fontSize: 16 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => editCompleted(item.id)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: item.completed ? "line-through" : "none",
                color: item.completed ? "#999" : "#000",
              }}
            >
              {item.name}
            </span>
            <button
              onClick={() => {
                setEditId(item.id);
                setInputVal(item.name);
              }}
            >
              ✏️
            </button>
            <button onClick={() => removeItem(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>No items yet. Add some!</p>
      )}
    </div>
  );
}

export default App;
