import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Checked, Unchecked, Cross, Dragger } from './Icons';
import { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Checklist({ todos, taskId, boardId, userId }) {
    const [todoList, setList] = useState(todos);
    const newTaskRef = useRef(null);

    const addSubTask = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
            const newTask = { task: e.target.value, done: false };
            setList([...todoList, newTask]);
            Inertia.post(`/boards/${boardId}/tasks/${taskId}/todos`, newTask); // Use Inertia to add a subtask
            newTaskRef.current.value = '';
        }
    };

    const checkMark = (e, todo) => {
        const updatedTodos = todoList.map(t => 
            t.task === todo.task ? { ...t, done: !t.done } : t
        );
        setList(updatedTodos);
        Inertia.put(`/boards/${boardId}/tasks/${taskId}/todos`, { todos: updatedTodos }); // Update the task with Inertia
    };

    const deleteSubTask = (taskName) => {
        const filtered = todoList.filter(t => t.task !== taskName);
        setList(filtered);
        Inertia.put(`/boards/${boardId}/tasks/${taskId}/todos`, { todos: filtered }); // Update the task with Inertia
    };

    const endOfDrag = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const newOrder = Array.from(todoList);
        const [movedTask] = newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, movedTask);
        setList(newOrder);
        Inertia.put(`/boards/${boardId}/tasks/${taskId}/todos`, { todos: newOrder }); // Update the task with Inertia
    };

    return (
        <div>
            <DragDropContext onDragEnd={endOfDrag}>
                <Droppable droppableId={'Checklist'}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {todoList.map((t, i) => (
                                <Draggable draggableId={t.task} index={i} key={t.task}>
                                    {(provided) => (
                                        <div className='flex items-center mt-3 w-full justify-between pr-6' {...provided.draggableProps} ref={provided.innerRef}>
                                            <div className='flex w-2/3'>
                                                <div className='mr-1' onClick={(e) => checkMark(e, t)}>
                                                    {t.done ? <Checked /> : <Unchecked />}
                                                </div>
                                                <h4 className={`ml-2 ${t.done ? 'line-through text-gray-400' : ''}`}>{t.task}</h4>
                                            </div>
                                            <div className='text-red-400 hover:text-red-700 cursor-pointer' onClick={() => deleteSubTask(t.task)}>
                                                <Cross />
                                            </div>
                                            <div {...provided.dragHandleProps} className='text-gray-600'>
                                                <Dragger />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}	
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <input maxLength='40' ref={newTaskRef} type="text" name='task' placeholder='Add a sub task' onKeyPress={addSubTask} className='border-b border-gray-300 outline-none my-3 w-full' />	
        </div>
    );
}