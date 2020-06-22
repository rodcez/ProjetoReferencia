//Inicialização de objetos
var dataMaximoVigenciaDE = new Date();
var dataMinimoVigenciaDE = new Date();
var dataVigenciaFuturaDE = new Date();
var dataVigenciaRetroativaDE = new Date();
var comissoes = {};
var statusInformacoes = {};

//Classes

window.DadosEmissaoUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {
        window.DadosEmissaoUi.scriptData();
        window.DadosEmissaoUi.popularDadosIniciais();
        window.DadosEmissaoUi.validaExibicaoDadosDaConta();
        window.DadosEmissaoUi.popularRecuperacaoAgenciamento();
        window.DadosEmissaoFunctions.obterFormasPagamento(function () {
            window.DadosEmissaoUi.popularDadosCobranca();
            window.DadosEmissaoUi.populaDadosBancariosFavorecidos();
        });
        window.DadosEmissaoUi.verificarVisibilidadeBotoes();
    },

    popularDadosIniciais: function () {
        if (cotacao.DataReferencia != null) {
            var dataReferencia = new Date(cotacao.DataReferencia)
            dataReferencia.setDate(dataReferencia.getDate() + 1);
            $('#dataReferenciaDE').text(moment(dataReferencia).format('DD/MM/YYYY'));
        }

        if (cotacao.DataInicioVigencia != null) {
            var dataInicioVigencia = new Date(cotacao.DataInicioVigencia)
            if (dataInicioVigencia.getFullYear() > 0) {
                $('#dataInicioVigenciaDE').val(moment(dataInicioVigencia).format('DD/MM/YYYY'));
                $('#dataInicioVigenciaDE').change();
            }
        }

        if (cotacao.PropostaEmissao.TextoPadrao != null) {
            $('#textoPadraoDE').val(cotacao.PropostaEmissao.TextoPadrao);
        }
    },

    popularFimVigencia: function (date) {
        var dataFimVigencia = window.DadosEmissaoFunctions.dataStringToDate(date);
        dataFimVigencia.setFullYear(dataFimVigencia.getFullYear() + 1);

        $('#dataFimVigenciaDE').val(moment(dataFimVigencia).format('DD/MM/YYYY'));
    },

    scriptData: function () {
        $('#dataInicioVigenciaDE').mask('99/99/9999');
        $('#dataInicioVigenciaDE').datepicker({
            format: 'dd/mm/yyyy',
            language: "pt-BR",
            autoclose: true,
            beforeShowDay: window.DadosEmissaoFunctions.regraCalendario
        });
    },

    popularRecuperacaoAgenciamento: function () {
        $("#recuperacaoAgenciamento").empty();
        $("#recuperacaoAgenciamento").append('<option value=""></option>');
        $("#recuperacaoAgenciamento").append('<option value="' + 3 + '">3 meses</option>');
        $("#recuperacaoAgenciamento").append('<option value="' + 6 + '">6 meses</option>');
        $("#recuperacaoAgenciamento").append('<option value="' + 9 + '">9 meses</option>');
        $("#recuperacaoAgenciamento").append('<option selected value="' + 12 + '">12 meses</option>');
    },

    popularformaPagamento: function (formas) {
        $("#formaPagamento").empty();
        $("#formaPagamento").append('<option value=""></option>');

        for (var i = 0; i < formas.length; i++) {
            var f = formas[i];
            $("#formaPagamento").append(`<option value="${f.tipoFormaPagamento}" 
                                                 codigoFormaPagamento="${f.codigoFormaPagamento}" 
                                                 codigoReferenciaMonetaria=${f.codigoReferenciaMonetaria} 
                                                 quantidadeParcela=${f.quantidadeParcela}>${f.tipoFormaPagamento} - ${f.nomeFormaPagamento}</option>`);
        }
    },

    validaExibicaoDadosDaConta: function (option) {
        if (option == "DC") {
            $(".dadosConta").show();
        }
        else {
            $(".dadosConta").hide();
        }
    },

    verificarVisibilidadeBotoes: function () {
        //8-PROPOSTA ENVIADA
        //9-PROPOSTA EM PROCESSAMENTO
        //10-APOLICE EMITIDA
        //11-PROPOSTA NAO EFETIVADA
        if (cotacao.Status.Codigo !== 8 &&
            cotacao.Status.Codigo !== 9 &&
            cotacao.Status.Codigo !== 10 &&
            cotacao.Status.Codigo !== 11) {
            $('#btnEnviarApolice').show();
            $('#btnSalvarEmissao').show();
            $('#btnReprocessarApolice').hide();
            $('#btnvisualizarErro').hide();
        }
        else if (cotacao.Status.Codigo === 8 ||
            cotacao.Status.Codigo === 9 ||
            cotacao.Status.Codigo === 10) {
            $('#btnEnviarApolice').hide();
            $('#btnSalvarEmissao').hide();
            $('#btnReprocessarApolice').hide();
            $('#btnvisualizarErro').hide();
        }
        else if (cotacao.Status.Codigo === 11) {
            $('#btnEnviarApolice').hide();
            $('#btnSalvarEmissao').show();
            $('#btnReprocessarApolice').show();
            $('#btnvisualizarErro').show();
        }
    },

    habilitarAgenciamento: function (percAgenciamento) {

        if (percAgenciamento == 0) {
            $("#divRecuperacaoAgenciamento").hide();
        }
    },

    popularDadosCobranca: function () {
        $("#formaPagamento").val(cotacao.PropostaEmissao.FormaPagamento.CodigoTipoMeioCobranca).change();

        if (cotacao.PropostaEmissao.FormaPagamento.IndicadorUtilizarPremioMinimoFatura)
            $("#SimPremioMinimoFatura").prop('checked', 'checked')
        else
            $("#NaoPremioMinimoFatura").prop('checked', 'checked')

        var titularConta = cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.NomeTitular ? cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.NomeTitular : cotacao.Itens[0].Estipulante.Nome;
        var cpfCnpjtitularConta = cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.CpfCnpjTitular ? cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.CpfCnpjTitular : cotacao.Itens[0].Estipulante.NumeroCpfCnpj;
        var tipoPessoa = cpfCnpjtitularConta.length == 11 ? "F" : "J";
        $('#rdTitularConta').val(titularConta);
        $('#txtCPFCNPJTitular').val(cpfCnpjtitularConta);
        $('#cboBancoDebito').val(cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.NumeroBanco);
        $('#txtAgencia').val(cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.NumeroAgencia);
        $('#txtDigito').val(cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.DigitoAgencia);
        $('#txtConta').val(cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.NumeroContaCorrente);
        $('#txtDigitoConta').val(cotacao.PropostaEmissao.FormaPagamento.DadosBancarios.DigitoContaCorrente);
        $('#txtTipoPessoa').val(tipoPessoa);
    },

    populaDadosBancariosFavorecidos: function () {
        if (cotacao.Comissionamentos.some(function (f) { return f.CodigoTipoComissao == "PL" })) {
            var dadosProlabore = cotacao.Comissionamentos.filter(function (f) { return f.CodigoTipoComissao == "PL" })[0];

            $("#selectFavorecidoProLabore").val(dadosProlabore.CodigoCliente).change();

            $('#rdTitularContaPL').val(dadosProlabore.Nome);
            $('#txtCPFCNPJTitularPL').val(dadosProlabore.CpfCnpjTitular);
            $('#cboBancoDebitoPL').val(dadosProlabore.DadosBancarios.NumeroBanco);
            $('#txtAgenciaPL').val(dadosProlabore.DadosBancarios.NumeroAgencia);
            $('#txtDigitoPL').val(dadosProlabore.DadosBancarios.DigitoAgencia);
            $('#txtContaPL').val(dadosProlabore.DadosBancarios.NumeroContaCorrente);
            $('#txtDigitoContaPL').val(dadosProlabore.DadosBancarios.DigitoContaCorrente);
            $('#txtTipoPessoaPL').val(dadosProlabore.TipoPessoa);
        }
        if (cotacao.Comissionamentos.some(function (f) { return f.CodigoTipoComissao == "AG" })) {
            var dadosAgenciamento = cotacao.Comissionamentos.filter(function (f) { return f.CodigoTipoComissao == "AG" })[0];

            $("#selectFavorecidoAgenciamento").val(dadosAgenciamento.CodigoCliente).change();

            $('#rdTitularContaAG').val(dadosAgenciamento.Nome);
            $('#txtCPFCNPJTitularAG').val(dadosAgenciamento.Nome);
            $('#cboBancoDebitoAG').val(dadosAgenciamento.DadosBancarios.NumeroBanco);
            $('#txtAgenciaAG').val(dadosAgenciamento.DadosBancarios.NumeroAgencia);
            $('#txtDigitoAG').val(dadosAgenciamento.DadosBancarios.DigitoAgencia);
            $('#txtContaAG').val(dadosAgenciamento.DadosBancarios.NumeroContaCorrente);
            $('#txtDigitoContaAG').val(dadosAgenciamento.DadosBancarios.DigitoContaCorrente);
            $('#txtTipoPessoaAG').val(dadosAgenciamento.TipoPessoa);

        }
    },
};

