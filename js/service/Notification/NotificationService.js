//ICONES
//https://www.w3schools.com/bootstrap/bootstrap_ref_comp_glyphs.asp

//DOCUMENTAÇÃO
//http://bootstrap-notify.remabledesigns.com/#documentation


function notification(tipo, mensagem, idElement) {

    if (tipo === 'alerta') {
        $('.tab-form').children().children().addClass('btn-is-disabled');
        $('.tab-form-final').children().children().addClass('btn-is-disabled');

        $.notify({
            icon: 'glyphicon glyphicon-bell',
            title: '<b><strong>' + "Mensagem de alerta:" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: "notificationWarn",
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 10,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            onClick: closeAllNotifications,
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-5 col-sm-3-notification alert alert-notificationWarn" role="alert" style="cursor:pointer">' +
                '<button type="button" aria-hidden="true" class="close-notificationWarn" data-notify="dismiss">x</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
        notificacaoFecharTodas();
        return;
    } else if (tipo === 'fechar') {
        $('.tab-form').children().children().addClass('btn-is-disabled');
        $('.tab-form-final').children().children().addClass('btn-is-disabled');

        $.notify({
            icon: 'glyphicon glyphicon-bell',
            title: '<b><strong>' + "Clique aqui para fechar todas as mensagens" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: "notificationWarn",
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 10,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            onClick: closeAllNotifications,
            icon_type: 'class',
            template: '<div data-notify="container" id="mensagemFecharTodas" class="col-xs-5 col-sm-3-notification alert alert-notificationWarn" role="alert" style="cursor:pointer">' +
                '<button type="button" aria-hidden="true" class="close-notificationWarn" data-notify="dismiss">x</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
        return;
    } else if (tipo === 'sucesso') {
        $("#sidebar").removeClass("in");
        $(".btnMenuSidebar").removeClass("hidden");
        $.notify({
            icon: 'glyphicon glyphicon-ok',
            title: '<b><strong>' + " Sucesso!" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: tipo,
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 8,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-5 col-sm-3-notification alert alert-notificationSuccess animated fadeInDown" role="alert">' +
                '<button type="button" aria-hidden="true" class="close-notificationSuccess" data-notify="dismiss">x</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
        notificacaoFecharTodas();
        return;
    }
    else if (tipo === 'sucessoError') {
        $("#sidebar").removeClass("in");
        $(".btnMenuSidebar").removeClass("hidden");
        $.notify({
            icon: '	glyphicon glyphicon-warning-sign',
            title: '<b><strong>' + " Aviso!" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: tipo,
            allow_dismiss: true,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 8,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-5 col-sm-3-notification alert alert-notificationSuccessError animated fadeInDown" role="alert">' +
                '<button type="button" aria-hidden="true" class="close-notificationSuccessError" data-notify="dismiss">x</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
        return;
    }
    else if (tipo === 'erro') {
        $("#sidebar").removeClass("in");
        $(".btnMenuSidebar").removeClass("hidden");
        $.notify({
            icon: 'glyphicon glyphicon-exclamation-sign',
            title: '<b><strong>' + "Erro:" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: tipo,
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 8,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-5 col-sm-3-notification alert alert-notificationError animated fadeInDown" role="alert">' +
                '<button type="button" aria-hidden="true" class="close-notificationError" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'

        });
        notificacaoFecharTodas();
    }
    else if (tipo === 'closeNotifications') {
        $.notifyClose('.alert-closeNotifications');
        $.notify({
            icon: "",
            title: '<b><strong>' + "Fechar notificações" + '</strong></b>',
            message: mensagem,
            url: '',
            target: '_blank'
        }, {
            element: 'body',
            position: null,
            type: tipo,
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 8,
            z_index: 1031,
            delay: 0,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            url_target: '_blank',
            onClick: closeAllNotifications,
            icon_type: 'src',
            template: '<div data-notify="container" class="col-xs-5 col-sm-3-notification alert alert-{0} animated fadeInDown" role="alert">' +
                '<button type="button" aria-hidden="true" class="close-{0}" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span><br>' + ' ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
        return;
    }

    if (idElement === undefined || idElement === null || idElement === "") {
        return;
    }

    $("#" + idElement).addClass("input-validation-error");
    $("#" + idElement).focus();

    var center = $(window).height() / 2;
    var top = $("#" + idElement).offset().top;
    if (top > center) {
        $('html, body').animate({ scrollTop: top - center }, 200);
    }
}

function closeAllNotifications() {
    $.notifyClose();

    $('.tab-form').children().children().removeClass('btn-is-disabled');
    $('.tab-form-final').children().children().removeClass('btn-is-disabled');
}

function notificacaoFecharTodas() {
    if ($(".alert").length > 1) {
        if ($("#mensagemFecharTodas").length > 0) {
            $("#mensagemFecharTodas").hide();
            $("#mensagemFecharTodas").remove();
        }
        notification("fechar", "Declaro que li e estou ciente das condições acima.", "");
    }
}

function verificaNotificacaoExiste(mensagem) {
    var existe = false;
    $(".alert-notificationError").each(function () {
        if (this.textContent.indexOf(mensagem) >= 0) {
            existe = true;
        }
    });
    return existe;
}