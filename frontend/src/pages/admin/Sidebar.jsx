import React from 'react';
import './style.css';
import { BoxIcons } from 'boxicons'; // Make sure to install the Boxicons package

const Sidebar = () => (
    <section id="sidebar">
        <a href="#" className="brand">
            <i className='bx bxs-smile'></i>
            <span className="text">AdminHub</span>
        </a>
        <ul className="side-menu top">
            <li className="active">
                <a href="#">
                    <i className='bx bxs-dashboard'></i>
                    <span className="text">Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i className='bx bxs-shopping-bag-alt'></i>
                    <span className="text">My Store</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i className='bx bxs-doughnut-chart'></i>
                    <span className="text">Analytics</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i className='bx bxs-message-dots'></i>
                    <span className="text">Message</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i className='bx bxs-group'></i>
                    <span className="text">Team</span>
                </a>
            </li>
        </ul>
        <ul className="side-menu">
            <li>
                <a href="#">
                    <i className='bx bxs-cog'></i>
                    <span className="text">Settings</span>
                </a>
            </li>
            <li>
                <a href="#" className="logout">
                    <i className='bx bxs-log-out-circle'></i>
                    <span className="text">Logout</span>
                </a>
            </li>
        </ul>
    </section>
);



export default Sidebar;