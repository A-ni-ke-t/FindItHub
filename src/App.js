import React from 'react';
import './App.scss';
import { Route, Routes } from "react-router-dom";
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Register/Register';
import ItemDetails from './components/Home/ItemDetails';
import EditItem from './components/AddItem/EditItem';

function App() {
 

  return (
    <>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route path="/edit/:id" element={<EditItem />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
 
  );
}

export default App;
