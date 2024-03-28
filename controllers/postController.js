const AWS = require("aws-sdk");
const { Image } = require("../models/Image");
const { Post } = require("../models/Post");
const { User } = require("../models/User");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

exports.createPost = async (req, res) => {
  const { title, content } = req?.body;

  try {
    const authorId = req?.user?.userId;
    const post = await Post.create({
      title,
      content,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Blog post created successfully", post });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPost = async (req, res) => {
  const postId = req?.params?.post_id;

  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        { model: User, attributes: ["id", "username", "email"] },
        { model: Image },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req?.params?.post_id;
  const { title, content } = req.body;
  if (!title && !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content for the post" });
  }
  const checkPost = await Post.findOne({ where: { id: postId } });

  if (checkPost.authorId !== req.user.userId) {
    return res.status(400).json({ message: "Can't modify this post!" });
  }

  try {
    const authorId = req?.user?.userId;
    const [updatedRowsCount] = await Post.update(
      { title, content, authorId, updatedAt: new Date() },
      { where: { id: postId } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req?.params?.post_id;

  try {
    const deletedRowCount = await Post.destroy({ where: { id: postId } });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(204).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addImage = async (req, res) => {
  const postId = req.params.post_id;

  const post = await Post.findOne({ where: { id: postId } });

  if (!post) {
    return res
      .status(400)
      .json({ message: "No post found with the given id!" });
  }

  if (post.authorId !== req.user.userId) {
    return res
      .status(400)
      .json({ message: "You are not allowed to upload image this post" });
  }
  if (!req.files || !req.files[0]) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  const file = req.files[0];

  try {
    // Upload image to S3
    const params = {
      Bucket: process.env.BUCKET,
      Key: `${postId}/${file.originalname}`,
      Body: file.buffer,
    };

    const uploadedImage = await s3.upload(params).promise();

    await Image.create({
      url: uploadedImage.Location,
      postId: postId,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl: uploadedImage.Location,
    });
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
