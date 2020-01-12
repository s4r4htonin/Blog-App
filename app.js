//Definitions
const   express        = require("express"),
        app            = express(),
        bodyParser     = require("body-parser"),
        mongoose       = require("mongoose"),
        methodOverride = require("method-override");

//Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//App Config
mongoose.connect("mongodb://localhost/blog_app"); //connect JS to MongoDB
app.set("view engine", "ejs"); //Tells express that /views are ejs files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method")); //allows us to cheat PUT or DELETE requests in a form through the POST method

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

app.get("/posts/:id", function(req, res){ //show - shows all info about a specific blog post
    //get the specific id of the post
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.render("show", {post: foundPost}); //render the post with the show template
        }
    });
});

app.get("/posts/:id/edit", function(req, res){ //edit - show form to edit an existing blog post
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.render("edit", {post: foundPost}); //render the edit template with the found blog post
        }
    });
});

app.put("/posts/:id", function(req, res){ //update - update the existing blog post and redirect to the show page
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000");
});
