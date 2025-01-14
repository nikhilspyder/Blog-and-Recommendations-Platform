import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useCommonContext } from './CommonContext';
import NotificationsIcon from '@mui/icons-material/Notifications';


// import { useCommonContext } from './CommonContext';

function Header(props) {
  const {sections, title ,userName, isSubscribed, checkSubscribe} = props;

  const {commonState, setCommonState} = useCommonContext();

  const handleLinkClick = (section) => {
    // setTopic(section.title); // Update local state
    setCommonState((prevCommonState) => ({
      ...prevCommonState,
      topic: section.title
    }));
    console.log("commonstate - " + JSON.stringify(commonState) );
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Button variant="outlined" size="small" style={{ marginLeft: '1rem' }} onClick={checkSubscribe}>
                    {isSubscribed}
        </Button>
        <Typography 
          component="h2"
          variant="h5" 
          noWrap 
          align='center' 
          sx={{ flex: 1 }}>
            <Link to='/'>
          <Button
            color='primary'
            size='small'
          >
          {title}
        </Button>
        </Link>
      </Typography>
        <Link to="/alerts">
          <Button variant="outlined" size="small" startIcon={<NotificationsIcon />}>
            Alerts
          </Button>
        </Link>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Link to="/signup">
          <Button variant="outlined" size="small">
            {userName}
          </Button>
        </Link>
        {/* {isLoggedIn && (
          <Button variant="outlined" size="small">
          Logout
        </Button>
        )} */}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link to="/topic"
            color="inherit"
            key={section.title}
            onClick={() => handleLinkClick(section)}
            variant="body2"
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
