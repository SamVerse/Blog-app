import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const handleBlogUpload = async (req, res) => {
  const { title, body } = req.body;
  const coverImageURL = `/images/uploads/${req.user._id}/${req.file.filename}`;

  const blog = await Blog.create({
    title,
    body,
    coverImageURL,
    createdBy: req.user._id,
  });
  console.log("file uploaded successfully ");

  res.redirect(`/blog/${blog._id}`);
};

const handleDetailedViewBlog = async (req , res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
  res.render('blog' , {
    user: req.user,
    blog: blog,
    comments: comments,
  });
}

const handleCreateComment =  async (req, res) => {
  try {
      await Comment.create({
          content: req.body.content,
          blogId: req.params.id,
          createdBy: req.user._id
      });
      res.redirect(`/blog/${req.params.id}`);
  } catch (error) {
      console.log(error);
      res.status(500).send('Error posting comment');
  }
}

const handleDeleteBlog = async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    console.log('Blog deleted successfully');
    res.redirect('/');
   } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
}

export { handleBlogUpload , handleDetailedViewBlog , handleCreateComment , handleDeleteBlog};
