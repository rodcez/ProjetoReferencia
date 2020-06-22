$(document).ready(function () {
    if ($('#hdCotacaoId').val() !== "") {
        //atualizarCamposDasCoberturasComDadosDaModel();
    }
});

$("input[name=diarias]").change(function () {

    if ($(this).is(':checked')) {
        $('#txt_QtdDiarias_' + $(this).val()).removeAttr("disabled");
        $('#txt_ValorDiarias_' + $(this).val()).removeAttr("disabled");
    }
    else {
        $('#txt_QtdDiarias_' + $(this).val()).attr('disabled', 'disabled').val("");
        $('#txt_ValorDiarias_' + $(this).val()).attr('disabled', 'disabled').val("");
    }
});

$("input[name=adicionaisFuneral]").change(function () {

    if ($(this).is(':checked')) {
        $('#txt_cobertura_' + $(this).val()).removeAttr("disabled");
    }
    else {
        $('#txt_cobertura_' + $(this).val()).attr('disabled', 'disabled');
    }
});

$(".checkCobertura").change(function () {

    var codigoCoberturaAlterada = $(this).prop("value");

    //Dependencias:
    if ($(this).is(':checked')) {

        $('#hd_cobertura_selecionado_' + codigoCoberturaAlterada).val(true);

        if ($('#hd_cobertura_percentualIndenizacaoValorCadastrado_' + codigoCoberturaAlterada).val() !== "") {
            $('#txt_cobertura_' + codigoCoberturaAlterada).val($('#hd_cobertura_percentualIndenizacaoValorCadastrado_' + codigoCoberturaAlterada).val());
            $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val($('#hd_cobertura_percentualIndenizacaoValorCadastrado_' + codigoCoberturaAlterada).val());
        }
        else {
            $('#txt_cobertura_' + codigoCoberturaAlterada).removeAttr("readonly");
        }

        //Exclusividade:
        if (this.hasAttribute("exclusivas")) {
            var arrayExclusivas = ($(this).attr('exclusivas')).split(',');

            for (var i = 0; i <= arrayExclusivas.length - 1; i++) {
                $('#chk_cobertura_' + arrayExclusivas[i]).removeAttr('checked');
                $('#txt_cobertura_' + arrayExclusivas[i]).attr('readonly', 'readonly');
                $('#txt_cobertura_' + arrayExclusivas[i]).val("");
            }
        }

        $(".checkCobertura").each(function () {

            if (this.hasAttribute("dependencias")) {
                var podeDesabilitar = false;

                if ($(this).attr('dependencias').indexOf(codigoCoberturaAlterada) > -1) {
                    var arrayDependencias = ($(this).attr('dependencias')).split(',');

                    for (var i = 0; i <= arrayDependencias.length - 1; i++) {
                        // habilitar esta cobertura, se alguma cobertura dependente estiver checada
                        if ($('#chk_cobertura_' + arrayDependencias[i]).is(':checked')) {
                            podeDesabilitar = true;
                            break;
                        }
                    }

                    if (podeDesabilitar) {
                        $(this).removeAttr("disabled");
                    }
                }
            }
        });
    }
    else {

        $('#hd_cobertura_selecionado_' + codigoCoberturaAlterada).val(false);
        $('#txt_cobertura_' + codigoCoberturaAlterada).attr('readonly', 'readonly');
        $('#txt_cobertura_' + codigoCoberturaAlterada).val("");
        $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val("");

        //Dependencias:
        $(".checkCobertura").each(function () {
            if (this.hasAttribute("dependencias")) {
                if ($(this).attr('dependencias').indexOf(codigoCoberturaAlterada) > -1) {
                    $(this).attr('disabled', 'disabled');
                    $(this).removeAttr('checked');
                    $(this).change();
                }
            }
        });
    }
});

$(".valorImportanciaSegurada").change(function () {
    var codigoCoberturaAlterada = $(this).attr("codigoCobertura");
    $('#hd_cobertura_valorImportanciaSegurada_' + codigoCoberturaAlterada).val(converterMoedaParaDecimalComQuatroCasas($(this).val()));
});

$(".percentualIndenizacao").change(function () {
    var codigoCoberturaAlterada = $(this).attr("codigoCobertura");
    $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val($(this).val());
});
