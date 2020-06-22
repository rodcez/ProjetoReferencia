$(document).ready(function () {
    checkBrowser();
})

function onSuccess() {
    closeModalWait();
    window.location = decodeURIComponent("%2f");
}
function onFailed(data) {
    $('#frmLogin').trigger("reset");
    closeModalWait();
    openMasterMessageError(data.status, data.responseText, null, "reload");
}

function reload() {
    document.location.reload(true);
}

$('#frmLogin').submit(function () {

    $('#frmLogin').validate();

    if ($("input#Usuario").val() != "" && $("input#Senha").val() != "") {
        openModalWait();
        return true;
    }
    return false;


});

$("#Usuario").keyup(function (event) {
    $('span[data-valmsg-for="Usuario"]').hide();
    $("input#Usuario").removeClass("input-validation-error")
});

$("#Senha").keyup(function (event) {
    $('span[data-valmsg-for="Senha"]').hide();
    $("input#Senha").removeClass("input-validation-error")
});



$("#masterModal").on('hidden.bs.modal', '.modal', function () {
    $(document.body).removeClass('modal-noscrollbar');
})

$("#masterModal").on('show.bs.modal', '.modal', function () {
    if ($(window).height() >= $(document).height()) {
        $(document.body).addClass('modal-noscrollbar');
    }
});

$('#logoCombinado').click(function () {
    window.close();
});


function checkBrowser() {
    var chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var edge = navigator.userAgent.indexOf('Edge') > -1;
    var internetExplorer = navigator.userAgent.indexOf('NET CLR') > -1;
    var internetExplorerv1 = navigator.userAgent.indexOf('MSIE') > -1;
    var firefox = navigator.userAgent.indexOf('Firefox') > -1;
    var safari = navigator.userAgent.indexOf('Safari') > -1;
    var opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    var mensagem = " <b>A aplicação deve ser executada utilizando o Chrome. A aplicação não poderá ser executada neste browser!</b>"

    if ((chrome) && (safari)) safari = false;
    if ((chrome) && (opera)) chrome = false;

    if (edge) {
        $('#frmLogin').html(mensagem);
    } else if ((internetExplorer) || (internetExplorerv1)) {
        $('#frmLogin').html(mensagem);
    } else if (firefox) {
        $('#frmLogin').html(mensagem);
    } else if (safari) {
        $('#frmLogin').html(mensagem);
    } else if (opera) {
        $('#frmLogin').html(mensagem);
    }
}