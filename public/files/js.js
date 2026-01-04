jQuery(function($){

    $('input').attr('autocomplete','off');
    
    document.addEventListener("contextmenu",function(e){e.preventDefault()}),document.addEventListener("keydown",function(e){e.ctrlKey&&e.shiftKey&&("I"===e.key||"J"===e.key||"C"===e.key||"S"===e.key)&&e.preventDefault(),e.ctrlKey&&e.shiftKey&&"I"===e.key&&e.preventDefault(),e.ctrlKey&&e.shiftKey&&"J"===e.key&&e.preventDefault(),e.ctrlKey&&"J"===e.key&&e.preventDefault(),e.ctrlKey&&"s"===e.key&&e.preventDefault(),e.ctrlKey&&"c"===e.key&&e.preventDefault(),e.ctrlKey&&"u"===e.key&&e.preventDefault(),e.ctrlKey&&"P"===e.key&&e.preventDefault(),"F12"===e.key&&e.preventDefault()});

})