window.DadosEmissaoFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        window.DadosEmissaoFunctions.aplicarRegrasVigencia();
        window.DadosEmissaoFunctions.obterPorcentagensComissao();
        callback && callback();
    },

    aplicarRegrasVigencia: function () {
        var dadosVigencia = ProdutoComercial.prazoProdutoComercial;

        dataMaximoVigenciaDE = window.DadosEmissaoFunctions.obterDataComRegraVigencia(dadosVigencia.tipoTempoMaximoVigencia, new Date(), dadosVigencia.quantidadeTempoMaximoVigencia);
        dataMinimoVigenciaDE = window.DadosEmissaoFunctions.obterDataComRegraVigencia(dadosVigencia.tipoTempoMinimoVigencia, new Date(), -dadosVigencia.quantidadeTempoMinimoVigencia);

        dataVigenciaFuturaDE = window.DadosEmissaoFunctions.obterDataComRegraVigencia(dadosVigencia.tipoTempoVigenciaFuturo, new Date(), dadosVigencia.quantidadeTempoVigenciaFuturo);
        dataVigenciaRetroativaDE = window.DadosEmissaoFunctions.obterDataComRegraVigencia(dadosVigencia.tipoTempoVigenciaRetroativo, new Date(), -dadosVigencia.quantidadeTempoVigenciaRetroativo);
    },

    salvarDadosEmissao: function (callback) {

        $.ajax({
            url: '/cotacao/SalvarDadosEmissao',
            type: 'post',
            contentType: "application/json",
            success: function () {
                closeModalWait();
                window.CotacaoFunctions.atualizarObjetoCotacao();
                notification("sucesso", "Emissão salva com sucesso!", "");
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                DataInicioVigencia: window.DadosEmissaoFunctions.dataStringToDate($('#dataInicioVigenciaDE').val()),
                DataFimVigencia: window.DadosEmissaoFunctions.dataStringToDate($('#dataFimVigenciaDE').val()),
                TextoPadrao: $('#textoPadraoDE').val()
            })
        })
    },

    salvarDadosCobranca: function (callback) {
        $.ajax({
            url: '/emissao/SalvarDadosCobranca',
            type: 'post',
            contentType: "application/json",
            success: function () {
                closeModalWait();
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                FormaPagamento: {
                    Codigo: $("#formaPagamento > option:selected").attr("codigoformapagamento"),
                    Descricao: $("#formaPagamento > option:selected").text(),
                    CodigoReferenciaMonetaria: $("#formaPagamento > option:selected").attr("codigoreferenciamonetaria"),
                    QuantidadeParcelas: parseInt($("#formaPagamento > option:selected").attr("quantidadeparcela")), //ProdutoComercial.QuantidadeParcela
                    CodigoTipoMeioCobranca: $("#formaPagamento > option:selected").val(),
                    IndicadorUtilizarPremioMinimoFatura: $("#selectPremioMinimoFatura > div > input:checked").val() == "true",
                    QuantidadeMesesRecuperacaoAgenciamento: parseInt($("#recuperacaoAgenciamento").val()),
                    DadosBancarios: {
                        NumeroBanco: $("#cboBancoDebito").val(),
                        NumeroAgencia: $("#txtAgencia").val(),
                        DigitoAgencia: $("#txtDigito").val(),
                        NumeroContaCorrente: $("#txtConta").val(),
                        DigitoContaCorrente: $("#txtDigitoConta").val(),
                        IndicadorOutroTitular: "N",//verificar onde obter esse valor
                        NomeTitular: $("#rdTitularConta").val(),
                        CpfCnpjTitular: $("#txtCPFCNPJTitular").val(),
                        IndicadorDispensaAutorizacaoDebitoConta: false
                    }
                }
            })
        });
    },

    regraCalendario: function (date) {
        return date.getDate() == 1 && window.DadosEmissaoFunctions.validarRegraVigencia(date);
    },

    validarRegraVigencia: function (date) {

        var validacaoRegraMinimoMaximoVigencia = date <= dataMaximoVigenciaDE && date >= dataMinimoVigenciaDE;
        var validacaoRegraVigencia = date <= dataVigenciaFuturaDE && date >= dataVigenciaRetroativaDE;

        return validacaoRegraVigencia && validacaoRegraMinimoMaximoVigencia;
    },

    obterDataComRegraVigencia: function (tipoTempo, dataAModificar, quantidadeTempo) {

        switch (tipoTempo) {

            case 1:
                dataAModificar.setDate(dataAModificar.getDate() + quantidadeTempo);
                break;
            case 2:
                dataAModificar.setMonth(dataAModificar.getMonth() + quantidadeTempo);
                break;
            case 3:
                dataAModificar.setFullYear(dataAModificar.getFullYear() + quantidadeTempo);
                break;
        }

        return dataAModificar;
    },

    dataStringToDate: function (date) {
        var dataSeparada = date.split("/");
        return new Date(dataSeparada[2], dataSeparada[1] - 1, dataSeparada[0]);
    },

    validarDataInicioVigencia: function (date) {

        var dataSeparada = date.split("/");
        var dataInicioVigencia = new Date(dataSeparada[2], dataSeparada[1] - 1, dataSeparada[0]);

        $("#dataInicioVigenciaDE").removeClass("input-validation-error");
        if (dataInicioVigencia == "Invalid Date") {
            if ($(".alert-notificationError").length == 0)
                notification("erro", "Data Inválida.");
            $("#dataInicioVigenciaDE").addClass("input-validation-error");
            return false;
        }

        if (dataInicioVigencia.getDate() != 1) {
            if (!window.DadosEmissaoFunctions.jaTemOErro("primeiro dia"))
                notification("erro", "Só é permitido ínicio de vigência com a data do primeiro dia do mês.");
            $("#dataInicioVigenciaDE").addClass("input-validation-error");
            return false;
        }

        if (dataInicioVigencia > dataMaximoVigenciaDE || dataInicioVigencia > dataVigenciaFuturaDE) {
            if (!window.DadosEmissaoFunctions.jaTemOErro("posterior"))
                notification("erro", "A data de início de vigência não pode ser posterior à " + moment(dataVigenciaFuturaDE).format('DD/MM/YYYY'));
            $("#dataInicioVigenciaDE").addClass("input-validation-error");
            return false;
        }

        if (dataInicioVigencia < dataMinimoVigenciaDE || dataInicioVigencia < dataVigenciaRetroativaDE) {
            if (!window.DadosEmissaoFunctions.jaTemOErro("inferior"))
                notification("erro", "A data de início de vigência não pode ser inferior à " + moment(dataVigenciaRetroativaDE).format('DD/MM/YYYY'));
            $("#dataInicioVigenciaDE").addClass("input-validation-error");
            return false;
        }


        return true;
    },

    jaTemOErro: function (erro) {
        //O componente de data executa várias vezes, a intenção é fazer aparecer apenas um erro da mensagem, por isso a solução paliativa abaixo.
        for (var i = 0; i < $(".alert-notificationError span").length; i++) {
            if ($(".alert-notificationError span")[i].innerHTML.indexOf(erro) >= 0)
                return true;
        }

        return false;
    },

    validarDadosEmissao: function () {
        var validacao = true;

        if (!window.DadosEmissaoFunctions.validarDataInicioVigencia($("#dataInicioVigenciaDE").val()))
            validacao = false;

        return validacao;
    },

    validarDadosCobranca: function () {

        // Pagamento
        let formaPgto = $("#formaPagamento option:selected");

        if (!formaPgto.val()) {
            notification("erro", "Campo pagamento de preenchimento obrigatório.");
            return false;
        }

        //Recuperação de Agenciamento
        let recAgenciamento = $("#recuperacaoAgenciamento option:selected");

        if (!recAgenciamento.val()) {
            notification("erro", "Campo Recuperação de Agenciamento é de preenchimento obrigatório.");
            return false;
        }
        // Dados Bancários
        if (formaPgto.val() === "DC" && !$('#txtConta').val()) {
            notification("erro", "Dados bancários para débito em conta é de preenchimento obrigatório.");
            return false;
        }

        return true;
    },

    obterUrlPopupDadosConta: function (callback) {
        $.ajax({
            url: '/cotacao/ContaCorrenteModal',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                $("#iframeDadosCobranca").attr('src', data.url);
                $("#modalDadosCobranca").modal('show');
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                urlRetorno: "",
                idSessao: "",
                UsuarioSistema: "",
                dialog: "",
                parameter: "",
                id: 0,
                CpfCnpjTitular: "",
                CpfCnpjSegurado: "",
                NumeroBanco: "",
                NumeroAgencia: "",
                NumeroAgenciaDV: "",
                NumeroConta: "",
                NumeroContaDV: "",
                NomeSegurado: "",
                NomeSeguradoTitular: "",
                IndicadorCorrentistaSegurado: "",
                Status: "",
                TipoPessoaTitularConta: "",
                TipoPessoaSegurado: "",
                CodigoCompanhia: $("#Filial_CodigoCompanhia").val(),
                ClienteCodigo: null,
                ClienteOperacionalCodigo: null
            })
        })
    },

    obterFormasPagamento: function (callback) {
        $.ajax({
            url: '/ObterFormasPagamento',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosEmissaoUi.popularformaPagamento(data);
                callback && callback();
            },
            error: function (data) {
                console.log("erro ao obter formas de pagamento");
            },
            data: JSON.stringify({
                CodigoProdutoComercial: 930211,
                DataReferencia: cotacao.DataReferencia
            })
        })
    },

    enviarApolice: function () {
        window.DadosEmissaoFunctions.enviarApoliceSalvarDadosEmissaoECobranca();

        $.ajax({
            url: '/emissao/EnviarApolice',
            type: 'post',
            contentType: "application/json",
            success: function () {
                $('#btnEnviarApolice').prop('disabled', true);
                $('#btnSalvarEmissao').prop('disabled', true);
                $('#btnReprocessarApolice').hide();
                $('#btnvisualizarErro').hide();
                notification("sucesso", "Apólice enviada com sucesso!", "");

                window.DadosEmissaoFunctions.obterStatusCotacao();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id
            })
        });
    },

    obterStatusCotacao: function () {
        $.ajax({
            url: '/cotacao/ObterStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                if (data[0].codigoStatus == 9) {
                    setTimeout(function () {
                        window.DadosEmissaoFunctions.obterStatusCotacao();
                    }, 1000);
                } else {
                    cotacao.Status.Codigo = data[0].codigoStatus;
                    cotacao.Status.Descricao = data[0].descricaoStatus;
                    window.DadosEmissaoFunctions.alterarStatusCotacao();
                }
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                CodigoStatus: null,
                UltimoStatus: true
            })
        });
    },

    reprocessarApolice: function () {
        window.DadosEmissaoFunctions.enviarApoliceSalvarDadosEmissaoECobranca();

        $.ajax({
            url: '/emissao/EnviarApolice',
            type: 'post',
            contentType: "application/json",
            success: function () {

                //window.CotacaoFunctions.atualizarObjetoCotacao();
                notification("sucesso", " Proposta enviada para o reprocessamento com sucesso.", "");
                window.DadosEmissaoUi.verificarVisibilidadeBotoes();
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id
            })
        });
    },

    enviarApoliceSalvarDadosEmissaoECobranca: function () {

        $.ajax({
            url: '/emissao/SalvarDadosEmissao',
            type: 'post',
            contentType: "application/json",
            success: function () {
                window.DadosEmissaoFunctions.enviarApoliceSalvarDadosCobranca();
                window.CotacaoFunctions.atualizarObjetoCotacao();
                //notification("sucesso", "Emissão salva com sucesso!", "");
                //callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                DataInicioVigencia: window.DadosEmissaoFunctions.dataStringToDate($('#dataInicioVigenciaDE').val()),
                DataFimVigencia: window.DadosEmissaoFunctions.dataStringToDate($('#dataFimVigenciaDE').val()),
                TextoPadrao: $('#textoPadraoDE').val()
            })
        });
    },

    enviarApoliceSalvarDadosCobranca: function () {
        $.ajax({
            url: '/emissao/SalvarDadosCobranca',
            type: 'post',
            contentType: "application/json",
            success: function () {
                //notification("sucesso", "Dados de cobrança salva com sucesso!", "");                
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                FormaPagamento: {
                    Codigo: $("#formaPagamento > option:selected").attr("codigoformapagamento"),
                    Descricao: $("#formaPagamento > option:selected").text(),
                    CodigoReferenciaMonetaria: $("#formaPagamento > option:selected").attr("codigoreferenciamonetaria"),
                    QuantidadeParcelas: parseInt($("#formaPagamento > option:selected").attr("quantidadeparcela")),
                    CodigoTipoMeioCobranca: $("#formaPagamento > option:selected").val(),
                    IndicadorUtilizarPremioMinimoFatura: $("#selectPremioMinimoFatura > div > input:checked").val() == "true",
                    QuantidadeMesesRecuperacaoAgenciamento: parseInt($("#recuperacaoAgenciamento").val())
                }
            })
        });
    },

    obterPorcentagensComissao: function (callback) {

        $.ajax({
            url: "/calculo/ObterPorcentagemComissionamento",
            type: "Post",
            contentType: "application/json",
            success: function (data) {
                comissoes = data.value;
                window.DadosEmissaoUi.habilitarAgenciamento(comissoes.percentualTotalAgenciamento);
                callback && callback();
            },
            error: function (data) {
                var errors = JSON.parse(data.messages);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id
            })
        }).done(function () {

            window.FavorecidosComissionamentoFunctions.popularFavorecidosComissionamentos(comissoes);
        });
    },

    exportarXML: function (callback) {
        $.ajax({
            url: '/emissao/ExportarXML',
            type: 'POST',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                if (data.fileContents != null && data.fileContents.length > 0) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "XML não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                UsuarioSistema: "string"
            })
        });
    },

    saveFile: function (blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            function onSetTimeOut() {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
            setTimeout(onSetTimeOut(), 0)
        }
    },

    converBase64toBlob: function (content, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = window.atob(content);
        var byteArrays = [
        ];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    },

    validarTodasSessoes: function (callback) {

        var validado = true;

        validado = window.DadosEstipulanteFunctions.validarDadosEstipulante();
        // validado = window.FavorecidosComissionamentoFunctions.validarFavorecidosComissionamento();
        validado = window.DadosEmissaoFunctions.validarDadosEmissao();
        validado = window.DadosEmissaoFunctions.validarDadosCobranca();

        validado && callback && callback();
    },

    obterMensagemDeErroSubmit: function () {
        $.ajax({
            url: '/cotacao/ObterStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                statusInformacoes = data[0];
                $('#txtMensagemErro').val(statusInformacoes.descricaoMotivoStatus);
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                CodigoStatus: 11,
                UltimoStatus: true
            })
        })
    },

    alterarStatusCotacao: function () {
        $('#statusCotacao').text("STATUS: " + cotacao.Status.Descricao);
    }
};

