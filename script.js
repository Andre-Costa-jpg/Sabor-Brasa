const nomes = ["", "Feijoada Completa", "Picanha na Brasa", "Moqueca de Peixe", "Risoto de Cogumelos", "Pastel de Queijo", "Bolinho de Bacalhau", "Pudim de Leite", "Brigadeiro Gourmet", "Suco Natural", "Caipirinha", "Feijão Tropeiro", "Frango com Quiabo", "Tutu de Feijão", "Vaca Atolada", "Leitão à Pururuca", "Pão de Queijo", "Torresmo Crocante", "Queijo Minas Frito", "Mandioca Frita", "Pastel de Angu", "Romeu e Julieta", "Bolo de Fubá", "Doce de Leite Caseiro", "Pé de Moleque", "Café Mineiro", "Cachaça de Salinas", "Quentão"];
const precos = [0, 49.90, 69.90, 59.90, 52.00, 14.90, 24.90, 16.00, 12.00, 9.90, 18.00, 38.90, 42.00, 44.90, 58.00, 64.90, 19.90, 26.90, 28.90, 22.00, 21.90, 15.90, 13.50, 14.90, 11.90, 6.90, 16.90, 12.90];
const totalProdutos = 27;

function lerCarrinho() {
  const texto = localStorage.getItem("carrinho");
  const carrinho = [];

  if (texto !== null) {
    const salvo = JSON.parse(texto);
    for (let i = 0; i < salvo.length; i++) {
      carrinho.push(salvo[i]);
    }
  }

  while (carrinho.length <= totalProdutos) {
    carrinho.push(0);
  }

  return carrinho;
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function lerContas() {
  const texto = localStorage.getItem("contas");
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function salvarContas(contas) {
  localStorage.setItem("contas", JSON.stringify(contas));
}

function lerUsuario() {
  const texto = localStorage.getItem("usuario");
  if (texto === null) {
    return null;
  }
  return JSON.parse(texto);
}

function lerPedidos() {
  const texto = localStorage.getItem("pedidos");
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function salvarPedidos(pedidos) {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function semSenha(conta) {
  return {
    nome: conta.nome,
    cpf: conta.cpf,
    nasc: conta.nasc,
    tel: conta.tel,
    cep: conta.cep,
    endereco: conta.endereco,
    numero: conta.numero,
    email: conta.email
  };
}

function contarItens(carrinho) {
  let quantidade = 0;
  for (let i = 1; i <= totalProdutos; i++) {
    quantidade = quantidade + carrinho[i];
  }
  return quantidade;
}

function calcularTotal(carrinho) {
  let total = 0;
  for (let i = 1; i <= totalProdutos; i++) {
    total = total + precos[i] * carrinho[i];
  }
  return total;
}

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function doisDigitos(numero) {
  return ("0" + numero).slice(-2);
}

function dataAgora() {
  const agora = new Date();
  return doisDigitos(agora.getDate()) + "/" + doisDigitos(agora.getMonth() + 1) + "/" + agora.getFullYear() + " " + doisDigitos(agora.getHours()) + ":" + doisDigitos(agora.getMinutes());
}

function baixarJson() {
  const contas = lerContas();
  const clientes = [];
  for (let i = 0; i < contas.length; i++) {
    clientes.push({
      nome: contas[i].nome,
      cpf: contas[i].cpf,
      nascimento: contas[i].nasc,
      email: contas[i].email,
      telefone: contas[i].tel,
      cep: contas[i].cep,
      endereco: contas[i].endereco,
      numero: contas[i].numero
    });
  }

  const produtos = [];
  for (let i = 1; i <= totalProdutos; i++) {
    produtos.push({ id: i, nome: nomes[i], preco: precos[i] });
  }

  const arquivo = { pedidos: lerPedidos(), clientes: clientes, produtos: produtos };
  const texto = JSON.stringify(arquivo, null, 2);

  const blob = new Blob([texto], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pedidos.json";
  link.click();
}

const aviso = document.getElementById("aviso");

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add("mostrar");
  setTimeout(function () {
    aviso.classList.remove("mostrar");
  }, 2200);
}

const btnTema = document.getElementById("btn-tema");

if (localStorage.getItem("tema") === "claro") {
  document.body.classList.add("tema-claro");
  btnTema.textContent = "☀️";
}

btnTema.addEventListener("click", function () {
  document.body.classList.toggle("tema-claro");
  const claro = document.body.classList.contains("tema-claro");
  btnTema.textContent = claro ? "☀️" : "🌙";
  localStorage.setItem("tema", claro ? "claro" : "escuro");
});

const modalLogin = document.getElementById("modal-login");
const btnLogin = document.getElementById("btn-login");
const btnFechar = document.getElementById("fechar-modal");
const formLogin = document.getElementById("form-login");
const erroLogin = document.getElementById("erro-login");

btnLogin.addEventListener("click", function () {
  modalLogin.showModal();
});

btnFechar.addEventListener("click", function () {
  modalLogin.close();
});

modalLogin.addEventListener("click", function (event) {
  if (event.target === modalLogin) {
    modalLogin.close();
  }
});

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;
  const contas = lerContas();
  let achou = null;

  for (let i = 0; i < contas.length; i++) {
    if (contas[i].email === email && contas[i].senha === senha) {
      achou = contas[i];
    }
  }

  if (achou !== null) {
    localStorage.setItem("usuario", JSON.stringify(semSenha(achou)));
    location.reload();
  } else {
    erroLogin.classList.remove("escondido");
  }
});

const linkLogin = document.getElementById("link-login");

if (linkLogin !== null) {
  linkLogin.addEventListener("click", function (event) {
    event.preventDefault();
    modalLogin.showModal();
  });
}

const formBusca = document.getElementById("form-busca");

formBusca.addEventListener("submit", function (event) {
  event.preventDefault();
  const busca = document.getElementById("busca-header").value.trim();
  location.href = "produtos.html?q=" + encodeURIComponent(busca);
});

const usuario = lerUsuario();

if (usuario !== null) {
  const saudacao = document.getElementById("saudacao");
  saudacao.textContent = "Olá, " + usuario.nome.split(" ")[0];
  saudacao.classList.remove("escondido");
  document.getElementById("btn-sair").classList.remove("escondido");
  document.getElementById("btn-login").classList.add("escondido");
  document.getElementById("btn-cadastro").classList.add("escondido");
}

document.getElementById("btn-sair").addEventListener("click", function () {
  localStorage.removeItem("usuario");
  location.href = "index.html";
});

function atualizarContador() {
  document.getElementById("contador").textContent = contarItens(lerCarrinho());
}

atualizarContador();

document.querySelectorAll(".btn-add").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const id = Number(botao.getAttribute("data-id"));
    const carrinho = lerCarrinho();
    carrinho[id] = carrinho[id] + 1;
    salvarCarrinho(carrinho);
    atualizarContador();
    mostrarAviso("Adicionado ao carrinho!");
  });
});

