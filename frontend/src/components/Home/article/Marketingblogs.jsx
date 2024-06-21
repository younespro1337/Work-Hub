
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './articles.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';
import { Formik , Form , Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

import {
  Snackbar, 
  Alert,
  Dialog, 
  DialogTitle,
  DialogContent, 
  TextField, 
  DialogActions, 
  Button,
} from '@mui/material';

import { Paper, Typography, List, ListItem } from '@mui/material';


const MarketingPlan = () => {  
  const [isFormVisible, setFormVisible] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    experience: Yup.string().required('Experience is required'),
    b2bExpertise: Yup.string().required('B2B Expertise is required'),
    additionalQuestion: Yup.string().required('Additional Question is required'),
  });

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleJoinButtonClick = () => {
    setFormVisible(true);
  };


  function sendDataToServer(data) {
    console.log('sending data to server succesfull', data)
    const url = '/api/v1/NewMemberMarketingB2B';
  
    axios.post(url, data)
      .then(response => {
        console.log('Data sent successfully:', response.data);
        handleFormClose();
        handleSnackbarOpen()
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  }


  const handleFormClose = () => {
    setFormVisible(false);
  };

return (
  <>

  
<div className="article">
      <Paper elevation={3} >
        <h1>Marketing Plan: Reaching B2B Targets</h1>
        <p>
          Our marketing plan is tailored to reach out to enterprises with a large workforce, extensive materials, and complex job operations. We aim to provide high-performance companies that prioritize time management and seek to optimize their business processes with a better experience for their workforce.
        </p>

        <Typography variant="h6">
          First Step: Identify Potential Clients
        </Typography>
        <p>
          Marketers should seek enterprises that fit our target criteria. Look for companies with a significant number of employees, a diverse range of materials, and a strong need for efficient talent management. If the company shows potential interest and meets the criteria, contact the SEO or the founder directly to pitch our solution.
        </p>

        <Typography variant="h6">
          Customization and Demo
        </Typography>
        <p>
          Each marketer will be assigned a unique domain name, hosting, and an admin account to customize the web app according to the enterprise's specific needs. This customization will be showcased to the company's SEO or boss, demonstrating how our solution addresses their pain points and enhances their operations. The first month will be offered for testing and gathering feedback on desired features and changes.
        </p>

        <Typography variant="h6">
          Features and Benefits
        </Typography>
        <p>
          The company's admin will have access to a dashboard, allowing them to view profiles of their employees, receive requests from workers for materials, and assign daily tasks. All job postings from the company will be consolidated in a single page, facilitating easy access for both companies and talented workers. Data will be charted to provide real-time insights, empowering companies with more control over their operations.
        </p>

        <Typography variant="h6">
          Supporting the Companies
        </Typography>
        <p>
          Every company will receive 24/7 support, including domain hosting, local or cloud options, SEO improvement, and version updates. We will continuously develop new versions to cater to their evolving needs. Additionally, we offer a 30-day money-back guarantee for companies unsatisfied with the app's performance.
        </p>

        <Typography variant="h6">
          Join the Marketing Team
        </Typography>
        <p>
          We are seeking expert marketing professionals and skilled web developers with B2B specialization to join our team. As part of the marketing team, you will play a key role in executing this plan and bringing in potential clients. As a web developer, you'll have the opportunity to contribute to the continuous development of our app and create customized versions for each company.
        </p>

        <Typography variant="h6">
          Email Campaign Support
        </Typography>
        <p>
          As an additional value-added service, I want to highlight that I can personally assist you with any email campaigns you plan to run. Whether you need to send marketing emails, newsletters, or announcements, I can handle up to 1,000,000 email recipients without any issue. All you need to do is provide me with an array or list of the email addresses, the preferred sending time, and the content of the email. With this support, we can maximize the impact of your marketing efforts and ensure a successful outreach to potential clients.
        </p>

        <Typography variant="h6">
          Earnings and Incentives
        </Typography>
        <p>
          Let's discuss the exciting part – your earnings and incentives for marketing AllMart. For every active user in the app, you will earn an impressive 20% commission of the total net fee paid by each user and for agency 50%. This incentivizes you to drive engagement and attract more enterprises to benefit from AllMart's game-changing features. As a web developer, you'll receive recognition for your contributions to creating unique versions of the app for each company.
        </p>

        <Typography variant="h6">
          Our Plan: $0.5 Monthly for Every Active User
        </Typography>
        <List>
          <ListItem>Domain Name: Each company will receive a unique domain name.</ListItem>
          <ListItem>Hosting: We provide hosting services for a year.</ListItem>
          <ListItem>SEO and Content Channels: We take care of SEO and create content channels like LinkedIn pages and other platforms to boost visibility.</ListItem>
          <ListItem>Unique Version for Each Company: Every company will get a customized version of the app tailored to their specific needs and preferences.</ListItem>
          <ListItem>Free Updates and Continuous Improvement: Companies will receive regular updates and improvements to ensure they stay ahead in resource management.</ListItem>
        </List>

        <Button color='primary' variant='contained'  onClick={handleJoinButtonClick}>Join the Marketing Team</Button>
      </Paper>
    </div>


     
  
<Dialog open={isFormVisible} onClose={handleFormClose}>
  <DialogTitle>Join the Marketing Team</DialogTitle>
  <DialogContent>
  <Formik
  initialValues={{
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    portfolio: '',
    b2bExpertise: '',
    additionalQuestion: '',
  }}
  validationSchema={validationSchema}
  onSubmit={(values, { setSubmitting }) => {
    console.log('Formik onSubmit:', values);
    sendDataToServer(values);
    setSubmitting(false);
  }}
>
  {({ errors, touched, isSubmitting }) => (
    <Form>
      <Field
        as={TextField}
        name="fullName"
        label="Full Name"
        fullWidth
        margin="normal"
        error={touched.fullName && !!errors.fullName}
        helperText={touched.fullName && errors.fullName}
      />

      <Field
        as={TextField}
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={touched.email && !!errors.email}
        helperText={touched.email && errors.email}
      />

      <Field
        as={TextField}
        name="phone"
        label="Phone"
        fullWidth
        margin="normal"
        error={touched.phone && !!errors.phone}
        helperText={touched.phone && errors.phone}
      />


      <Field
        name="b2bExpertise"
        // ...
      >
        {({ field }) => (
          <TextField
            {...field}
            label="B2B Expertise"
            fullWidth
            margin="normal"
            error={touched.b2bExpertise && !!errors.b2bExpertise}
            helperText={touched.b2bExpertise && errors.b2bExpertise}
          />
        )}
      </Field>

      <Field
        as={TextField}
        name="portfolio"
        label="Portfolio"
        fullWidth
        margin="normal"
        error={touched.portfolio && !!errors.portfolio}
        helperText={touched.portfolio && errors.portfolio}
      />

      {/* Additional Question Field (if needed) */}
      <Field
        as={TextField}
        name="additionalQuestion"
        label="Additional Question"
        fullWidth
        margin="normal"
        error={touched.additionalQuestion && !!errors.additionalQuestion}
        helperText={touched.additionalQuestion && errors.additionalQuestion}
      />

      <DialogActions>
        <Button onClick={handleFormClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </DialogActions>
    </Form>
  )}
</Formik>

  </DialogContent>
</Dialog>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Data sent successfully!
        </Alert>
      </Snackbar>
      
      <div className="image-container">
        {/* Dashboard Chart data with SideBar */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006296/Web_capture_27-7-2023_161716_localhost_rhpurm.jpg'} alt="Dashboard Chart data with SideBar" />
          <p className="image-description">Dashboard Chart data with SideBar</p>
        </div>

        {/* Show workers CRUD workers with SideBar */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691502347/Web_capture_8-8-2023_144341_localhost_vpe2qa.jpg'} alt="Show workers CRUD workers with SideBar" />
          <p className="image-description">Show workers CRUD workers with SideBar</p>
        </div>
     
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691502462/Web_capture_8-8-2023_132229_localhost_t3j8ud.jpg'} alt="Show workers CRUD workers with SideBar" />
          <p className="image-description">Adding Daily Task to Worker with Deadline </p>
        </div>
        {/* Show materials CRUD with SideBar */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006296/Web_capture_27-7-2023_162832_localhost_ckguzd.jpg'} alt="Show materials CRUD with SideBar" />
          <p className="image-description">Show materials CRUD with SideBar</p>
        </div>

        {/* Dashboard CRUD jobsPost, see the pdf of applier download or browse it */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006295/Web_capture_27-7-2023_163617_localhost_zl8cb9.jpg'} alt="Dashboard CRUD jobsPost, see the pdf of applier download or browse it" />
          <p className="image-description">Dashboard CRUD jobsPost, see the pdf of applier download or browse it</p>
        </div>

        {/* Materials in page of worker, show-Products Route */}
        <div className="image-box">
  <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006295/Web_capture_27-7-2023_163036_localhost_eyzb5q.jpg'} alt="Materials in page of worker, show-Products Route" />
  <p className="image-description">
    Materials in page of worker, show-Products{' '}
    like if stuck available (in red) dislike if the stuck =  0
  </p>
</div>

<div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691502356/Web_capture_8-8-2023_144522_localhost_wvdyjz.jpg'} alt="Show workers CRUD workers with SideBar" />
          <p className="image-description">Profile for Each Worker</p>
        </div>
        {/* Material in page of workers, show-products Route, show location of material and other workers */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006295/Web_capture_27-7-2023_16319_localhost_rbrcra.jpg'} alt="Material in page of workers, show-products Route, show location of material and other workers" />
          <p className="image-description">Material in page of workers, show-products page, show location of material and other workers</p>
        </div>

       
        {/* Show Jobs Available for workers and Unknown user role */}
        <div className="image-box">
          <img src={'https://res.cloudinary.com/dktkavyr3/image/upload/v1691006294/Web_capture_27-7-2023_163537_localhost_o01lwx.jpg'} alt="Show Jobs Available for workers and Unknown user role" />
          <p className="image-description">Show Jobs Available for workers and Unknown user role</p>
        </div>
      </div>

      <div className="contact">
        <label htmlFor="more-information">For More Information Contact Me:<LinkedInIcon /></label>
        <Link to='https://www.linkedin.com/in/younes-raymond-188a40241/' target='_blank'>
          <Button variant='contained' color='primary' >Contact Me</Button>
        </Link>
      </div>

      </>

  );



};

export default MarketingPlan;




