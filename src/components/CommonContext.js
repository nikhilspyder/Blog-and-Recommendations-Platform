import React, { createContext, useContext, useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

const CommonContext = createContext();

const initialCommonState = {
    userName: 'Sign Up',
    role:'',
    title: "Blog",
    isLoggedin: false,
    authenticated: false,
    openRecommendDialog: false,
    topic:'',
    sections : [
        { title: 'Academic Resources', url: '#', isSubscribed:false },
        { title: 'Career Services', url: '#', isSubscribed:false},
        { title: 'Campus', url: '#', isSubscribed:false },
        { title: 'Local Community Resources', url: '#', isSubscribed:false },
        { title: 'Sports', url: '#', isSubscribed:false },
        { title: 'Health and Wellness', url: '#', isSubscribed:false },
        { title: 'Technology', url: '#', isSubscribed:false },
        { title: 'Travel', url: '#', isSubscribed:false },
        { title: 'Alumni', url: '#', isSubscribed:false },
    ],
    sidebar: {
        title: 'About',
        description: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
        archives: [
            { title: 'March 2020', url: '#' },
            { title: 'February 2020', url: '#' },
            { title: 'January 2020', url: '#' },
            { title: 'November 1999', url: '#' },
            { title: 'October 1999', url: '#' },
            { title: 'September 1999', url: '#' },
            { title: 'August 1999', url: '#' },
            { title: 'July 1999', url: '#' },
            { title: 'June 1999', url: '#' },
            { title: 'May 1999', url: '#' },
            { title: 'April 1999', url: '#' },
        ],
        social: [
            { name: 'GitHub', icon: GitHubIcon },
            { name: 'X', icon: XIcon },
            { name: 'Facebook', icon: FacebookIcon },
        ],
    }
};

export const CommonProvider = ({ children }) => {
  const [commonState, setCommonState] = useState(initialCommonState);

  // Retrieve state from local storage on mount
  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem('commonState'));
    if (storedState) {
      setCommonState(storedState);
    }
  }, []);

  // Store state in local storage on state change
  useEffect(() => {
    localStorage.setItem('commonState', JSON.stringify(commonState));
  }, [commonState]);

  const commonContextValue = {
    commonState,
    setCommonState,
  };

  return (
    <CommonContext.Provider value={commonContextValue}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);

  if (!context) {
    throw new Error('useCommon must be used within a CommonProvider');
  }

  return context;
};
