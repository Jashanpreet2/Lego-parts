/********************************************************************************

* WEB322 – Assignment 04

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Jashanpreet Singh Student ID: 112454228 Date: 10 November

*

* Published URL: ___________________________________________________________

*

********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
const HTTP_PORT = process.env.PORT || 8080;

const legoData = require("./modules/legoSets");

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'public/views/home'));
});

app.get('/about',(req,res)=>{
    res.render(path.join(__dirname, 'public/views/about'));
});

app.get('/lego/sets', (req, res) => {
    if(req.query.theme){
        legoData.getSetsByTheme(req.query.theme).then((legoSets)=>{
            res.render(path.join(__dirname, 'public/views/sets'), {data: legoSets});
    }).catch((reason)=>{
        res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    });
    }
    else if(!req.query.theme){
        legoData.getAllSets().then((sets) =>{ 
            res.render(path.join(__dirname, 'public/views/sets'), {data: sets});
        })
        .catch((reason)=>{
            res.status(404).render(path.join(__dirname, 'public/views/404', {message: "I'm sorry, we're unable to find what you're looking for"}));
        });
}});

app.get('/lego/sets/:setNum', (req, res) => {
        legoData.getSetsByNum(req.params.setNum).then((legoSet)=>{
            res.render(path.join(__dirname, 'public/views/set'), {set: legoSet});
        })
        .catch(()=>{
            res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
        });
});

legoData.initialize().then(()=>{app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));});