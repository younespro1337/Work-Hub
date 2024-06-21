import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Home/Header/Header.jsx';
import LoginPage from './components/Auth/SingIn.jsx';
import RegisterPage from './components/Auth/SingUp.jsx';
import ForgetPassword from './components/Auth/ForgetPassword.jsx';
import Search from './components/Layouts/Search';
import Jobs from './components/Jobs/Jobs'


import Dashboard from './components/Admin/Charts/MainData.jsx';
import EditWorkers from './components/Admin/Workers/Main'
import EditMaterials from './components/Admin/Materials/Main';
import EditJobs from './components/Admin/Jobs/Main'


import Profile from './components/Home/profile/Main'
import LearnBoxes  from './components/Home/article/learnMoreBox';
import MarketingPlan  from './components/Home/article/Marketingblogs'
import Settings from './components/Home/Settings/Setting';
import ChatLayouts from './components/Home/ChatLayout/ChatLayout.jsx'
import TabsPricingExample from './components/Home/payments/Pricing.jsx';
import Materials from './components/Home/Materials/Materials.jsx'
import Optionbox from './components/Home/option';
import Aboutus from './components/Home/AboutUs/about-us';
import ProtectedRoute from './Routes/ProtectedRoute.js';
import Checkout from './components/payments/Checkout.jsx';

const App = () => {
  return (
    <>
      <Router>
         <Header />

        <Routes>
        <Route path="/pricing" element={<TabsPricingExample />} />       
        <Route path="/checkout" element={<Checkout />} />       
        <Route path="/singin" element={<LoginPage />} />       
        <Route path="/singup" element={<RegisterPage />} />
           {/* start user section     */}
          <Route path='/'  exact   element={
            <ProtectedRoute>
          <Optionbox />
            </ProtectedRoute>
          }></Route>

<Route path="/about-us" element={
    <ProtectedRoute>
        <Aboutus />
    </ProtectedRoute>
} />

<Route path="/materials" element={
    <ProtectedRoute>
        <Materials />
    </ProtectedRoute>
} />
<Route path="/search" element={
    <ProtectedRoute>
        <Search />
    </ProtectedRoute>
} />

<Route path="/Jobs" element={
    <ProtectedRoute>
        <Jobs />
    </ProtectedRoute>
} />

<Route path="/settings" element={
    <ProtectedRoute>
        <Settings />
    </ProtectedRoute>
} />

<Route path="/inbox" element={
    <ProtectedRoute>
        <ChatLayouts />
    </ProtectedRoute>
} />
<Route path="/profile" element={
    <ProtectedRoute>
        <Profile />
    </ProtectedRoute>
} />

{/* end users section*/}
      







<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} ></Route>

<Route path='/admin/edit-workers' element={
  <ProtectedRoute isAdmin={true}>
    <EditWorkers />
  </ProtectedRoute>
}></Route>

<Route path='/admin/edit-materials' element={
  <ProtectedRoute isAdmin={true}>
    <EditMaterials />
  </ProtectedRoute>
}></Route>

<Route path='/admin/edit-jobs' element={
  <ProtectedRoute isAdmin={true}>
    <EditJobs />
  </ProtectedRoute>
}></Route>



{/* end Admin Dashboard Section */}
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/learn-more" element={<LearnBoxes />} />
          <Route path='/Marketing-plan' element={<MarketingPlan />} />

        </Routes>


      </Router>
    </>
  );

};

export default App;