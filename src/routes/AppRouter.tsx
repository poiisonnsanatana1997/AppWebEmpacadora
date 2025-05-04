import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Layout from '../components/Layout';
import Home from '../pages/Home';

const AppRouter = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Layout />}>
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default AppRouter;