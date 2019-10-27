import React, { useState, useEffect } from 'react';
import {Button, CssBaseline,Paper, 
        InputLabel, TextField, MenuItem, Select, Container, Grid 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PBIList from './PBIList';
import Copyright from './Copyright';
import AppBar from './AppBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    textAlign: 'left'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState(0);
  const [priority, setPriority] = useState(0);
  const [pbiArray, setPbiArray] = useState([]);
  const priorityList = [1,2,3,4,5,6,7,8,9,10];
  const url = "http://127.0.0.1:8000/pbi/";

  useEffect(() => {
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(json => setPbiArray(json));
  }, []);

  const validation = () => {
    if(name==='' || description === '' || estimate === 0 || priority === 0) {
      return false;
    }
    return true;
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(validation()) {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          name, description, estimate, priority
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        if(json.status_code === 201) {
          console.log('created')
          fetch(url)
          .then(getResponse => getResponse.json())
          .then(getJson => setPbiArray(getJson))
        }
      });
     
      setName('');
      setDescription('');
      setPriority(0);
      setEstimate(0); 
    }
  };

  const handleDelete = (id) => {
    fetch(url + id + '/', {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(json => {
      console.log(json)
      if(json.status_code === 200) {
        console.log('deleted')
        fetch(url)
        .then(getResponse => getResponse.json())
        .then(getJson => setPbiArray(getJson))
      }
    })
  }

  const handleUpdate = (id, updateName, updateDescription, updateEstimate, updatePriority) => {
    fetch(url + id + '/', {
      method: 'PATCH',
      body: JSON.stringify({
        name: updateName,
        description: updateDescription,
        estimate: updateEstimate,
        priority: updatePriority
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log(json)
      if(json.status_code === 200) {
        console.log('updated')
        fetch(url)
        .then(getResponse => getResponse.json())
        .then(getJson => setPbiArray(getJson))
      }
    })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar heading = 'Product Backlog'/>
      <div className={classes.content}>
        <div className={classes.appBarSpacer} />
        <form
          onSubmit={handleSubmit}
        >
          <TextField 
            fullWidth
            value={name}
            label="Name"
            onChange={e => setName(e.target.value)}
          />
          <br />
          <TextField 
            fullWidth
            multiline
            value={description}
            label="Description"
            onChange={e => setDescription(e.target.value)}
          />
          <br />
          <br />
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            {
              priorityList.map(priorityItem => (
                <MenuItem value={priorityItem}>{priorityItem}</MenuItem>
              ))
            }
          </Select> 
          <br />
          <br />
          <InputLabel>Estimate</InputLabel>
          <Select
            value={estimate}
            onChange={e => setEstimate(e.target.value)}
          >
            {
              priorityList.map(priorityItem => (
                <MenuItem value={priorityItem}>{priorityItem}</MenuItem>
              ))
            }
          </Select>
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Create PBI
          </Button> 
        </form>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <PBIList pbis={pbiArray} deletePBI={handleDelete} updatePBI={handleUpdate}/>
                </Paper>
              </Grid>
            </Grid>
        </Container>
        <Copyright />
      </div>
    </div>
  );
}