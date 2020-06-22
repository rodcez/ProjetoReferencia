$(document).ready(function () {
    $('#Operador_CPF').mask('999.999.999-99');
    window.CotacaoFunctions.vericarNumeroDaApolice();
    //var url = new URL(window.location.href);
    //var searchParams = new URLSearchParams(url.search);
    //if (searchParams.get('idSessaoResult') != null) {
    //    parent.parent.$('#modalDadosCobranca').modal('hide');
    //}

});

// Funções
function onSuccess(data) {

    if ((typeof data.idCotacao !== "undefined")) {
        cotacao._id = parseInt(data.idCotacao);
        $("#hdCotacaoId").val(data.idCotacao);

        window.PlanosCondicoesComerciaisFunctions.salvarCenario(function () {
            if (criarPlanoDepoisDoSubmit) {
                var numeroDoPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length - 1].numeroPlano + 1;
                window.PlanosCondicoesComerciaisFunctions.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                window.PlanosCondicoesComerciaisUi.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                $('#selectPlanoSeguro').val(numeroDoPlano).trigger('change');
                criarPlanoDepoisDoSubmit = false;
            }
            else if (criarCenarioDepoisDoSubmit) {
                var numeroCenario = cotacao.CenariosCotacao[cotacao.CenariosCotacao.length - 1].numeroCenario + 1;
                window.PlanosCondicoesComerciaisFunctions.adicionarCenario(numeroCenario);
                window.PlanosCondicoesComerciaisUi.adicionarCenario("#addCenario", numeroCenario);
                window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();
                window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
                window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela();

                $("#cenarios > li").removeClass("active");
                $($("#cenarios > li")[indexCenarioSelecionado]).addClass("active");

                //mostrar/esconder botão de exluir cenarios, dependendo da qtde de cenarios
                if (cotacao.CenariosCotacao.length == 1)
                    $($("#cenarios > li > a > i > i")[1]).hide()
                else
                    $($("#cenarios > li > a > i > i")[1]).show()

                criarCenarioDepoisDoSubmit = false;
            }


            if ($('#hdSolicitarOrcamento').val() == "true") {
                solicitarCotacao()
            }
            else {
                if (data.mensagem != "" && (typeof data.restricoes == "undefined" || data.restricoes.length <= 0)) {
                    notification('sucesso', data.mensagem, '');
                }
            }
            window.PlanosCondicoesComerciaisUi.liberaImportacaoVidas(true);
        }, true);

    }

    if (typeof data.restricoes !== "undefined" && data.restricoes.length > 0) {
        for (var i = 0; i < data.restricoes.length; i++) {
            notification("erro", data.restricoes[i].mensagem, '');
        }
    }
    else if (data.mensagem != "") {
        if (cotacao.Status.Codigo == 1) {
            $('#statusCotacao').text("STATUS:" + data.status);
            cotacao.Status = { Codigo: data.idStatus, Descricao: data.status };
        }
        $('#numeroCotacao').text(data.idCotacao);
    }
    FocusParaForçarMascara();
    if (cotacao.Status.Codigo > 1) {
        window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
        window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
    }
    closeModalWait();
}

function onFailed(data) {
    FocusParaForçarMascara();
    closeModalWait();
    try {
        var mensagens = JSON.parse(data.responseText);
        for (var i = 0; i < mensagens.length; i++) {
            notification("erro", mensagens[i], '');
        }
    }
    catch (erro) {
        notification("erro", data.responseText, '');
    }
}

function successSolicitar(data) {
    notification('sucesso', data.messages, '');
    $('#statusCotacao').text("STATUS:" + data.status);
    cotacao.Status = { Codigo: data.idStatus, Descricao: data.status };
    window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
    window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
}

function reload() {
    document.location.reload(true);
}

function FocusParaForçarMascara() {
    $('[id*="txt_ValorDiarias_"]').each(function () {
        $(this).focus();
    });
    $('.valorImportanciaSegurada').each(function () {
        if (!$(this).is('[readOnly]')) {
            $(this).focus();
        }
    });
}

