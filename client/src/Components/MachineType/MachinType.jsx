import React, { useState, useEffect } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StickyHeadTable from '../Table/Table';
import Modal from '../Modal/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TextField, Autocomplete, MenuItem, Select, Menu, Button } from '@mui/material';
import axios from 'axios'
import { config } from '../config'

import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress'
import { styles } from '../User/userStyle'
import '../User/user.css'
import Error from '../error/Error';


const MachinType = () => {

  const [loading, setloading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
  };

  const [errorOpen, seterrorOpen] = useState(false);
  const [errorColor, seterrorColor] = useState("");
  const [errorTitle, seterrorTitle] = useState("");
  const [errorText, seterrorText] = useState("");
  const [deleteError, setdeleteError] = useState(false);


  const [open, setopen] = useState(false)
  const [tdata, settdata] = useState([]);
  const [data, setdata] = useState({ MachineTypeID: 0, MachineTypeCode: "", MachineTypeDescription: "", Allowance: "" });

  const [fieldErrors, setfieldErrors] = useState({ MachineTypeCode: false, MachineTypeDescription: false, Allowance: false });

  const handleError = () => {
    Object.keys(data).forEach(key => {
      if (!data[key] || data[key] === 0) {
        setfieldErrors(ps => ({ ...ps, [key]: true }))
      } else {
        setfieldErrors(ps => ({ ...ps, [key]: false }))
      }
    })
  }
  const showError = (color, title, text, isdeleteError) => {
    seterrorColor(color); seterrorTitle(title); seterrorText(text); setdeleteError(isdeleteError); seterrorOpen(true)
  }


  const setInitialData = () => {
    setdata({ MachineTypeID: 0, MachineTypeCode: "", MachineTypeDescription: "", Allowance: "" })
  }

  const handleNewClick = () => {
    cancelClick()
  }
  const gettdata = () => {
    setloading(true)
    axios.get('/api/machineType', config).then(response => { settdata(response.data); setloading(false) }).catch(err => { console.log(err); setloading(false) })
  }
  const upbtnClick = (item) => {
    setdata(item)
    setopen(!open)
    document.getElementById('form').reset()
    document.getElementById('createbtn').style.display = "none"
    document.getElementById('clearbtn').style.display = "none"
    document.getElementById('updatebtn').style.display = "block"
    document.getElementById('cancelbtn').style.display = "block"
  }
  const updateTheRecord = (e) => {
    e.preventDefault()
    if (data.MachineTypeID === 0 || !data.MachineTypeCode || !data.MachineTypeDescription || !data.Allowance){
      handleError()
      return showError('#785EE0', 'Missing Fields', `Some required Fields are missing, You have to entre these fields to continue`);
    }
    setloading(true)
    axios.put('/api/machineType', { MachineTypeID: data.MachineTypeID, MachineTypeCode: data.MachineTypeCode, MachineTypeDescription: data.MachineTypeDescription, Allowance: data.Allowance }, config)
      .then(response => {
        if (response.status === 200) {
          document.getElementById('form').reset()
          cancelClick()
          showError('#785EE0', 'Updated Successfully', `Record is Updated with statusCode(${response.status}).You can see the changes in Table of Content.`)
          return gettdata()
        }
        setloading(false)
      }).catch(err => { console.log(err); setloading(false);showError('red', 'Error Occured', `${err}`) })

  }
  const clearClick = () => {
    document.getElementById('form').reset()
    setInitialData()
  }
  const cancelClick = () => {
    document.getElementById('form').reset()
    document.getElementById('createbtn').style.display = "block"
    document.getElementById('clearbtn').style.display = "block"
    document.getElementById('updatebtn').style.display = "none"
    document.getElementById('cancelbtn').style.display = "none"
    setopen(!open)
    setInitialData()
  }
  const delbtnClick = (item) => {
    if (window.confirm("Continue to delete? The record will be deleted permanently")) {
      setloading(true)
      axios.delete(`/api/machineType/${item.MachineTypeID}`, config)
        .then(response => {
          if (response.status === 200) {
            showError('#785EE0', 'Deleted Successfully', `Record is Deleted with statusCode(${response.status}).You can see the changes in Table of Content.`)
            cancelClick()
            return gettdata()
          }
          setloading(false)
        }).catch(err => { console.log(err.response); setloading(false);showError('red', "Request Failed", `${err}`) })
    }
  }
  const subclick = (e) => {
    e.preventDefault()
    if (!data.MachineTypeCode || !data.MachineTypeDescription || !data.Allowance){
      handleError()
      return showError('#785EE0', 'Missing Fields', `Some required Fields are missing, You have to entre these fields to continue`);      
    }
    setloading(true)
    axios.post('/api/machineType', { MachineTypeCode: data.MachineTypeCode, MachineTypeDescription: data.MachineTypeDescription, Allowance: data.Allowance }, config)
      .then(response => {
        if (response.status === 200) {
          document.getElementById('form').reset()
          setInitialData()
          setopen(false)
          gettdata()
          return showError('#785EE0', 'SuccessFully Inserted', "MachineType has been Inserted registered and could be Updated and Deleted afterward from the table icon.")
        }
        setloading(false)
      }).catch(err => { console.log(err.response); setloading(false);showError('red', 'Error Occured', `${err}`) })
  }
  useEffect(() => {
    gettdata()
  }, []);


  return (
    <div style={{ width: '100%' }}>

      <div style={styles.upper}>
        <div style={styles.upperHeading} >View Machine Type</div>
        <div style={styles.newBtnContainer}>
          <button onClick={handleNewClick} style={{ display: `${JSON.parse(localStorage.getItem('user')).UserType === 'Worker' ? "none" : "flex"}`, cursor: 'pointer', height: '60%', alignItems: 'center', padding: '0px 20px', borderRadius: '50px', border: '0px', backgroundColor: '#785EE0', color: 'white', fontWeight: 'bold', fontSize: "11px" }} ><span style={{ marginRight: '10px' }} ><AddCircleOutlineIcon sx={{ fontSize: '18px' }} /></span> ADD MACHINE TYPE</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <Paper sx={styles.tablePaper}>
          <TableContainer sx={styles.tablePaperInnerTableContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead >
                <TableRow >
                  <TableCell sx={styles.tableHeaderCell}>MachineTypeCode</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>MachineTypeDescription</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Allowance</TableCell>
                  <TableCell sx={{ backgroundColor: '#785EE0', color: 'white', display: `${JSON.parse(localStorage.getItem('user')).UserType === 'Worker' ? "none" : ""}` }}>Update</TableCell>
                  <TableCell sx={{ backgroundColor: '#785EE0', color: 'white', display: `${JSON.parse(localStorage.getItem('user')).UserType === 'Worker' ? "none" : ""}` }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  tdata.map((item, index) => (
                    <TableRow key={index} sx={{ bgcolor: `${index % 2 === 0 ? "white" : "rgba(120, 94, 224, 0.1)"}`, borderBottom: '3px solid rgba(187, 187, 187, 0.5)' }}>
                      <TableCell>{item.MachineTypeCode}</TableCell>
                      <TableCell>{item.MachineTypeDescription}</TableCell>
                      <TableCell>{item.Allowance}</TableCell>
                      <TableCell sx={{ display: `${JSON.parse(localStorage.getItem('user')).UserType === 'Worker' ? "none" : ""}` }}><EditIcon onClick={() => upbtnClick(item)} /></TableCell>
                      <TableCell sx={{ display: `${JSON.parse(localStorage.getItem('user')).UserType === 'Worker' ? "none" : ""}` }}><DeleteIcon color='error' onClick={() => delbtnClick(item)} /></TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <div id="modal" className='modalContainer' style={{ display: `${open ? "flex" : "none"}` }}>
        <div style={styles.modalInner} >

          <div style={styles.modalHeader} >
            <div style={styles.modalHeadingContainer} >
              <p style={styles.modalHeadingPara} >Add Machine Type</p>
            </div>
            <div style={styles.modalCrossContainer}>
              <span><CancelIcon onClick={cancelClick} sx={styles.modalCrossIcon} /></span>
            </div>
          </div>


          <form id="form" style={styles.modalForm}>
            <TextField error={fieldErrors.MachineTypeCode} required value={data.MachineTypeCode} id='MachineTypeCode' sx={styles.modalFormInput} label="MachineTypeCode" onChange={e => setdata(ps => ({ ...ps, MachineTypeCode: e.target.value }))} />
            <TextField error={fieldErrors.MachineTypeDescription} required value={data.MachineTypeDescription} id="MachineTypeDescription" sx={styles.modalFormInput} label="Description" onChange={e => setdata(ps => ({ ...ps, MachineTypeDescription: e.target.value }))} />
            <TextField error={fieldErrors.Allowance} required type="number" value={data.Allowance} id="Allowance" sx={styles.modalFormInput} label="Allowance" onChange={e => setdata(ps => ({ ...ps, Allowance: e.target.value }))} />
          </form>



          <div style={styles.modalButtonContainer}>
            <Button id='createbtn' onClick={subclick} type="" sx={styles.modalCreateButton}>Create</Button>
            <Button id='clearbtn' onClick={clearClick} sx={styles.modalClearButton}>Clear</Button>
            <Button id='updatebtn' onClick={updateTheRecord} sx={styles.modalUpdateButton}>Update</Button>
            <Button id='cancelbtn' onClick={cancelClick} sx={styles.modalCancelButton}>Cancel</Button>
          </div>

        </div>
      </div>

      <div id="loading" className='loadingContainer' style={{ display: `${loading ? "flex" : "none"}` }} >
        <CircularProgress color='primary' />
      </div>

      {/* Error */}
      <Error errorOpen={errorOpen} setErrorOpen={seterrorOpen} errorColor={errorColor} errorText={errorText} errorTitle={errorTitle} deleteError={deleteError} />



    </div>
  )
}

export default MachinType