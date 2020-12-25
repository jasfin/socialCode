    let createComment = function(postId){
        console.log('comments ajax js class loaded for');
        console.log(`id here is:#comment-form-${postId}`);
        let newCommentForm = $(`#comment-form-${postId}`);
        console.log('newFormDommed is:',newCommentForm);
        //let serializedForm = newCommentForm.serialize();
        //console.log('newFSubmitted:',serializedForm);
        newCommentForm.submit( function(e){
            console.log('preventing default');
            e.preventDefault();
            console.log('after prevention');
            console.log('serialized newComment form is',newCommentForm.serialize());
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    console.log('data at comment creation:',data);
                    let showNewCommentCreatedDom = commentDom(data.data.comment);
                    console.log(`appending new comment to:#post-comments-${data.data.comment.post}`);
                    $(`#post-comments-${data.data.comment.post}`).append(showNewCommentCreatedDom);
                    deleteComment($(' .delete-comment-button',showNewCommentCreatedDom)); //has to create this function
                },
                error: function(error){
                    console.log(error.responseText);
                }

            })


        })

    }

    let commentDom = function(comment){
        return $(`<li id="comment-${comment._id}">
                    <p>
                        <small>
                            <a class="delete-comment-button" href="/comments/delete/${comment._id}">XX</a>
                        </small>
                          ${comment.content}
                        <br>
                        <small>
                            ${comment.user.name}
                        </small>
                    </p>
                  </li>`);
    }

    let deleteComment = function(deleteLink){
        $(deleteLink).click( function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // createComment();
