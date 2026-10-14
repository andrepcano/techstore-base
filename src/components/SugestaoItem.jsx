import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { calcularValorParaFreteGratis } from '../utils/carrinho'

export default function SugestaoItem({ produto, onAdicionar }) {
  const precoNumerico = Number(produto.price)
  const precoDisponivel = Number.isFinite(precoNumerico)
  const valorParaFreteGratis = precoDisponivel ? calcularValorParaFreteGratis(precoNumerico) : 0
  const temFreteGratis = precoDisponivel && precoNumerico >= 200

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <Link to={`/produto/${produto.id}`} className="card-link">
          <p className="sugestao-titulo">{produto.title}</p>
        </Link>
        <p className="preco preco-pequeno">{precoDisponivel ? formatarPreco(produto.price) : 'Preço indisponível'}</p>
        {precoDisponivel && temFreteGratis && <span className="selo selo-frete">Frete grátis</span>}
      </div>
      <button className="botao botao-pequeno" onClick={() => onAdicionar(produto)} disabled={!precoDisponivel}>
        Comprar
      </button>
    </div>
  )
}
