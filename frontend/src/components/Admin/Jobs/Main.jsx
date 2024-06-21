import React, { useEffect, useState, useRef } from 'react';
import { getAllJobs } from '../../../actions/userAction';
import SideBar from '../SideBar/SideBar';
import { formatDate } from '../../../utils/DateFormat';
import JobsDataGrid from './JobsGridComponent';
import JobsFormDialog from './JobsFormDialog';

const Main = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddJobsDialogOpen, setIsAddJobsDialogOpen] = useState(false);

  const fetchJobsData = (jobs) => {
    const updatedRows = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements,
      counter: job.counter,
      applicants: job.applicants || [],
      createdAt: formatDate(job.createdAt),
    }));
    return updatedRows;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        const jobsData = res.data;
        const updatedRows = fetchJobsData(jobsData);
        setJobs(updatedRows);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchJobs();
  }, []);

  const openAddJobsDialog = () => {
    setIsAddJobsDialogOpen(true);
  };

  const updateJobs = (newJobs) => {
    const updatedRows = fetchJobsData(newJobs);
    setJobs(updatedRows);
  };

  return (
    <div className='wrapper'>
      <SideBar 
      openAddJobsDialog={openAddJobsDialog} 
      />
      <JobsDataGrid 
      jobs={jobs} 
      loading={loading} 
      updateJobsData={updateJobs} 
      />
      <JobsFormDialog
        isAddJobsDialogOpen={isAddJobsDialogOpen}
        onClose={() => setIsAddJobsDialogOpen(false)}
        updateJobs={updateJobs} 
      />
    </div>
  );
};

export default Main;