const extensoes = ["jpg", "png", "webp", "jpeg"];

function carregarFoto(foto) {
  const id = foto.getAttribute("data-id");
  let tentativa = 0;

  function tentarProxima() {
    if (tentativa >= extensoes.length) {
      return;
    }
    foto.src = "imagens/" + id + "." + extensoes[tentativa];
    tentativa = tentativa + 1;
  }

  foto.addEventListener("error", tentarProxima);

  foto.addEventListener("load", function () {
    foto.classList.remove("escondido");
    foto.parentElement.classList.add("tem-foto");
  });

  tentarProxima();
}

document.querySelectorAll(".card-foto").forEach(function (foto) {
  carregarFoto(foto);
});

function mascaraCpf(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  let resultado = numeros;

  if (numeros.length > 3) {
    resultado = numeros.slice(0, 3) + "." + numeros.slice(3, 6);
  }

  if (numeros.length > 6) {
    resultado = numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6, 9);
  }

  if (numeros.length > 9) {
    resultado = numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6, 9) + "-" + numeros.slice(9, 11);
  }

  return resultado;
}

function mascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  let resultado = numeros;

  if (numeros.length > 0) {
    resultado = "(" + numeros.slice(0, 2);
  }

  if (numeros.length > 2) {
    resultado = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7);
  }

  if (numeros.length > 7) {
    resultado = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7, 11);
  }

  return resultado;
}

