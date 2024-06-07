import { useState, useRef, useEffect } from 'react';
import './index.css';
import { Checkbox } from "@nextui-org/react";
import { motion } from "framer-motion"

function Todo() {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newInputValue, setNewInputValue] = useState('');
  const editInputRef = useRef(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const openAlertPopup = () => {
    setIsAlertOpen(true);
    setTimeout(() => {
      setIsAlertOpen(false); 
    }, 2800);
  }

  const closeAlertPopup = () => {
    setIsAlertOpen(false);
  }

  const alertClickHandler = () => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.style.animation = 'alertOut 2s ease-in-out';
    }
  }

  const addTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: inputValue }]);
      setInputValue('');
    } else {
      alert('Du musst etwas angeben!');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const handleEditKeyPress = (event) => {
    if (event.key === 'Enter' && editInputRef.current === document.activeElement) {
      saveEditedTask();
    }
  };

  const saveEditedTask = () => {
    if (newInputValue.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = { ...updatedTasks[editingIndex], text: newInputValue }; 
      setTasks(updatedTasks);
      setEditingIndex(null); 
      setNewInputValue('');
      closePopup();
      openAlertPopup();
    } else {
      alert('Du musst etwas angeben!');
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const openPopup = (index) => {
    setEditingIndex(index);
    setNewInputValue(tasks[index].text); 
    setIsOpen(true);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus(); 
      }
    }, 0);
  };

  const closePopup = () => {
    setIsOpen(false);
    setEditingIndex(null);
  };

  const checkboxClickHandler = () => {
  }

  const makeLoadingGoAway = () => {
    setIsLoading(false);
  }

  return (
    <div onClick={makeLoadingGoAway} className='flex flex-col items-center justify-center h-screen bg-gray-200 p-4'>
      {/* //HEADING */}
      <div id='typingWrapper'>
        <h1 id='typingAnimationHeader' className='text-7xl font-bold mb-4 uppercase'>
          Just Task It.
        </h1>
      </div>

      <motion.div
        style={{
          width: 0, // Initial width
          height: 2, // Height of the line
          background: 'black',
          marginBottom: 20 // Color of the line
        }}
        animate={{
          width: 200, // Target width
        }}
        transition={{
          duration: 1, // Duration of the animation
          ease: 'easeInOut', // Type of easing
          delay: '2'
        }}
      />

      {isLoaderVisible && (
        <span id='loader' className='fade-out'></span>
      )}

      {/* INPUT ADDING TASK*/}
      <div className='flex flex-col items-center'>
        <input id='taskInput'
          maxLength={22}
          onKeyDown={handleKeyPress}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className='rounded w-64 m-4 p-3 pl-4 bg-black text-white'
          type='text'
          placeholder='Type in your task...'
        />
        {/* ADDING TASK BUTTON */}
        <button id='addButton' className='mb-4 p-1 border border-gray-500 rounded hover:bg-black hover:text-white w-24 transition duration-300' 
        onClick={addTask}>
          Add
        </button>
      </div>

      {/* TASK LIST */}
      <ul className='w-full max-w-md'>
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className='rounded cursor-grap active:cursor-grabbing flex items-center bg-slate-100 p-3 pl-4 mb-2 transition transform ease-out duration-500'
            style={{ animation: 'fadeIn 0.5s' }}
          >
            {/* TASK HAS BEEN DONE BUTTON */}
            <label className="flex items-center cursor-pointer">
              <Checkbox
                className='w-7 h-7 border mr-3 rounded'
                size='lg'
                onClick={checkboxClickHandler}
              />
            </label>

            {/* DELETE TASK BUTTON */}
            <button className='text-red-700 mr-4' onClick={() => removeTask(index)}>
              Delete
            </button>

            {/* EDIT TASK BUTTON */}
            <button className='text-blue-700 mr-4' onClick={() => openPopup(index)}>
              Edit
            </button>

            {/* THE VALUE OF THE INPUT SHOW IN THE LIST*/}
            <span className='ml-4'>{task.text}</span>
          </li>
        ))}
      </ul>

      {/* EDITING POPUP */}
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='relative w-80 h-60 bg-gray-500 rounded-lg flex flex-col items-center justify-center p-4 transition transform ease-out duration-500'
            style={{ animation: 'editPopupIn 0.5s' }}>
            <h1 className='mb-9 font-normal'>Edit your Task</h1>

            {/* CLOSE POPUP BUTTON */}
            <span className='absolute top-2 right-2 cursor-pointer' onClick={closePopup}>
              <button>Close</button>
            </span>

            {/* EDITING INPUT */}
            <input
              maxLength={34}
              ref={editInputRef}
              onKeyDown={handleEditKeyPress}
              type='text'
              onChange={(e) => setNewInputValue(e.target.value)}
              value={newInputValue} // Set the input value to the newInputValue state
              className='w-full mb-4 p-2 rounded outline-none'
            />

            {/* SAVE BUTTON */}
            <button onClick={saveEditedTask} className='border-2 px-4 py-2'>
              Save
            </button>
          </div>
        </div>
      )}

      {/* ALERT POPUP */}
      {isAlertOpen && (
        <div id='alert-container' onClick={closeAlertPopup} 
          className='transition transform ease-out duration-500 fixed inset-0 flex items-center justify-center'
          style={{ animation: 'alertIn 0.5s' }}
        >
          {/* MAKING ALERT POPUP GO AWAY WHEN CLICKING */}
          <div onClick={alertClickHandler} className='cursor-pointer absolute m-4 w-29 h-30 text-center bg-white rounded-lg bottom-0 left-0 p-4'>
            <h1 className='mb-4 text-green-800 font-medium'>
              Task Saved Successfully!
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;
