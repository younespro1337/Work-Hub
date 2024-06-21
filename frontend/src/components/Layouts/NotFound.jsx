import notFound from '../../assets/images/404-not-found.svg';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="mt-16 flex flex-col gap-4 items-center justify-center">
            <img draggable="false" className="sm:w-1/3 h-full" src={notFound} alt="Page Not Found" />
            <Link to="/" className="px-4 py-2 bg-primary-blue rounded-sm uppercase shadow hover:shadow-lg text-white">Back To Home</Link>
        </div>
    )
};

export default NotFound;


// i need to  fix and maintain the login functionality for foget a password oki and send email that contan a code i can generate then when he pass this code i need to get it match  then if true  i can give the user the option to pass new password and confirm it then msotre the new password in db and tell him go head 