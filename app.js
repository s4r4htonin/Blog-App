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
app.get("/posts", function(req, res){ //index - show all blog posts
    Post.find({}, function(err, allPosts){
        if (err){
            console.log(err);
        } else {
            res.render("index", {posts: allPosts});
        }
    });   
});

app.get("/posts/new", function(req, res){ //new - show form to add a new blog post
    res.render("new");
});

app.post("/posts", function(req, res){ //create - create a new blog post and redirect to index
    //create a new blog post
    Post.create(req.body.post, function(err, newPost){
        if (err){
            res.render("new");
        } else{
            res.redirect("/posts"); 
        }
    });
});

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000");
});