function mascaraCep(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  let resultado = numeros;

  if (numeros.length > 5) {
    resultado = numeros.slice(0, 5) + "-" + numeros.slice(5, 8);
  }

  return resultado;
}

function mascaraData(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  let resultado = numeros;

  if (numeros.length > 2) {
    resultado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4);
  }

  if (numeros.length > 4) {
    resultado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4) + "/" + numeros.slice(4, 8);
  }

  return resultado;
}

const campoNome = document.getElementById("nome");
const campoCpf = document.getElementById("cpf");
const campoNasc = document.getElementById("nasc");
const campoTel = document.getElementById("tel");
const campoCep = document.getElementById("cep");
const campoNumero = document.getElementById("numero");

if (campoNome !== null) {
  campoNome.addEventListener("input", function () {
    campoNome.value = campoNome.value.replace(/[^A-Za-zÀ-ÿ' ]/g, "");
  });

  campoCpf.addEventListener("input", function () {
    campoCpf.value = mascaraCpf(campoCpf.value);
  });

  campoNasc.addEventListener("input", function () {
    campoNasc.value = mascaraData(campoNasc.value);
  });

  campoTel.addEventListener("input", function () {
    campoTel.value = mascaraTelefone(campoTel.value);
  });

  campoCep.addEventListener("input", function () {
    campoCep.value = mascaraCep(campoCep.value);
  });

  campoNumero.addEventListener("input", function () {
    campoNumero.value = campoNumero.value.replace(/\D/g, "");
  });
}

if (document.body.id === "pagina-produtos") {
  const filtroTexto = document.getElementById("filtro-texto");
  const cartoes = document.querySelectorAll(".card-produto");
  const botoesFiltro = document.querySelectorAll(".btn-filtro");
  const semProdutos = document.getElementById("sem-produtos");
  let categoriaAtual = "Todos";

  function filtrarProdutos() {
    const busca = filtroTexto.value.toLowerCase();
    let encontrados = 0;

    cartoes.forEach(function (cartao) {
      const texto = cartao.textContent.toLowerCase();
      let categoriaCerta = false;

      if (categoriaAtual === "Todos") {
        categoriaCerta = true;
      } else if (categoriaAtual === "Mineiros") {
        categoriaCerta = cartao.getAttribute("data-origem") === "Minas";
      } else {
        categoriaCerta = cartao.getAttribute("data-categoria") === categoriaAtual;
      }

      const textoCerto = texto.includes(busca);

      if (categoriaCerta && textoCerto) {
        cartao.classList.remove("escondido");
        encontrados = encontrados + 1;
      } else {
        cartao.classList.add("escondido");
      }
    });

    if (encontrados === 0) {
      semProdutos.classList.remove("escondido");
    } else {
      semProdutos.classList.add("escondido");
    }
  }

  filtroTexto.addEventListener("input", filtrarProdutos);

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
      categoriaAtual = botao.getAttribute("data-categoria");
      botoesFiltro.forEach(function (outro) {
        outro.classList.remove("ativo");
      });
      botao.classList.add("ativo");
      filtrarProdutos();
    });
  });

  if (location.search.startsWith("?q=")) {
    const busca = decodeURIComponent(location.search.slice(3));
    filtroTexto.value = busca;
    document.getElementById("busca-header").value = busca;
    filtrarProdutos();
  }
}

