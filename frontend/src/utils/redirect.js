// hooks/useRedirectBasedOnRole.js
import { useNavigate } from 'react-router-dom';

const useRedirectBasedOnRole = () => {
  const navigate = useNavigate();

  const redirect = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/edit-workers');
        break;
      case 'user':
        navigate('/profile');
        break;
      default:
        navigate('/pricing'); 
    }
    window.location.reload();
  };

  return redirect;
};

export default useRedirectBasedOnRole;
