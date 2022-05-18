import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './Navbar';
import QuestionForm from './QuestionForm';
import QuestionCardList from './QuestionCard';
import QuestionPageWrapper from './QuestionPage';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/" element={<QuestionForm/>} />
            <Route path="/browse" element={<QuestionCardList/>} />
            <Route path="/question/:id" element={<QuestionPageWrapper/>} />
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
