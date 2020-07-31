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
    		    res.render("news",{news:json.articles})
    	}catch(error){
    		console.log(error.message);
    	}


    })
})
	 

})
app.get("/search",function(req,res){
	res.render("search",{news:json.articles});
})


app.post("/search",function(req,res){
	console.log("hi");
	const search=req.body.search;
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
				res.render("search",{news:next_json.articles});
			}catch(error){
				console.log(error.message);
			}
		})
	})

})













app.listen(3000,function(res){
	console.log("server listening at port 3000");
})