import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { NumericFormat } from "react-number-format";
import './ModalConfirmar.css';

const ModalConfirmar = ({ carrinho, totalAPagar, setTotalAPagar, setCarrinho }) => {
  const [formaPagamento, setFormaPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [mostrarTroco, setMostrarTroco] = useState(true);
  const [dataHoraEnvio, setDataHoraEnvio] = useState(""); // Estado para armazenar a data e hora

  useEffect(() => {
    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString("pt-BR");
    setDataHoraEnvio(dataHoraFormatada);
  }, []);

  const handleFormaPagamentoChange = (event) => {
    setFormaPagamento(event.target.value);
    setMostrarTroco(true);
  };

  const handleNaoTemTrocoClick = () => {
    setTroco("");
    setMostrarTroco(false);
  };

  const handleComTrocoClick = () => {
    setMostrarTroco(true);
  };

  const handleTrocoChange = (values) => {
    setTroco(values.floatValue || "");
  };

  const valorZerado = totalAPagar === 0 || (formaPagamento === "dinheiro" && troco === "");

  const limparCarrinho = () => {
    setCarrinho([]);
    setTotalAPagar(0);
  };

  const formatarValorEmReais = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const sendPedidoPorWhatsApp = () => {
    const pedidoFormatado = carrinho
      .map((produto, index) => `Produto ${index + 1}: ${produto.nome} - R$${(produto.preco / 100).toFixed(2)} x ${produto.quantidade}`)
      .join('\n');
  
    const endereco = document.getElementById("recipient-endereco").value;
    const metodoPagamento = document.getElementById("formaPagamento").value;
    
    let mensagem = `Olá! Gostaria de fazer o seguinte pedido:\n\n${pedidoFormatado}
    \n Endereço : ${endereco} 
    \n Método pagamento : ${metodoPagamento}`;
  
    if (formaPagamento === "dinheiro" && mostrarTroco) {
      mensagem += `\n\n Troco para: ${formatarValorEmReais(troco)}`;
    }
  
    mensagem += `\n\nTotal: R$${(totalAPagar / 100).toFixed(2)}`;
  
    const whatsappURL = `https://api.whatsapp.com/send?phone=+554796382724&text=${encodeURIComponent(mensagem)}`;
  
    window.open(whatsappURL, '_blank');
  };

  const handleChangeQuantidade = (produto, quantidade) => {
    quantidade = Math.max(quantidade, 0);

    if (quantidade === 0) {
      const novoCarrinho = carrinho.filter((item) => item.nome !== produto.nome);
      setCarrinho(novoCarrinho);
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
                Confirmação do Pedido
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div className="modal-body">
              <input type="hidden" name="Data e Hora do Pedido" value={dataHoraEnvio} />
              <input type="hidden" name="_subject" value="ENTREGA : Delivery" />
              <input type="hidden" name={`Valor a Receber `} value={`R$${(totalAPagar / 100).toFixed(2)}`} />
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
                  name="Forma de Pagamento"
                  value={formaPagamento}
                  onChange={handleFormaPagamentoChange}
                  required
                >
                  <option value="">Selecione a Forma de Pagamento</option>
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
                          value={formatarValorEmReais(troco)}
                          onValueChange={handleTrocoChange}
                          required={mostrarTroco}
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
                  {mostrarTroco && (
                    <div className="form-group" style={{ display: "none" }}>
                      <label htmlFor="troco" className="col-form-label">Troco para</label>
                      <input
                        className="form-control"
                        type="text"
                        name="Troco para"
                        id="troco"
                        value={formatarValorEmReais(troco)}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="recipient-endereco" className="col-form-label">Endereço</label>
                <input className="form-control" type="text" name="Endereço" id="recipient-endereco" required />
              </div>
              <div>
                <h3>Lista de Pedidos</h3>
                {carrinho.map((produto, index) => (
                  <div key={index} className="form-group d-flex align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <label htmlFor={`produto-${index}`} className="col-form-label mb-2">
                        {produto.nome} - R${(produto.preco / 100).toFixed(2)}
                      </label>
                      <input type="hidden" name={`Produto `} value={`Quantidade: ${produto.quantidade} | ${produto.nome} - R$${(produto.preco / 100).toFixed(2)} `} />
                    </div>
                    {produto.quantidade > 0 && (
                      <div className="input-group input-group-sm">
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
                          readOnly="true"
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
                <strong>Total a Pagar: R${(totalAPagar / 100).toFixed(2)}</strong>
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
                Limpar Pedido
              </button>
              <button type="submit" className="btn btn-primary" disabled={valorZerado} onClick={sendPedidoPorWhatsApp}>
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