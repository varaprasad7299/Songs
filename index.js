const express=require('express');
const songs=require('./songs');
const path=require('path');
const app=express();
const songFilter = req => member => member.songNo === parseInt(req.params.songNo);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

const PORT=3000;
app.listen(PORT);

app.get('/songs',(req,res)=>res.json(songs));

app.get('/songs/:songNo', (req, res) => {
    const found = songs.some(songFilter(req));
    if (found) {  
    res.json(songs.filter(songFilter(req)));  
    } else { 
    res.status(400).json({ msg: `No song with the no of ${req.params.id}` });
    }
    });

app.post('/songs',(req,res)=>{
    const newSong={
        songNo: songs.length + 1,
        name: req.body.name, 
        artist:req.body.artist,
        rating:req.body.rating
    }; 
    if(!newSong.name || !newSong.rating || !newSong.artist){
        return res.status(400).json({msg:'Song Name and Rating Must be provided'});
    }
    songs.push(newSong);
    res.json(songs);
    }
    );

 app.put('/songs/:songNo',(req,res)=>
    {
        const found = songs.some(member=>member.songNo===parseInt(req.params.songNo));
        if(found)
        {
            const updSong=req.body;
            songs.forEach( member=>{
                if(member.songNo===parseInt(req.params.songNo))
                {
                    member.name=updSong.name ? updSong.name : member.name;
                    member.artist=updSong.artist ? updSong.artist : member.artist;
                    member.rating=updSong.rating ? updSong.rating : member.rating;
                    res.json({msg:'Updated Details',member})
                }
            });
        }
        else{
            res.status(400).json({msg:`No User found with ${req.params.songNo}`});
        }
    });

app.delete('/songs/:songNo', (req, res) => {
    const found = songs.some(songFilter(req));     
    if (found) {        
        res.json({msg:'Deleted', 
        members:songs.filter(   
        member=>member.songNo!==parseInt(req.params.songNo))})   
    } else {      
        res.status(400).json({ msg: `No member with the id of ${req.params.songNo}` });     
    }    
});