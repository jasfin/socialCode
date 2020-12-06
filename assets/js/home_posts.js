{
    console.log('loaded');

    //this method will submit the new post Creation post using ajax
    let createPost = function(){
        let newPostForm = $('#post-form');

        newPostForm.submit( function(e){
            e.preventDefault();        
            //ajax used for - Dynamically adding content to a web page using JavaScript from JSON received from the server 
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    console.log(data);
                    let showNewPostCreated = postToDom(data.data.post);
                    $('#posts-container>ul').prepend(showNewPostCreated);
                }, error: function(error){
                    console.log(error.responseText);
                }

            });
        });
    }

    createPost();

    let postToDom = function(post){
            return $(`<li id="post- ${post._id}">
            
            <small>
                <a class="delete-post-button" href="/posts/delete/${post.id}">X</a>
            </small>

            <p>
             ${post.content}
            <small>
                ${post.user.name}
            </small>
            </p>
        
            <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Add comment..." required>
                    <input type="hidden" name="post" value="${post._id}" >
                    <input type="submit" value="Add Comment">
                </form>
                
                <div class="post-comments-list">
                <ul id="post-comments- ${post._id}">
                    
                </ul>
                </div>
            </div>
        </li>`);
    }


}