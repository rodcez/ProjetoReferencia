window.ConsultaUi = { //Validações de campos, criação de HTML, alteração de CSS e etc.

    initialize: function () {
        window.ConsultaUi.CarregaScriptsIniciais();
        window.ConsultaUi.VisibilidadeInicial();
    },

    CarregaScriptsIniciais: function () {
        var html = $("#TabelaCotacaoTemplate").render();
        $("#campoTabelaConsulta").html(html);
        window.ConsultaUi.CarregaDataTables();
        window.ConsultaUi.MascaraNumeroCotacao();
        $('#inputPeriodoInicial').mask('99/99/9999');
        $('#inputPeriodoFinal').mask('99/99/9999');
        $('#inputPeriodoInicial').datepicker({
            format: 'dd/mm/yyyy',
            language: "pt-BR",
            autoclose: true
        });
        $('#inputPeriodoFinal').datepicker({
            format: 'dd/mm/yyyy',
            language: "pt-BR",
            autoclose: true
        });

        window.ConsultaFunctions.pesquisarStatus();
    },

    CarregaDataTables: function () {
        $('#tabelaConsulta').DataTable({
            "language": {
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "_MENU_ resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Filtrar: &nbsp;",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                },
                "select": {
                    "rows": {
                        "_": "Selecionado %d linhas",
                        "0": "Nenhuma linha selecionada",
                        "1": "Selecionado 1 linha"
                    }
                }
            }
        });
        $(".dataTables_filter").css('float', 'right');
    },

    VisibilidadeInicial: function () {
        $("#campoFilial").hide();
    },

    MascaraEstipulanteCnpjCpf: function () {
        $("#inputCpfCnpj").unmask();
        if ($("#inputCpfCnpj").val().length > 11) {
            $("#inputCpfCnpj").mask('99.999.999/9999-99');
        } else {
            $("#inputCpfCnpj").mask('999.999.999-99');
        }
    },

    MascaraNumeroCotacao: function () {
        $("#inputNumeroCotacao").mask('9999999999999');
    },

    LimpaNumeroCotacao: function () {
        $("#inputNumeroCotacao").val("");
        window.ConsultaUi.MascaraNumeroCotacao();
        $("#inputNumeroCotacao").removeClass("input-validation-error");
    },

    LimpaNomeEstipulante: function () {
        $("#inputEstipulante").val("");
        $("#inputEstipulante").removeClass("input-validation-error");
    },

    LimpaEstipulanteCnpjCpf: function () {
        $("#inputCpfCnpj").removeClass("input-validation-error");
        $("#inputCpfCnpj").mask('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        $("#inputCpfCnpj").unmask();
        $("#inputCpfCnpj").val("");
    },

    LimpaMascaraEstipulanteCnpjCpf: function () {
        $("#inputCpfCnpj").mask('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        $("#inputCpfCnpj").unmask();
    },
};

window.ConsultaFunctions = { //Chamadas Ajax, Regras de negócio

    initialize: function () {

    },

    validaPeriodo: function () {
        var inputdataFinal = $("#inputPeriodoFinal").val().split("/");
        var inputdataInicial = $("#inputPeriodoInicial").val().split("/");
        var inputdataDeHoje = $("#dataDeHoje").val().split("/");
        var dataFinal = new Date(inputdataFinal[2], inputdataFinal[1], inputdataFinal[0]);
        var dataInicial = new Date(inputdataInicial[2], inputdataInicial[1], inputdataInicial[0]);
        var dataHoje = new Date(inputdataDeHoje[2], inputdataDeHoje[1], inputdataDeHoje[0]);
        var erroDataInicial = false;
        var erroDataFinal = false;
        if ($("#inputPeriodoInicial").val() != "") {
            if (dataInicial > dataHoje) {
                $("#inputPeriodoInicial").addClass("input-validation-error");
                erroDataInicial = true;
                $("#inputPeriodoInicial").addClass("erro-regra-dataInicial_maiorQueAtual");
                if (!verificaNotificacaoExiste("deve ser maior que a data atual")) {
                    notification("erro", "Data inicial não deve ser maior que a data atual.", "");
                }
            } else {
                $("#inputPeriodoInicial").removeClass("erro-regra-dataInicial_maiorQueAtual");
            }
        }
        if ($("#inputPeriodoFinal").val() != "") {
            if (dataInicial > dataFinal) {
                $("#inputPeriodoFinal").addClass("input-validation-error");
                erroDataFinal = true;
                $("#inputPeriodoInicial").addClass("input-validation-error");
                erroDataInicial = true;
                $("#inputPeriodoFinal").addClass("erro-regra-dataFinal_maiorQueInicial");
                if (!verificaNotificacaoExiste("menor que a data inicial")) {
                    notification("erro", "Data final não pode ser menor que a data inicial.", "");
                }
            } else {
                $("#inputPeriodoFinal").removeClass("erro-regra-dataFinal_maiorQueInicial");
            }
            var diferencaPeriodo = (dataFinal - dataInicial);
            var diferencaEmDias = (diferencaPeriodo / (1000 * 3600 * 24));
            if (diferencaEmDias > 30) {
                $("#inputPeriodoFinal").addClass("input-validation-error");
                erroDataFinal = true;
                $("#inputPeriodoInicial").addClass("input-validation-error");
                erroDataInicial = true;
                $("#inputPeriodoFinal").addClass("erro-regra-dataFinal_maior30dias");
                if (!verificaNotificacaoExiste("30 dias")) {
                    notification("erro", "Período máximo permitir para consulta: 30 dias.", "");
                }
            } else {
                $("#inputPeriodoFinal").removeClass("erro-regra-dataFinal_maior30dias");
            }
        }
        if (!erroDataInicial) {
            $("#inputPeriodoInicial").removeClass("input-validation-error");
        }
        if (!erroDataFinal) {
            $("#inputPeriodoFinal").removeClass("input-validation-error");
        }
    },
    
    pesquisarCorretor: function (busca) {
        var querystring = "?buscaRealizada=" + busca;
        $('#modalCorretorConsulta').removeData()
        $("#ifrmCorretorConsulta").contents().find("html").html("");
        $('#ifrmCorretorConsulta').attr('src', "/ObterListaCorretorConsulta" + querystring);
        $('#modalCorretorConsulta').modal('show');
    },

    closeIFramePesquisaCorretorConsulta: function (codigo, descricao, codigoClienteOperacional, estabelecimento, tipoCliente, tipoPessoa) {
        try {
            $('#modalCorretorConsulta').modal('hide');
            $('#modalCorretorConsulta').removeData();
            $('#ifrmCorretorConsulta').removeAttr('src');
            $("#CorretorConsultaPesquisa").val(descricao);
            $("#codigoCorretor").val(codigo);
            $("#codigoClienteCorretor").val(codigoClienteOperacional);
        } catch (e) {
            ExceptionHandling(e);
        }
    },

    pesquisarCorretorConsulta: function () {
        $("#CorretorConsultaPesquisa").removeClass("input-validation-error");
        try {
            if ($("#CorretorConsultaPesquisa").val() != null && $("#CorretorConsultaPesquisa").val() != "" && $("#CorretorConsultaPesquisa").val().length >= 2) {
                $.ajax({
                    type: "POST",
                    url: "/VerificarSessao",
                    async: true,
                    success: function () {
                        window.ConsultaFunctions.pesquisarCorretor($("#CorretorConsultaPesquisa").val());
                    },
                    error: function (result) {
                        closeModalWait();
                        VerificarAuth(result);
                        notification("erro", result.responseText, '');
                    }
                });
            } else {
                if ($("#CorretorConsultaPesquisa").val().length <= 1) {
                    notification("erro", "Digite no minimo 2 caracteres", "CorretorConsultaPesquisa");
                } else {
                    notification("erro", "Informe um Corretor", "CorretorConsultaPesquisa");
                }

            }
        } catch (e) {
            ExceptionHandling(e);
        }
    },

    pesquisarFiliais: function (CodigoCompanhia) {
        $.ajax({
            type: "GET",
            url: '/ObterListaFilial/' + CodigoCompanhia,
            async: true,
            success: window.ConsultaFunctions.successFiliais,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successFiliais: function (data) {        
        $("#selectFilial").empty();
        for (var i = 0; i < data.filiais.filial.length; i++) {
            $("#selectFilial").append('<option value="' + data.filiais.filial[i].codigoFilial + '"> ' + data.filiais.filial[i].nomeFilial + ' </option>');
        }
        $("#campoFilial").show();
    },

    retornaConsultaRequest: function () {
        var ConsultaRequest = /** @class */ (function () {
            function ConsultaRequest() {
                this.Id;
                this.CompanhiaCodigo;
                this.CorretorCodigo;
                this.CorretorNome;
                this.EstipulanteCpfCnpj;
                this.EstipulanteNome;
                this.FilialCodigo;
                this.PeriodoDataInicial;
                this.PeriodoDataFinal;
                this.StatusCodigo;
            }
            return ConsultaRequest;
        }());

        var ConsultaRequest = new ConsultaRequest();

        if ($("#selectCompanhia").val() != "") {
            ConsultaRequest.CompanhiaCodigo = $("#selectCompanhia").val();
            var filiaisSelecionadas = window.ConsultaEvents.carregaFiliaisSelecionadas();
            if (filiaisSelecionadas.length > 0) {
                ConsultaRequest.FilialCodigo = new Array();
                for (var i = 0; i < filiaisSelecionadas.length; i++) {
                    ConsultaRequest.FilialCodigo.push(filiaisSelecionadas[i]);
                }
            }
        }

        ConsultaRequest.StatusCodigo = $("#selectStatus").val();

        switch ($("#selectTipoConsulta").val()) {
            case "1":
                ConsultaRequest.CorretorNome = $("#CorretorConsultaPesquisa").val();
                ConsultaRequest.CorretorCodigo = $("#codigoClienteCorretor").val();
                if ($("#inputPeriodoInicial").val() != "") {
                    ConsultaRequest.PeriodoDataInicial = $("#inputPeriodoInicial").val();
                }
                if ($("#inputPeriodoFinal").val() != "") {
                    ConsultaRequest.PeriodoDataFinal = $("#inputPeriodoFinal").val();
                }
                break;
            case "2":
                ConsultaRequest.Id = $("#inputNumeroCotacao").val();
                break;
            case "3":
                ConsultaRequest.EstipulanteNome = $("#inputEstipulante").val();
                if ($("#inputPeriodoInicial").val() != "") {
                    ConsultaRequest.PeriodoDataInicial = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoInicial").val());
                }
                if ($("#inputPeriodoFinal").val() != "") {
                    ConsultaRequest.PeriodoDataFinal = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoFinal").val());
                }
                break;
            case "4":
                if ($("#inputPeriodoInicial").val() != "") {
                    ConsultaRequest.PeriodoDataInicial = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoInicial").val());
                }
                if ($("#inputPeriodoFinal").val() != "") {
                    ConsultaRequest.PeriodoDataFinal = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoFinal").val());
                }
                break;
            case "5":
                if ($("#inputPeriodoInicial").val() != "") {
                    ConsultaRequest.PeriodoDataInicial = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoInicial").val());
                }
                if ($("#inputPeriodoFinal").val() != "") {
                    ConsultaRequest.PeriodoDataFinal = window.ConsultaFunctions.converteDataParaApi($("#inputPeriodoFinal").val());
                }
                ConsultaRequest.EstipulanteCpfCnpj = $("#inputCpfCnpj").val();
                break;
        }

        return ConsultaRequest;
    },

    converteDataParaApi: function (stringData) {
        var dataArray = stringData.split("/");
        return dataArray[2] + "-" + dataArray[1] + "-" + dataArray[0];
    },

    pesquisarStatus: function () {
        $.ajax({
            type: "GET",
            url: '/obterlistastatus',
            async: true,
            success: window.ConsultaFunctions.successStatus,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successStatus: function (data) {
        data.unshift({
            "codigoDominio": "0",
            "descricaoDominio": "Todos (Ativos)"
        });
        $("#selectStatus").empty();
        var html = $("#StatusTemplate").render(data);
        $("#selectStatus").html(html);
    },

    validacoesConsulta: function () {
        if (($(".input-validation-error").length == 0) && ($(".erro-regra-dataFinal_maiorQueInicial").length == 0) && ($(".erro-regra-dataFinal_maior30dias").length == 0)) {
            var tipoConsulta = $("#selectTipoConsulta").val();
            if (tipoConsulta == "1") {
                if ($("#CorretorConsultaPesquisa").val() != "") {
                    $("#CorretorConsultaPesquisa").removeClass("input-validation-error");
                    return "true";
                } else {
                    notification("alerta", "Para realizar essa consulta, é preciso pesquisar um corretor.", "CorretorConsultaPesquisa");
                    $("#CorretorConsultaPesquisa").addClass("input-validation-error");
                    return "false";
                }
            } else if (tipoConsulta == "2") {
                if ($("#inputNumeroCotacao").val() != "") {
                    $("#inputNumeroCotacao").removeClass("input-validation-error");
                    return "true";
                } else {
                    notification("alerta", "Para realizar essa consulta, é preciso digitar um número de cotação.", "inputNumeroCotacao");
                    $("#inputNumeroCotacao").addClass("input-validation-error");
                    return "false";
                }
            } else if (tipoConsulta == "3") {
                if ($("#inputEstipulante").val() != "") {
                    $("#inputEstipulante").removeClass("input-validation-error");
                    return "true";
                } else {
                    notification("alerta", "Para realizar essa consulta, é preciso preencher o nome do estipulante.", "inputEstipulante");
                    $("#inputEstipulante").addClass("input-validation-error");
                    return "false";
                }
            } else if (tipoConsulta == "4") {
                if (($("#inputPeriodoInicial").val() == "") && ($("#inputPeriodoFinal").val() == "")) {
                    $("#inputPeriodoInicial").addClass("input-validation-error");
                    $("#inputPeriodoFinal").addClass("input-validation-error");
                    notification("alerta", "Para realizar essa consulta, é preciso preencher o período inicial e/ou final.", "");
                    return "false";
                } else {
                    $("#inputPeriodoInicial").removeClass("input-validation-error");
                    $("#inputPeriodoFinal").removeClass("input-validation-error");
                    return "true";
                }
            } else if (tipoConsulta == "5") {
                var tamanhoCnpjCpf = $("#inputCpfCnpj").val().length;
                if ((tamanhoCnpjCpf == 14) || (tamanhoCnpjCpf == 18)) {
                    return "true";
                } else {
                    notification("alerta", "Para realizar essa consulta, é preciso digitar número completo do CNPJ / CPF.", "inputCpfCnpj");
                    $("#inputCpfCnpj").addClass("input-validation-error");
                    return "false";
                }
            }
        } else {
            return "false";
        }
    },

    pesquisarCotacoes: function () {
        if ($("#selectTipoConsulta").val() != "") {
            var consultaValida = window.ConsultaFunctions.validacoesConsulta();
            if (consultaValida == "true") {
                var consultaRequest = window.ConsultaFunctions.retornaConsultaRequest();
                $.ajax({
                    type: "POST",
                    url: '/consulta/cotacoes',
                    async: true,
                    data: consultaRequest,
                    success: window.ConsultaFunctions.successCotacoes,
                    error: function (result) {
                        onFailed(result)
                    }
                });
            } else {
                if ($(".erro-regra-dataFinal_maiorQueInicial").length > 0) {
                    notification("erro", "Data final não pode ser menor que a data inicial.", "");
                }
                if ($(".erro-regra-dataFinal_maior30dias").length > 0) {
                    notification("erro", "Período máximo permitir para consulta: 30 dias.", "");
                }
                if ($(".erro-regra-dataInicial_maiorQueAtual").length > 0) {
                    notification("erro", "Data inicial não deve ser maior que a data atual.", "");
                }
            }
        } else {
            notification("alerta", "Para consultar, selecione um tipo de consulta.", "selectTipoConsulta");
        }
    },

    successCotacoes: function (data) {
        $("#campoTabelaConsulta").empty();
        var html = $("#TabelaCotacaoTemplate").render();
        $("#campoTabelaConsulta").html(html);
        if (data.length > 300) {
            notification("alerta", "Será apresentado os últimos 300 registros de acordo com o filtro informado.", "selectTipoConsulta");
            data = data.slice(0, 300);
        }
        var html = $("#CotacaoTemplate").render(data);
        $("#corpoTabelaConsulta").html(html);
        window.ConsultaUi.CarregaDataTables();
    },

    limparConsulta: function () {
        $("#codigoClienteCorretor").val("");
        $("#codigoCorretor").val("");
        $("#checkboxFilial").empty();
        $("#corpoTabelaConsulta").empty();
        $("#inputPeriodoInicial").val("").datepicker('update');
        $("#inputPeriodoFinal").val("").datepicker('update');
        $("#CorretorConsultaPesquisa").val("");
        window.ConsultaUi.LimpaEstipulanteCnpjCpf();
        window.ConsultaUi.LimpaNumeroCotacao();
        window.ConsultaUi.LimpaNomeEstipulante();
        $("#selectCompanhia").val("").change();
        $("#selectTipoConsulta").val("").change();
        $("#selectStatus").val(0).change();
        window.ConsultaUi.CarregaScriptsIniciais();
        window.ConsultaUi.VisibilidadeInicial();
        window.ConsultaEvents.selecionaTipoConsulta();
        window.ConsultaFunctions.removeClassesDeErro();
    },

    removeClassesDeErro: function () {
        $("#inputNumeroCotacao").removeClass("input-validation-error");
        $("#CorretorConsultaPesquisa").removeClass("input-validation-error");
        $("#inputPeriodoInicial").removeClass("input-validation-error");
        $("#inputPeriodoFinal").removeClass("input-validation-error");
        $("#inputEstipulante").removeClass("input-validation-error");
        $("#inputCpfCnpj").removeClass("input-validation-error");
        $("#inputPeriodoInicial").removeClass("erro-regra-dataInicial_maiorQueAtual");
        $("#inputPeriodoFinal").removeClass("erro-regra-dataFinal_maior30dias");
        $("#inputPeriodoFinal").removeClass("erro-regra-dataFinal_maiorQueInicial");
    }

};

window.ConsultaEvents = { //Eventos como Click, Blur, Change e etc.
    initialize: function () {
        window.ConsultaEvents.selecionaTipoConsulta();
    },

    verificaTipoConsulta: function () {
        var tipoConsulta = $("#selectTipoConsulta").val();
        if (tipoConsulta == "1") {
            var filiaisSelecionadas = window.ConsultaEvents.carregaFiliaisSelecionadas();
            if (filiaisSelecionadas.length == 0) {
                $("#selectTipoConsulta").val(0).change();
                $("#CorretorConsultaPesquisa").val("");
                notification("alerta", "Para utilizar a consulta do tipo Corretor, deve-se selecionar uma filial.", "selectTipoConsulta");
            } else if (filiaisSelecionadas.length > 1) {
                $("#selectTipoConsulta").val(0).change();
                $("#CorretorConsultaPesquisa").val("");
                notification("alerta", "Para utilizar a consulta do tipo Corretor, deve-se selecionar apenas uma filial.", "selectTipoConsulta");
            }
        }
    },

    verificaEnterPressionado: function (event) {
        if (event.keyCode === 13) {
            window.ConsultaFunctions.pesquisarCotacoes();
        }
    },

    selecionaTipoConsulta: function () {
        var tipoConsulta = $("#selectTipoConsulta").val();
        window.ConsultaFunctions.removeClassesDeErro();
        if (tipoConsulta == "1") {
            var filiaisSelecionadas = window.ConsultaEvents.carregaFiliaisSelecionadas();
            if (filiaisSelecionadas.length == 0) {
                $("#selectTipoConsulta").val(0).change();
                notification("alerta", "Para utilizar este tipo de Consulta, deve-se selecionar uma filial.", "selectTipoConsulta");
            } else if (filiaisSelecionadas.length > 1) {
                $("#selectTipoConsulta").val(0).change();
                notification("alerta", "Para utilizar este tipo de Consulta, deve-se selecionar apenas uma filial.", "selectTipoConsulta");
            } else {
                $("#campoCorretor").show();
                $("#campoEspacamentoCentral").show();
                $("#campoPeriodo").show();
                $("#campoEstipulanteNome").hide();
                $("#campoNumeroCotacao").hide();
                $("#campoEstipulanteCpfCnpj").hide();
            }
        } else if (tipoConsulta == "2") {
            $("#campoCorretor").hide();
            $("#campoPeriodo").hide();
            $("#campoEspacamentoCentral").hide();
            $("#campoEstipulanteNome").hide();
            $("#campoNumeroCotacao").show();
            $("#campoEstipulanteCpfCnpj").hide();
        } else if (tipoConsulta == "3") {
            $("#campoCorretor").hide();
            $("#campoPeriodo").show();
            $("#campoEspacamentoCentral").show();
            $("#campoEstipulanteNome").show();
            $("#campoNumeroCotacao").hide();
            $("#campoEstipulanteCpfCnpj").hide();
        } else if (tipoConsulta == "4") {
            $("#campoCorretor").hide();
            $("#campoPeriodo").show();
            $("#campoEspacamentoCentral").hide();
            $("#campoEstipulanteNome").hide();
            $("#campoNumeroCotacao").hide();
            $("#campoEstipulanteCpfCnpj").hide();
        } else if (tipoConsulta == "5") {
            $("#campoCorretor").hide();
            $("#campoEspacamentoCentral").show();
            $("#campoPeriodo").show();
            $("#campoEstipulanteNome").hide();
            $("#campoEstipulanteCpfCnpj").show();
            $("#campoNumeroCotacao").hide();
        } else {
            $("#campoCorretor").hide();
            $("#campoPeriodo").hide();
            $("#campoEspacamentoCentral").hide();
            $("#campoEstipulanteNome").hide();
            $("#campoNumeroCotacao").hide();
            $("#campoEstipulanteCpfCnpj").hide();
        }
    },

    selecionaCompanhia: function () {
        if ($("#selectCompanhia").val() == "") {
            $("#campoFilial").hide();
        } else {
            var companhia = parseInt($("#selectCompanhia").val());
            window.ConsultaFunctions.pesquisarFiliais(companhia);
        }
    },

    carregaFiliaisSelecionadas: function () {
        var filiais = [];
        if ($("#selectFilial").select2("val") != undefined) {
            $.each($("#selectFilial").select2("val"), function (index, value) {
                filiais.push(value);
            });
        }
        return filiais;
    },
};

$(function () {
    window.ConsultaUi.initialize();
    window.ConsultaEvents.initialize();
});