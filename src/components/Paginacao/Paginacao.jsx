import React from "react";

const Paginacao = ({ totalItens, itensPorPagina, paginaAtual, onChangePagina }) => {
  const numeroTotalPaginas = Math.ceil(totalItens / itensPorPagina);

  const handlePaginaAnterior = () => {
    onChangePagina(paginaAtual - 1);
  };

  const handlePaginaProxima = () => {
    onChangePagina(paginaAtual + 1);
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePaginaAnterior}>
            Comida
          </button>
        </li>

        {/* {Array.from({ length: numeroTotalPaginas }).map((_, index) => (
          <li key={index} className={`page-item ${paginaAtual === index + 1 ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChangePagina(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))} */}

        <li className={`page-item ${paginaAtual === numeroTotalPaginas ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePaginaProxima}>
            Bebida
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginacao;
