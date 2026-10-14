import { Link, useParams } from 'react-router'

import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoDisponivel = Number.isFinite(Number(produto.price))
  const podeAdicionar = produto.estoque > 0 && precoDisponivel

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoDisponivel ? formatarPreco(produto.price) : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={!podeAdicionar}
          >
            {precoDisponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
          </button>

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => {
          const itemPrecoDisponivel = Number.isFinite(Number(item.price))
          const itemPodeAdicionar = item.estoque > 0 && itemPrecoDisponivel

          return (
            <article key={item.id} className="card">
              <Link to={`/produto/${item.id}`} className="card-link">
                <div className="card-imagem-moldura">
                  <img src={item.image} alt={item.title} className="card-imagem" />
                </div>
                <h3 className="card-titulo">{item.title}</h3>
              </Link>
              <p className="preco">
                {itemPrecoDisponivel ? formatarPreco(item.price) : 'Preço indisponível'}
              </p>
              <button className="botao" onClick={() => onAdicionar(item)} disabled={!itemPodeAdicionar}>
                {itemPrecoDisponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
