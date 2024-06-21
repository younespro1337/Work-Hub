import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {

    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    // console.log(user, loading, isAuthenticated)

    return (
        <>
            {loading === false && (
                isAuthenticated === false ? <Navigate to="/singin" /> : isAdmin ? user.role !== "admin" ? <Navigate to="/singin" /> : children : children
            )}
        </>
    );
};

export default ProtectedRoute;