import React, { useState } from "react";
import InputMask from "react-input-mask";
import { NumericFormat } from "react-number-format";
import './ModalConfirmar.css'

const ModalConfirmar = ({ carrinho, totalAPagar, setTotalAPagar, setCarrinho }) => {

  const [formaPagamento, setFormaPagamento] = useState(""); // Estado para a forma de pagamento
  const [troco, setTroco] = useState(""); // Estado para a quantidade de troco
  const [mostrarTroco, setMostrarTroco] = useState(false);

  const handleFormaPagamentoChange = (event) => {
    setFormaPagamento(event.target.value);
    setMostrarTroco(true); // Mostrar o campo de troco sempre que a forma de pagamento for "dinheiro"
  };

  const handleNaoTemTrocoClick = () => {
    setTroco("");
    setMostrarTroco(false); // Esconder o campo de troco quando o botão "Sem Troco" for clicado
  };

  const handleComTrocoClick = () => {
    setMostrarTroco(true); // Mostrar o campo de troco quando o botão "Com Troco" for clicado
  };




  const handleTrocoChange = (values) => {
    setTroco(values.floatValue || ""); // Mantenha o valor vazio se for inválido
  };



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
                <label htmlFor="formaPagamento" className="col-form-label">Forma de Pagamento</label>
                <select
                  className="form-control"
                  id="formaPagamento"
                  name="Forma de Pagamento" // Adicione o nome do campo
                  value={formaPagamento}
                  onChange={handleFormaPagamentoChange}
                  required
                >
                  <option value="">Selecione a forma de pagamento</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">Pix</option>
                </select>
              </div>
              {formaPagamento === "dinheiro" && (
                <div>
                  <div className="form-group">
                    {mostrarTroco && (
                      <div className="input-group">
                        <span className="input-group-text">R$</span>
                        <NumericFormat
                          className="form-control"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale={true}
                          prefix=""
                          placeholder="Troco para..."
                          allowNegative={false}
                          value={troco}
                          onValueChange={handleTrocoChange}
                          required={mostrarTroco} // Defina a obrigatoriedade baseada em mostrarTroco
                        />
                      </div>
                    )}
                  </div>
                  {!mostrarTroco ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleComTrocoClick}
                    >
                      Com Troco
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleNaoTemTrocoClick}
                    >
                      Sem Troco
                    </button>
                  )}
                </div>
              )}
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
                    {produto.quantidade > 0 && (
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
                    )}
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
                Limpar pedido
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
