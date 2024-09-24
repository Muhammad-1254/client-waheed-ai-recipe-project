import {  Routes, Route, Navigate, useLocation, } from 'react-router-dom';
import Chatbot from '../pages/Chatbot';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Recipes from '../pages/Recipes';
import NotFound from '../pages/NotFound';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../store/user';
import DRecipe from '../pages/DRecipe';

const Pages = () => {

  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
      
      {/* public Routes */}
    <Route path="/login" element={
        <Login />
    } />
    <Route path="/register"  element={
        <Register />
    } />

    
    {/* protected Route */}
    <Route path="/chatbot" element={
      <ProtectedRoute >
        <Chatbot />
      </ProtectedRoute>
    } />
    <Route path="/contact" element={
      <ProtectedRoute >
        <Contact/>
      </ProtectedRoute>
    } />
    <Route path="/recipes"element={
      <ProtectedRoute >
        <Recipes />
      </ProtectedRoute>
    } />
  <Route path='/recipes/:recipeId' element={
    <ProtectedRoute >
      <DRecipe />
    </ProtectedRoute>
  } />

    {/* 404 Not Found Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  )
}

export default Pages


const ProtectedRoute = ({ children }) => {
  const {user} = useContext(UserContext);
  const location = useLocation();
  console.log("user.isAuth: ",user.isAuth)
  if(user.isAuth){
    return children;
  }
  return <Navigate to="/login" state={{from:location}} replace />;
 
};

