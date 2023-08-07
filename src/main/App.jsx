import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './App.css'
import React from 'react'

 import Nav from '../components/template/Nav'
 import MainCard from '../components/Card/MainCard'
 import Footer from '../components/template/Footer'


 export default props =>
    <div className="app">
        <Nav />
        <MainCard />
        <Footer /> 
    </div>