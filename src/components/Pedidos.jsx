import styles from "@/styles/Pedidos.module.css";

import React from "react";

export default class Pedidos extends React.Component {
    state = { pedidos: [] };

    // Inclui na lista o pedido recebido pelo evento personalizado.
    adicionarPedido = (event) => {
        const item = event.detail;
        this.setState(({ pedidos }) => ({
            pedidos: (() => {
                const index = pedidos.findIndex((pedido) => (
                    pedido.id != null && item.id != null
                        ? pedido.id === item.id
                        : pedido.nome === item.nome && pedido.preco === item.preco
                ));

                if (index === -1) {
                    return [...pedidos, { ...item, quantidade: 1 }];
                }

                return pedidos.map((pedido, pedidoIndex) => (
                    pedidoIndex === index
                        ? { ...pedido, quantidade: (pedido.quantidade || 1) + 1 }
                        : pedido
                ));
            })(),
        }));
    };

    alterarQuantidade = (item, alteracao) => {
        this.setState(({ pedidos }) => ({
            pedidos: pedidos
                .map((pedido) => {
                    const corresponde = pedido.id != null && item.id != null
                        ? pedido.id === item.id
                        : pedido.nome === item.nome && pedido.preco === item.preco;

                    return corresponde
                        ? { ...pedido, quantidade: (pedido.quantidade || 1) + alteracao }
                        : pedido;
                })
                .filter((pedido) => pedido.quantidade > 0),
        }));
    };

    // Gerencia o listener conforme o ciclo de vida do componente.
    componentDidMount() {
        window.addEventListener('adicionarAoPedido', this.adicionarPedido);
    }

    componentWillUnmount() {
        window.removeEventListener('adicionarAoPedido', this.adicionarPedido);
    }

    render() {
        const { pedidos } = this.state;

        return (
            <div className={styles.container}>
                <h2 className={styles.h2}>Pedidos</h2>
                <div className={styles.pedidos}>
                    {pedidos.length === 0 ? (
                        <p className={styles.p}>Nenhum pedido adicionado.</p>
                    ) : (
                        <ul className={styles.lista}>
                            {pedidos.map((item) => (
                                <li
                                    key={item.id ?? `${item.nome}-${item.preco}`}
                                    className={styles.item}
                                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <span>
                                        {item.nome} - R$ {(item.preco * (item.quantidade || 1)).toFixed(2)}
                                    </span>
                                    <span className={styles.quantidadeControls}>
                                        <button
                                            type="button"
                                            aria-label={`Adicionar ${item.nome}`}
                                            onClick={() => this.alterarQuantidade(item, 1)}
                                            className={styles.adicionarButton}
                                        >+</button>
                                        <span>
                                            {item.quantidade || 1}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Retirar ${item.nome}`}
                                            onClick={() => this.alterarQuantidade(item, -1)}
                                            className={styles.retirarButton}
                                        >−</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {/* Exibe o total acumulado dos pedidos. */}
                    <div className={styles.total}>
                        <strong>Total: R$ {pedidos.reduce((total, item) => total + item.preco * (item.quantidade || 1), 0).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        );
    }
}
