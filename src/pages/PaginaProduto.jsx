import { useState } from 'react'
import { Link, useParams } from 'react-router'

import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'

const CHAVE_ALERTAS = 'techstore-alertas'

function lerAlertas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ALERTAS) || '{}')
  } catch {
    return {}
  }
}

function salvarAlertas(alertas) {
  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify(alertas))
}

function eEmailGmailValido(email) {
  return typeof email === 'string' && email.trim().toLowerCase().endsWith('@gmail.com')
}

export default function PaginaProduto({ produtos, onAdicionar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

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

  function registrarInteresse(evento) {
    evento.preventDefault()

    const emailLimpo = email.trim()
    const nomeLimpo = nome.trim()

    if (!nomeLimpo || !emailLimpo) {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
      return
    }

    if (!eEmailGmailValido(emailLimpo)) {
      setMensagem('Use um e-mail do Gmail para entrar na lista de espera.')
      return
    }

    const alertas = lerAlertas()
    const listaAtual = Array.isArray(alertas[produto.id]) ? alertas[produto.id].filter((item) => eEmailGmailValido(item.email)) : []
    const jaCadastrado = listaAtual.some(
      (item) => item.email.toLowerCase() === emailLimpo.toLowerCase()
    )

    if (jaCadastrado) {
      setMensagem('Você já está na lista de espera para este produto.')
      return
    }

    alertas[produto.id] = [...listaAtual, { nome: nomeLimpo, email: emailLimpo }]
    salvarAlertas(alertas)
    setMensagem('Você foi adicionado à lista de espera.')
    setNome('')
    setEmail('')
  }

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

          {produto.estoque === 0 ? (
            <form onSubmit={registrarInteresse}>
              <p className="aviso">Produto esgotado. Deixe seu nome e e-mail para receber aviso.</p>
              <input
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
              />
              <button type="submit" className="botao botao-grande">
                Avise-me quando voltar
              </button>
              {mensagem && <p>{mensagem}</p>}
            </form>
          ) : (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!podeAdicionar}
            >
              {precoDisponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