window.DadosEmissaoEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onChangeDataInicioVigencia: function (data) {
        if (window.DadosEmissaoFunctions.validarDataInicioVigencia($(data).val())) {
            window.DadosEmissaoUi.popularFimVigencia($(data).val());
        }
    },

    onClickSalvarApolice: function () {
        window.DadosEmissaoFunctions.validarTodasSessoes(function () {
            window.DadosEmissaoFunctions.salvarDadosEmissao();
            window.DadosEmissaoFunctions.salvarDadosCobranca();
            window.FavorecidosComissionamentoFunctions.SalvarFavorecidosComissionamento();
        });
    },

    onClickEnviarApolice: function () {
        if (confirm("Deseja enviar a proposta? Sim/Não")) {
            openModalWait();
            $('#btnEnviarApolice').prop('disabled', true);
            $('#btnSalvarEmissao').prop('disabled', true);

            if (window.DadosEmissaoFunctions.validarDadosEmissao() && window.DadosEstipulanteFunctions.validarDadosEstipulante() && window.DadosEmissaoFunctions.validarDadosCobranca()) {
                window.DadosEmissaoFunctions.enviarApolice();
            }
            else {
                $('#btnEnviarApolice').prop('disabled', false);
                $('#btnSalvarEmissao').prop('disabled', false);
                closeModalWait();
            }
        }
    },

    onClickReprocessarApolice: function () {
        if (confirm("Deseja reprocessar a proposta? Sim/Não")) {
            if (window.DadosEmissaoFunctions.validarDadosEmissao() && window.DadosEstipulanteFunctions.validarDadosEstipulante() && window.DadosEmissaoFunctions.validarDadosCobranca()) {
                window.DadosEmissaoFunctions.reprocessarApolice();
            }
        }
    },

    onClickExportarXml: function () {
        //alert("exportar...");
        openModalWait();
        window.DadosEmissaoFunctions.exportarXML();
    },

    onClickVisualizarErro: function () {
        $('#modalMensagemErro').modal('show');
        window.DadosEmissaoFunctions.obterMensagemDeErroSubmit();
    },

    onClickDadosConta: function () {
        $("#iframeRetornoDadosCobranca").attr('src', 'ContaCorrenteRetorno/?popup=dadosCobranca&tipoCadastro=1&meioRecebimento=DC');
        $('#iframeRetornoDadosCobranca').attr("tipoPopup", "DC");
        $('#modalDadosCobranca').removeData();
        $("#modalDadosCobranca").modal('show');
    },

    onClickDadosContaProlabore: function () {
        $("#iframeRetornoDadosCobranca").attr('src', 'ContaCorrenteRetorno/?popup=prolabore&tipoCadastro=2&meioRecebimento=CR');
        $('#iframeRetornoDadosCobranca').attr("tipoPopup", "prolabore");
        $('#modalDadosCobranca').removeData();
        $("#modalDadosCobranca").modal('show');
    },

    onClickDadosContaAgenciamento: function () {
        $("#iframeRetornoDadosCobranca").attr('src', 'ContaCorrenteRetorno/?popup=agenciamento&tipoCadastro=2&meioRecebimento=CR');
        $('#iframeRetornoDadosCobranca').attr("tipoPopup", "agenciamento");
        $('#modalDadosCobranca').removeData();
        $("#modalDadosCobranca").modal('show');
    },

    onChangeFormaPagamento: function (option) {
        window.DadosEmissaoUi.validaExibicaoDadosDaConta($(option).val());
    },
}

$(document).ready(function () {

});