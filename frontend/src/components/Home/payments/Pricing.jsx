import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import { Box , List, ListItem,Button,ListItemText , ListItemIcon} from '@mui/material';

export default function TabsPricingExample() {
  return (
    <Box
    display="flex" 
    justifyContent="center"  
    alignItems="center"    
    width='100%'  
    height="80vh" 
    >
    <Tabs
      variant="outlined"
      aria-label="Pricing plan"
      defaultValue={0}
      sx={{
        width: 343,
        borderRadius: 'lg',
        boxShadow: 'sm',
        overflow: 'auto',
      }}
    >
      <TabList
        disableUnderline
        tabFlex={1}
        sx={{
          [`& .${tabClasses.root}`]: {
            fontSize: 'sm',
            fontWeight: 'lg',
            [`&[aria-selected="true"]`]: {
              color: 'primary.500',
              bgcolor: 'background.surface',
            },
            [`&.${tabClasses.focusVisible}`]: {
              outlineOffset: '-4px',
            },
          },
        }}
      >
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          Community
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          Pro
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          Premium
        </Tab>
      </TabList>




      <TabPanel value={0}>
  <Typography level="inherit" sx={{ mb: 2 }}>
    Explore job opportunities in the construction industry and take your career to new heights! 👷‍♂️🏗️
  </Typography>

  <List sx={{ mt: 2, color: 'text.primary' }}>
    <ListItem disablePadding>
      <ListItemIcon>
        🛠️
      </ListItemIcon>
      <ListItemText primary="Find a job in the construction industry." />
    </ListItem>
    <ListItem disablePadding>
      <ListItemIcon>
        📋
      </ListItemIcon>
      <ListItemText primary="Create and manage a profile" />
    </ListItem>
    <ListItem disablePadding>
      <ListItemIcon>
        💼
      </ListItemIcon>
      <ListItemText primary="Work as a freelancer on tasks for our companies." />
    </ListItem>
    <ListItem disablePadding>
      <ListItemIcon>
        🤝
      </ListItemIcon>
      <ListItemText primary="Collaborate with companies" />
    </ListItem>
  </List>
  
  <Typography textColor="success.400" fontSize="xl3" fontWeight="xl" mt={2}>
    $0{' '}
    <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
      － Free forever
    </Typography>
  </Typography>
  
  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
    Start for Free
  </Button>
</TabPanel>




      <TabPanel value={1}>
        <Typography level="inherit">
          Best for professional developers building enterprise or data-rich
          applications.
        </Typography>
        <Typography textColor="primary.400" fontSize="xl3" fontWeight="xl" mt={1}>
          $15{' '}
          <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
            / dev / month
          </Typography>
        </Typography>
      </TabPanel>
      <TabPanel value={2}>
        <Typography level="inherit">
          The most advanced features for data-rich applications, as well as the
          highest priority for support.
        </Typography>
        <Typography textColor="primary.400" fontSize="xl3" fontWeight="xl" mt={1}>
          <Typography
            fontSize="xl"
            borderRadius="sm"
            px={0.5}
            mr={0.5}
            sx={(theme) => ({
              ...theme.variants.soft.danger,
              color: 'danger.400',
              verticalAlign: 'text-top',
              textDecoration: 'line-through',
            })}
          >
            $49
          </Typography>
          $37*{' '}
          <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
            / dev / month
          </Typography>
        </Typography>
      </TabPanel>
    </Tabs>
    </Box>
  );
}