if (document.body.id === "pagina-carrinho") {
  const carrinhoVazio = document.getElementById("carrinho-vazio");
  const textoTotal = document.getElementById("total");

  function atualizarCarrinho() {
    const carrinho = lerCarrinho();

    for (let i = 1; i <= totalProdutos; i++) {
      const linha = document.getElementById("linha-" + i);
      if (carrinho[i] > 0) {
        linha.classList.remove("escondido");
        document.getElementById("qtd-" + i).textContent = carrinho[i];
      } else {
        linha.classList.add("escondido");
      }
    }

    if (contarItens(carrinho) === 0) {
      carrinhoVazio.classList.remove("escondido");
    } else {
      carrinhoVazio.classList.add("escondido");
    }

    textoTotal.textContent = formatarPreco(calcularTotal(carrinho));
    atualizarContador();
  }

  document.querySelectorAll(".btn-qtd").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = Number(botao.getAttribute("data-id"));
      const carrinho = lerCarrinho();

      if (botao.getAttribute("data-acao") === "mais") {
        carrinho[id] = carrinho[id] + 1;
      } else {
        carrinho[id] = carrinho[id] - 1;
      }

      if (carrinho[id] < 0) {
        carrinho[id] = 0;
      }

      salvarCarrinho(carrinho);
      atualizarCarrinho();
    });
  });

  document.querySelectorAll(".btn-remover").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = Number(botao.getAttribute("data-id"));
      const carrinho = lerCarrinho();
      carrinho[id] = 0;
      salvarCarrinho(carrinho);
      atualizarCarrinho();
    });
  });

  document.getElementById("btn-finalizar").addEventListener("click", function () {
    const carrinho = lerCarrinho();

    if (contarItens(carrinho) === 0) {
      mostrarAviso("Carrinho vazio");
      return;
    }

    if (usuario === null) {
      mostrarAviso("Faça login para finalizar");
      modalLogin.showModal();
      return;
    }

    const cliente = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      nascimento: usuario.nasc,
      email: usuario.email,
      telefone: usuario.tel,
      cep: usuario.cep,
      endereco: usuario.endereco,
      numero: usuario.numero
    };

    const itens = [];
    let total = 0;

    for (let i = 1; i <= totalProdutos; i++) {
      if (carrinho[i] > 0) {
        itens.push({
          produto: i,
          nome: nomes[i],
          quantidade: carrinho[i],
          preco: precos[i]
        });
        total = total + precos[i] * carrinho[i];
      }
    }

    const pedido = {
      codigo: Date.now().toString(),
      data: dataAgora(),
      cliente: cliente,
      itens: itens,
      total: Math.round(total * 100) / 100
    };

    const pedidos = lerPedidos();
    pedidos.push(pedido);
    salvarPedidos(pedidos);
    localStorage.removeItem("carrinho");

    baixarJson();
    mostrarAviso("Pedido feito! Arquivo pedidos.json salvo.");

    setTimeout(function () {
      location.href = "pedidos.html";
    }, 900);
  });

  atualizarCarrinho();
}

if (document.body.id === "pagina-pedidos") {
  const campoBusca = document.getElementById("busca-pedido");
  const semPedidos = document.getElementById("sem-pedidos");

  function mostrarPedidos() {
    const todos = lerPedidos();
    const busca = campoBusca.value;
    let espaco = 1;

    for (let i = todos.length - 1; i >= 0; i--) {
      const pedido = todos[i];

      if (pedido.cliente.email !== usuario.email) {
        continue;
      }

      if (!pedido.codigo.includes(busca)) {
        continue;
      }

      let textoItens = "";
      for (let j = 0; j < pedido.itens.length; j++) {
        if (j > 0) {
          textoItens = textoItens + ", ";
        }
        textoItens = textoItens + pedido.itens[j].quantidade + "× " + pedido.itens[j].nome;
      }

      if (espaco <= 10) {
        document.getElementById("numero-" + espaco).textContent = pedido.codigo;
        document.getElementById("status-" + espaco).textContent = "Enviado";
        document.getElementById("data-" + espaco).textContent = pedido.data;
        document.getElementById("itens-" + espaco).textContent = textoItens;
        document.getElementById("total-" + espaco).textContent = formatarPreco(pedido.total);
        document.getElementById("pedido-" + espaco).classList.remove("escondido");
        espaco = espaco + 1;
      }
    }

    for (let k = espaco; k <= 10; k++) {
      document.getElementById("pedido-" + k).classList.add("escondido");
    }

    if (espaco === 1) {
      semPedidos.classList.remove("escondido");
    } else {
      semPedidos.classList.add("escondido");
    }
  }

  campoBusca.addEventListener("input", function () {
    campoBusca.value = campoBusca.value.replace(/\D/g, "");
    if (usuario !== null) {
      mostrarPedidos();
    }
  });

  document.getElementById("btn-baixar").addEventListener("click", function () {
    baixarJson();
    mostrarAviso("Arquivo pedidos.json salvo!");
  });

  if (usuario !== null) {
    document.getElementById("aviso-login").classList.add("escondido");
    mostrarPedidos();
  } else {
    semPedidos.classList.add("escondido");
  }
}

