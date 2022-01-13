import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, } from 'react-beautiful-dnd';
import '../styles/tasklist.scss'
import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}
const finalSpaceCharacters = [
  {
    id: 'gary',
    name: 'Gary Goodspeed',
    thumb: '/images/gary.png'
  },
  {
    id: 'cato',
    name: 'Little Cato',
    thumb: '/images/cato.png'
  },
  {
    id: 'kvn',
    name: 'KVN',
    thumb: '/images/kvn.png'
  },
]

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');


  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if(!newTaskTitle)return; 
    const data = {
      id: (Math.random() * 100),
      title: newTaskTitle,
      isComplete: false
    }
    //setTasks(old => [...old, data])
    setTasks([...tasks, data])
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    // const indexTask = tasks.findIndex(task => task.id === id)
    // if(indexTask !== -1 ){
    //   tasks[indexTask].isComplete = true;
    // } 
    // else{ 
    //   alert("Task não encontrada!")
    // }

    const newTask = tasks.map(task => task.id === id ? {...task, isComplete: !task.isComplete} : task);
    setTasks(newTask);
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID

    // const removeTask = tasks.filter(task => task.id !== id);
    // setTasks(removeTask);

    const indexTask = tasks.findIndex(task => task.id === id);
    if(indexTask !== -1){
      tasks.splice(indexTask, 1);
      setTasks([...tasks]);
    }else{
      alert("Task não encontrada!");
    }
  }

  function handleOnDragEnd(result: DropResult):void {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log("itens "+items)
    //updateCharacters(items);
    console.log("characters "+ tasks)
    setTasks(items)
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
      </header>

      <main>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.title} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                          <label className="checkbox-container">
                            <input 
                              type="checkbox"
                              readOnly
                              checked={task.isComplete}
                              onClick={() => handleToggleTaskCompletion(task.id)}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <p>{task.title}</p>
                        </div>
                        <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                          <FiTrash size={16}/>
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </section>
  )
}