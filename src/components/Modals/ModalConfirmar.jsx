import React, { useState } from "react";
import InputMask from "react-input-mask";
import './ModalConfirmar.css'

const ModalConfirmar = ({ carrinho, totalAPagar, setTotalAPagar, setCarrinho }) => {
  const valorZerado = totalAPagar === 0;

  const limparCarrinho = () => {
    setCarrinho([]);
    setTotalAPagar(0);
  };

  const handleChangeQuantidade = (produto, quantidade) => {
    quantidade = Math.max(quantidade, 0);

    if (quantidade === 0) {
      // Remove the item from the cart when its quantity is zero
      const novoCarrinho = carrinho.filter((item) => item.nome !== produto.nome);
      setCarrinho(novoCarrinho);
      // Subtract the price of the removed item from the total
      setTotalAPagar((prevTotal) => prevTotal - produto.preco * produto.quantidade);
    } else {
      const produtoExistente = carrinho.find((item) => item.nome === produto.nome);
      if (produtoExistente) {
        const novoCarrinho = carrinho.map((item) =>
          item.nome === produto.nome ? { ...item, quantidade } : item
        );
        setCarrinho(novoCarrinho);
        setTotalAPagar(
          (prevTotal) =>
            prevTotal + produto.preco * (quantidade - produtoExistente.quantidade)
        );
      }
    }
  };

  return (
    <form action="https://formspree.io/f/mqkobadr" method="POST">
      <div className="modal fade" id="modalConfirmar" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Confirmação de Pedido
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <input type="hidden" name="_subject" value="ENTREGA : Delivery" />
              <input type="hidden" name={`Valor a receber `} value={`R$${(totalAPagar / 100).toFixed(2)}`} />
              <div className="form-group">
                <label htmlFor="recipient-name" className="col-form-label">Nome</label>
                <input className="form-control" type="text" name="Nome" id="recipient-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-telefone" className="col-form-label">Telefone</label>
                <InputMask
                  mask="(99) 99999-9999"
                  maskChar=""
                  className="form-control"
                  type="text"
                  name="Telefone"
                  id="recipient-telefone"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-endereco" className="col-form-label">Endereço</label>
                <input className="form-control" type="text" name="Endereço" id="recipient-endereco" required />
              </div>
              <div>
                <h3>Lista de pedido</h3>
                {carrinho.map((produto, index) => (
                  <div key={index} className="form-group d-flex align-items-center justify-content-between">
                    <div>
                      <label htmlFor={`produto-${index}`} className="col-form-label">
                        {produto.nome} - R${(produto.preco / 100).toFixed(2)}
                      </label>
                      <input type="hidden" name={`Produto `} value={`Quantidade >  ${produto.quantidade} | ${produto.nome} - R$${(produto.preco / 100).toFixed(2)} `} />
                    </div>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleChangeQuantidade(produto, produto.quantidade - 1)} 
                      >
                        -
                      </button>
                      <input
                        className="form-control col-2"
                        type="number"
                        id={`produto-${index}`}
                        value={produto.quantidade}
                        onChange={(e) => handleChangeQuantidade(produto, parseInt(e.target.value))}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => handleChangeQuantidade(produto, produto.quantidade + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <strong>Total a pagar: R${(totalAPagar / 100).toFixed(2)}</strong>
              </div>
              <div className="form-group">
                <label htmlFor="recipient-observacao" className="col-form-label">Observação</label>
                <input className="form-control" type="text" name="Observação" id="recipient-observacao" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
              <button type="button" className="btn btn-danger" onClick={limparCarrinho}>
                Limpar Carrinho
              </button>
              <button type="submit" className="btn btn-primary" disabled={valorZerado}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ModalConfirmar;
