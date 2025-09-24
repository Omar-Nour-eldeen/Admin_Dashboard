$(document).ready(function () {
    let usersData = JSON.parse(localStorage.getItem("users")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (usersData.length === 0) {
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/users",
            method: "GET",
            success: function (data) {
                usersData = data;
                saveUsers();
                loadTable(usersData);
                toastr.success("Users loaded from API");
            },
            error: function () {
                toastr.error("Failed to load users");
            }
        });
    } else {
        loadTable(usersData);
    }

    function saveUsers() {
        localStorage.setItem("users", JSON.stringify(usersData));
    }

    function saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function loadTable(users) {
        $("#usersTable").DataTable({
            data: users,
            destroy: true,
            responsive: true,
            columns: [
                {
                    data: "id",
                    render: function (id) {
                        let isFav = favorites.includes(id);
                        let icon = isFav
                            ? "fa-solid fa-bookmark text-primary"
                            : "fa-regular fa-bookmark text-secondary";
                        return `<i class="${icon} fav-btn" data-id="${id}" style="cursor:pointer;"></i>`;
                    }
                },
                { data: "id" },
                { data: "name" },
                { data: "email" },
                { data: "username" },
                {
                    data: "id",
                    render: function (id) {
                        return `
              <button class="btn btn-sm btn-primary edit-btn" data-id="${id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${id}">Delete</button>
            `;
                    }
                }
            ]
        });
    }

    $("#addUserForm").submit(function (e) {
        e.preventDefault();

        let email = $("#newUserEmail").val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toastr.error("Invalid email format!");
            return;
        }

        let newId = (usersData.length ? usersData[usersData.length - 1].id : 0) + 1;
        let newUser = {
            id: newId,
            name: $("#newUserName").val(),
            email: email,
            username: $("#newUserUsername").val()
        };

        usersData.push(newUser);
        saveUsers();
        toastr.success("User added");
        $("#addUserModal").modal("hide");
        this.reset();
        loadTable(usersData);
    });

    $(document).on("click", ".fav-btn", function () {
        let id = $(this).data("id");
        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
            toastr.info("Removed from favorites");
        } else {
            favorites.push(id);
            toastr.success("Added to favorites");
        }
        saveFavorites();
        loadTable(usersData);
    });

    $(document).on("click", ".delete-btn", function () {
        let id = $(this).data("id");
        usersData = usersData.filter(u => u.id !== id);
        saveUsers();
        toastr.error("User deleted");
        loadTable(usersData);
    });

    $(document).on("click", ".edit-btn", function () {
        let id = $(this).data("id");
        let user = usersData.find(u => u.id === id);
        $("#editUserId").val(user.id);
        $("#editUserName").val(user.name);
        $("#editUserEmail").val(user.email);
        $("#editUserUsername").val(user.username);
        $("#editUserModal").modal("show");
    });

    $("#editUserForm").submit(function (e) {
        e.preventDefault();

        let email = $("#editUserEmail").val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toastr.error("Invalid email format!");
            return;
        }

        let id = parseInt($("#editUserId").val());
        let user = usersData.find(u => u.id === id);

        user.name = $("#editUserName").val();
        user.email = email;
        user.username = $("#editUserUsername").val();

        saveUsers();
        toastr.success("User updated");
        $("#editUserModal").modal("hide");
        loadTable(usersData);
    });
});
