const setData = require("../data/setData"); 
const themeData = require("../data/themeData");

let sets = [];
function initialize()
{
    return new Promise((resolve)=>{
        var i = 0;
        setData.forEach((set) =>{
        sets[i] = set;
        sets[i++].theme = themeData.find((theme) => theme.id === set.theme_id).name;
        resolve();
        }); 
    });
}

async function getAllSets()
{
    return new Promise((resolve)=>{
        resolve(sets);
    });
}

async function getSetsByNum(setNum)
{
    return new Promise((resolve,reject)=>{
        let returnVal = (sets.find((set) => set.set_num === setNum));
        returnVal !== undefined ? resolve(returnVal) : reject("Match not found");
    });
}

async function getSetsByTheme(theme)
{
    return new Promise((resolve,reject)=>{
        let returnVal = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()));
        returnVal.length ? resolve(returnVal) :  reject("Match not found");
    });
}

module.exports = {sets,initialize,getAllSets,getSetsByNum,getSetsByTheme}