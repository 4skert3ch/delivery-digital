import React, { useState, useEffect } from "react";
import Main from "../template/Main";
import Paginacao from "../Paginacao/Paginacao";
import Navbar from "../template/Nav";
import ModalConfirmar from "../Modals/ModalConfirmar";
import produtos from "./Produtos"
import horariosFuncionamento from "./Funcionamento"

const produtosPorCategoria = {
  "Comida": produtos.filter(produto => produto.categoria === "Comida"),
  "Bebidas": produtos.filter(produto => produto.categoria === "Bebidas"),
};

const MainCard = () => {
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [carrinho, setCarrinho] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 8;

  const nomesDasPaginas = ["Comida", "Bebidas"];
  const horaAtual = new Date().getHours();
  const diaAtual = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)
  const horarioDiaAtual = horariosFuncionamento[diaAtual];

  const isAberto =
    horaAtual >= horarioDiaAtual.abertura && horaAtual <= horarioDiaAtual.fechamento;


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

  const handleChangePagina = (pagina) => {
    setPaginaAtual(pagina);
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
        <h2>{nomesDasPaginas[paginaAtual - 1]}</h2>
        <Paginacao
          totalItens={produtosPorCategoria[nomesDasPaginas[paginaAtual - 1]].length}
          itensPorPagina={produtosPorPagina}
          paginaAtual={paginaAtual}
          onChangePagina={handleChangePagina}
        />
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

export default MainCard;