function pesquisarCorretor(busca) {
    var codigoFilial = $("#Filial_CodigoEstabelecimento").val();
    var codigoCompanhia = $("#Filial_CodigoCompanhia").val();
    var querystring = "?buscaRealizada=" + busca + "&codigoCompanhia=" + codigoCompanhia + "&codigoFilial=" + codigoFilial;
    $('#modalCotacao').removeData();
    $("#ifrmCotacao").contents().find("html").html("");
    $('#ifrmCotacao').attr('src', "/ObterListaCorretor" + querystring)
    $('#modalCotacao #btnGravar').hide();
    $('#modalCotacao #btnCotar').hide();
    $('#modalCotacao').modal('show');
}

function successCpfVendedor(data) {
    closeModalWait();
    $("#Operador_Nome").val(data.nomeOperador);
}

function closeIFramePesquisaCorretor(codigo, descricao, codigoClienteOperacional, estabelecimento, tipoCliente, tipoPessoa) {
    try {
        $('#hdCorretorCodigo').val(codigoClienteOperacional);
        $('#CorretorPrincipal_Nome').val(descricao);
        $('#CorretorPrincipal_CodigoOperacional').val(codigoClienteOperacional);
        $('#modalCotacao').modal('hide');
        $('#modalCotacao').removeData();
        $('#ifrmCotacao').removeAttr('src');

        $("#Comissionamentos_0__CodigoCliente").val(codigo);
        $("#Comissionamentos_0__Nome").val(descricao);
        $("#Comissionamentos_0__CodigoClienteOperacional").val(codigoClienteOperacional);
        $("#Comissionamentos_0__CodigoEstabelecimento").val(estabelecimento);
        $("#Comissionamentos_0__CodigoTipoComissao").val(tipoCliente);
        $("#corretorTipoPessoa").val(tipoPessoa);
        $("#Comissionamentos_0__PercentualParticipacao").val(100);
        inicializaCorretorParaCocorretagem();
        $("#cotacaoTotalPercentualCorretagem").val(ProdutoComercial.comissaoProdutoComercial.percentualComissaoPessoaJuridica.toFixed(2).replace('.', ','));

    } catch (e) {
        ExceptionHandling(e);
    }
}

function determineDropDirection() {
    $(".dropdown-menu").each(function () {

        // Invisibly expand the dropdown menu so its true height can be calculated
        $(this).css({
            visibility: "hidden",
            display: "block"
        });

        // Necessary to remove class each time so we don't unwantedly use dropup's offset top
        $(this).parent().removeClass("dropup");

        // Determine whether bottom of menu will be below window at current scroll position
        if ($(this).offset().top + $(this).outerHeight() > $(window).innerHeight() + $(window).scrollTop()) {
            $(this).parent().addClass("dropup");
        }

        // Return dropdown menu to fully hidden state
        $(this).removeAttr("style");
    });
}

function solicitarCotacao() {

    if (confirm("Deseja confirmar a Solicitação do Orçamento ?")) {
        $.ajax({
            url: '/cotacao/solicitar/' + cotacao._id,
            type: 'get',
            contentType: "application/json",
            success: successSolicitar,
            error: onFailed
        });
    } else {
        false;
    }
}

