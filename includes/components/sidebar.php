<div class="sidebar animation-left">
    <div class="logo-details">
        <img src="../assets/images/EduMechanic_Logo-.webp" alt="Logo" class="logo-image d-none">
        <i class="fa-solid fa-bars" id="btn"></i>
    </div>
    <?php if (strpos($_SERVER['REQUEST_URI'], '/std/') !== false) { ?>
        <ul class="nav-list">
            <li>
                <a href="homepage">
                    <i class="fa fa-home"></i>
                    <span class="links-name">Home</span>
                </a>
                <span class="tooltip">Home</span>
            </li>
            <li>
                <a href="readings">
                    <i class="fa fa-solid fa-book-open"></i>
                    <span class="links-name">Readings</span>
                </a>
                <span class="tooltip">Readings</span>
            </li>
            <li>
                <a href="videos">
                    <i class="fa fa-solid fa-video"></i>
                    <span class="links-name">Videos</span>
                </a>
                <span class="tooltip">Videos</span>
            </li>
            <li>
                <a href="simulations.php">
                    <i class="fa fa-solid fa-laptop-code"></i>
                    <span class="links-name">Simulations</span>
                </a>
                <span class="tooltip">Simulations</span>
            </li>
            <li>
                <a href="grades">
                    <i class="fa fa-solid fa-clipboard-list"></i>
                    <span class="links-name">Grades</span>
                </a>
                <span class="tooltip">Grades</span>
            </li>
        </ul>
        <ul class="nav-list bottom-list">
            <li>
                <a href="profile">
                    <i class="fa fa-solid fa-gear"></i>
                    <span class="links-name">Settings</span>
                </a>
                <span class="tooltip">Settings</span>
            </li>
            <li>
                <a href="#" class="logout-account">
                    <i class="fa fa-solid fa-power-off"></i>
                    <span class="links-name">Logout</span>
                </a>
                <span class="tooltip">Logout</span>
            </li>
        </ul>
    <?php } else { ?>
        <ul class="nav-list">
            <li>
                <a href="dashboard">
                    <i class="fa fa-home"></i>
                    <span class="links-name">Dashboard</span>
                </a>
                <span class="tooltip">Dashboard</span>
            </li>
            <li>
                <a href="manageLessons">
                    <i class="fa fa-solid fa-book-open"></i>
                    <span class="links-name">Manage Lessons</span>
                </a>
                <span class="tooltip">Manage Lessons</span>
            </li>
            <li>
                <a href="manageVideos">
                    <i class="fa fa-solid fa-video"></i>
                    <span class="links-name">Manage Videos</span>
                </a>
                <span class="tooltip">Manage Videos</span>
            </li>
            <li>
                <a href="manageSimulations">
                    <i class="fa fa-solid fa-laptop-code"></i>
                    <span class="links-name">Manage Simulations</span>
                </a>
                <span class="tooltip">Manage Simulations</span>
            </li>
            <li>
                <a href="manageStudents">
                    <i class="fa-solid fa-users"></i>
                    <span class="links-name">Manage Students</span>
                </a>
                <span class="tooltip">Manage Students</span>
            </li>
        </ul>
        <ul class="nav-list bottom-list">
            <li>
                <a href="profile">
                    <i class="fa fa-solid fa-gear"></i>
                    <span class="links-name">Settings</span>
                </a>
                <span class="tooltip">Settings</span>
            </li>
            <li>
                <a href="#" class="logout-account">
                    <i class="fa fa-solid fa-power-off"></i>
                    <span class="links-name">Logout</span>
                </a>
                <span class="tooltip">Logout</span>
            </li>
        </ul>
    <?php } ?>
</div>