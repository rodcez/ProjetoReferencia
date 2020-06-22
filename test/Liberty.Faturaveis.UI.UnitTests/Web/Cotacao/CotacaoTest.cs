using AutoMapper;
using Liberty.Faturaveis.UI.Application.Cotacao.Commands.SalvarCotacao;
using Liberty.Faturaveis.UI.Infrastructure.Services.Cotacao;
using Liberty.Faturaveis.UI.Infrastructure.Services.Cotacao.Dto;
using Liberty.Faturaveis.UI.Infrastructure.Services.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Liberty_CotadorVida.UI.UnitTests.Web.Cotacao
{
    [TestClass]
    public class CotacaoTest
    {
        public SalvarCotacaoHandle _salvarCotacao;
        public Mock<ICotacaoService> _service;
        public Mock<IGenericService> _genericservice;
        public Mock<IMapper> _mapper;

        [TestInitialize]
        public void InitTest()
        {
            _service = new Mock<ICotacaoService>();
            _genericservice = new Mock<IGenericService>();
            _mapper = new Mock<IMapper>();
            _salvarCotacao = new SalvarCotacaoHandle(_mapper.Object, _genericservice.Object);

            SetupMocks();
        }

        /*
        [TestMethod]
        public async Task SalvarCotacaoValida()
        {
            var cotacao = GetSalvarCotacaoCommandMock("1");

            var retorno = await _salvarCotacao.Handle(cotacao, new CancellationToken());

            Assert.IsTrue(retorno != null);
            Assert.IsTrue(retorno._id == cotacao._id);
        }
        */

        private SalvarCotacaoCommand GetSalvarCotacaoCommandMock(int? id)
        {
            return new SalvarCotacaoCommand()
            {
                _id = id,
                //Segurado = new Liberty.Faturaveis.UI.Application.Cotacao.Commands.SalvarCotacao.Segurado()
                //{
                //    CodigoCnae = "X",
                //    CodigoOcupacao = "Y",
                //    DescricaoCnae = "Descrição Cnae",
                //    DescricaoOcupacao = "Descrição Ocupação",
                //    Nome = "Nome X",
                //    NumeroCpfCnpj = "12345678901",
                //    TipoPessoa = "Z"
                //}
            };
        }


        private void SetupMocks()
        {
            var listaCotacao = new List<CotacaoDto>();

            //_service.Setup(x => x.SalvarCotacao<SalvarCotacaoResponse>(It.IsAny<CotacaoDto>()))
            //           .Callback((CotacaoDto cotacao) =>
            //           {
            //               listaCotacao.Add(cotacao);
            //           });

            //.Returns((Domain.AggregatesModel.CotacaoAggregate.Cotacao cotacao) =>
            //{
            //    listaCotacao.Add(cotacao);
            //    return new Task ;
            //});

            _mapper.Setup(x => x.Map<CotacaoDto>(It.IsAny<SalvarCotacaoCommand>()))
                   .Returns((SalvarCotacaoCommand request) =>
                   {
                       var cotacao = new CotacaoDto
                       {
                           _id = request._id
                       };

                       //if (request.Segurado != null)
                       //{
                       //    cotacao.Segurado = new Liberty.Faturaveis.UI.Infrastructure.Services.Cotacao.Dto.Segurado
                       //    {
                       //        CodigoCnae = request.Segurado.CodigoCnae,
                       //        CodigoOcupacao = request.Segurado.CodigoOcupacao,
                       //        DescricaoCnae = request.Segurado.DescricaoCnae,
                       //        DescricaoOcupacao = request.Segurado.DescricaoOcupacao,
                       //        Nome = request.Segurado.Nome,
                       //        NumeroCpfCnpj = request.Segurado.NumeroCpfCnpj,
                       //        TipoPessoa = request.Segurado.TipoPessoa
                       //    };
                       //}

                       return cotacao;
                   });
        }


    }
}
