# SEI Project 3: The Forum (full stack web app)

## Introduction & Deployed Project

The Forum is a full-stack social media application built using the MERN stack. Its functionality is loosely modelled on sites similar to Reddit: users can make posts, edit and delete their posts, comment on posts, reply to comments, and view other users’ profile pages. The app has secure registration and login using JSON Web Token, and handles profile pictures via Cloudinary.

This was my third module project for the Software Engineering Immersive (SEI) course with General Assembly.

### Deployed project: https://louis-theforum.netlify.app/

![landing page](/readme_assets/landing.png)

<br/>

#### **Client GitHub repository** can be found here: https://github.com/ljsgrant/ga-project-03-client

### This REST API is deployed via Heroku.

#### **API Endpoints:**

- All posts: https://louis-theforum.herokuapp.com/api/posts
- Single post by ID: https://louis-theforum.herokuapp.com/api/posts/:id
- Comments for post ID: https://louis-theforum.herokuapp.com/api/posts/:id/comments
- Single comment by ID: https://louis-theforum.herokuapp.com/api/comments/:id
- All users: https://louis-theforum.herokuapp.com/api/users
- Single user by ID: https://louis-theforum.herokuapp.com/api/users/:id
- Login: https://louis-theforum.herokuapp.com/api/login
- Register: https://louis-theforum.herokuapp.com/api/register
- Search posts: https://louis-theforum.herokuapp.com/api/posts/search?search=your_query_here

<br/>

## Contents

