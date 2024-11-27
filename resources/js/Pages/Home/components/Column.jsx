import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { Bin, Exclaim } from './Icons';
import { debounce } from '../utils';
import { useState, useRef } from 'react';
import Modal from './Modal';
import { Inertia } from '@inertiajs/inertia';

export default function Column({ column, tasks, allData, boardId, userId, filterBy, index }) {
    const [modal, setModal] = useState(false);
    const [editingCol, setEditingCol] = useState(false);
    const colInput = useRef(null);

    // Function to delete the column and its tasks
    const deleteCol = (colId, tasks) => {
        Inertia.delete(`/boards/${boardId}/columns/${colId}`); // Use Inertia to delete the column
        tasks.forEach(t => {
            Inertia.delete(`/boards/${boardId}/tasks/${t}`); // Delete each task in the column
        });
    };

    // Debounced function to change the column name
    const changeColName = debounce((e, colId) => {
        Inertia.put(`/boards/${boardId}/columns/${colId}`, { title: e.target.value }); // Update column name with Inertia
    }, 700);

    // Function to focus on the input for editing the column name
    const moveToInput = () => {
        setEditingCol(true);
        setTimeout(() => {
            colInput.current.focus();
        }, 50);
    };

    return (
        <>
            <Draggable draggableId={column.id} index={index}>
                {(provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef} className='mr-5'>
                        <div style={{ background: '#edf2ff' }}>
                            <div {...provided.dragHandleProps} className='bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 flex items-center justify-between px-4 py-1 rounded-sm'>
                                <input
                                    ref={colInput}
                                    className={`sm:text-xl text-blue-700 text-lg px-2 w-10/12 ${editingCol ? '' : 'hidden'}`}
                                    onBlur={() => setEditingCol(false)}
                                    type="text"
                                    defaultValue={column.title}
                                    onChange={(e) => changeColName(e, column.id)}
                                />
                                <h2 className={`sm:text-lg text-blue-100 truncate text-lg ${editingCol ? 'hidden' : ''}`} onClick={moveToInput}>
                                    {column.title}
                                </h2>
                                <div className='text-blue-700 hover:text-blue-50 cursor-pointer' onClick={() => setModal(true)}>
                                    <Bin />
                                </div>
                            </div>
                            <Droppable droppableId={column.id} type='task'>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`shadow-sm h-full py-4 px-2 ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-green-400 via-green-200 to-green-100' : ''}`}
                                    >
                                        {tasks.map((t, i) => (
                                            <Task
                                                allData={allData}
                                                id={t}
                                                index={i}
                                                key={t}
                                                boardId={boardId}
                                                userId={userId}
                                                columnDetails={column}
                                                filterBy={filterBy}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <Modal modal={modal} setModal={setModal} ariaText='Column Delete confirmation'>
                            <div className='md:px-12'>
                                <div className='text-yellow-600 mb-2'>
                                    <Exclaim />
                                </div>
                                <h2 className='text-base md:text-2xl text-gray-900 mb-2'>Are you sure you want to delete this column?</h2>
                                <h3 className="text-red-600 text-sm md:text-lg">This column and its tasks will be permanently deleted and it cannot be undone.</h3>
                                <div className="my-8 flex">
                                    <button
                                        className='border border-red-700 text-red-600 px-2 py-1 rounded-sm mr-4 text-sm md:text-base'
                                        onClick={() => deleteCol(column.id, tasks)}
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base'
                                        onClick={() => setModal(false )}
                                    >
                                        No, go back
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </Draggable>
        </>
    );
}