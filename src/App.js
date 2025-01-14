import React from 'react';
import Blog from './components/Blog';
import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import Signup from './components/Signup';
import CreatePost from './components/CreatePost';
import ViewPost from './components/ViewPost';
import Reply from './components/Reply';
import Admin from './components/Admin'
import Header from './components/Header';
import TopicPosts from './components/Topic';
import Alerts from './components/Alerts';
import RecommendActivity from './components/RecommendActivity';
import RecommendedForUser from './components/RecommendedForUser';

const App = () => {
  return (
    <BrowserRouter>
      <div>
      {false && (
          <nav>
            <ul>
              <li>
                <Link to="/">Blog</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/createPost">CreatePost</Link>
              </li>
              <li>
                <Link to="/viewPost">ViewPost</Link>
              </li>
              <li>
                <Link to="/reply">Reply</Link>
              </li>
              <li>
                <Link to="/header">Header</Link>
              </li>
              <li>
                <Link to="/topic">TopicPosts</Link>
              </li>
              <li>
                <Link to="/alerts">Alerts</Link>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/viewPost" element={<ViewPost />} />
          <Route path="/reply" element= {<Reply/>}/>
          <Route path="/admin" element= {<Admin/>}/>
          <Route path="/header" element= {<Header/>}/>
          <Route path="/topic" element= {<TopicPosts/>}/>
          <Route path="/alerts" element= {<Alerts/>}/>
          <Route path="/recommendActivity" element= {<RecommendActivity/>}/>
          <Route path="/recommendedForYou" element= {<RecommendedForUser/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
