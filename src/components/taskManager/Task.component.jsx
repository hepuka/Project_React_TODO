import React from "react";
import { FaCheckDouble, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./Task.css";

const Task = ({
  id,
  name,
  dateNow,
  date,
  complete,
  editTask,
  deleteTask,
  completeTask,
}) => {
  return (
    <div key={id} className={complete ? "task complete" : "task"}>
      <span className="taskdate">
        <p>
          <b>Added:</b> {dateNow}
        </p>
        <p>
          <b>Task:</b> {name}
        </p>
        <p>
          <b>Deadline:</b> {date}
        </p>
      </span>
      <span className="buttons">
        <button
          onClick={() => editTask(id)}
          className={complete ? "completebutton" : null}
        >
          <FaEdit color="green" size={15} />
        </button>
        <button onClick={() => deleteTask(id)}>
          <FaTrashAlt color="red" size={15} />
        </button>
        <button
          onClick={() => completeTask(id)}
          className={complete ? "completebutton" : null}
        >
          <FaCheckDouble color="purple" size={15} />
        </button>
      </span>
    </div>
  );
};

export default Task;
