import React, { useState, useEffect } from "react";
import Main from "../template/Main";
import Paginacao from "../Paginacao/Paginacao";
import Navbar from "../template/Nav";
import ModalConfirmar from "../Modals/ModalConfirmar";

const MainCard = () => {
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [carrinho, setCarrinho] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 18;
  const horaAbertura = 18; // Replace 8 with the actual opening hour
  const horaFechamento = 21; // Replace 22 with the actual closing hour

  const nomesDasPaginas = ["Comida", "Bebidas", "Hotdog"];
  const horaAtual = new Date().getHours();
  const isAberto = horaAtual >= horaAbertura && horaAtual <= horaFechamento;

  useEffect(() => {
    document.title = nomesDasPaginas[paginaAtual - 1];
  }, [paginaAtual, nomesDasPaginas]);

  const adicionarAoCarrinho = (produto) => {
    const produtoExistente = carrinho.find((item) => item.nome === produto.nome);

    if (produtoExistente) {
      const novoCarrinho = carrinho.map((item) =>
        item.nome === produto.nome ? { ...item, quantidade: item.quantidade + 1 } : item
      );
      setCarrinho(novoCarrinho);
    } else {
      setCarrinho([...carrinho, { ...produto, pagina: paginaAtual, quantidade: 1 }]);
    }

    setTotalAPagar((prevTotal) => prevTotal + produto.preco);
  };

  const handleChangePagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  const removerUmDoCarrinho = (produto) => {
    const produtoExistente = carrinho.find((item) => item.nome === produto.nome);

    if (produtoExistente && produtoExistente.quantidade > 0) {
      const novoCarrinho = carrinho.map((item) =>
        item.nome === produto.nome ? { ...item, quantidade: item.quantidade - 1 } : item
      );
      setCarrinho(novoCarrinho);
      setTotalAPagar((prevTotal) => prevTotal - produto.preco);
    }
  };

  const handleFinalizarPedido = () => {
    // Filtrar apenas os itens com quantidade maior que 0
    const itensPedido = carrinho.filter((item) => item.quantidade > 0);
    // Lógica para finalizar o pedido (enviar para o backend, exibir mensagem, etc.)
    // Aqui, você pode implementar a lógica que desejar para finalizar o pedido com os itens selecionados.
    console.log("Itens do pedido:", itensPedido);
    // Após finalizar o pedido, limpar o carrinho e o total a pagar
    setCarrinho([]);
    setTotalAPagar(0);
  };

  return (
    <>
      <ModalConfirmar
        carrinho={carrinho}
        totalAPagar={totalAPagar}
        setTotalAPagar={setTotalAPagar}
        setCarrinho={setCarrinho}
        onFinalizarPedido={handleFinalizarPedido}
        isAberto={isAberto}
      />
      <Navbar
        totalAPagar={totalAPagar}
        setTotalAPagar={setTotalAPagar}
        setCarrinho={setCarrinho}
        isAberto={isAberto}
      />
      <Main>
        <Paginacao
          totalItens={produtos.length}
          itensPorPagina={produtosPorPagina}
          paginaAtual={paginaAtual}
          onChangePagina={handleChangePagina}
        />
        <h2>{nomesDasPaginas[paginaAtual - 1]}</h2>
        <div className="d-flex flex-wrap gap-3">
          {produtos.slice((paginaAtual - 1) * produtosPorPagina, paginaAtual * produtosPorPagina).map((produto, index) => {
            const produtoExistente = carrinho.find((item) => item.nome === produto.nome);
            const quantidadeNoCarrinho = produtoExistente ? produtoExistente.quantidade : 0;

            return (
              <div key={index} className="card col-md-6 col-lg-4 col-xl-3">
                <img
                  src={produto.imagemUrl}
                  loading="lazy"
                  className="card-img-top"
                  alt="Product"
                  style={{
                    width: "100%",       // Preenche a largura do espaço disponível
                    maxHeight: "300px",  // Define uma altura máxima para o card
                    objectFit: "cover"   // Mantém a proporção e corta a imagem se necessário
                  }}
                />

                <div className="card-body">
                  <h5 className="card-title">{produto.nome}</h5>
                  <p className="card-text">{produto.descricao}</p>
                  <p className="card-text">{`R$${(produto.preco / 100).toFixed(2)}`}</p>
                  <div className="d-flex flex-column align-items-center">
                    <button
                      className="btn btn-primary btn-sm col-9 col-md-6"
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      Adicionar
                    </button>
                    {quantidadeNoCarrinho > 0 && (
                      <div className="d-flex align-items-center mt-2">
                        <button
                          className="btn btn-danger btn-sm col-8 col-md-6"
                          onClick={() => removerUmDoCarrinho(produto)}
                        >
                          Remover
                        </button>
                        <strong className="btn btn-secondary btn-sm col-4 col-md-6" style={{ marginLeft: "5px", marginRight: "5px" }}>
                          x {quantidadeNoCarrinho}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Main>
    </>
  );
};



const produtos = [
  {
    nome: "X-BURGUER",
    preco: 1600,
    imagemUrl: "https://i.ibb.co/4FhtpXV/Captura-de-tela-2023-08-07-170601.png"
  },
  {
    nome: "X-Calabresa",
    descricao: "Calabresa, hambúger, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2500,
    imagemUrl: "https://i.ibb.co/wg0G5bc/xcalabresa.png"
  },
  {
    nome: "X-Frango",
    descricao: "Frango, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2399,
    imagemUrl: "https://i.ibb.co/fDP2FV9/xfrango.png"
  },
  {
    nome: "X-Bacon",
    descricao: "Coração, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2900,
    imagemUrl: "https://i.ibb.co/1R3mbsz/xbacon.png"
  },
  {
    nome: "X-Coração",
    descricao: "Hambúrguer, bacon, queijo, preseunto, alface, tomate, pepino, milho e ervilha",
    preco: 2600,
    imagemUrl: "https://i.ibb.co/x3CyYg7/xcoracao.png"
  },
  {
    nome: "X-Alcatra",
    descricao: "Alcatra, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2900,
    imagemUrl: "https://i.ibb.co/JxLz743/xalcatra.png"
  },
  {
    nome: "X-EGG",
    descricao: "Ovo, hambúrguer, queijo, presunto, alface, tomate, pepino, milho e ervilha",
    preco: 2900,
    imagemUrl: "https://i.ibb.co/DL22Q1h/Captura-de-tela-2023-08-07-164911.png"
  },
  {
    nome: "PORÇÃO PEROLAS / Meia",
    descricao: "Alcatra, frango, calabresa, fritas, farofa, pepino e pão com queijo",
    preco: 7600,
    imagemUrl: "https://i.ibb.co/h2Xvfrw/perolasmeia.png"
  },
  {
    nome: "PORÇÃO PEROLAS / Inteira",
    preco: 9800,
    imagemUrl: "https://th.bing.com/th/id/OIP.wSYDezrpVMgaw-oM5nHxMwHaDz?pid=ImgDet&rs=1"
  },
  {
    nome: "BATATA FRITA / Meia",
    preco: 2100,
    imagemUrl: "https://i.ibb.co/znQXv6Q/batatameia.png"
  },
  {
    nome: "BATATA FRITA / Inteira",
    preco: 3300,
    imagemUrl: "https://th.bing.com/th/id/OIP.LkjpcBTtSb91JgHvuNolLAHaE7?pid=ImgDet&rs=1"
  },

  {
    nome: "MISTO QUENTE",
    descricao: "Queijo e presunto",
    preco: 1500,
    imagemUrl: "https://i.ibb.co/jrh8VFj/Captura-de-tela-2023-08-07-170250.png"
  },
  {
    nome: "DOG TRADICIONAL",
    descricao: "Salsicha, milho, ervilha e batata palha.",
    preco: 1900,
    imagemUrl: "https://i.ibb.co/F8K8cMh/Captura-de-tela-2023-08-07-170506.png"
  },
  {
    nome: "DOG CALABRESA",
    descricao: "Salsicha, calabresa, milho, ervilha e batata palha.",
    preco: 2500,
    imagemUrl: "https://i.ibb.co/vmHJF60/Captura-de-tela-2023-08-07-170334.png"
  },
  {
    nome: "DOG BACON",
    descricao: "Salsicha, bacon, milho, ervilha, e batata palha",
    preco: 2600,
    imagemUrl: "https://i.ibb.co/S3mN5Jw/Captura-de-tela-2023-08-07-170354.png"
  },
  {
    nome: "DOG FRANGO",
    descricao: "Salsicha, frango, milho, ervilha, e bata palha",
    preco: 2600,
    imagemUrl: "https://i.ibb.co/Vg20fkm/Captura-de-tela-2023-08-07-170435.png"
  },
  {
    nome: "DOG PIZZA",
    descricao: "Salsicha, presunto, queijo, catupiry, tomate, orégano, milho, ervilha e batata palha",
    preco: 2800,
    imagemUrl: "https://i.ibb.co/z6kz069/Captura-de-tela-2023-08-07-170314.png"
  },
  {
    nome: "Dog pérolas ( Servido aberto )",
    descricao: "Salsicha, bacon, calabresa, frango, catupirym milho, ervilha e batata palha",
    preco: 3200,
    imagemUrl: "https://i.ibb.co/SdCrS7V/Captura-de-tela-2023-08-07-170535.png"
  },
  {
    nome: "Coca-Cola 1,5L",
    preco: 1200,
    imagemUrl: "https://www.trinkgut.de/media/image/7d/1c/3b/5000112547726.png"
  },
  {
    nome: "Coca-Cola 600ml",
    preco: 800,
    imagemUrl: "https://n4.sdlcdn.com/imgs/d/7/e/Coca-Cola-Cola-600-ml-SDL967588379-1-c06f5.jpg"
  },
  {
    nome: "Coca-Cola 350ml",
    preco: 600,
    imagemUrl: "https://cdn.dooca.store/418/products/coca.jpg?v=1589835707&webp=0"
  },
  {
    nome: "Guaraná 1,5L",
    preco: 1000,
    imagemUrl: "https://th.bing.com/th/id/OIP.bHsGG_SsCh4I0TpJHQOEVwHaHa?pid=ImgDet&rs=1"
  },
  {
    nome: "Guaraná 600ml",
    preco: 800,
    imagemUrl: "https://apoioentrega.vteximg.com.br/arquivos/ids/459548-1000-1000/def63cee85539b67479205ee45835997_refrigerante-antarctica-guarana-garrafa-600-ml---refrig-antarctica-600ml-pet-guarana---1-un_lett_2.jpg?v=637305879246200000"
  },
  {
    nome: "Guaraná 350ml",
    descricao: "Description of the product goes here.",
    preco: 600,
    imagemUrl: "https://apoioentrega.vteximg.com.br/arquivos/ids/459546-1000-1000/52f217b9ecacfa07b163c321348257e0_refrigerante-guarana-antarctica-lata-350ml---refrig-antarctica-350ml-lt-guarana---1-un_lett_2.jpg?v=637305879165000000"
  },
  {
    nome: "Água mineral",
    descricao: "Description of the product goes here.",
    preco: 400,
    imagemUrl: "https://th.bing.com/th/id/OIP.6CDUqpv9Hk8e3_5s9ImjUQHaNn?pid=ImgDet&rs=1"
  },
  // Adicione caminhos relativos para as imagens dos demais produtos conforme necessário
];

export default MainCard;
