import $ from "jquery";
$("#btn-hide").click(function() {
    $(".form-select .form-1").slideUp("slow");
});

$("#btn-show").click(function() {
    $(".form-select .form-1").slideDown("slow");
});
$("#btn-hide-2").click(function() {
    $(".form-select .form-2 ").slideUp("slow");
});

$("#btn-show-2").click(function() {
    $(".form-select .form-2  ").slideDown("slow");
});