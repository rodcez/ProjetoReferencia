using AutoMapper;
using Liberty.Faturaveis.UI.Application.Documentos.Commands.ObterDadosCPF;
using Liberty.Faturaveis.UI.Infrastructure.Services.Documentos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading;
using System.Threading.Tasks;

namespace Liberty_CotadorVida.UI.UnitTests.Web.Documento
{
    public class DocumentoTest
    {
        public ObterDadosCPFHandle _obterDadosCPFHandle;
        public Mock<IDocumentoService> _repository;
        public Mock<IMapper> _mapper;

        [TestInitialize]
        public void InitTest()
        {
            _repository = new Mock<IDocumentoService>();
            _mapper = new Mock<IMapper>();
            _obterDadosCPFHandle = new ObterDadosCPFHandle(_repository.Object, _mapper.Object);

        }

        [TestMethod]
        public async Task ObterDadosCPFValido()
        {
            var request = GetObterDadosCPFRequest();

            var retorno = await _obterDadosCPFHandle.Handle(request, new CancellationToken());

            Assert.IsTrue(retorno != null);
            Assert.IsTrue(retorno.Mensagem == string.Empty);
        }


        [TestMethod]
        public async Task ObterDadosCPFInvalido()
        {
            var request = GetObterDadosCPFRequest();
            request.CPF = 0;

            var retorno = await _obterDadosCPFHandle.Handle(request, new CancellationToken());

            Assert.IsTrue(retorno != null);
            Assert.IsTrue(retorno.Mensagem != string.Empty);
        }

        private ObterDadosCPFCommand GetObterDadosCPFRequest()
        {
            return new ObterDadosCPFCommand() { CPF = 72463174811 };
        }
    }
}
