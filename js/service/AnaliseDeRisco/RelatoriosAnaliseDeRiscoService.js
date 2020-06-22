var indiceCenarioSelecionadoRelatorios = 0;
var indiceVersaoSelecionadaRelatorios = 0;
let maiorIdadeRT = 0;
let maiorCapitalRT = 0;
window.RelatoriosAnaliseDeRiscoUi = {

    initialize: function () {
        indiceCenarioSelecionadoRelatorios = 0;
        indiceVersaoSelecionadaRelatorios = 0;
        window.RelatoriosAnaliseDeRiscoUi.carregarCenarios();
        window.RelatoriosAnaliseDeRiscoUi.carregarVersoes();
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[0].indicadorVersaoCalculada) {
            window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
            window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
            window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        }
    },

    rederizarResumoTecnico: function (resumoTecnico) {

        var helper = {
            formatarDecimal: window.helperFormatacao.formatarDecimal
        };

        var htmlBasicas = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "basica";
        }), helper);
        $('#coberturasBasicas').html(htmlBasicas);

        var htmlAdicionais = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "adicional";
        }), helper);
        $('#coberturasAdicionais').html(htmlAdicionais);

        var htmlFuneral = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "funeral";
        }), helper);
        $('#coberturasFuneral').html(htmlFuneral);

        var htmlDiarias = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "diaria";
        }), helper);
        $('#coberturasDiarias').html(htmlDiarias);

        var htmlServico = $("#templateServicos").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "servico";
        }), helper);
        $('#servicos').html(htmlServico);

        $('#taxaPuraTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaLibertyFinal, 4));
        $('#taxaResseguroTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaResseguroFinal, 4));
        $('#taxaComercialTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaComercialFinalCoberturas, 4));
        $('#custoTotalServicos').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialAssistencias, 2, true));
        $('#taxaComercialTotalServicos').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaComercialFinal, 4));

        //premio
        $('#PremioComercialLibertySemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialLiberty, 2, true));
        $('#PremioComercialResseguroSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialResseguro, 2, true));
        $('#PremioComercialAssistenciasSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialAssistencias, 2, true));
        $('#PremioComercialTotalSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorTotalPremioLiquidoComercial, 2, true));
        $('#PremioPuroAnualRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoAnual, 2, true));
        $('#PremioMedioIndividualRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoMedioIndividual, 2, true));
        $('#PremioTotalComIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorTotalPremioComercial, 2, true));

        //carregamentos
        $('#ComissaoRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualCorretagem), 2));
        $('#ProLaboreRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualProLabore), 2));
        $('#AgenciamentoRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualAgenciamento), 2));
        $('#DART').text(helperFormatacao.formatarDecimal(cotacao.PercentualDespesaAdministrativa, 2));

        //Tábua de Mortalidade / Descontos
        $('#TabuaMortalidadeRT').text(resumoTecnico.tabuaMortalidadeEDescontos.descricaoTabuaMortalidade);
        $('#descontoAgravoTecnicoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.tabuaMortalidadeEDescontos.percentualDescontoAgravoTecnico, 2) + "%");
        resumoTecnico.tabuaMortalidadeEDescontos.indicadorDescontoAgravoResseguro ? $('#descontoAgravoResseguroRT').text("Sim") : $('#descontoAgravoResseguroRT').text("Não");

        //GrupoAnalisado
        $('#quantidadeVidasGrupoRT').text(resumoTecnico.grupoAnalisado.quantidadeTotalVidas);
        $('#quantidadeVidasResseguradasRT').text(resumoTecnico.grupoAnalisado.quantidadeVidasResseguradas);
        $('#idadeMediaRT').text(resumoTecnico.grupoAnalisado.idadeMedia);
        $('#idadeMediaAtuarialRT').text(resumoTecnico.grupoAnalisado.idadeMediaAtuarial);
        $('#idadeMaximaRT').text(resumoTecnico.grupoAnalisado.idadeMaxima);
        $('#porcentagemGeneroFemininoRT').text(resumoTecnico.grupoAnalisado.percentualVidasGeneroFeminino);
        $('#porcentagemGeneroMasculinoRT').text(resumoTecnico.grupoAnalisado.percentualVidasGeneroMasculino);
        $('#quantidadeAfastadosRT').text(resumoTecnico.grupoAnalisado.quantidadeTotalVidasAfastadas);
        $('#quantidadeVidasAcimaRT').text(resumoTecnico.grupoAnalisado.quantidadeVidasForaDoLimiteDeIdade);

        //capitais
        $('#modalidadeRT').text(resumoTecnico.capitais.tipoModalidadeCapital);
        $('#limiteRetencaoLibertyRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorLimiteRetencaoLiberty, 2, true));
        $('#totalCapitalRetidoLibertyRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetidoLiberty, 2, true));
        $('#totalCapitalRetidoResseguroRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetidoResseguro, 2, true));
        $('#totalCapitalLibertyResseguroRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetido, 2, true));
        $('#capitalMinimoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMinimo, 2, true));
        $('#capitalMaximoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMaximo, 2, true));
        $('#capitalMedioRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMedio, 2, true));
        $('#capitalSeguradoMaisVelhoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMaiorIdade, 2, true));
        $('#capitalMedioConcentracaoRT').text(resumoTecnico.capitais.valorCapitalMedioConcentracaoGrupo + "%");
        $('#TotalCapitalResseguradoVidasAcima70RT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalResseguradoForaLimiteIdade, 2, true));
        $('#paridadeRT').text(resumoTecnico.capitais.numeroParidade);

        //sinistro
        $('#expectativaRT').text(helperFormatacao.formatarDecimal(resumoTecnico.expectativaSinistro.percentualExpectativa, 2));
        $('#sinistroPorMilRT').text(helperFormatacao.formatarDecimal(resumoTecnico.expectativaSinistro.percentualSinistroPorMil, 2));
        $('#anosDeRecuperacaoRT').text(parseInt(resumoTecnico.expectativaSinistro.quantidadeAnosRecuperacao));

    },

    renderizarFreecover: function (freecover) {
        $("#ISAcimaLimiteIdadeFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorCapitalAcimaIdadeFreeCover, 2, true));
        $("#LimiteMaximoAbrangenciaFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorLimiteMaximoAbrangenciaFreeCover, 2, true));
        $("#SomaMediaSeguradaFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorSomaMediaSegurada, 2, true));
        $("#LimiteFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorLimiteFreeCover, 2, true));
        $("#PorcentagemGrupoFreecover").text(freecover.aceitacaoGrupo.percentualGrupo);

        if (!freecover.indicadorLimiteGrupoUltrapassado) {
            $("#FreecoverFcl").addClass('glyphicon glyphicon-ok');
            $("#FreecoverFcl").css("color", "green");
        } else {
            $("#FreecoverFcl").addClass('glyphicon glyphicon-remove');
            $("#FreecoverFcl").css("color", "red");
        }



    },

    carregarCenarios: function () {
        //TODO: validar qual cenario foi o ultimo a ser calculado
        $("#cenariosRel > li").remove();
        cotacao.CenariosCotacao.forEach(function (cen) {
            if (cen.versoesCalculo.some(function (c) {
                return c.indicadorVersaoCalculada == true
            })) {
                cen.numeroCenario === 1 ?
                    $("#cenariosRel").append("<li class='active'><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >") :
                    $("#cenariosRel").append("<li><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >")
            }
        });

        $('#cenariosRel a').unbind('shown.bs.tab');
        $('#cenariosRel a').on('shown.bs.tab', function (e) {
            window.RelatoriosAnaliseDeRiscoEvents.onChangeCenario($(e.target).closest('li').index(), $(e.relatedTarget).closest('li').index());
        });
    },

    carregarVersoes: function () {
        $('#selectVsCalculoRel').empty();
        //TODO: Primeiro impelmentar a melhoria do selecione antes de colocar -1 no combo
        //$('#selectVsCalculoRel').append('<option value="-1">Selecione</option>');
        cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo.forEach(function (v) {
            if (v.indicadorVersaoCalculada)
                $('#selectVsCalculoRel').append('<option value="' + v.numeroVersao + '">' + v.numeroVersao + '</option>');
        });
    },

    adicionarVersaoNoDropdown: function (numeroVersao) {
        var necessarioAdicionar = true;
        $("#selectVsCalculoRel option").each(function () {
            if ($(this).val() == numeroVersao)
                necessarioAdicionar = false;
        });

        if (necessarioAdicionar) {
            $('#selectVsCalculoRel').append('<option value="' + numeroVersao + '">' + numeroVersao + '</option>');
            $('#selectVsCalculoRel').change();
        }

    },

    carregarPlanos: function () {
        $('#selecPlanoRel').empty();
        //TODO: Primeiro impelmentar a melhoria do selecione antes de colocar -1 no combo
        //$('#selecPlanoRel').append('<option value="-1">Selecione</option>');

        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].indicadorPlanoMesmaCobertura && cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].planosCondicoesComerciais.length > 1) {
            $('#selecPlanoRel').append('<option value="0">TODOS OS PLANOS</option>');
        }
        cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].planosCondicoesComerciais.forEach(function (p) {
            $('#selecPlanoRel').append('<option value="' + p.numeroPlano + '">' + p.nomePlano + '</option>');
        });
    },
};
window.RelatoriosAnaliseDeRiscoFunctions = {

    obterResumoTecnico: function () {
        $.ajax({
            url: '/calculo/ObterResumoTecnico',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoUi.rederizarResumoTecnico(data.value);
                maiorIdadeRT = data.value.grupoAnalisado.idadeMaxima;
                maiorCapitalRT = data.value.capitais.valorCapitalMaximo;
                closeModalWait();
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario,
                NumeroVersao: parseInt($('#selectVsCalculoRel').val()),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    obterFreecover: function () {
        $.ajax({
            url: '/calculo/ObterFreecover',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoUi.renderizarFreecover(data.value);
                closeModalWait();
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario,
                NumeroVersao: parseInt($('#selectVsCalculoRel').val()),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    ValidarDistribuicaoCapitalIntervaloCapitais: function () {
        //Se não foi preenchido obter o intervalo do produto comercial (Motor de Calculo)
        if ($('#txtDCIntervaloCapitais').val() !== "" && parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]) > 0) {
            var intervaloCapital = parseFloat($('#txtDCIntervaloCapitais').maskMoney('unmasked')[0]);
            var intervaloMinimoPermitido = 0.01;

            if (intervaloCapital < intervaloMinimoPermitido || intervaloCapital > maiorCapitalRT) {
                notification("erro", "O Intervalo de Capitais deve ser maior que 0 e menor ou igual que o valor do Maior Capital informado de " + maiorCapitalRT.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'txtDCIntervaloCapitais');
                return false;
            }
        }
        $('#txtDCIntervaloCapitais').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIntervaloIdade: function () {
        //Se não foi preenchido obter o intervalo do produto comercial (Motor de Calculo)
        if ($('#txtDCIntervaloIdade').val() !== "" && $('#txtDCIdadeMaxima').val() !== "") {
            var intervaloIdade = parseInt($('#txtDCIntervaloIdade').val());
            var intervaloMinimoPermitido = 1;

            if (intervaloIdade < intervaloMinimoPermitido || intervaloIdade > maiorIdadeRT) {
                notification("erro", "O Intervalo de Faixa de Idade deve ser maior que 0 e menor que a Idade Máxima informada de " + maiorIdadeRT, 'txtDCIntervaloIdade');
                return false;
            }
        }
        $('#txtDCIntervaloIdade').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalMenorCapital: function () {
        var valorCapitalMinimo = $('#txtDCCapitalMinimo').val() === "" ? 0 : parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]);
        var valorMinimoPermitido = 0;
        var valorCapitalMaximo = parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]);

        if (valorCapitalMinimo < valorMinimoPermitido || valorCapitalMinimo > valorCapitalMaximo) {
            notification("erro", "O valor do Menor Capital deve ser menor ou igual que o valor do Maior Capital informado.", 'txtDCCapitalMinimo');
            return false;
        }
        $('#txtDCCapitalMinimo').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIdadeMinima: function () {
        var valorIdadeMinima = $('#txtDCIdadeMinima').val() === "" ? 0 : parseInt($('#txtDCIdadeMinima').val());
        var valorMinimoPermitido = 0;
        var valorIdadeMaxima = parseInt($('#txtDCIdadeMaxima').val());

        if (valorIdadeMinima < valorMinimoPermitido || valorIdadeMinima > valorIdadeMaxima) {
            notification("erro", "O campo Idade Mínima deve ser menor ou igual ao valor do campo Idade máxima.", 'txtDCIdadeMinima');
            return false;
        }
        $('#txtDCIdadeMinima').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalMaiorCapital: function () {
        if ($('#txtDCCapitalMaximo').val() === "" && $('#txtDCIntervaloCapitais').val() !== "") {
            notification("erro", "O valor do Maior Capital deve ser informado.", 'txtDCCapitalMaximo');
            return false;
        }
        else if ($('#txtDCCapitalMaximo').val() !== "") {
            var valorCapitalMaximo = parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]);
            var valorCapitalMinimo = parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]);

            if (valorCapitalMaximo < valorCapitalMinimo) {
                notification("erro", "O valor do Maior Capital deve ser maior ou igual que o valor do Menor Capital informado.", 'txtDCCapitalMaximo');
                return false;
            }
        }
        $('#txtDCCapitalMaximo').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIdadeMaxima: function () {
        if ($('#txtDCIdadeMaxima').val() === "" && parseInt($('#txtDCIntervaloIdade').val()) > 0) {
            notification("erro", "A Idade Máxima deve ser informada.", 'txtDCIdadeMaxima');
            return false;
        }
        else if ($('#txtDCIdadeMaxima').val() !== "") {
            var valorIdadeMaxima = parseInt($('#txtDCIdadeMaxima').val());
            var valorIdadeMinima = parseInt($('#txtDCIdadeMinima').val());

            if (valorIdadeMaxima < valorIdadeMinima) {
                notification("erro", "A Idade Máxima deve ser maior ou igual ao valor Idade Mínima informada.", 'txtDCIdadeMaxima');
                return false;
            }
        }
        $('#txtDCIdadeMaxima').removeClass("input-validation-error");
        return true;
    },

    CalcularDistribuicaocapital: function (codigoProdutoComercial,
        dataReferencia,
        numeroCotacao,
        numeroCenario,
        numeroVersao,
        numeroPlano,
        intervaloCapital,
        menorCapital,
        maiorCapital,
        intervaloFaixaIdade,
        idadeMinima,
        idadeMaxima) {
        $.ajax({
            url: '/calculo/DistribuicaoCapital/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                if (data.value.mensagem !== null && data.value.mensagem !== "") {
                    notification("erro", data.value.mensagem, '');
                }
                else {
                    notification("sucesso", "Relatório atualizado com sucesso!", "");
                }
            },
            error: function (data) {
                closeModalWait();
                if (data.value.mensagem !== null && data.value.mensagem !== "") {
                    notification("erro", data.value.mensagem, '');
                }
                var errors = JSON.parse(data.messages);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                CodigoProdutoComercial: codigoProdutoComercial,
                DataReferencia: dataReferencia,
                NumeroCotacao: numeroCotacao,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                NumeroPlano: numeroPlano,
                IntervaloCapital: intervaloCapital,
                MenorCapital: menorCapital,
                MaiorCapital: maiorCapital,
                IntervaloFaixaIdade: intervaloFaixaIdade,
                IdadeMinima: idadeMinima,
                IdadeMaxima: idadeMaxima
            })
        });
    },

    ObterProjecaoFaturamento: function () {
        $.ajax({
            url: '/calculo/ObterProjecaoFaturamento/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoFunctions.CarregarProjecaoFaturamento(data);
            },
            error: function (data) {
                if (data.messages != undefined) {
                    var errors = JSON.parse(data.messages);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                }
            },
            data: JSON.stringify({
                NumeroCotacao: parseInt(cotacao._id),
                NumeroCenario: parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario),
                NumeroVersao: parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[indiceVersaoSelecionadaRelatorios].numeroVersao),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    CarregarProjecaoFaturamento: function (data) {

        if (data.value != undefined) {

            $('#spValorPremioPF').html(data.value.valorTotal.valorPremioEmitido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorAsssitenciasPF').html(data.value.valorTotal.valorPremioAssitencias.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorResseguroPF').html(data.value.valorTotal.valorPremioResseguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorCosseguroPF').html(data.value.valorTotal.valorPremioCosseguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorPremioGanhoPF').html(data.value.valorTotal.valorPremioGanho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorComissaoPF').html(data.value.valorTotal.valorComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorProLaborePF').html(data.value.valorTotal.valorProLabore.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorAgenciamentoPF').html(data.value.valorTotal.valorAgenciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorDespAdmPF').html(data.value.valorTotal.valorDespesasAdministrativas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorSinProjPF').html(data.value.valorTotal.valorSinistrosProjetados.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorResultadoPF').html(data.value.valorTotal.valorResultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

            $('#spPercPremioPF').html(data.value.percentualTotal.percentualPremioEmitido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercAsssitenciasPF').html(data.value.percentualTotal.percentualPremioAssitencias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercResseguroPF').html(data.value.percentualTotal.percentualPremioResseguro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercCosseguroPF').html(data.value.percentualTotal.percentualPremioCosseguro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercPremioGanhoPF').html(data.value.percentualTotal.percentualPremioGanho.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercComissaoPF').html(data.value.percentualTotal.percentualComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercProLaborePF').html(data.value.percentualTotal.percentualProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercAgenciamentoPF').html(data.value.percentualTotal.percentualAgenciamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercDespAdmPF').html(data.value.percentualTotal.percentualDespesasAdministrativas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercSinProjPF').html(data.value.percentualTotal.percentualSinistrosProjetados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercResultadoPF').html(data.value.percentualTotal.percentualResultado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
    },

    ExportarFreecover: function (callback) {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/Freecover',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "Relatório não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'Freecover'
            })
        });
    },

    ExportarResumoTecnico: function (callback) {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/ResumoTecnico',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "Relatório não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'ResumoTecnico'
            })
        });
    },

    ExportarDistribuicaoCapital: function () {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/DistribuicaoCapital',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "Relatório não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'DistribuicaoCapital'
            })
        });
    }
};

window.RelatoriosAnaliseDeRiscoEvents = {

    onChangeCenario: function (indexAbaAtual, indexAbaAnterior) {
        openModalWait();
        //TODO: limpar relatorios?

        indiceCenarioSelecionadoRelatorios = indexAbaAtual;
        indiceVersaoSelecionadaRelatorios = 0;
        window.RelatoriosAnaliseDeRiscoUi.carregarVersoes();
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[0].indicadorVersaoCalculada) {
            window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
            window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
            window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        }
    },

    onChangeVersao: function (campo) {
        openModalWait();
        indiceVersaoSelecionadaRelatorios = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo.findIndex(function (value) {
            return value.numeroVersao == $(campo).val();
        });
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
        window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
        window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        closeModalWait();
    },

    onChangePlano: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
        window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
        window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        closeModalWait();
    },

    OnClickAtualizarRelatorioDistribuicaoCapital: function () {
        openModalWait();
        $('#txtDCIntervaloCapitais').removeClass("input-validation-error");
        $('#txtDCIntervaloIdade').removeClass("input-validation-error");
        $('#txtDCCapitalMinimo').removeClass("input-validation-error");
        $('#txtDCIdadeMinima').removeClass("input-validation-error");
        $('#txtDCCapitalMaximo').removeClass("input-validation-error");
        $('#txtDCIdadeMaxima').removeClass("input-validation-error");

        if ($('#txtDCIntervaloCapitais').val() === "" && $('#txtDCCapitalMinimo').val() === "" && $('#txtDCCapitalMaximo').val() === "" &&
            $('#txtDCIntervaloIdade').val() === "" && $('#txtDCIdadeMinima').val() === "" && $('#txtDCIdadeMaxima').val() === "") {
            notification("erro", "Para atualizar o relatório, deve-se preencher os campos de limitadores.", '');
            closeModalWait();
        }
        else {
            var capitalMenorOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalMenorCapital();
            var capitalMaiorOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalMaiorCapital();
            var idadeMinimaOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIdadeMinima();
            var idadeMaximaOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIdadeMaxima();

            if (capitalMenorOK && capitalMaiorOK) {
                var intervaloCapitalOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIntervaloCapitais();
            }

            if (idadeMinimaOK && idadeMaximaOK) {
                var intervaloIdadeOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIntervaloIdade();
            }

            if (intervaloCapitalOK && intervaloIdadeOK) {

                window.RelatoriosAnaliseDeRiscoFunctions.CalcularDistribuicaocapital(parseInt(cotacao.ProdutoComercial.Codigo),
                    cotacao.DataReferencia,
                    parseInt(cotacao._id),
                    parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario),
                    parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[indiceVersaoSelecionadaRelatorios].numeroVersao),
                    parseInt($('#selecPlanoRel').val()),
                    $('#txtDCIntervaloCapitais').val() === "" ? null : parseInt($('#txtDCIntervaloCapitais').maskMoney('unmasked')[0]),
                    $('#txtDCCapitalMinimo').val() === "" ? 0 : parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]),
                    $('#txtDCCapitalMaximo').val() === "" ? null : parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]),
                    $('#txtDCIntervaloIdade').val() === "" ? null : parseInt($('#txtDCIntervaloIdade').val()),
                    $('#txtDCIdadeMinima').val() === "" ? 0 : parseInt($('#txtDCIdadeMinima').val()),
                    $('#txtDCIdadeMaxima').val() === "" ? null : parseInt($('#txtDCIdadeMaxima').val()));
            }
            else
                closeModalWait();
        }
    },

    OnClickExportarResumoTecnico: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarResumoTecnico();
    },

    OnClickExportarFreecover: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarFreecover();
    },

    OnClickExportarDistribuicaoCapital: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarDistribuicaoCapital();
    },

};