if (document.body.id === "pagina-cadastro") {
  const formCadastro = document.getElementById("form-cadastro");

  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const conta = {
      nome: document.getElementById("nome").value.trim(),
      cpf: document.getElementById("cpf").value,
      nasc: document.getElementById("nasc").value,
      tel: document.getElementById("tel").value,
      cep: document.getElementById("cep").value,
      endereco: document.getElementById("endereco").value.trim(),
      numero: document.getElementById("numero").value,
      email: document.getElementById("email").value.trim(),
      senha: document.getElementById("senha").value
    };
    const confirmacao = document.getElementById("senha2").value;

    if (conta.cpf.replace(/\D/g, "").length !== 11) {
      mostrarAviso("CPF incompleto");
      return;
    }

    if (conta.nasc.replace(/\D/g, "").length !== 8) {
      mostrarAviso("Data de nascimento incompleta");
      return;
    }

    if (conta.tel.replace(/\D/g, "").length < 10) {
      mostrarAviso("Telefone incompleto");
      return;
    }

    if (conta.cep.replace(/\D/g, "").length !== 8) {
      mostrarAviso("CEP incompleto");
      return;
    }

    if (conta.senha !== confirmacao) {
      mostrarAviso("As senhas não conferem");
      return;
    }

    const contas = lerContas();
    for (let i = 0; i < contas.length; i++) {
      if (contas[i].email === conta.email || contas[i].cpf === conta.cpf) {
        mostrarAviso("E-mail ou CPF já cadastrado");
        return;
      }
    }

    contas.push(conta);
    salvarContas(contas);
    localStorage.setItem("usuario", JSON.stringify(semSenha(conta)));
    mostrarAviso("Cadastro realizado!");

    setTimeout(function () {
      location.href = "perfil.html";
    }, 800);
  });
}

if (document.body.id === "pagina-perfil") {
  if (usuario !== null) {
    document.getElementById("aviso-perfil").classList.add("escondido");
    document.getElementById("caixa-perfil").classList.remove("escondido");

    document.getElementById("nome").value = usuario.nome;
    document.getElementById("cpf").value = usuario.cpf;
    document.getElementById("nasc").value = usuario.nasc;
    document.getElementById("tel").value = usuario.tel;
    document.getElementById("cep").value = usuario.cep;
    document.getElementById("endereco").value = usuario.endereco;
    document.getElementById("numero").value = usuario.numero;
    document.getElementById("email").value = usuario.email;
  }

  document.getElementById("form-perfil").addEventListener("submit", function (event) {
    event.preventDefault();

    const contas = lerContas();

    for (let i = 0; i < contas.length; i++) {
      if (contas[i].email === usuario.email) {
        contas[i].nome = document.getElementById("nome").value.trim();
        contas[i].nasc = document.getElementById("nasc").value;
        contas[i].tel = document.getElementById("tel").value;
        contas[i].cep = document.getElementById("cep").value;
        contas[i].endereco = document.getElementById("endereco").value.trim();
        contas[i].numero = document.getElementById("numero").value;

        salvarContas(contas);
        localStorage.setItem("usuario", JSON.stringify(semSenha(contas[i])));
        document.getElementById("saudacao").textContent = "Olá, " + contas[i].nome.split(" ")[0];
      }
    }

    mostrarAviso("Dados atualizados!");
  });
}
