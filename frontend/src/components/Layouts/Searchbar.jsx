import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../../actions/userAction';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
const Searchbar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      try {
        await search(keyword); // Call the search function from userAction with the keyword
        // navigate(`/search/${keyword}`);
        navigate('/search');
      } catch (error) {
        console.error(error);
        navigate('/search');
      }
    } else {
      navigate('/search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className=".form">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className=""
        type="text"
        placeholder="Search for Material, Workers & Jobs and more"
      />
      <button type="submit" className="btn">
        <ManageSearchRoundedIcon />
      </button>
    </form>
  );
};

export default Searchbar;
