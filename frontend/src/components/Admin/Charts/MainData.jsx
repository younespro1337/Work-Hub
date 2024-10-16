import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale } from 'chart.js';
import { getAllUsers, getAllMaterialRequest, getAllJobs,  fetchTasks } from '../../../actions/userAction';
import { getProducts } from '../../../actions/productaction';
import WorkersChart from './WorkersChart';
import MaterialsChart from './MaterialsChart';
import UsersChart from './UsersChart';
import MaterialRequesterChart from './MaterialRequesterChart';
import JobsChart from './JobsChart';
import TasksChart from './TasksChart';
import { Container } from '@mui/system';
const MainData = () => {
  const [Workers, setWorkers] = useState([]);
  const [MaterialRequester, setMaterialRequester] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [Materials, setMaterials] = useState([]);
  const [Tasks, setTasks] = useState([]);

  useEffect(() => {
    Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

    const fetchData = async () => {
      try {
        const usersResponse = await getAllUsers();
        setWorkers(usersResponse.users);


        const materialsResponse = await getProducts();
        setMaterials(materialsResponse.products);

        const materialRequesterResponse = await getAllMaterialRequest();
        setMaterialRequester(materialRequesterResponse);

        const jobsResponse = await getAllJobs();

        setJobs(jobsResponse.data);

        
        const tasksResponse = await fetchTasks();
        // console.log(tasksResponse)

        setTasks(tasksResponse.data); 
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: '20px' }}>
    <WorkersChart workers={Workers} />
    <MaterialsChart materials={Materials} />
    <MaterialRequesterChart materialRequester={MaterialRequester} />
    <JobsChart jobs={Jobs} />
    <TasksChart tasks={Tasks} /> 
  </Container>
  );
};

export default MainData;