function ativarSolicitarOrcamento(e, value) {
    if (cotacao.Status.Codigo > 1) {
        window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#cotacao #step-1");
        window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#cotacao #step-2");
        window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#cotacao #step-3");
        window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#cotacao #step-5");
    }
    //TODO: Colocar isso em outro lugar
    $('#TotaisComissionamento_TotalPercentualCorretagem').val($('#cotacaoTotalPercentualCorretagem').maskMoney('unmasked')[0]);
    $('#TotaisComissionamento_TotalPercentualProLabore').val($('#cotacaoTotalPercentualProLabore').maskMoney('unmasked')[0]);
    $('#TotaisComissionamento_TotalPercentualAgenciamento').val($('#cotacaoTotalPercentualAgenciamento').maskMoney('unmasked')[0]);

    // valida o campo nome do plano
    validacaoCampoVazio("#inputNomeDoPlano", " - Nome do plano deve ser preenchido ");

    // valida o dropdonw  se não foi selecionado,  Nenhum  tipo de Modalidade
    if ($("#selectTipoModalidadeCapital").val() == 0) {
        $("#selectTipoModalidadeCapital").addClass("input-validation-error");
        notification("erro", "Cenário " + cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario + " - Plano " + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano + "- Campo Modalidade deve ser informado.");
    } else {
        $('#selectTipoModalidadeCapital').removeClass("input-validation-error");
    }


    // valida campos  conforme o tipo de Modalidade selecionado
    if ($('#selectTipoModalidadeCapital').val() == "MS") {
        validacaoCampoVazio("#inputValorMultiplo", " - Campo Valor Multiplo deve ser informado.");
        for (var i = 0; i <= cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length - 1; i++) {
            validacaoCampoVazio("#inputIdadeInicial_" + i, " - Campo Idade Inicial deve ser informado.");
            validacaoCampoVazio("#inputIdadeFinal_" + i, " - Campo Idade Final deve ser informado.");
            validacaoCampoVazio("#inputCapitalMinimo_" + i, " - Campo Capital Mínimo deve ser informado.");
            validacaoCampoVazio("#inputCapitalMaximo_" + i, " - Campo Capital Máximo deve ser informado.");

        }

    } else if ($('#selectTipoModalidadeCapital').val() == "ES") {

        for (var i = 0; i <= cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length - 1; i++) {
            validacaoCampoVazio("#inputIdadeInicial_" + i, " - Campo Idade Inicial deve ser informado.");
            validacaoCampoVazio("#inputIdadeFinal_" + i, " - Campo Idade Final deve ser informado.");
            validacaoCampoVazio("#inputCapitalMinimo_" + i, " - Campo Capital Mínimo deve ser informado.");
            validacaoCampoVazio("#inputCapitalMaximo_" + i, " - Campo Capital Máximo deve ser informado.");
        }

    } else if ($('#selectTipoModalidadeCapital').val() == "UN") {

        validacaoCampoVazio("#inputValorCapitalUniforme", " - Campo Valor Capital Uniforme deve ser informado.");
        for (var i = 0; i <= cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length - 1; i++) {

            validacaoCampoVazio("#inputIdadeInicial_" + i, " - Campo Idade Inicial deve ser informado.");
            validacaoCampoVazio("#inputIdadeFinal_" + i, " - Campo Idade Final deve ser informado.");

        }

    }


    for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; i++) {
        var currentCobertura = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[i];
        var currentCenario = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
        var currentPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
        var coberturasAdicionais = "53,54,55,56,57,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76".split(",");
        var coberturasDiarias = "81,82,83".split(",");
        var coberturasFuneral = "77,78,88,89,90,91,92".split(",");

        if (coberturasAdicionais.includes(currentCobertura.codigoTipoCobertura + "")) {
            if (currentCobertura.selecionado && (currentCobertura.verbas[0].percentualIndenizacao == null || isNaN(currentCobertura.verbas[0].percentualIndenizacao))) {
                $("#txt_cobertura_" + currentCobertura.codigo).addClass("input-validation-error");

                notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura + " - O campo % Ind é de preenchimento obrigatório.");
            }
        }

        if (coberturasDiarias.includes(currentCobertura.codigoTipoCobertura + "")) {
            if (currentCobertura.selecionado && (currentCobertura.verbas[0].percentualIndenizacao == null || isNaN(currentCobertura.verbas[0].percentualIndenizacao))) {

                if ($("#txt_QtdDiarias_" + currentCobertura.codigo).val() == "") {
                    $("#txt_QtdDiarias_" + currentCobertura.codigo).addClass("input-validation-error");
                    notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura + " - O campo Qtde diárias é de preenchimento obrigatório.");

                } if ($("#txt_ValorDiarias_" + currentCobertura.codigo).val() == "") {
                    $("#txt_ValorDiarias_" + currentCobertura.codigo).addClass("input-validation-error");
                    notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura + " - O campo Valor diária é de preenchimento obrigatório.");
                }

            }

        }

        if (coberturasFuneral.includes(currentCobertura.codigoTipoCobertura + "")) {
            if (currentCobertura.selecionado && (currentCobertura.verbas[0].valorImportanciaSegurada == null || isNaN(currentCobertura.verbas[0].valorImportanciaSegurada))) {
                $("#txt_cobertura_" + currentCobertura.codigo).addClass("input-validation-error");
                notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura + " - O campo Valor é de preenchimento obrigatório.");
            }
        }
    }


    if ($(".input-validation-error").length > 0) {
        $('html, body').animate({
            scrollTop: $(".input-validation-error").offset().top - 240
        }, 500);
        e.preventDefault();
    } else {
        $('#hdSolicitarOrcamento').val(value);
    }

}

