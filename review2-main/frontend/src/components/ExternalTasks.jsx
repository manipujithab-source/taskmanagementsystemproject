
import { useEffect, useState } from "react";
import { getExternalTasks } from "../services/externalApi";
import "./ExternalTasks.css";

function ExternalTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExternalTasks()
      .then((data) => setTasks(data.slice(0, 10)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading external tasks...</p>;

  return (
    <div className="external-tasks">
      <h2>Sample Tasks from External API</h2>

      {tasks.map((task) => (
        <div className="external-task-card" key={task.id}>
          <span className="external-task-number">
            {task.id}
          </span>
          <p>{task.title}</p>
        </div>
      ))}
    </div>
  );
}

export default ExternalTasks;