- **[Brief](#brief)**
- **[Installation Requirements](#installation-requirements)**
- **[Code Installation](#code-installation)**
- **[Timeframe & Team](#timeframe--team)**
- **[Technologies Used](#technologies-used)**

**[Development Process Write-Up:](#development-process-write-up)**

- **[Planning](#planning)**
  - [Wireframing](#wireframing)
  - [Organisation](#organisation)
- **[Programming](#programming)**
  - [Register and Login Components](#register-and-login-components)
  - [Nested Comments](#nested-comments)
    - [In the API](#in-the-api)
    - [In the Front-End](#in-the-front-end)
    - [Limiting Comment Thread Depth](#limiting-comment-thread-depth)
    - [Re-Rendering the Page for Comments](#re-rendering-the-page-for-comments)
    - [Deleting Comments](#deleting-comments)
    - [Profile Pictures on Comments](#profile-pictures-on-comments)
  - [Liking/Disliking Posts](#likingdisliking-posts)
    - [Request from the Client](#request-from-the-client)
    - [Handling the Request in the API](#handling-the-request-in-the-api)
    - [Styling the Like/Dislike Buttons](#styling-the-likedislike-buttons)
  - [Deleting Posts](#deleting-posts)
  - [Editing Posts](#editing-posts)
  - [Toggle Between Edited & Original Post](#toggle-between-edited--original-post)
  - [Back-End Notifications](#back-end-notifications)
- **[Challenges](#challenges)**
- **[Wins](#wins)**
- **[Key Learnings/Takeaways](#key-learningstakeaways)**
- **[Bugs](#bugs)**
- **[Future Improvements](#future-improvements)**

<br />

## Brief

The brief was to:

> Build a full stack app using MongoDB, Express, React and Node.js, with full CRUD functionality and multiple schemas. The functionalities and design are for the team to decide on.

[&#9650; _Back to contents_](#contents)

<br/>

## Installation Requirements

### API:

- MongoDB Community

[&#9650; _Back to contents_](#contents)

<br/>

## Code Installation

### API:

- Clone this repository
- In the terminal, navigate into the project directory
- Run `npm install` to install dependencies from package.json
- Run `npm run dev` to start the development server
- Check the terminal for:

```sh
Connected to mongodb 🤖
Up and running on port 8080
```

### Client:

- Clone the [client repository](https://github.com/ljsgrant/ga-project-03-client)
- In the terminal, navigate into the project directory
- Run `npm install` to install packages
- Run `npm start` to start the development server
- Make sure both the API and the Client are running
- In your browser, navigate to http://localhost:3000
- Engage in riveting discussions with other users. Often centred around the tyrannical forum administrator.

[&#9650; _Back to contents_](#contents)

<br/>

## Timeframe & Team

A 5 day project in a 3 person team:

- [Louis Grant](https://github.com/ljsgrant/) (me)
- [Alice Lo](https://github.com/siuusunn)
- [Parul Singh](https://github.com/ParulSingh16/)

[&#9650; _Back to contents_](#contents)

<br/>

## Technologies Used

### Front End:

- React
- Node.js
- Sass
- Material UI

### Back End:

- MongoDB
- Mongoose
- Express
- Cloudinary

### Development Tools:

- Visual Studio Code
- Postman
- mongosh
- Chrome DevTools

[&#9650; _Back to contents_](#contents)

<br/>

# Development Process Write-Up

Covering some of the specifics of our build process and my responsibilities.

<br/>

## Planning

We began by planning our apps. We discussed how to structure our endpoints and models, and identified the core functionality we’d need for our MVP, which broke down as:

- Registration & login
- Users should be able to make and view posts
- Users should be able to comment on posts

![initial planning in excalidraw](/readme_assets/project-3-planning-all.png)

<br/>

### Wireframing

Once we were satisfied with our idea, we worked up wireframes for our main pages, identifying which components we’d need to build for each:

![register wireframe](/readme_assets/project-3-wireframe-register.png)
![home wireframe](/readme_assets/project-3-wireframe-landing.png)
![all posts wireframe](/readme_assets/project-3-wireframe-allposts.png)

[&#9650; _Back to contents_](#contents)

<br/>

### Organisation

Finally, we added components and functionality to a Trello board, which allowed us to track features and assign tickets throughout the project, and we stayed in touch throughout the workday via Zoom calls and Slack, making a point of communicating when features were finished and when we were starting work on something new. This helped us to avoid blocking each other and, vitally, to avoid merge conflicts arising from two people working on the same component.

![our trello board for the project](/readme_assets/project-3-trello.png)

[&#9650; _Back to contents_](#contents)

<br/>

## Programming

On day 1, after the planning stage, we began to build out the basics of our API, dividing the workload via our Trello board. I worked on the posts and comments schemas as well as the comments controller, and researched options for how to handle nested comments.

In the morning of day 2, we worked on some fixes to the back end, and tested our endpoints in Postman. Once we were satisfied everything was working, we got started on the front end.

[&#9650; _Back to contents_](#contents)

<br/>

### Register and Login Components

I built out the register & login pages, with an `onChange` on the form that calls `handleChange` to set state for `formFields`:

```js
const handleChange = (event) => {
  setFormFields({ ...formFields, [event.target.name]: event.target.value });
};
```

And an `onSubmit`, which calls async function `handleSubmit()` to make a POST request to the login/register endpoints, with the `formData` as the request body. I also use `useNavigate()` to take users to the main page after logging them in:

```js
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      API.POST(API.ENDPOINTS.login, formFields).then(({ data }) => {
        AUTH.setToken(data.token);
        NOTIFY.SUCCESS(data.message);
        navigate(‘/posts’);
      });
    } catch (error) {
      console.error(error);
    }
  };
```

![register page](/readme_assets/project-3-register.png)
![login page](/readme_assets/project-3-login.png)

[&#9650; _Back to contents_](#contents)

<br/>

### Nested Comments

#### In the API

I began by working on our post and comment schemas and controllers in the API, so that comment ids are added to an array on their parent, so we can get all the children of any post or comment. Later I went back and updated this so each comment also stores a reference to its parent’s ID, so we can get the parent and update its array of child comments if a comment is deleted:

```js
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, min: 1, max: 500 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    timestamp: { type: String },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    parentPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    ancestorPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    parentCommentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
    replyThreadDepth: { type: Number },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    deletedComments: [{ type: mongoose.Schema.ObjectId }],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, min: 1, max: 200 },
    originalTopic: { type: String, min: 1, max: 200 },
    content: { type: String, required: true, min: 1, max: 1000 },
    originalContent: { type: String, min: 1, max: 1000 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    isEdited: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    replyThreadDepth: { type: Number, default: 0 }
  },
  { timestamps: true }
);
```

In the commentsController I added a few lines of code to push the id of a newly created comment into the comments array of its parent:

```js
const { _id } = await PostModels.Comment.create(newComment);
parent.comments.push(_id);
const savedParent = await parent.save();
```

And then in the comments controller when we GET a post, we perform a nested population of the posts comments, and their replies:

```js
const post = await PostModels.Post.findById(req.params.id).populate([
      { path: ‘addedBy’ },
      {
        path: ‘comments’,
        populate: [
          { path: ‘addedBy’ },
          {
            path: ‘comments’,
            populate: [
              { path: ‘addedBy’ },
              {
                path: ‘comments’,
                populate: [
                  { path: ‘addedBy’ },
                  {
                    path: ‘comments’,
                    populate: [
                      { path: ‘addedBy’ },
```

…and so on. Using a recursive function to populate down to a depth specified would probably be the neater way of achieving this, but for the moment it does the job.

[&#9650; _Back to contents_](#contents)

<br/>

#### In the Front-End

To get comments showing in the front end, I built a recursive CommentCard component, which checks to see if the current comment has any replies, and then iterates over them with `Array.map()`, rendering them as child elements:

```js
return (
      <div className=‘CommentCard’>
        <div className=‘comment-header’>
          <div className=‘profile-picture-container’>
            {cloudinaryImageId ? (
              <ProfilePicture
                className=‘profile-picture’
                cloudinaryImageId={cloudinaryImageId}
                imageWidth={30}
                imageHeight={30}
              />
```

… (partially omitted for sake of length) …

```js
{comments?.map((comment) => {
            return (
              <CommentCard
                key={comment._id}
                text={comment.text}
                likes={comment.likes}
                dislikes={comment.dislikes}
                comments={comment.comments}
                username={comment.addedBy?.username}
                userId={comment.addedBy?._id}
                isDeleted={comment.isDeleted}
                deletedComments={comment.deletedComments}
                commentId={comment._id}
                timePosted={comment.createdAt}
                setIsContentUpdated={setIsContentUpdated}
              ></CommentCard>
            );
          })}
        </div>
      </div>
    );
```

This means that whenever a comment is rendered, we recursively render any of its descendents. To test this in the browser, I made a placeholder route to render a single comment thread, and added some basic styling. The recursive component has the bonus of making styling really simple – we can just give each comment a `margin-left` of whatever we want, and each child will be indented relative to its parent:

![nested comments - work in progress](/readme_assets/project-3-wip-comments-main.png)

[&#9650; _Back to contents_](#contents)

<br/>

#### Limiting Comment Thread Depth

After considering the nested population above, I raised the question of what “depth” we should allow comment threads to reach - i.e. how to handle replies to replies (as opposed to comments whose parent is a post, rather than another comment). If we allowed threads of infinite depth, they could become hard to navigate and break the UI as they have less and less width available. One option was to disallow replies to replies, but we liked the nested structure and being able to see the shape of an ongoing discussion rather than users just shouting isolated responses to a post.

After discussing as a team, we decided the best way to handle this was to add some logic to track comment depth, and then use a const to set a limit on this depth: if a comment is of a certain depth, then the API shouldn’t allow replies and the client shouldn’t render the UI for adding a reply.

I worked on this solution while Alice worked on components to show a single post and a user profile, and Parul worked on displaying a list of posts. I started by adding the replyThreadDepth field to the Comment Schema. In the commentController, when we make a new comment, we start with the new comment and its parent:

```js
const newComment = {
      …req.body,
      addedBy: req.currentUser._id
    };
    const parent = await parentType.findById(parentId);
```

Then we take the `replyThreadDepth` of the parent element, and increment it:

```js
newComment.replyThreadDepth = parent.replyThreadDepth + 1;
```

And limit the depth of the thread based on the `replyThreadDepthLimit` const:

```js
if (parent.replyThreadDepth === replyThreadDepthLimit) {
  return res.status(403).send({
    message: `Comment threads cannot be deeper than ${replyThreadDepthLimit} replies`
  });
}
```

> #### **Note**:
>
> One final bit of functionality I need to add in here is for each comment to only show its post-a-reply UI if its `replyThreadDepth` is less than the `replyThreadDepthLimit`.

[&#9650; _Back to contents_](#contents)

<br/>

#### Re-rendering the Page for Comments

To get the page to re-render if the user posts, edits or deletes a comment, I made some state for `isContentUpdated`, which is initialised as false. Props for `setIsContentUpdated` are passed down to the CommentCard component, and is set to true whenever a comment is added, edited or deleted. This then triggers the `useEffect` hook in the post viewer, to fetch the updated post and its children from the API, and re-render the page with the new updates. Finally, the `useEffect` sets `isContentUpdated` back to false:

```js
useEffect(() => {
  if (id === null) return;
  setIsLoading(true);
  if (!isPostDeleted) {
    API.GET(API.ENDPOINTS.singlePost(id))
      .then(({ data }) => {
        setIsPostDeleted(false);
        setSinglePost(data);
        setIsLoading(false);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
  }
  setIsContentUpdated(false);
}, [id, isContentUpdated, isPostDeleted]);
```

[&#9650; _Back to contents_](#contents)

<br/>

#### Deleting Comments

Working out how to delete comments in a way that worked for their nested structure was tricky. We felt users would like to still be able to see replies if a comment higher up the chain was deleted, and if we delete a comment completely then the references to its children will disappear, meaning we will no longer get any of its descendents. Therefore after some discussion, we decided it was best to leave a “deleted” comment in place but wipe its content and the reference to who posted it, whilst preserving the references to its children:

```js
const updatedComment = await comment.updateOne({
  $set: {
    text: '',
    isDeleted: true
  },
  $unset: {
    addedBy: ''
  }
});
```

I was concerned about potentially leaving a lot of essentially blank data in the db, but after talking it through with a developer friend who advised me that “unused data is usually a much smaller problem than it feels like it is”, I decided the tradeoff was worth it for maintaining the comment thread structure.

[&#9650; _Back to contents_](#contents)

<br/>

#### Profile Pictures on Comments

Alice worked on the components to create and edit posts, and added functionality to add profile pictures using Cloudinary. I then added her ProfilePicture component to the CommentCard to implement users’ profile pictures showing next to their comment, and I used a ternary to display a blank placeholder image if the image is missing or the comment has been deleted:

```js
<div className='profile-picture-container'>
             
  {cloudinaryImageId ? (
    <ProfilePicture
      className='profile-picture'
      cloudinaryImageId={cloudinaryImageId}
      imageWidth={30}
      imageHeight={30}
    />
  ) : (
    <img src={blankPic} alt='blank profile picture' />
  )}
           
</div>
```

[&#9650; _Back to contents_](#contents)

<br/>

<br/>

### Liking/Disliking Posts

Parul had added UI elements for likes and dislikes using MUI icons, in a reusable component. I then worked on adding this to posts, connecting it to the API, and building out a system to handle liking and disliking on the back-end.

Functionality shown here in the deployed app:
![liking and disliking posts](/readme_assets/project-3-likes-dislikes.gif)

<br/>

#### **Request from the Client**

We decided the best way to handle likes for a post would be through a PUT request. I added the PostLikes component into the Single Post page, and added a `handleLike` and `handleDislike` function, each of which make a PUT request to the `singlePost` endpoint, but with a different value for `likeOrDislike` as the request body:

```js
const handleLike = async () => {
  API.PUT(
    API.ENDPOINTS.singlePost(id),
    { likeOrDislike: 'like' },
    API.getHeaders()
  )
    .then(({ data }) => {
      console.log(data);
      setIsContentUpdated(true);
      setPostsUpdated(true);
    })
    .catch((err) => console.error(err));
};
```

I use `setIsContentUpdated` and `setPostsUpdated` here to trigger `useEffect` hooks both for the post component and in the PostsIndex, which will GET the updated post from the API, with the updated like and dislike count, so the counts will re-render whenever the user interacts with the buttons.

[&#9650; _Back to contents_](#contents)

<br/>

#### **Handling the request in the API**

To handle this in the API, we crucially needed a solution that wouldn’t allow users to spam the like and dislike buttons, adding as many likes/dislikes as they wanted.

I had added an array of liked and disliked posts to the user schema, so I used nested if statements to check if a user clicks the like button a second time. If they do, this will remove their like; similarly if they click the dislike button after clicking the like button, this will remove their like and add a dislike:

```js
if (req.body.likeOrDislike) {
     if (req.body.likeOrDislike === 'like') {
       // if user hasn't already liked post
       if (!user.likedPosts || !user.likedPosts.includes(post._id)) {
         await post.updateOne({ $inc: { likes: 1 } });
         await user.updateOne({ $push: { likedPosts: req.params.id } });
         // if user has disliked post previously, remove post from their dislikes
         if (user.dislikedPosts && user.dislikedPosts.includes(post._id)) {
           await post.updateOne({ $inc: { dislikes: -1 } });
           await user.updateOne({ $pull: { dislikedPosts: req.params.id } });
         }
       }
       // if user has already liked post
       if (user.likedPosts && user.likedPosts.includes(post._id)) {
         await post.updateOne({ $inc: { likes: -1 } });
         await user.updateOne({ $pull: { likedPosts: req.params.id } });
       }
     }
     if (req.body.likeOrDislike === 'dislike') {
       // if user hasn't already disliked post
       if (!user.dislikedPosts || !user.dislikedPosts.includes(post._id)) {
         await post.updateOne({ $inc: { dislikes: 1 } });
         await user.updateOne({ $push: { dislikedPosts: req.params.id } });
         // if user has liked post previously, remove post from their likes
         if (user.likedPosts && user.likedPosts.includes(post._id)) {
           await post.updateOne({ $inc: { likes: -1 } });
           await user.updateOne({ $pull: { likedPosts: req.params.id } });
         }
       }
       // if user has already disliked post
       if (user.dislikedPosts && user.dislikedPosts.includes(post._id)) {
         await post.updateOne({ $inc: { dislikes: -1 } });
         await user.updateOne({ $pull: { dislikedPosts: req.params.id } });
       }
     }
     const updatedPost = await post.save();
     return res.status(200).json(updatedPost);
```

[&#9650; _Back to contents_](#contents)

<br/>

#### **Styling the like/dislike buttons**

I added two styles of the icons from MUI, one filled and one outlined - as well as colours for some extra clarity - to show a user when they have already liked/disliked a post. I wrapped each button in a ternary to render the filled, coloured version when the user has the post in their likes/dislikes, and the unfilled outline version if they don’t:

```js
<Button
           onClick={handleLike}
           sx={{ pt: padding, pb: padding, pl: padding }}
         >
           {userData?.likedPosts?.includes(id) ? (
             <ThumbUpIcon color='success' sx={{ height: iconSize }} />
           ) : (
             <ThumbUpOutlinedIcon sx={{ height: iconSize }} />
           )}
           {`${storedLikes}`}
         </Button>
         <Button
           onClick={handleDislike}
           sx={{ pt: padding, pb: padding, pl: padding }}
         >
           {userData?.dislikedPosts?.includes(id) ? (
             <ThumbDownIcon color='error' sx={{ height: iconSize }} />
           ) : (
             <ThumbDownOutlinedIcon sx={{ height: iconSize }} />
           )}
           {`${storedDislikes}`}
         </Button>
```

[&#9650; _Back to contents_](#contents)

<br/>

### Deleting Posts

When a user hits the delete button, this first just fires a function to open an alert, asking them to confirm. If they hit confirm, this will call the function to delete the post.
In the API, I wrote a recursive function within the `deleteSinglePost` function, which first returns an array of all the comment and reply ids on a post:

```js
const idArray = [];
function getIds(postObject) {
  idArray.push(postObject.id);
  if (postObject.comments.length === 0) {
    return;
  }
  postObject.comments.forEach((child) => getIds(child));
}
getIds(post);
```

Then I use a for…of statement to find & delete for each comment id:

```js
// remove first id, which will be the parent post id
idArray.shift(); // delete each comment
for (let id of idArray) {
  try {
    await PostModels.Comment.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
  }
}
```

As posts ids are also referenced in the user schema, I then needed to add some logic to remove the post id from the user who posted it:

```js
const postOwner = await User.findByIdAndUpdate(post.addedBy._id, {
  $pull: { posts: post._id }
});
```

Finally I needed to show the post as deleted in the UI. I added a boolean, `isPostDeleted`, which is initialised as `false` and becomes `true` when we delete a post. If `isPostDeleted === true`, we render a “post was deleted” message instead of the normal return of the display post component:

![deleted post message](/readme_assets/project-3-post-deleted.png)

[&#9650; _Back to contents_](#contents)

<br/>

### Editing Posts

I made an EditPost component, added a route in app.js and wrapped the edit post button in a link to this page, with a dynamic id in the url. I reused most of Alice’s create post component for this page, with a few changes. The text fields will be populated with the post data, so the user can see what their original content was and make changes to it. I declare state for `formFields`, which is initialised with empty values, and `singlePost`, which is set via a GET request to the `singlePost` endpoint – so I added a `useEffect` hook with `singlePost` as the dependency, inside which I call `setFormFields()`, passing in the `singlePost` data.

In the DisplayPost component, I then conditionally render the delete post & edit post buttons using `AUTH.isOwner(singlePost?.addedBy._id) || AUTH.getPayload().isAdmin`, and the logical `&&` operator, so they don’t show unless the user has the correct permissions.

I also went back & added similar functionality to comments, so users can only see the option to reply or delete if they’re logged in, and can only delete if they’re the comment owner.

[&#9650; _Back to contents_](#contents)

<br/>

### Toggle Between Edited & Original Post

This extra functionality grew out of our discussions as a team over how social media sites handle editing posts: we wanted editing functionality, but wanted to account for how this might change the context of posts and their comments – for example, if a user posts saying “I love humans”, other users reply saying “yeah me too!”, and then the original post is edited to read “I hate humans”, the apparent meaning of all the comments is also reversed.

We decided the best way to compromise between integrity and functionality was to allow posts to be edited once, and then to give users the option to view the original post after it had been edited.

I added fields for `isEdited`, `originalTopic` and `originalContent` to the post Schema, and then in the `updateSinglePost` function in the `postsController`, I used an if statement to check if the post has been edited. If it hasn’t, I update the original fields and set `isEdited` to true, before setting the post with the `req.body` (which is the user’s requested edits), and saving the post. However if `isEdited === true`, we return a 403 and don’t allow the edits:

```js
if (!post.isEdited) {
  await post.updateOne({
    originalTopic: post.topic,
    originalContent: post.content,
    isEdited: true
  });
  post.set(req.body);
  const updatedPost = await post.save();
  return res.status(200).json(updatedPost);
} else {
  return res.status(403).json({
    message: 'Cannot edit a post which has already been edited.'
  });
}
```

(Another way of handling this – if we wanted to allow the post to be edited more than once but still limit the edits – would be to increment an `editCount` variable and instead check against a `maxEdits` const to limit to however many edits we want above 1.)

[&#9650; _Back to contents_](#contents)

<br/>

### Back-End notifications

This was a late stretch goal that I didn’t manage to fully finish before the deadline, but I managed to get most of the system implemented in the back end.

I created a new schema for notifications, to store references to the user who would receive the notification, the user whose action triggered the notification, and the content that the notification refers to:

```js
const accountNotificationSchema = new mongoose.Schema(
  {
    forUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    fromUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    contentType: { type: String, required: true },
    contentId: {
      type: mongoose.Schema.ObjectId,
      refPath: 'contentType',
      required: true
    }
  },
  { timestamps: true }
);
```

I then made an `accountNotificationsController` to create a notification when a performs an action, and a function to get all notifications for the currently signed in user.

By the deadline I had only managed to get the back end set up for this, so adding the functionality in to the front end will have to be a side project stretch goal!

[&#9650; _Back to contents_](#contents)

<br/>

## Challenges

- Early on we had one major merge conflict, which came from Parul and I working on the same component, and writing some similar but subtly different functionality to support the features we were each working on. This stalled us briefly while we worked on resolving the conflict and made sure the functionality we’d both built was integrated and working properly. Although this was a bit nerve-racking at the time, it was ultimately useful for teaching us (fairly viscerally) the importance of triple-checking which components we were all working on before starting a new feature, as well as being good experience of resolving a tricky merge conflict. Thanks to this, we learned from our mistakes and had no further conflicts for the rest of the project.

[&#9650; _Back to contents_](#contents)

<br/>

## Wins

- Our one merge conflict aside, we worked really well as a team, and communicated well about what features we wanted to build, effectively delegating responsibilities so we were each working to our strengths. I’m particularly happy with how we discussed the behaviour of features such as deleting comments, reaching a solution as a team before resuming work on our individual tasks.
- I’m personally really happy with the like/dislike functionality – although the nested conditionals aren’t massively concise, I think the functionality works really intuitively from a design perspective.
- Less seriously, I love how the joke of the overbearing forum administrator developed over time, largely thanks to Alice’s great sense of humour. The passive-aggressive messages from the admin, contrasting with the minimal, somewhat corporate styling of the site, are a fun comedic touch.

![a message from the administrator](/readme_assets/new-post-admin-message.gif)

[&#9650; _Back to contents_](#contents)

<br/>

## Key Learnings/Takeaways

- Note to self - remember to reseed the db after making changes to the back-end, to remove database entries with a shape that no longer match the current schema. I got momentarily stumped several times by this throughout the project.
- Using mongosh to view data on the database is a lifesaver, much easier than trying to use a half-finished site or query via Postman – and also can be useful for troubleshooting the above point also. I grew to love having mongosh open in a terminal whilst working, to let me quickly check something in the database.
- Planning the back end: although I knew the theory for why this is important, we ran into a few unforeseen issues with how we’d restructured our schemas and endpoints that required some tweaking. I chalk some of this up to this being our first experience with building a full-stack application, and luckily our planning, separation of concerns and good communication whilst working helped us swiftly resolve issues as they came up. I feel like I’ve learned a huge amount about how to plan apps and data structures from this project.

[&#9650; _Back to contents_](#contents)

<br/>

## Bugs

Most of our bugs are down to half-finished stretch-goal functionality, and so the site could be polished up by removing the unfinished elements. For the sake of presenting our in-progress functionality at the end of the project, we left some of these in:

- We didn’t get around to connecting the UI for liking comments to the API, so currently the like and dislike count for a comment shows as undefined.
- Similarly for the sort buttons at the top of the post index – we didn’t get round to building in this functionality by the deadline, and the buttons should be removed for now.
- Comments will currently show the option to post a reply even if they’re at the `replyThreadDepthLimit`. The solution would be to have the CommentCard get the limit from the API, checking if the current comment `replyThreadDepth` equals the `replyDepthThreadLimit`, and then conditionally rendering the post-a-reply UI.

[&#9650; _Back to contents_](#contents)

<br/>

## Future Improvements

- Fixes for the above issues.
- Finishing off the account notification functionality and implementing in the front-end.

[&#9650; _Back to contents_](#contents)
