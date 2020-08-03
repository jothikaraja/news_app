require('dotenv').config();
const https=require("https");
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
var json={};


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.get("/",function(req,res){


	const url="https://newsapi.org/v2/top-headlines?country=in&apiKey="+process.env.API_KEY;
	 https.get(url,function(resp){
      let body="";
      resp.on("data",function(chunk){
          body+=chunk;
      })
    resp.on("end",function(){

    	try{

    		    json=JSON.parse(body);
    		    res.render("search",{news:json.articles,heading:"TOP HEADLINES"})
    	}catch(error){
    		console.log(error.message);
    	}


    })
})
	 

})
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
app.get("/search",function(req,res){
	if(isEmpty(json)){
      
      const url="https://newsapi.org/v2/top-headlines?country=in&apiKey="+process.env.API_KEY;
	 https.get(url,function(resp){
      let body="";
      resp.on("data",function(chunk){
          body+=chunk;
      })
    resp.on("end",function(){

    	try{

    		    json=JSON.parse(body);
    		    res.render("news",{news:json.articles,heading:"TOP HEADLINES"})
    	}catch(error){
    		console.log(error.message);
    	}


    })
})
	}else{
	res.render("search",{news:json.articles,heading:"TOP HEADLINES"});
}
})
app.get("/covid",function(req,res){
	const url="https://api.covidindiatracker.com/state_data.json";
	https.get(url,function(resp){
		let body="";
		resp.on("data",function(chunk){
			body+=chunk;
		})
		resp.on("end",function(){
			try{
				var next_json=JSON.parse(body);
				res.render("covid",{data:next_json});
			}catch(error){
				console.log(error.message);
			}
		})
	})
})

app.post("/search",function(req,res){
	console.log("hi");
	const search=String(req.body.search);
	if(!search){
		res.redirect("/");
	}
	const filter=req.body.filter;
	console.log(search);
	const url="https://newsapi.org/v2/everything?q="+search+"&apiKey="+process.env.API_KEY+"&sortBy"+filter;
	https.get(url,function(resp){
		let body="";
		resp.on("data",function(chunk){
			body+=chunk;
		})
		resp.on("end",function(){
			try{
				var next_json=JSON.parse(body);
				res.render("search",{news:next_json.articles,heading:search.toUpperCase()});
			}catch(error){
				console.log(error.message);
			}
		})
	})

})













app.listen(3000,function(res){
	console.log("server listening at port 3000");
})