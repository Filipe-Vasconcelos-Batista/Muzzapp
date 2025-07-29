import Nav from "./components/Navigation/NavBar.tsx";
import './index.css'
import {LoginForm} from "./pages/Login.tsx";
import { Home } from './pages/Home.tsx';
import NotFound from './pages/General/404.tsx'
import  SignUpForm  from './pages/Signup.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PrivateRoute, PublicOnlyRoute} from "./components/Navigation/Routes.tsx";
import Dashboard from "./pages/Dashboard.tsx";

function App() {
    return (
            <BrowserRouter>
                    <Nav/>
                        <main>
                            <Routes>
                                <Route path='/' element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
                                <Route path='/login' element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
                                <Route path='/signup' element={<PublicOnlyRoute><SignUpForm /></PublicOnlyRoute>} />
                                <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>} />
                                <Route path='/board' element={<Dashboard/>} />
                                <Route path="*" element={<NotFound/>} />
                            </Routes>
                        </main>

            </BrowserRouter>

    )
            ;
}

export default App;