function validacaoCampoVazio(campo, mensagem) {
    if ($(campo).val() == "") {
        $(campo).addClass("input-validation-error");
        invalido = 1;
        notification("erro", "Cenário " + cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario + " - Plano " + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano + mensagem);
    }
}


// Eventos
$('#endCep').on('change', function () {
    if ($('#endCep').val() !== null && $('#endCep').val() !== ''
        && $('#endCep').val().length >= 8 && $('#endCep').val().length <= 9) {

        $("#masterModalWaitMessage").html("Aguarde...");
        $('#masterModalWait').modal('show');

        $.ajax({
            async: true,
            cache: false,
            type: "GET",
            url: "/Cotacao/Residencia/ConsultarCEP",
            data: { "cep": $('#endCep').val().replace('-', '') },
            success: successCep,
            error: errorCep
        });
    }

});

$('#PesquisaCorretor').click(function () {
    try {


        if ($("#CorretorPrincipal_Nome").val() !== null && $("#CorretorPrincipal_Nome").val() !== "" && $("#CorretorPrincipal_Nome").val().length >= 2) {
            $.ajax({
                type: "POST",
                url: "/VerificarSessao",
                async: true,
                success: function () {
                    pesquisarCorretor($("#CorretorPrincipal_Nome").val());
                },
                error: function (result) {
                    closeModalWait();
                    VerificarAuth(result);
                    notification("erro", result.responseText, '');
                    $('#Estipulante_CPFCNPJ').val('');
                    $('#estipulanteViewModel_Nome').val('');
                }
            });
        }
        else {
            if ($("#CorretorPrincipal_Nome").val().length <= 1) {
                notification("erro", "Digite no minimo 2 caracteres", "CorretorPrincipal_Nome");
            }
            else {
                notification("erro", "Informe um Corretor", "CorretorPrincipal_Nome");
            }

        }
    } catch (e) {
        ExceptionHandling(e);
    }
});

$("#btnAlterarCPFVendedor").click(function () {

    if ($('#Operador_CPF').val() === '') {
        notification("erro", "Informe um CPF", "Operador_CPF");
        return;
    }

    if ($('#Operador_CPF').val().replace('.', '').replace('-', '').replace('.', '').length < 11) {
        notification("erro", "CPF Incompleto", "Operador_CPF");
        return;
    }

    openModalWait();
    $.ajax({
        type: "POST",
        url: "/ObterDadosOperador",
        async: true,
        contentType: 'application/x-www-form-urlencoded',
        data: { cpf: Number($('#Operador_CPF').val().replace('.', '').replace('-', '').replace('.', '')) },
        success: successCpfVendedor,
        error: function (result) {
            closeModalWait();
            VerificarAuth(result)
            notification("erro", result.responseText, "");
            $('#Operador_CPF').val('')
            $('#Operador_Nome').val('')
        }
    });
});

$("#CorretorPrincipal_Nome").keydown(function (e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
        e.preventDefault();
        $('#PesquisaCorretor').click();
    }
});

