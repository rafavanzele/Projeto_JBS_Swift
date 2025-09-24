
document.addEventListener("DOMContentLoaded", () => {
    // PAGE HOME-MISSOES
    if (document.querySelector(".missao-container")) {
        const cards = Array.from(document.querySelectorAll(".card-missao"));
        const botoes = Array.from(document.querySelectorAll(".card-missao .btn"));
        const medalha = document.querySelector(".medalha");
        const placar = document.getElementById("placar");

        if (!cards.length || !botoes.length || !medalha) {
            console.warn("Confere as classes .card-missao, .card-missao .btn e .medalha no HTML.");
            return;
        }

        let concluidas = 0;
        let pontos = 0;
        const total = cards.length;

        // pegando número da badge (+150 pts)
        function pontosDaBadge(card) {
            const badge = card.querySelector(".badge");
            if (!badge) return 0;
            const match = badge.textContent.match(/(\d+)/); // pega os dígitos
            return match ? parseInt(match[1], 10) : 0;
        }

        // botões não enviam o formulário sem querer
        botoes.forEach(btn => {
            if (!btn.getAttribute("type")) btn.setAttribute("type", "button");
        });

        botoes.forEach(btn => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".card-missao");
                if (!card || card.classList.contains("concluida")) return;

                // marca concluída
                card.classList.add("concluida");
                btn.textContent = "Concluída";
                btn.disabled = true;

                // soma pontos
                pontos += pontosDaBadge(card);
                if (placar) placar.textContent = `${pontos} pts`;

                // conta concluídas
                concluidas++;

                // se todas foram concluídas, mostra medalha
                if (concluidas === total) {
                    medalha.classList.add("show");
                }
            });
        });
        /*
        // ação do botão "Pegar medalha" (opcional)
        const btnPegar = document.querySelector(".medalha .btn-pegar");
        if (btnPegar) {
            btnPegar.addEventListener("click", () => {
                alert("Medalha adicionada ao seu perfil! 🏅");
            });
        }
        */
    }




    // GAME PAGE
    if (document.querySelector(".mapa-game")) {

        const caminho = document.querySelector(".caminho");

        //recupera o progresso do usuario (caso o usuário não tenha começado ainda, começa na posição 1 do mapa)
        let posicaoAtual = parseInt(localStorage.getItem("posicaoAtual")) || 1;
        let ultimaData = localStorage.getItem("ultimaData");


        //Checando se passou 24h
        const agora = new Date();
        if (ultimaData) {
            const ultima = new Date(ultimaData);
            const diffHoras = (agora - ultima) / (1000 * 60 * 60);

            if (diffHoras >= 24) {
                posicaoAtual++;
                localStorage.setItem("ultimaData", agora);
            }
        } else {
            localStorage.setItem("ultimaData", agora);
        }

        localStorage.setItem("posicaoAtual", posicaoAtual);


        //chamar funcao etapas disponiveis:
        renderizarEtapas(caminho, posicaoAtual);

        //Etapa ativa:
        document.querySelectorAll(".etapa").forEach((etapa, index) => {
            etapa.classList.toggle("ativo", index + 1 === posicaoAtual);
        })
    }
});



//Funcao renderizar (add) etapas
function renderizarEtapas(caminho, posicaoAtual) {
    const etapasExistentes = caminho.querySelectorAll(".etapa").length;

    // Se não tiver etapas suficientes, cria novas
    if (etapasExistentes < posicaoAtual) {
        for (let i = etapasExistentes + 1; i <= posicaoAtual; i++) {
            // Corações entre etapas
            const coracoes = document.createElement("div");
            coracoes.classList.add("caminho-game");
            coracoes.innerHTML = `
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>`;

            // Zig-zag dos corações
            if (i % 2 === 1) {
                coracoes.style.marginLeft = "3rem";
                coracoes.style.transform = "rotate(-30deg)";
            } else {
                coracoes.style.marginRight = "3rem";
                coracoes.style.transform = "rotate(30deg)";
            }
            caminho.appendChild(coracoes);

            // Etapa nova
            const etapa = document.createElement("figure");
            etapa.classList.add("etapa", `etapa-${i}`);
            etapa.innerHTML = `
                <img src="../img/carrinho_feliz-removebg-preview.png" alt="carrinho feliz">
                <span class="numero">${i}</span>
      `;

            // Zig-zag das etapas
            if (i % 2 === 1) {
                etapa.style.alignSelf = "flex-end";
                etapa.style.marginLeft = "3rem";
            } else {
                etapa.style.alignSelf = "flex-start";
                etapa.style.marginRight = "3rem";
            }

            caminho.appendChild(etapa);
        }
    }
}
