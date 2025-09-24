$(document).ready(function () {
    let postsData = JSON.parse(localStorage.getItem("posts")) || [];

    if (postsData.length === 0) {
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "GET",
            success: function (data) {
                postsData = data;
                savePosts();
                renderPosts(postsData);
                toastr.success("Posts loaded from API");
            },
            error: function () {
                toastr.error("Failed to load posts");
            }
        });
    } else {
        renderPosts(postsData);
    }

    function savePosts() {
        localStorage.setItem("posts", JSON.stringify(postsData));
    }

    function renderPosts(posts) {
        $("#postsList").empty();
        posts.forEach(post => {
            $("#postsList").append(`
                <div class="list-group-item">
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        <button class="btn btn-sm btn-info view-comments rounded-5" data-id="${post.id}">Comments</button>
                        <button class="btn btn-sm btn-primary edit-post rounded-5" data-id="${post.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-post rounded-5" data-id="${post.id}">Delete</button>
                    </div>
                    <div class="comments mt-2" id="comments-${post.id}" style="display:none;"></div>
                </div>
            `);
        });
    }

    $("#addPostForm").submit(function (e) {
        e.preventDefault();
        let newPost = {
            id: Date.now(),
            title: $("#postTitle").val(),
            body: $("#postBody").val()
        };
        postsData.unshift(newPost);
        savePosts();
        toastr.success("Post added");
        $("#addPostModal").modal("hide");
        this.reset();
        renderPosts(postsData);
    });

    $(document).on("click", ".delete-post", function () {
        let id = $(this).data("id");
        postsData = postsData.filter(p => p.id !== id);
        savePosts();
        toastr.error("Post deleted");
        let allComments = JSON.parse(localStorage.getItem("comments"));
        allComments = allComments.filter(c => c.postId !== id);
        localStorage.setItem("comments", JSON.stringify(allComments));
        renderPosts(postsData);
    });

    $(document).on("click", ".edit-post", function () {
        let id = $(this).data("id");
        let post = postsData.find(p => p.id === id);
        $("#editPostId").val(post.id);
        $("#editPostTitle").val(post.title);
        $("#editPostBody").val(post.body);
        $("#editPostModal").modal("show");
    });

    $("#editPostForm").submit(function (e) {
        e.preventDefault();
        let id = parseInt($("#editPostId").val());
        let post = postsData.find(p => p.id === id);
        post.title = $("#editPostTitle").val();
        post.body = $("#editPostBody").val();
        savePosts();
        toastr.success("Post updated");
        $("#editPostModal").modal("hide");
        renderPosts(postsData);
    });

    $(document).on("click", ".view-comments", function () {
        let id = $(this).data("id");
        let commentsBox = $(`#comments-${id}`);
        if (commentsBox.is(":visible")) {
            commentsBox.hide();
            return;
        }
        $.ajax({
            url: `https://jsonplaceholder.typicode.com/comments?postId=${id}`,
            method: "GET",
            success: function (comments) {
                let html = comments.map(c => `
                    <div class="comment-item p-3 mb-2 rounded-4">
                        <strong>${c.name}</strong><br>${c.body}
                    </div>
                `).join("");
                commentsBox.html(html).slideDown();
            },
            error: function () {
                toastr.error("Failed to load comments");
            }
        });
    });

    $("#searchInput").on("keyup", function () {
        let term = $(this).val().toLowerCase();
        let filtered = postsData.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.body.toLowerCase().includes(term)
        );
        renderPosts(filtered);
    });
});
