//Definitions
const   express    = require("express"),
        app        = express(),
        bodyParser = require("body-parser"),
        mongoose   = require("mongoose");

//Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/blog_app"); //connect JS to MongoDB
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); //Tells express that /views are ejs files

//Schema Set up
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Post = mongoose.model("Post", blogSchema);

//Home page
app.get("/", function(req, res){
    res.redirect("/posts");
})

//RESTful Routes
app.get("/posts", function(req, res){ //index
    Post.find({}, function(err, allPosts){
        if (err){
            console.log(err);
        } else {
            res.render("index", {posts: allPosts});
        }
    });   
});

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000");
});
