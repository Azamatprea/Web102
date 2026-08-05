# Web Development Final Project - *CampusConnect*

Submitted by: **Azamat Erkinov**

This web app: **A modern, high-tech forum for high school students to read school news, create discussions, share images, upvote popular topics, and chat in real-time in a dedicated School Lounge.**

Time spent: **10** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - [x] Form requires users to add a post title
  - [x] Forms should have the *option* for users to add: 
    - [x] additional textual content
    - [x] an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - [x] Web app must include home feed displaying previously created posts
  - [x] By default, each post on the posts feed should show only the post's:
    - [x] creation time
    - [x] title 
    - [x] upvotes count
  - [x] Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - [x] Users can sort posts by either:
    - [x] creation time
    - [x] upvotes count
  - [x] Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - [x] The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - [x] content
    - [x] image
    - [x] comments
  - [x] Users can leave comments underneath a post on the post page
  - [x] Each post includes an upvote button on the post page. 
    - [x] Each click increases the post's upvotes count by one
    - [x] Users can upvote any post any number of times
- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - [x] After a user creates a new post, they can go back and edit the post
  - [x] A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [ ] Web app implements pseudo-authentication
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
- [ ] Users can customize the interface
- [ ] Users can add more characterics to their posts
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] **School Lounge Chat**: Added a fully functional, real-time global chat room using Supabase Subscriptions for students to hang out.
* [x] **Premium Glassmorphic UI**: Implemented a highly aesthetic, responsive dark mode design with sleek animations, glass-like panels, and dynamic hover effects.
* [x] **Empty States**: Beautiful empty states with icons when no posts match search criteria or when the database is empty.
* [x] **Date Formatting**: Used `date-fns` to format timestamps into readable "relative time" (e.g., "5 minutes ago") across the app.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://i.imgur.com/fWRhKU6.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ScreenToGif  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

One of the main challenges was making sure the real-time chat component properly handled Supabase subscriptions to display messages instantly without requiring a page refresh. Ensuring the UI layout stayed consistent across different image sizes in posts was also an interesting design challenge, addressed using CSS object-fit properties.

## License

    Copyright [2026] [Azamat Erkinov]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
