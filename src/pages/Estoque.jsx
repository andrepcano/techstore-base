const CHAVE_ALERTAS = 'techstore-alertas'

function lerAlertas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ALERTAS) || '{}')
  } catch {
    return {}
  }
}

function eEmailGmailValido(email) {
  return typeof email === 'string' && email.trim().toLowerCase().endsWith('@gmail.com')
}

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const alertas = lerAlertas()

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Esperando voltar</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const listaEspera = Array.isArray(alertas[produto.id])
                ? alertas[produto.id].filter((item) => eEmailGmailValido(item.email))
                : []

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                  <td>
                    {listaEspera.length > 0 ? (
                      <ul>
                        {listaEspera.map((item, index) => (
                          <li key={`${produto.id}-${index}`}>
                            {item.nome} — {item.email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Nenhum'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
