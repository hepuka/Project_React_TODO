import React, { useState, useRef, useEffect, useReducer } from "react";
import useLocalStorage from "use-local-storage";
import Task from "./Task.component";
import "./TaskManager.css";
import Alert from "../alert/Alert.component";
import Confirm from "../confirm/Confirm.component";
import { taskReducer } from "./taskReducer.js";
import "./TaskManager.css";

const TaskManagerReducer = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const initialState = {
    tasks: tasks,
    taskID: null,
    isEditing: false,
    isAlertOpen: false,
    alertContent: "This is an alert!",
    alertClass: "danger",
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    modalTitle: "Delete Task",
    modalMsg: "You are about to delete this task.",
    modalActionText: "OK",
  };

  /*taskReducer ki van exportálva egy külön fájlba, importálni kell*/
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  });

  const onCloseAlert = () => {
    dispatch({
      type: "CLOSE_ALERT",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !date) {
      dispatch({
        type: "EMPTY_FIELD",
      });
    }

    if (name && date && state.isEditing) {
      const updatedTask = {
        id: state.taskID,
        name: name,
        date: date,
        complete: false,
      };
      dispatch({
        type: "UPDATE_TASK",
        payload: updatedTask,
      });
      setName("");
      setDate("");
      setTasks(
        tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return { ...task, name, date, complete: false };
          }
          return task;
        })
      );

      return;
    }

    if (name && date) {
      const newTask = {
        id: Date.now(),
        dateNow: new Date().toLocaleString(),
        name: name,
        date: date,
        complete: false,
      };

      dispatch({
        type: "ADD_TASK",
        payload: newTask,
      });

      setName("");
      setDate("");
      setTasks([...tasks, newTask]);
    }
  };

  const openEditModal = (id) => {
    dispatch({
      type: "OPEN_EDIT_MODAL",
      payload: id,
    });
  };

  const editTask = () => {
    const id = state.taskID;

    dispatch({
      type: "EDIT_TASK",
      payload: id,
    });

    const thisTask = state.tasks.find((task) => task.id === id);
    setName(thisTask.name);
    setDate(thisTask.date);
    closeModal();
  };

  const openDeleteModal = (id) => {
    dispatch({
      type: "OPEN_DELETE_MODAL",
      payload: id,
    });
  };
  const deleteTask = () => {
    const id = state.taskID;

    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });

    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks);
  };

  const completeTask = (id) => {
    dispatch({
      type: "COMPLETE_TASK",
      payload: id,
    });

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: true };
        }
        return task;
      })
    );
  };

  const closeModal = () => {
    dispatch({
      type: "CLOSE_MODAL",
    });
  };

  return (
    <div className="con --bg-primary">
      {/* ha az isLaertOpen true akkor megjelenik az értesítő. 

        egyszerűbb az &&-et használni mert nincs else ág. 

      */}
      {state.isAlertOpen && (
        <Alert
          alertContent={state.alertContent}
          alertClass={state.alertClass}
          onCloseAlert={onCloseAlert}
        />
      )}

      {state.isEditModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalActionText={state.modalActionText}
          modalAction={editTask}
          onCloseModal={closeModal}
        />
      )}

      {state.isDeleteModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalActionText={state.modalActionText}
          modalAction={deleteTask}
          onCloseModal={closeModal}
        />
      )}

      <h1 className="--text-center --text-light">What TODO?</h1>
      <div className="--flex-center --p">
        <div className="--card --bg-light --width-500px --p --flex-center">
          <form onSubmit={handleSubmit} className="form --form-control">
            <div>
              <label htmlFor="name">Task:</label>
              <input
                ref={nameInputRef}
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
              {state.isEditing ? "Edit Task" : "Save Task"}
            </button>
          </form>
        </div>
      </div>

      {/* Display Task */}
      <article className="--flex-center --my2">
        <div className="--width-500px --p">
          {state.tasks.length === 0 ? (
            <p className="--text-light">Empty task list</p>
          ) : (
            <div key={tasks.id}>
              {state.tasks.map((task) => {
                return (
                  <Task
                    {...task}
                    editTask={openEditModal}
                    deleteTask={openDeleteModal}
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

export default TaskManagerReducer;
