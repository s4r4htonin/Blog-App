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

// Post.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1565855991995-7a5ceb19ee95?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//     body: "This is a test blog post. Welcome to my blog. I hope you have a great day.",
// })

//RESTful Routes
app.get("/posts", function(req, res){
    Post.find({}, function(err, allPosts){
        if (err){
            console.log(err);
        } else {
            res.render("index", {posts: allPosts});
        }
    });   
});


//Set up the blog app
// create the blog model
// add index route and template
// add simple nav bar

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000");
});