$("#CorretorPrincipal_Nome").keyup(function () {
    if ($(this).val().length > 3) {
        $("[data-valmsg-for='CorretorPrincipal_Nome']").removeClass("field-validation-error");
    }

    if ($(this).length === 0) {
        $("[data-valmsg-for='CorretorPrincipal_Nome']").toggleClass("field-validation-error");
    }
});

//Eventos e funções utilizados para a sessão de coberturas:
$(".valorImportanciaSegurada").change(function () {
    var codigoCoberturaAlterada = $(this).attr("codigoCobertura");
    $('#hd_cobertura_valorImportanciaSegurada_' + codigoCoberturaAlterada).val(converterMoedaParaDecimalComQuatroCasas($(this).val()));
});

$(".percentualIndenizacao").change(function () {
    var codigoCoberturaAlterada = $(this).attr("codigoCobertura");
    $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val($(this).val());
});

$(".checkCobertura").change(function () {
    console.log("teste checkCobertura");
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
                    var arrayDependencias = $(this).attr('dependencias').split(',');

                    for (var i = 0; i <= arrayDependencias.length - 1; i++) {
                        //Habilitar esta cobertura, se alguma cobertura dependente estiver checada:
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

        $(".checkCobertura").each(function () {
            //Dependencias:
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

$("input[name=basica]").change(function () {
    console.log("teste");
    let coberturaParaPesquisarDependente = $(this).val();
    let proximasCobertura = [];
    let contextoCoberturaPadrao = false;
    let primeiraCoberturaComDependencia = true;

    if (!$(this).is(':checked')) {
        /* Se uma cobertura básica foi desmarcada então irá verificar se há alguma outra cobertura básica marcada e fazer o tratamento da visualização: */
        $("input[name=basica]").each(function () {
            if ($(this).is(':checked')) {
                coberturaParaPesquisarDependente = this.value;
                return false;
            }
        });
    }

    while (coberturaParaPesquisarDependente !== "") {

        $(".checkCobertura").each(function () {

            if (this.hasAttribute("condicaoVisualizacao") &&
                this.hasAttribute("dependencias") &&
                this.getAttribute("dependencias").indexOf(coberturaParaPesquisarDependente) >= 0) {

                /* primeiraCoberturaComDependencia - Indentifica se a cobertura do loop atual tem dependencia da cobertura basica e assim achar o contexto */
                if (primeiraCoberturaComDependencia) {
                    /* Contexto = Identifica se a cobertura básica selecionada corresponde a cobertura morte (cobertura morte - deverá ser mostrada quando mais de uma cobertura basica for selecionada) */
                    contextoCoberturaPadrao = this.getAttribute("dependencias") === $("#hdCodigoCoberturaMorte").val();
                    primeiraCoberturaComDependencia = false;
                }

                /* Sair da função se a cobertura básica padrão estiver selecionada e o contexto indicar que a basica selecionada neste momento corresponde a outra cobertura */
                if ($("#chk_cobertura_" + $("#hdCodigoCoberturaMorte").val()).is(':checked') && contextoCoberturaPadrao === false) {
                    return false;
                }
                else {
                    $("#divCobertura_" + this.value).removeClass("hide");
                    $("#chk_cobertura_" + this.value).removeAttr("checked");
                    $("#divCobertura_" + this.getAttribute("condicaoVisualizacao")).addClass("hide");
                    $("#chk_cobertura_" + this.getAttribute("condicaoVisualizacao")).removeAttr("checked");

                    proximasCobertura.push(this.value); //Adiciona esta cobertura na array para que seja feita a busca por dependentes desta cobertura e assim fazer o tratamento de visualização
                }
            }
        });

        coberturaParaPesquisarDependente = proximasCobertura.length > 0 ? proximasCobertura[0] : "";
        proximasCobertura.shift();
    }
});

$("input[name=diarias]").change(function () {

    if ($(this).is(':checked')) {
        $('#txt_QtdDiarias_' + $(this).val()).removeAttr("readonly");
        $('#txt_ValorDiarias_' + $(this).val()).removeAttr("readonly").maskMoney({ prefix: "R$ ", decimal: ",", thousands: "." });
    }
    else {
        $('#txt_QtdDiarias_' + $(this).val()).attr('readonly', 'readonly').val("");
        $('#txt_ValorDiarias_' + $(this).val()).attr('readonly', 'readonly').val("").maskMoney('destroy');
    }
});

$("input[name=adicionaisFuneral]").change(function () {

    if ($(this).is(':checked')) {
        $('#txt_cobertura_' + $(this).val()).removeAttr("readonly").maskMoney({ prefix: "R$ ", decimal: ",", thousands: "." });
    }
    else {
        $('#txt_cobertura_' + $(this).val()).attr('readonly', 'readonly').maskMoney('destroy');
    }
});

$("input[id^='txt_QtdDiarias_']").keyup(function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});

$('#frmCotacao').submit(function () {

    var url = new URL(window.location.href);
    var searchParams = new URLSearchParams(url.search);
    console.log(searchParams.get('idSessaoResult'));

    $('#frmCotacao').validate();

    openModalWait();
    return true;


});

//Novos métodos favor utilizar já a nova estrutura para irmos migrando aos poucos...
window.CotacaoFunctions = {
    initialize: function (callback) {

    },

    atualizarObjetoCotacao: function (callback) {
        $.ajax({
            url: '/cotacao/AtualizarObjetoCotacao/' + cotacao._id,
            type: 'get',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.CotacaoFunctions.popularCotacao(data);
                window.CotacaoFunctions.vericarNumeroDaApolice();
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            }
        })
    },

    popularCotacao: function (data) {

        //Os objetos são diferentes, então vamos atualizando conforme a necessidade
        //O certo seria colocar cotacao = data, mas...

        //Os dados do ajax vem como minúsculo, por isso estou pegando dado por dado e não o objeto inteiro

        if (data.dataInicioVigencia != null) {
            cotacao.DataInicioVigencia = data.dataInicioVigencia;
            cotacao.DataFimVigencia = data.dataFimVigencia;
        }

        if (data.cosseguroCedido != null) {
            cotacao.CosseguroCedido.CodigoSeguradora = data.cosseguroCedido.codigoSeguradora;
            cotacao.CosseguroCedido.NomeSeguradora = data.cosseguroCedido.nomeSeguradora;
            cotacao.CosseguroCedido.PercentualCosseguro = data.cosseguroCedido.percentualCosseguro;
            cotacao.CosseguroCedido.PercentualComissao = data.cosseguroCedido.percentualComissao;
            cotacao.CosseguroCedido.PercentualDespesaAdministrativa = data.cosseguroCedido.percentualDespesaAdministrativa;
        }

        if (data.propostaEmissao != null) {
            cotacao.PropostaEmissao.NumeroCenario = data.propostaEmissao.numeroCenario;
            cotacao.PropostaEmissao.NumeroVersao = data.propostaEmissao.numeroVersao;
            cotacao.PropostaEmissao.NumeroCenarioComissionamento = data.propostaEmissao.numeroCenarioComissionamento;
            cotacao.PropostaEmissao.NumeroApolice = data.propostaEmissao.numeroApolice;
            cotacao.PropostaEmissao.CodigoContrato = data.propostaEmissao.codigoContrato;
        }

        if (data.totaisComissionamento) {
            cotacao.TotaisComissionamento.TotalPercentualAgenciamento = data.totaisComissionamento.totalPercentualAgenciamento;
            cotacao.TotaisComissionamento.TotalPercentualCorretagem = data.totaisComissionamento.totalPercentualCorretagem;
            cotacao.TotaisComissionamento.TotalPercentualProLabore = data.totaisComissionamento.totalPercentualProLabore;
        }

        if (data.cenariosCotacao != null && data.cenariosCotacao.length > 0) {
            cotacao.CenariosCotacao.forEach(function (cenarioCotacao) {
                var cenarioData = data.cenariosCotacao.filter(function (value) {
                    return value.numeroCenario == cenarioCotacao.numeroCenario;
                });

                cenarioCotacao.indicadorPlanoMesmaCobertura = cenarioData[0].indicadorPlanoMesmaCobertura;
            });
        }

        if (data.estipulantePrincipal != null && data.estipulantePrincipal.numeroCPFCNPJ != null) {
            cotacao.EstipulantePrincipal = {};
            cotacao.EstipulantePrincipal.NumeroCPFCNPJ = data.estipulantePrincipal.numeroCPFCNPJ;
        }

        if (data.itens != null && data.itens.length > 0) {
            cotacao.Itens = [];
            data.itens.forEach(function (dataItem) {

                var cotacaoItem = {};
                cotacaoItem.NumeroItem = dataItem.numeroItem;
                cotacaoItem.NumeroPlanoCondicoesComerciais = dataItem.numeroPlanoCondicoesComerciais;

                cotacaoItem.Estipulante = {};
                cotacaoItem.Estipulante.Nome = dataItem.estipulante.nome;
                cotacaoItem.Estipulante.NumeroCpfCnpj = dataItem.estipulante.numeroCpfCnpj;
                cotacaoItem.Estipulante.TipoPessoa = dataItem.estipulante.tipoPessoa;
                cotacaoItem.Estipulante.Email = dataItem.estipulante.email;

                cotacaoItem.Estipulante.Telefone = {};
                cotacaoItem.Estipulante.Telefone.DDD = dataItem.estipulante.telefone.ddd;
                cotacaoItem.Estipulante.Telefone.Numero = dataItem.estipulante.telefone.numero;

                cotacaoItem.Estipulante.Endereco = {};
                cotacaoItem.Estipulante.Endereco.NumeroCep = dataItem.estipulante.endereco.numeroCep;
                cotacaoItem.Estipulante.Endereco.TipoLogradouro = dataItem.estipulante.endereco.tipoLogradouro;
                cotacaoItem.Estipulante.Endereco.NomeLogradouro = dataItem.estipulante.endereco.nomeLogradouro;
                cotacaoItem.Estipulante.Endereco.NumeroLogradouro = dataItem.estipulante.endereco.numeroLogradouro;
                cotacaoItem.Estipulante.Endereco.Complemento = dataItem.estipulante.endereco.complemento;
                cotacaoItem.Estipulante.Endereco.NomeBairro = dataItem.estipulante.endereco.nomeBairro;
                cotacaoItem.Estipulante.Endereco.NomeCidade = dataItem.estipulante.endereco.nomeCidade;
                cotacaoItem.Estipulante.Endereco.SiglaUF = dataItem.estipulante.endereco.siglaUF;

                if (cotacaoItem.Estipulante.TipoPessoa == "F") {
                    cotacaoItem.Estipulante.CodigoMeiCei = dataItem.estipulante.codigoMeiCei;
                    cotacaoItem.Estipulante.CodigoFaixaRenda = dataItem.estipulante.codigoFaixaRenda;
                    cotacaoItem.Estipulante.IndicadorPEP = dataItem.estipulante.indicadorPEP;

                    cotacaoItem.Estipulante.Ocupacao = {};
                    cotacaoItem.Estipulante.Ocupacao.Codigo = dataItem.estipulante.ocupacao.codigo;
                    cotacaoItem.Estipulante.Ocupacao.Descricao = dataItem.estipulante.ocupacao.descricao;
                } else {
                    cotacaoItem.Estipulante.Cnae = {};
                    cotacaoItem.Estipulante.Cnae.Codigo = dataItem.estipulante.cnae.codigo;
                    cotacaoItem.Estipulante.Cnae.Descricao = dataItem.estipulante.cnae.descricao;
                }

                cotacao.Itens.push(cotacaoItem);
            })
        }
    },

    vericarNumeroDaApolice: function () {
        if (cotacao.PropostaEmissao.NumeroApolice > 0) {
            $("#numeroApolice").show();
            $("#textApolice").show();
        } else {
            $("#numeroApolice").hide();
            $("#textApolice").hide();
        }
    }
}