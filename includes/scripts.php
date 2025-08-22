<?php
if (
    strpos($_SERVER['REQUEST_URI'], '/usr/') !== false ||
    strpos($_SERVER['REQUEST_URI'], '/std/') !== false
) {
    $linkTg = "../";
} else {
    $linkTg = "";
}
?>
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
    crossorigin="anonymous"></script>
<?php if (strpos($_SERVER['REQUEST_URI'], '/std/activity') !== false) { ?>
    <!-- jQuery UI -->
    <script src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"
        integrity="sha256-9zljDKpE/mQxmaR4V2cGVaQ7arF3CcXxarvgr7Sj8Uc=" crossorigin="anonymous"></script>
<?php } ?>
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
    crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
    integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
    crossorigin="anonymous"></script>
<?php if (strpos($_SERVER['REQUEST_URI'], '/usr/') !== false) { ?>
    <!-- DataTable -->
    <script src="https://cdn.datatables.net/2.2.1/js/dataTables.min.js"></script>
    <!-- ApexCharts -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<?php } ?>
<!-- Font Awesome -->
<script src="https://kit.fontawesome.com/26afe9fd6c.js" crossorigin="anonymous"></script>