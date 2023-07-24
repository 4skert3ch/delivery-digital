import './Nav.css'
import React from 'react'

const Navbar = ({ totalAPagar, setTotalAPagar, setCarrinho }) => {
  
  const valorZerado = totalAPagar === 0;
  const limparPedido = () => {
    setTotalAPagar(0);
    setCarrinho([])
  };

  return (
    <aside className="menu-area">
      <nav className="menu">
        <div className='row'>   
          <a href="#/" className='col-12'>
            <div className="contador">
              <label id="backContador">Total a pagar<p id="contador" className="form-control">R${(totalAPagar / 100).toFixed(2)}</p></label>
            </div>
          </a>
          <button type="button" className="btn btn-success col-6" data-bs-toggle="modal" data-bs-target="#modalConfirmar" id="btnRequest" disabled={valorZerado}>
            <i className="fa fa-cutlery" aria-hidden="true"></i> Pedir lanche
          </button>
          <button type="button" className="btn btn-danger col-6" id="btnRequest" onClick={limparPedido} disabled={valorZerado}>
            <i className="fa fa-trash" aria-hidden="true"></i> Limpar pedido
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;
