const apiUrl = 'https://exuberant-bloom-b9ed052e25.strapiapp.com/api/produtos?populate=*';
// Substitua ESTE_E_O_SEU_TOKEN_SECRETO pela string exata do seu token gerado no Strapi
const API_TOKEN='4a2fb4472373e898f9bb93a96d43d1f13edaeef02ef14a9ee1f7328d4c558b4e0660f2339650e2c59fe75e747fe623f77115ce5dfbad0cb331a8c4d3e297649cc4d957b86d6333f2de8c57168384f81e1d43fbf443684755ce1fb6552b4db85b50e8167394fcc108ad7b25965c709071a7eab9391df2ad7c4814bb4cd4a7d3bb';
// 1. Função principal para buscar os dados
async function carregarProdutos() {
        console.log("➡️ Função carregarProdutos() INICIOU");

    if (containerDeCards) {
        containerDeCards.innerHTML = '';
    }

    try {
        const response = await fetch(apiUrl, {

            method: 'GET',
            headers: {
                // Configura o tipo de conteúdo esperado (JSON)
                'Content-Type': 'application/json',
                
                // Adiciona o cabeçalho de Autorização no formato exigido pelo Strapi: Bearer [Token]
                'Authorization': `Bearer ${API_TOKEN}` 
            } 
        });                    console.log("🔄 Fazendo requisição para:", apiUrl);


        if (!response.ok) {
        console.log("📨 Resposta recebida:", response);

            // Lança um erro se a resposta não for bem-sucedida (incluindo 401 Unauthorized ou 403 Forbidden)
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}. Verifique se o token é válido e se a rota está configurada para acesso.`);
        }

        const jsonResponse = await response.json();
        
        // Acessa o array de produtos, que está dentro de 'data' no formato Strapi
        const produtos = jsonResponse.data; 

        // Renderiza os cards na tela
        criarCardsDeProdutos(produtos);

    } catch (error) {
        console.error('Falha ao carregar produtos:', error);
        if (containerDeCards) {
             containerDeCards.innerHTML = `<p class="erro">Não foi possível carregar os produtos. Detalhe: ${error.message}</p>`;
        }
    }
}

// 2. Função para criar e injetar o HTML dos cards
// function criarCardsDeProdutos(produtos) {
//     if (!containerDeCards) return; 

//     // Limpa o conteúdo anterior de "Carregando produtos..."
//     containerDeCards.innerHTML = ''; 

//     if (!produtos || produtos.length === 0) {
//         containerDeCards.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
//         return;
//     }

//     produtos.forEach(produto => {
//         // Acessa as chaves do Strapi: .attributes e o nome do seu campo (ex: Produto, Preco)
//         const attributes = produto.attributes;
//         const id = produto.id; 

//         // Mapeamento dos campos do seu JSON
//         const nome = attributes.Produto || 'Nome Indisponível';
//         const preco = attributes.Preco ? `R$ ${parseFloat(attributes.Preco).toFixed(2)}` : 'Preço Indisponível';
//         const descricao = attributes.descricao || 'Sem descrição.'; // Ajuste esta chave se ela for diferente no seu modelo
//         const imagemUrl = attributes.imagem_url || 'placeholder.jpg'; 

//         // Cria o elemento card principal
//         const card = document.createElement('div');
//         card.classList.add('card-produto');
//         card.setAttribute('data-produto-id', id);

//         // Preenche o card com o template HTML
//         card.innerHTML = `
//             <img src="${imagemUrl}" alt="Imagem do produto: ${nome}">
//             <div class="card-info">
//                 <h3>${nome}</h3>
//                 <p class="descricao">${descricao}</p>
//                 <p class="preco">${preco}</p>
//                 <button onclick="adicionarAoCarrinho(${id})">Adicionar</button>
//             </div>
//         `;

//         // Adiciona o card ao container
//         containerDeCards.appendChild(card);
//     });
// }
function criarCardsDeProdutos(produtos) {
    if (!containerDeCards) return;

    containerDeCards.innerHTML = '';

    if (!produtos || produtos.length === 0) {
        containerDeCards.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
        return;
    }

    produtos.forEach(produto => {
        console.log("Produto recebido:", produto);

        // 🚀 Agora acessando corretamente
        const nome = produto.Produto || 'Nome Indisponível';
        const preco = produto.Preco
            ? `R$ ${parseFloat(produto.Preco).toFixed(2)}`
            : 'Preço Indisponível';

        // Como não existe imagem/descrição na API ainda, valores padrão:
        const descricao = produto.descricao || 'Sem descrição.';
        const imagemUrl = produto.Imagem?.formats?.small?.url || produto.Imagem?.url || '';
console.log("imagem recebida");
        const card = document.createElement('div');
        card.classList.add('card-produto');
        card.setAttribute('data-produto-id', produto.id);

        card.innerHTML = `
            <img src="${imagemUrl}" alt="Imagem do produto: ${nome}">
            <div class="card-info">
                <h3>${nome}</h3>
                <p class="preco">${preco}</p>
            </div>
        `;

        containerDeCards.appendChild(card);
    });
}

// Inicia o carregamento dos produtos
carregarProdutos();