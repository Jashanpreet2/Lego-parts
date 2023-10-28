/******************************************************************************** 
*  WEB322 – Assignment 3
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  hbps://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Jashanpreet Singh Student ID: 112454228 Date: 16 October, 2023
* Published URL: ___________________________________________________________
* 
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('public'))
const HTTP_PORT = process.env.PORT || 8080;

const legoData = require("./modules/legoSets");


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/home.html'));
});

app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/views/about.html'));
});

app.get('/lego/sets', (req, res) => {
    let errorDetails = "Status Code 404: ";
    if(req.query.theme){
        legoData.getSetsByTheme(req.query.theme).then((sets)=>{
        res.send(sets)
    }).catch((reason)=>{
        res.status(404).sendFile(path.join(__dirname, 'public/views/404.html'));
    });
    }
    else if(!req.query.theme){
        res.send(legoData.sets);
    }
});

app.get('/lego/sets/:setNum', (req, res) => {
    let errorDetails = "Status Code 404: ";
        legoData.getSetsByNum(req.params.setNum).then((set)=>{
            res.send(set)
        })
        .catch(()=>{
            res.status(404).sendFile(path.join(__dirname, 'public/views/404.html'));
        });
});

legoData.initialize().then(()=>{app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));});