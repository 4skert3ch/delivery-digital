import React, { useState, useEffect } from "react";
import Main from "../template/Main";
import Paginacao from "../Paginacao/Paginacao";
import Navbar from "../template/Nav";
import ModalConfirmar from "../Modals/ModalConfirmar";

const MainCard = () => {
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [carrinho, setCarrinho] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1); // Estado para controlar a página atual
  const produtosPorPagina = 8; // Defina o número de produtos por página

  const nomesDasPaginas = ["Comida", "Bebidas", "Hotdog"];

  useEffect(() => {
    // Atualiza o título da página quando a página atual muda
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

  // Cria uma lista de produtos paginados com base na página atual e no tamanho da página
  const listaProdutosPaginados = produtos.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

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

  return (
    <>
      <ModalConfirmar carrinho={carrinho} totalAPagar={totalAPagar} setTotalAPagar={setTotalAPagar} setCarrinho={setCarrinho} />
      <Navbar totalAPagar={totalAPagar} setTotalAPagar={setTotalAPagar} setCarrinho={setCarrinho} />
      <Main>
        <Paginacao
          totalItens={produtos.length}
          itensPorPagina={produtosPorPagina}
          paginaAtual={paginaAtual}
          onChangePagina={handleChangePagina}
        />
        <h2>{nomesDasPaginas[paginaAtual - 1]}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {listaProdutosPaginados.map((produto, index) => {
            const produtoExistente = carrinho.find((item) => item.nome === produto.nome);
            const quantidadeNoCarrinho = produtoExistente ? produtoExistente.quantidade : 0;

            return (
              <div key={index} className="card" style={{ width: "250px" }}>
                <img
                  src={produto.imagemUrl}
                  loading="lazy"
                  className="card-img-top"
                  alt="Product"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{produto.nome}</h5>
                  <p className="card-text">{produto.descricao}</p>
                  <p className="card-text">{`R$${(produto.preco / 100).toFixed(2)}`}</p>
                  <div className="d-flex flex-column align-items-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      Adicionar no carrinho
                    </button>
                    {quantidadeNoCarrinho > 0 && (
                      <div className="d-flex align-items-center mt-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removerUmDoCarrinho(produto)}
                        >
                          Remover
                        </button>
                      </div>
                    )}
                        <span style={{ marginLeft: "5px", marginRight: "5px" }}>
                          Quantidade: {quantidadeNoCarrinho}
                        </span>
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
    nome: "PORÇÃO / Meia",
    descricao: "Alcatra, frango, calabresa, fritas, farofa, pepino e pão com queijo",
    preco: 7600,
    imagemUrl: "https://th.bing.com/th/id/OIP.ade_zws1Q_aHdK3qYCCdFgHaE8?pid=ImgDet&rs=1"
  },
  {
    nome: "X-Calabresa",
    descricao: "Calabresa, hambúger, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2500,
    imagemUrl: "https://th.bing.com/th/id/OIP.1WLeEc6y7L4qeADu4jEFvgHaE8?pid=ImgDet&rs=1"
  },
  {
    nome: "X-Frango",
    descricao: "Frango, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2399,
    imagemUrl: "https://th.bing.com/th/id/OIP.ym3M4ybCDW1pYpPmGHsN8wHaEj?pid=ImgDet&rs=1"
  },
  {
    nome: "X-Bacon",
    descricao: "Hambúrguer, bacon, queijo, preseunto, alface, tomate, pepino, milho e ervilha",
    preco: 2600,
    imagemUrl: "https://th.bing.com/th/id/OIP.AvI5N2smm4X9PxxJjGPGJgHaEn?pid=ImgDet&rs=1"
  },
  {
    nome: "X-Alcatra",
    descricao: "Alcatra, queijo, alface, tomate, pepino, milho e ervilha",
    preco: 2900,
    imagemUrl: "https://th.bing.com/th/id/R.e95e4719720dce518b8628ac2bfc3348?rik=YXTOigeMXwKDxA&riu=http%3a%2f%2fblog.tnh1.com.br%2fnidelins%2fwp-content%2fuploads%2f2014%2f08%2fmontagu%c2%b4s5.jpg&ehk=SITnAVl0C%2bcDi0KFpw1BmmGTz5cdYruO%2fpanIvMzjGE%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    nome: "PORÇÃO / Inteira",
    descricao: "PORÇÃO PÉROLAS/ Inteira",
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
    preco: 2399,
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
