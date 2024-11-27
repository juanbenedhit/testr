import { BrowserRouter, Route } from 'react-router-dom'
import useBoards from '../hooks/useBoards'
import BoardList from '../components/BoardList'
import Kanban from './Kanban'
import { Inertia } from '@inertiajs/inertia'

export default function Home({ logOut, userId, loginWithGoogle, name, isAnon }) 
{
    const boards = useBoards(userId)

    const addNewBoard = (e) => {
        e.preventDefault()
        Inertia.post(`/boards`, { id: uid, name: e.target.elements.boardName.value }) // Use Inertia to add a new board
        e.target.elements.boardName.value = ''
    }

    return boards !== null ? (
        <BrowserRouter>
            <Route exact path='/'>
                <BoardList deleteBoard={(id) => Inertia.delete(`/boards/${id}`)} logOut={logOut} boards={boards} addNewBoard={addNewBoard} name={name} />
            </Route>
            <Route path='/board/:boardId'>
                <Kanban userId={userId} />
            </Route>
        </BrowserRouter>
    ) : <div className="spinner h-screen w-screen" />
}

