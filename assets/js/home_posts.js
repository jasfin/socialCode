
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
                    let showNewPostCreatedDOM = postToDom(data.data.post);
                    $('#posts-container>ul').prepend(showNewPostCreatedDOM); //into the <ul> i am prepending a li element here
                    //whenever we create a post, we have to make the delete button - X to be linked to the click event we defined in the deletePost fn
                    deletePost($(' .delete-post-button', showNewPostCreatedDOM));
                }, error: function(error){
                    console.log(error.responseText);
                }

            });
        });
    }

    

    let postToDom = function(post){ 
            return $(`<li id="post-${post._id}">
            
            <small>
                <a class="delete-post-button" href="/posts/delete/${post._id}">X</a>
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


    //this method is used for deleting a post from the dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    //after successfull deletion from the db, we have to remove that post from the dom 

                    $(`#post-${data.data.post_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })


        });

    }




    createPost();

}

