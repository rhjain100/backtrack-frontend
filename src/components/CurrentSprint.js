import React, { useState, useEffect } from 'react';
import { CssBaseline, Table, TableBody, TableRow, TableCell, Paper, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from './Copyright';
import AppBar from './AppBar/AppBar';

const pbiList = {
  "start_date": "2019-10-19",
  "end_date": "2019-10-31",
  "capacity": 80,
  "project": 1,
  "pbis": [
    { "pbi_id": 6,
      "tasks": [{"description":  "Create", "effort_hours": 10, "status": true},
           {"developer":  "2", "description":  "New", "effort_hours": 8, "status": false}
      ]
    },
    { "pbi_id":5,
      "tasks": [{"description":  "Create", "effort_hours": 5, "status": true},
           {"developer":  "2", "description":  "New", "effort_hours": 6, "status": false}
      ]
    }
  ]
}

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
  newtext: {
    fontSize: 25,
  },
  pbitext: {
    fontSize: 18,
  },
}));

export default () => {
  const classes = useStyles();
  const [pbiArray, setPbiArray] = useState([]);
  const [burndown, setBurndown] = useState(0);
  const [completed, setCompleted] = useState(0);


  // const [addPbis, setAddPbis] = useState([]);
  // const hello = ({
  //   id: 12,
  //   name: "Make",
  // });

  const url = "http://127.0.0.1:8000/pbi/";

  useEffect(() => {
    fetch(url)
    .then(response => response.json())
    .then(json => setPbiArray(json));
  }, []);


  let tmpBurndown = burndown;
  let tmpCompleted = completed;
  let pbiBurndown = 0;
  let pbiCompleted = 0;
  const reset = () =>{
    pbiBurndown = 0;
    pbiCompleted = 0;
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar heading = 'Current Sprint'/>
      <div className={classes.content}>
        <div className={classes.appBarSpacer} />
        <br/>
        <br/>
          <div className={classes.pbitext}>
          <div>
          <b> Project: </b>{pbiList.project}<br/>
            <b>Capacity: </b>{pbiList.capacity}<br/>
            <b>Start Date: </b> {pbiList.start_date} <br/>
            <b>End Date: </b> {pbiList.end_date} <br/>
          </div>

          { pbiList.pbis.length>0? (
              pbiList.pbis.map(row => (
                <>
                { 
                  reset()
                }
                <div className={classes.newtext}>
                </div>
                <br/>
                PBI ID: {row.pbi_id} <br/>
                Tasks:
                {
                  (row.tasks.length>0)? (
                    <div>
                    <Paper className={classes.paper}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Effort</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                          </TableRow>

                          {row.tasks.map(task => {
                            pbiBurndown = pbiBurndown + task.effort_hours;
                            tmpBurndown = tmpBurndown + task.effort_hours;
                            if(task.status===true){
                              tmpCompleted = tmpCompleted + task.effort_hours;
                              pbiCompleted = pbiCompleted + task.effort_hours;
                            }
                            console.log("pbiBurndown " + pbiBurndown);
                            return(
                            <TableRow>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.effort_hours}</TableCell>
                                <TableCell>{task.status? ("Completed"): ("In progress")}</TableCell>
                                <TableCell>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary">
                                    Complete
                                </Button> 
                              </TableCell>
                            </TableRow>
                          )})}
                      </TableBody>
                      </Table>
                    </Paper>
                    </div>
                  ) : (
                    <>
                      <dig>
                        There are no Tasks added in this PBI.
                      </dig>
                    </>
                  )
                }
                <b>PBI Completed: </b> {pbiCompleted} <br/>
                <b>PBI Burndown: </b> {pbiBurndown} <br/>
                <b>Leftover: </b> {pbiBurndown-pbiCompleted}
              </>
              ))
               

              ): (
                <div>
                  <b>There are no PBIs added to Current Sprint</b>
                </div>
              )
          }
          <br/>
        <center>
        <b>Sprint Completed: </b>{tmpCompleted} <br/>
        <b>Sprint Burndown: </b>{tmpBurndown} <br/>
        <b>Leftover: </b> {tmpBurndown-tmpCompleted}
        </center>
        </div> 
        <br/>
        <br/>
        <br/>
        <Copyright />   
      </div>
      
    </div>
  );
}