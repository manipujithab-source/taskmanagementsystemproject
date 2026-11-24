
function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <h2>✓ TaskFlow</h2>

      <nav>
        <button
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          📊 Dashboard
        </button>

        <button
          className={activePage === "tasks" ? "active" : ""}
          onClick={() => setActivePage("tasks")}
        >
          📋 My Tasks
        </button>

        <button
          className={activePage === "important" ? "active" : ""}
          onClick={() => setActivePage("important")}
        >
          ⭐ Important
        </button>

        <button
          className={activePage === "calendar" ? "active" : ""}
          onClick={() => setActivePage("calendar")}
        >
          📅 Calendar
        </button>

        {/* Third-party API */}
        <button
          className={activePage === "external" ? "active" : ""}
          onClick={() => setActivePage("external")}
        >
          🌐 External API Tasks
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
