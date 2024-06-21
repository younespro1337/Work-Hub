import * as Yup from 'yup';

// Define validation schema for sign-in
export const signInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});


// Define validation schema for sign-up
export const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const addWorkerFormSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  position: Yup.string(),
  salary: Yup.number().required('Salary is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  gender: Yup.string().required('Gender is required'),
  avatar: Yup.mixed().required('Avatar is required'),
  nationalId: Yup.string(),
  phoneNumber: Yup.string(),
  legalInfo: Yup.string().required('Legal information is required'),
});

export const tasksSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string()
    .required('Description is required')
    .min(50, 'Description must be at least 50 characters'),
  resultExpectation: Yup.string().required('Result Expectation is required'),
  deadlineDays: Yup.date().required('Deadline is required'),
});

export const addMaterialsSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name should be at least 3 characters')
    .max(50, 'Name should not exceed 50 characters')
    .required('Name is required'),
  description: Yup.string()
    .min(10, 'Description should be at least 10 characters')
    .max(200, 'Description should not exceed 200 characters')
    .required('Description is required'),
  image: Yup.mixed()
    .required('Image is required'),
  stock: Yup.number()
    .min(1, 'Stock should be at least 1')
    .max(1000, 'Stock should not exceed 1000')
    .required('Stock is required'),
  category: Yup.string()
    .min(3, 'Category should be at least 3 characters')
    .max(30, 'Category should not exceed 30 characters')
    .required('Category is required')
});



export const addJobSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  requirements: Yup.string().required('Requirements are required'),
  salary: Yup.number().required('Salary is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
}); 


