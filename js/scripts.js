document.addEventListener("DOMContentLoaded", () => {
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

    // garante que os botões não submetem formulário por engano
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

            // se todas concluídas, mostra medalha
            if (concluidas === total) {
                medalha.classList.add("show");
            }
        });
    });

    // ação do botão "Pegar medalha" (opcional)
    const btnPegar = document.querySelector(".medalha .btn-pegar");
    if (btnPegar) {
        btnPegar.addEventListener("click", () => {
            alert("Medalha adicionada ao seu perfil! 🏅");
        });
    }
});
