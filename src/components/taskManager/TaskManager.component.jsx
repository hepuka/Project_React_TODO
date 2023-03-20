import React, { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import Task from "./Task.component";
import "./TaskManager.css";

const TaskManager = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [taskID, setTaskID] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const nameInputRef = useRef(null);

  /* fókusz hozzáadása az input mezőhöz */
  useEffect(() => {
    nameInputRef.current.focus();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((!name && !date) || !name || !date) {
      alert("Please enter task name and date!");

      //szerkesztés utáni mentés. Ha ez nem lenne akkor egy új Task-ként jelenne meg, nem az eredti lenne felülírva
    } else if (name && date && isEditing) {
      setTasks(
        tasks.map((item) => {
          if (item.id === taskID) {
            return { ...item, name: name, date: date, complete: false };
          }

          return item;
        })
      );

      setName("");
      setDate("");
      setIsEditing(false);
      setTaskID(null);
    } else {
      //tárolni kívánt task objektum template-ének létrehozása
      const newTask = {
        id: Date.now(),
        dateNow: new Date().toLocaleString(),
        name: name,
        date: date,
        complete: false,
      };

      //itt már megvan az új objektum az inputokból
      console.log(newTask);

      //új objektum hozzáaadása a tasks változóhoz
      setTasks([...tasks, newTask]);
      setName("");
      setDate("");
    }
  };

  const editTask = (id) => {
    //itt keresem ki az ID alapján a task-ot, és mentem el egyváltozóba
    const thisTask = tasks.find((item) => item.id === id);
    setIsEditing(true);
    setTaskID(id);

    //visszarakjuk az input mezőbe a nevet és a dátumot
    setName(thisTask.name);
    setDate(thisTask.date);
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?") === true) {
      const newTasks = tasks.filter((item) => item.id !== id);

      setTasks(newTasks);
    }
  };

  //ask complete property-jét állítja true-ra. Bejárom a taskot, ha az aid megegyezik a kapott id-val akkor visszaadom a teljes itemet és a complete propertyt true-ra állítom
  const completeTask = (id) => {
    setTasks(
      tasks.map((item) => {
        if (item.id === id) {
          return { ...item, complete: true };
        }

        return item;
      })
    );
  };

  return (
    <div className="con --bg-primary">
      <h1 className="--text-center --text-light">What TODO?</h1>
      <div className="--flex-center --p">
        <div className="--card --bg-light --width-500px --p --flex-center">
          <form onSubmit={handleSubmit} className="form --form-control">
            <div>
              <label htmlFor="name">Task:</label>
              <input
                ref={nameInputRef} //fókuszt adjuk hozzá ha az oldal betöltődik
                type="text"
                placeholder="Task name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                placeholder="Task name"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button className="--btn --btn-success --btn-block">
              {isEditing ? "Edit Task" : "Save Task"}
            </button>
          </form>
        </div>
      </div>

      {/* Display Task */}
      <article className="--flex-center --my2">
        <div className="--width-500px --p">
          {tasks.length === 0 ? (
            <p className="--text-light">Empty task list</p>
          ) : (
            <div key={tasks.id}>
              {tasks.map((task) => {
                return (
                  <Task
                    //átadom az egész Task-ot, amiből a Task komponens destruktúrálással kiszedi a propertyket
                    {...task}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    completeTask={completeTask}
                  />
                );
              })}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default TaskManager;
