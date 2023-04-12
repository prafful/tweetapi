let e = require('express')
let mongoose = require('mongoose')
let tweet = require('./tweet')
let cors = require('cors')

//create express app
let app = e()

//configure cors
app.use(cors())

//configure express to use request & response in json format
app.use(e.json())
//app.use(e.urlencoded({extended:true}))

//define connection string
let conString = "mongodb+srv://mongouser:mongopassword@cluster0.8dhk8wf.mongodb.net/mern"
//open the connection mongodb database 
mongoose.connect(conString)
//get reference to connection
let db = mongoose.connection

//verify if connection was successful
db.once("open", ()=>{
    console.log("Connected to mongodb database in cloud")
})

//endpoint -> http://localhost:8888/ GET
app.get("/", (request, response)=>{
    console.log("Incoming request")
    console.log(request.url)
    //send back response
    response.json({
        "message":"GET request received for / endpoint"
    })
})

//endpoint -> http://localhost:8888/welcome GET
app.get("/welcome", (request, response)=>{
    console.log("Incoming request")
    console.log(request.url)
    //send back response
    response.json({
        "message":"GET request received for /welcome endpoint"
    })
})


app.post( "/welcome", (req, res)=>{
    console.log("Incoming request")
    console.log(req.url)
    console.log(req.body)
    //send response
    res.json({
        "message":"POST request received for /welcome endpoint",
         "received":req.body 
    })
})


//api to interact with mongodb

//get list of tweets from db
app.get("/tweet/all", (request, response)=>{
    console.log("get all tweets from db")
    tweet.find({})
            .then((data)=>{
                console.log(data)
                response.json(data)
            })
            .catch((error)=>{
                console.log(error)
                response.json(error)
            })
})

//post tweet to db
app.post("/tweet/add", (request, response)=>{
    console.log("post tweet to db")
    console.log(request.body)
    //transfer values from requestbody to newTweet
    let newTweet = new tweet()
    newTweet.message = request.body.message
    newTweet.author = request.body.author
    newTweet.likes = request.body.likes
    newTweet.dislikes = request.body.dislikes
    newTweet.videoid = request.body.videoid
    //save newTweet in db
    newTweet.save()
            .then((data)=>{
                response.json(data)
            })
            .catch((error)=>{
                response.json(error)
            })
})

//get tweet by id
app.get("/tweet/:myid", (request, response)=>{
    console.log("get tweet by id")
    console.log(request.params.myid)
    tweet.findById(request.params.myid)
            .then((data)=>{
                response.json(data)
            })
            .catch((error)=>{
                response.json(error)
            })
})

//delete tweet by id
app.delete("/tweet/delete/:myid", (request, response)=>{
    console.log("delete tweet by id")
    console.log(request.params.myid)
    tweet.findByIdAndDelete(request.params.myid)
            .then((data)=>{
                console.log(data)
                response.json(data)
            })
            .catch((error)=>{
                console.log(error)
                response.json(error)
            })  
})

//find tweet by id and increase like
app.put("/tweet/likes/:myid", (request, response)=>{
    console.log("find tweet by id and increase likes")
    console.log(request.params.myid)
    //find the tweet by id
    tweet.findById(request.params.myid)
            .then((data)=>{
                console.log(data)
                //response.json(data)
                //increase likes by 1
                console.log("updating....");
                tweet.findByIdAndUpdate(request.params.myid, {"likes": data.likes+ 1}, {new: true})
                        .then((dataU)=>{
                            console.log(dataU)
                            response.json(dataU)
                        })
                        .catch((error)=>{
                            response.json(error)
                        })


            })
            .catch((error)=>{
                response.json(error)
            })

})



//define a port for API to run
let PORT = 8181
app.listen(PORT, ()=>{
    console.log( `Listening on port: ${PORT}`)
})
