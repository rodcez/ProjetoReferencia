$(function () {
    window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
    window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();

});

window.ControleDeAcessoCotacaoFunctions = {
    //#region metodos genericos
    ValidaExibicaoDasAbas: function (callback) {
        $("#tab_analiseRisco").hide();
        $("#tab_orcamento").hide();
        $("#tab_aceitacao").hide();
        $("#tab_emissao").hide();
        if (cotacao.Status) {
            if (cotacao.Status.Codigo == 2) {
                $("#tab_analiseRisco").show();
                if (cotacao.CenariosCotacao[0].versoesCalculo.some(function (v) { return v.indicadorVersaoCalculada })) {
                    $("#tab_orcamento").show();
                }
            }
            else if (cotacao.Status.Codigo == 3) {
                $("#tab_analiseRisco").show();
                $("#tab_orcamento").show();
            }
            else if (cotacao.Status.Codigo == 4) {
                $("#tab_analiseRisco").show();
                $("#tab_orcamento").show();
                $("#tab_aceitacao").show();
            }
            else if (cotacao.Status.Codigo == 5 ||
                cotacao.Status.Codigo == 6 ||
                cotacao.Status.Codigo == 16 ||
                cotacao.Status.Codigo == 17 ||
                cotacao.Status.Codigo == 18
            ) {
                $("#tab_analiseRisco").show();
                $("#tab_orcamento").show();
                $("#tab_aceitacao").show();
            }
            else if (cotacao.Status.Codigo == 12 ||
                cotacao.Status.Codigo == 14 ||
                cotacao.Status.Codigo == 15) {
                $("#tab_analiseRisco").show();
                $("#tab_orcamento").show();
            }
            else if (cotacao.Status.Codigo == 7 ||
                cotacao.Status.Codigo == 8 ||
                cotacao.Status.Codigo == 9 ||
                cotacao.Status.Codigo == 10 ||
                cotacao.Status.Codigo == 11) {
                $("#tab_analiseRisco").show();
                $("#tab_orcamento").show();
                $("#tab_aceitacao").show();
                $("#tab_emissao").show();
            }
        }
        callback && callback();
    },

    ValidaExibicaoDasSessoes: function (callback) {
        if ("tipoUsuario" == "Emissor") {//TODO: obter o tipo do usuario
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeCotacao();
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeAnaliseRisco();
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeOrcamento();
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeAceitacao();
        }
        else {
            if (cotacao.Status) {
                window.ControleDeAcessoCotacaoFunctions.validaExibicaoDasSessoesAbaCotacao();
                window.ControleDeAcessoCotacaoFunctions.validaExibicaoDasSessoesAbaAnaliseRisco();
                window.ControleDeAcessoCotacaoFunctions.validaExibicaoDasSessoesAbaOrcamento();
                window.ControleDeAcessoCotacaoFunctions.validaExibicaoDasSessoesAbaAceitacao();
            }
        }

    },

    DesabilitarTodosOsCamposDaSessao: function (idSessao, callback) {
        $(idSessao + " select").attr('disabled', 'disabled');
        $(idSessao + " input").attr('disabled', 'disabled');
        $(idSessao + " textarea").attr('disabled', 'disabled');
    },

    HabilitarTodosOsCamposDaSessao: function (idSessao, callback) {
        $(idSessao + " select").removeAttr('disabled');
        $(idSessao + " input").removeAttr('disabled');
        $(idSessao + " textarea").removeAttr('disabled');
    },
    //#endregion 

    //#region validações das sessões
    validaExibicaoDasSessoesAbaCotacao: function () {
        if (cotacao.Status.Codigo == 2) {
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-1");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-2");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-3");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-5");
            $("#btnSolicitar").attr('disabled', 'disabled');
            $("#PesquisaCorretor").attr('disabled', 'disabled');
            $("#EstipulanteCPFCNPJ").attr('disabled', 'disabled');
            $("#addCenario").attr('disabled', 'disabled');
            $("#justificativaFacultativa").attr('disabled', 'disabled');
            $("#btnCorretagem").removeAttr('disabled');
            $("#pesquisaCorretorCorretagembtn").attr('disabled', 'disabled');
            $("#modal-body-corretagem input").attr('disabled', 'disabled');
        }
        else if (cotacao.Status.Codigo > 2) {

            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeCotacao();
        }

    },

    validaExibicaoDasSessoesAbaAnaliseRisco: function () {
        if (cotacao.CenariosCotacao[0].versoesCalculo.some(function (v) { return v.indicadorVersaoCalculada })) {
            $("#analiseRisco #step-2").show();
        } else {
            $("#analiseRisco #step-2").hide();
        }
        if (cotacao.Status.Codigo >= 3 && cotacao.Status.Codigo != 15) {
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#analiseRisco #step-1");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#analiseRisco #step-2");
            $("#selectVsCalculo").removeAttr('disabled');
            $("#btnExportarOrcamento").removeAttr('disabled');
            $("#selectVsCalculoRel").removeAttr('disabled');
            $("#selecPlanoRel").removeAttr('disabled');
            $("#exportarResumoTecnico").removeAttr('disabled');
            $("#exportarFreecover").removeAttr('disabled');
            $("#exportarDistribuicaoCapital").removeAttr('disabled');
            $("#exportarProjecaoFaturamento").removeAttr('disabled');
        }
        else if (cotacao.Status.Codigo == 15) {
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#analiseRisco #step-1");
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#analiseRisco #step-2");
            $("#CapitalMedioCenario").attr('disabled', 'disabled');
            $("#TotalVidasVersao").attr('disabled', 'disabled');

        }
    },

    validaExibicaoDasSessoesAbaOrcamento: function () {
        if (cotacao.Status.Codigo == 2) {
            $("#orcamento #step-4").hide();
        }
        else if (cotacao.Status.Codigo == 3) {
            $("#orcamento #step-4").show();
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-1");
            $("#selectVersaoDadosOrcamento").removeAttr('disabled');
        }
        else if (cotacao.Status.Codigo > 3 && cotacao.Status.Codigo != 15) {
            $("#orcamento #step-4").show();
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-1");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-4");
            $("#txtMotivoOrcamentoAceitacao").attr('disabled', 'disabled');
            $("#selectVersaoDadosOrcamento").removeAttr('disabled');
        }
        else if (cotacao.Status.Codigo == 15) {
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#orcamento #step-1");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-4");
            $("#btnExportarOrcamento").removeAttr('disabled');
            $("#btnOrcamentoEnviado").removeAttr('disabled');
            $("#txtMotivoOrcamentoAceitacao").attr('disabled', 'disabled');
            $("#selectVersaoDadosOrcamento").removeAttr('disabled');
        }
    },

    validaExibicaoDasSessoesAbaAceitacao: function () {
        if (cotacao.Status.Codigo == 4) {
            $("#aceitacao #step-4").hide();
        }
        else if (cotacao.Status.Codigo == 5) {
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-1");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-2");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-3");
            $('input[name$="rbComissionamento"]').attr('disabled', 'disabled');
            $("#selectPlanoCenComiss").removeAttr('disabled');
            $("#btnExportarCartaOferta").removeAttr('disabled');
            $("#selectCenariosDadosCartaOferta").removeAttr('disabled');
            $("#selectVersaoDadosCartaOferta").removeAttr('disabled');
            $("#aceitacao #step-4").show();
        }
        else if (cotacao.Status.Codigo > 5 && cotacao.Status.Codigo < 18) {
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeAceitacao();
        }
        else if (cotacao.Status.Codigo == 18) {
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#aceitacao #step-1");
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#aceitacao #step-2");
            window.ControleDeAcessoCotacaoFunctions.HabilitarTodosOsCamposDaSessao("#aceitacao #step-3");
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-4");
            $("#dataFimVigenciaDE").attr('disabled', 'disabled');
            $("#btnCartaOfertaEnviada").removeAttr('disabled');
            
        }
    },

    validaExibicaoDasSessoesAbaEmissao: function () {
        if (cotacao.Status.Codigo >= 8) {
            window.ControleDeAcessoCotacaoFunctions.DesabilitarTelaDeEmissao();
        }
    },
    //#endregion 

    //#region Desabilitar tela inteira
    DesabilitarTelaDeCotacao: function () {
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-1");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-2");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-3");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-4");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#cotacao #step-5");
        $("#btnSalvar").attr('disabled', 'disabled');
        $("#btnSolicitar").attr('disabled', 'disabled');
        $("#PesquisaCorretor").attr('disabled', 'disabled');
        $("#EstipulanteCPFCNPJ").attr('disabled', 'disabled');
        $("#justificativaFacultativa").attr('disabled', 'disabled');
        $("#btnCorretagem").removeAttr('disabled');
        $("#btn_rl_ExportarPlan").removeAttr('disabled');
        $("#selectPlanoSeguro").removeAttr('disabled');
        $("#addCenario").hide();
        $("#tabCenarios > li").each(function (abaCenario) {
            $($("#tabCenarios > li")[abaCenario]).find("a > i > i").each(function (opcoesCenario) {
                $($($("#tabCenarios > li")[abaCenario]).find("a > i > i")[opcoesCenario]).hide()
            })
        })

        //popUpCoCorretagem
        $("#pesquisaCorretorCorretagembtn").attr('disabled', 'disabled');
        $("#modal-body-corretagem input").attr('disabled', 'disabled');

    },

    DesabilitarTelaDeAnaliseRisco: function () {
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#analiseRisco #step-1");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#analiseRisco #step-2");
        $("#selectVsCalculo").removeAttr('disabled');
        $("#selectVsCalculoRel").removeAttr('disabled');
        $("#selecPlanoRel").removeAttr('disabled');
        $("#exportarResumoTecnico").removeAttr('disabled');
        $("#exportarFreecover").removeAttr('disabled');
        $("#exportarDistribuicaoCapital").removeAttr('disabled');
        $("#exportarProjecaoFaturamento").removeAttr('disabled');
    },

    DesabilitarTelaDeOrcamento: function () {
        $("#orcamento #step-4").show();
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-1");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#orcamento #step-4");
        $("#txtObservacaoOrcamento").attr('disabled', 'disabled');
        $("#btnExportarOrcamento").removeAttr('disabled');
    },

    DesabilitarTelaDeAceitacao: function () {
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-1");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-2");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-3");
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-4");
        $('input[name$="rbComissionamento"]').attr('disabled', 'disabled');
        $("#selectPlanoCenComiss").removeAttr('disabled');
        $("#btnExportarCartaOferta").removeAttr('disabled');
        $("#selectCenariosDadosCartaOferta").removeAttr('disabled');
        $("#selectVersaoDadosCartaOferta").removeAttr('disabled');
    },

    DesabilitarTelaDeEmissao: function () {
        window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#emissao #step-1");
        $("#btnSalvarEmissao").attr('disabled', 'disabled');
        $("#btnEnviarApolice").attr('disabled', 'disabled');
        //window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-2");
        //window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-3");
        //window.ControleDeAcessoCotacaoFunctions.DesabilitarTodosOsCamposDaSessao("#aceitacao #step-4");
    },
    //#endregion
}



