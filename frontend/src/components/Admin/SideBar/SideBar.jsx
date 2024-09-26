import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './SideBar.css';
import {
  Avatar,
  Button,
  Typography,
} from '@mui/material';

const navMenu = [
  {
    icon: <EqualizerIcon />,
    label: "Dashboard",
    ref: "/admin/dashboard",
    category: "Dashboard"
  },
  {
    icon: <GroupIcon />,
    label: "Workers",
    ref: "/admin/edit-workers",
    category: "Workers"
  },
  {
    icon: <PersonAddAlt1Icon />,
    label: "Add Worker",
    ref: "/admin/edit-workers",
    category: "Workers"
  },
  {
    icon: <InventoryIcon />,
    label: "Materials",
    ref: "/admin/edit-materials",
    category: "Materials"
  },
  {
    icon: <AddBoxIcon />,
    label: "Add Material",
    ref: "/admin/edit-materials",
    category: "Materials"
  },
  {
    icon: <WorkIcon />,
    label: "Jobs",
    ref: "/admin/edit-jobs",
    category: "Jobs"
  },
  {
    icon: <AddBoxIcon />,
    label: "Add Jobs",
    ref: "/admin/edit-jobs",
    category: "Jobs"
  },
  {
    icon: <AccountBoxIcon />,
    label: "My Profile",
    ref: "/profile",
    category: "Profile"
  },
];

const SideBar = ({ openAddWorkerDialog, openAddMaterialDialog, openAddJobsDialog }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const currentPath = location.pathname;

  const handleItemClick = (label) => {
    if (label === 'Add Worker') {
      openAddWorkerDialog();
    }
    if (label === 'Add Material') {
      openAddMaterialDialog();  
    }
    if (label === 'Add Jobs') {
      openAddJobsDialog();  
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="aside sidebar-container">
      <div className="Avatar">
        <Avatar alt="Avatar" />
        <div className="UserInfo">
          <Typography variant='contained'>{user?.name || user?.firstName}</Typography>
        </div>
      </div>

      <div className="NavMenu">
        {navMenu.map((item, index) => {
          const { icon, label, ref, category } = item;
          const isAddItem = label.includes('Add');
          const isCurrentCategory = currentPath.includes(category.toLowerCase().replace(' ', '-'));

          if (isCurrentCategory || (!isAddItem && !isCurrentCategory)) {
            return (
              <Link
                key={index}
                to={ref}
                className="FlexLink"
                onClick={() => handleItemClick(label)}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          }

          return null;
        })}
        <Button onClick={handleLogout} color='secondary' variant='contained'>
          <LogoutIcon />
          Logout
        </Button>
      </div>



        {/* <Typography variant="body2">Developed with ❤️ by:</Typography>
        <Link href="https://www.linkedin.com/in/younes-raymond-188a40241/" target="_blank" rel="noreferrer" className="LinkedInLink">
          <LinkedInIcon />
          <Typography variant="body2" className="LinkedInText">Younes Raymond</Typography>
        </Link> */}
    </aside>
  );
};

export default SideBar;
