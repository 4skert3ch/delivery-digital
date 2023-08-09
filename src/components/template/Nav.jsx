import './Nav.css';
import React, { useEffect, useState } from 'react';

const Navbar = ({ totalAPagar, setTotalAPagar, setCarrinho, isAberto }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const valorZerado = totalAPagar === 0;

  const limparPedido = () => {
    setTotalAPagar(0);
    setCarrinho([]);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const instalarApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
          } else {
            console.log('Usuário rejeitou a instalação');
          }
          setDeferredPrompt(null);
        })
        .catch((error) => {
          console.error('Erro ao tratar a escolha do usuário:', error);
        });
    }
  };

  return (
    <aside className="menu-area">
      <nav className="menu">
        <div className="row">
          {/* Check if the establishment is open and apply appropriate styling */}
          <span
            id="backStatus"
            className={`badge badge-${isAberto ? 'success' : 'danger'}`}
          >
            <strong id="txtStatus">
              {isAberto ? 'Estabelecimento aberto' : 'Estabelecimento fechado'}
            </strong>
          </span>
  
          <a className="col-12">
            <div className="contador">
              <label id="backContador">
                Total a pagar
                <p id="contador" className="form-control">
                  R${(totalAPagar / 100).toFixed(2)}
                </p>
              </label>
              {!isDesktop && !isAppInstalled && (
                <button
                  className="btn btn-success instalarApp"
                  onClick={instalarApp}
                  style={{ display: isAppInstalled ? 'none' : 'block' }}
                >
                  Instalar aplicativo
                </button>
              )}
            </div>
          </a>
          <button
            type="button"
            className="btn btn-success col-6"
            data-bs-toggle="modal"
            data-bs-target="#modalConfirmar"
            id="btnRequest"
            disabled={valorZerado}
          >
            <i className="fa fa-cutlery" aria-hidden="true"></i> Pedir lanche
          </button>
          <button
            type="button"
            className="btn btn-danger col-6"
            id="btnRequest"
            onClick={limparPedido}
            disabled={valorZerado}
          >
            <i className="fa fa-trash" aria-hidden="true"></i> Limpar pedido
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;
