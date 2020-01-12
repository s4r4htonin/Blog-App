//~~~~~~~~~~~~~~~~~~~//
//    Definitions    //
//~~~~~~~~~~~~~~~~~~~//

const   express        = require("express"),
        app            = express(),
        bodyParser     = require("body-parser"),
        mongoose       = require("mongoose"),
        methodOverride = require("method-override");

//~~~~~~~~~~~~~~~~~~//
//    App Config    //
//~~~~~~~~~~~~~~~~~~//

//Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

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

//~~~~~~~~~~~~~~~~~~//
//  RESTful Routes  //
//~~~~~~~~~~~~~~~~~~//

//Landing page
app.get("/", function(req, res){
    res.redirect("/posts");
});

//INDEX - Show all blog posts
app.get("/posts", function(req, res){
    Post.find({}, function(err, allPosts){
        if (err){
            console.log(err);
        } else {
            res.render("index", {posts: allPosts});
        }
    });   
});

//NEW - Show form to add a new blog post
app.get("/posts/new", function(req, res){
    res.render("new");
});

//CREATE - Create a new blog post and redirect to index
app.post("/posts", function(req, res){
    //create a new blog post
    Post.create(req.body.post, function(err, newPost){
        if (err){
            res.render("new");
        } else{
            res.redirect("/posts"); 
        }
    });
});

//SHOW - Shows all information about a specific blog post
app.get("/posts/:id", function(req, res){
    //get the specific id of the post
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.render("show", {post: foundPost}); //render the post with the show template
        }
    });
});

//EDIT - Show form to edit an existing blog post
app.get("/posts/:id/edit", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.render("edit", {post: foundPost}); //render the edit template with the found blog post
        }
    });
});

//UPDATE - Update an existing blog post and redirect to the show page
app.put("/posts/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err){
            res.redirect("/posts");
        } else{
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DESTROY - Delete an existing blog post and redirect to the index page
app.delete("/posts/:id", function(req, res){
    Post.findByIdAndDelete(req.params.id, function(err){
        if (err){
            res.redirect("/posts/");
        } else{
            res.redirect("/posts");
        }
    });
});

//~~~~~~~~~~~~~~~~~~//
//   Start Server   //
//~~~~~~~~~~~~~~~~~~//

app.listen(3000, function(){
    console.log("Server started on port 3000");
});