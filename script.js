document.addEventListener('DOMContentLoaded', function () {
    // Verifica se há um banco de dados de cupons no localStorage.
    // Se existir, recupera-o; caso contrário, inicializa um novo banco de dados com dois cupons predefinidos.

    const cuponDatabaseKey = 'cuponDatabase';
    const cuponDatabase = localStorage.getItem(cuponDatabaseKey)
        ? JSON.parse(localStorage.getItem(cuponDatabaseKey))
        : {
            cupons: [
                {
                    id: 1,
                    nome: 'Cupom 1',
                    valorDesconto: 10,
                    dataValidade: '2023-12-31',
                },
                {
                    id: 2,
                    nome: 'Cupom 2',
                    valorDesconto: 15,
                    dataValidade: '2023-11-30',
                },
            ],
            cuponsAtivos: true,
        };
        
    //menu hamburguer para exibição do menu em dispositivos móveis
    const menuHamburger = document.getElementById('menuHamburger');
    if (menuHamburger) {
        menuHamburger.addEventListener('click', toggleMenu);
    }

    function toggleMenu() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('menu-opened');
    }

    //  funções relacionadas ao uso do modal
    const cuponToggle = document.getElementById('cupon-toggle');
    cuponToggle.checked = cuponDatabase.cuponsAtivos;

    cuponToggle.addEventListener('change', function () {
        cuponDatabase.cuponsAtivos = cuponToggle.checked;
        localStorage.setItem(cuponDatabaseKey, JSON.stringify(cuponDatabase));
        if (cuponDatabase.cuponsAtivos == true) {
            abrirModal('cuponsAtivadosModal');
        } else {
            abrirModal('cuponsDesativadosModal');
        }
        updateCuponSectionVisibility();
    });

    function abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
    }

    function fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    }

    function fecharModalComBotao(modalId) {
        fecharModal(modalId);
    }

    const botoesFecharModal = document.querySelectorAll('.fechar-modal-btn');
    botoesFecharModal.forEach((botao) => {
        botao.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal-id');
            fecharModalComBotao(modalId);
        });
    });

    function fecharModalAoClicarFora(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => {
            if (modal.classList.contains('active') && !modal.contains(event.target)) {
                modal.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', fecharModalAoClicarFora);

    // visibilidade da seção de cadastro de cupons

    function updateCuponSectionVisibility() {
        const cuponToggle = document.getElementById('cupon-toggle');
        const criarCupomSection = document.getElementById('criar-cupom');

        if (cuponToggle.checked) {
            criarCupomSection.style.display = 'block';
        } else {
            criarCupomSection.style.display = 'none';
        }
        updateCuponsListSection('todos');
    }
    // listagem dos cupons

    function updateCuponsListSection(cupomTipo) {
        const cuponsList = document.getElementById('cupons-lista');

        // limpa a lista antes de recriá-la
        cuponsList.innerHTML = '';
        // adiciona o header da lista
        const listItem = document.createElement('li');
        listItem.classList.add('cupom-item-header');
        listItem.innerHTML = `
        <div class="cupom-info space-around-content">
        <p>Código</p>
        <p>Desconto</p>
        <p>Tipo</p>
        <p>Pedido Mínimo</p>
        <p>Vezes usado</p>
        <p>Data limite</p>
        </div>`;
        cuponsList.appendChild(listItem);

        // adiciona cada cupom à lista com base no tipo
        cuponDatabase.cupons.forEach((cupom, index) => {
            // verifica se o tipo do cupom corresponde à seleção atual
            if (
                (cupomTipo === 'todos') ||
                (cupomTipo === 'geral' && cupom.cupomTipo === 'geral') ||
                (cupomTipo === 'unico' && cupom.cupomTipo === 'unico')
            ) {
                const listItem = document.createElement('li');
                listItem.classList.add('cupom-item');

                // adiciona informações formatadas ao item da lista
                listItem.innerHTML = `
                <div class="cupom-info space-around-content">
                    <p>${cupom.nome}</p>
                    <p> ${cupom.valor}</p>
                    <p> ${cupom.tipoDesconto}</p>
                    <p> ${cupom.valorMinimo}</p>
                    <p> ${cupom.usos || 0} </p>
                    <p> ${cupom.dataLimite || 'Sem data limite'}</p>
                </div>
                <button class="usar-cupom-btn" data-index="${index}">
                    Usar Cupom
                </button>
                <button class="excluir-cupom-btn" data-index="${index}">
                    <i class="material-icons">delete</i>
                </button>
            `;

                // adiciona o item à lista
                cuponsList.appendChild(listItem);

                const usarCupomBtn = listItem.querySelector('.usar-cupom-btn');
                usarCupomBtn.addEventListener('click', function () {
                    const index = usarCupomBtn.getAttribute('data-index');
                    usarCupom(index);
                });
                const excluirCupomBtns = document.querySelectorAll('.excluir-cupom-btn');
                excluirCupomBtns.forEach((btn) => {
                    btn.addEventListener('click', function () {
                        const index = this.getAttribute('data-index');
                        excluirCupom(index);
                    });
                });
            }
        });
    }

    // funções relacionadas a exclusão / uso de cupom para melhor visualização do gráfico
    function excluirCupom(index) {
        cuponDatabase.cupons.splice(index, 1);
        localStorage.setItem(cuponDatabaseKey, JSON.stringify(cuponDatabase));
        updateCuponsListSection('todos');
    }

    function usarCupom(index) {
        const cupom = cuponDatabase.cupons[index];
        if (cupom) {
            // incrementa a contagem de uso
            cupom.usos = (cupom.usos || 0) + 1;
            // Desativa o cupom se for de uso único
            if (cupom.cupomTipo === 'unico' && cupom.usos >= 1) {
                cupom.ativo = false;
            }
            // atualiza a persistência local
            localStorage.setItem('cuponDatabase', JSON.stringify(cuponDatabase));
            // atualiza a lista de cupons
            updateCuponsListSection('todos');
        }
    }

    updateCuponSectionVisibility();


    // funções relacionadas a máscaras para o form
    function gerarCodigo() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres.charAt(randomIndex);
        }

        document.getElementById('cupom-nome').value = codigo;
    }

    function formatarValorMinimo(input) {
        var valorLimpo = input.value.replace(/\D/g, '');

        input.value = "R$ " + (valorLimpo / 100).toFixed(2).replace('.', ',');

        var posicaoCursor = input.value.length - 3;
        input.setSelectionRange(posicaoCursor, posicaoCursor);
    }

    function formatarDescontoPercentual(input) {
        var valorLimpo = input.value.replace(/\D/g, '');

        input.value = valorLimpo + '%';

        var posicaoCursor = input.value.length - 1;
        input.setSelectionRange(posicaoCursor, posicaoCursor);
    }

    const tipoDescontoSelect = document.getElementById('cupom-tipo-desconto');
    const valorInput = document.getElementById('cupom-valor');

    tipoDescontoSelect.addEventListener('change', function () {
        if (tipoDescontoSelect.value === 'fixo') {
            valorInput.removeEventListener('input', formatarDescontoPercentual);
            valorInput.addEventListener('input', function () {
                formatarValorMinimo(this);
            });
        } else if (tipoDescontoSelect.value === 'porcentagem') {
            valorInput.removeEventListener('input', formatarValorMinimo);
            valorInput.addEventListener('input', function () {
                formatarDescontoPercentual(this);
            });
        }
    });

    // listeners para botões, submit
    document.getElementById('gerar-codigo').addEventListener('click', gerarCodigo);

    document.querySelectorAll('.cupom-tipo-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const gerarCodigoContainer = document.getElementById('gerar-codigo-container');
            gerarCodigoContainer.style.display = this.dataset.value === 'unico' ? 'flex' : 'none';
        });
    });

    function addSubmitListener() {
        const cupomForm = document.getElementById('cupom-form');
        if (cupomForm) {
            cupomForm.addEventListener('submit', function (event) {
                event.preventDefault();

                const cupomNome = document.getElementById('cupom-nome').value;
                const cupomTipoDesconto = document.getElementById('cupom-tipo-desconto').value;
                const cupomValor = parseFloat(document.getElementById('cupom-valor').value) || 0;
                const cupomDataLimite = document.getElementById('cupom-data-limite').checked;
                const cupomData = cupomDataLimite ? document.getElementById('cupom-data').value : null;
                const cupomValorMinimo = parseFloat(document.getElementById('cupom-valor-minimo').value) || 0;
                const cupomImprimir = document.getElementById('cupom-imprimir').checked;

                const cupomTipoButton = document.querySelector('.cupom-tipo-btn.active');
                const cupomTipo = cupomTipoButton ? cupomTipoButton.getAttribute('data-value') : 'geral';

                const novoCupom = {
                    id: cuponDatabase.cupons.length + 1,
                    nome: cupomNome,
                    cupomTipo: cupomTipo,
                    tipoDesconto: cupomTipoDesconto,
                    valor: cupomValor,
                    dataLimite: cupomDataLimite ? cupomData : null,
                    valorMinimo: cupomValorMinimo,
                    imprimir: cupomImprimir,
                };

                cuponDatabase.cupons.push(novoCupom);
                localStorage.setItem(cuponDatabaseKey, JSON.stringify(cuponDatabase));
                cupomForm.reset();
                alert('Cupom criado com sucesso!');
                updateCuponsListSection('todos');

            });
        }
    }

    addSubmitListener();

    const cupomTypeReportButtons = document.querySelectorAll('.cupom-tipo-relatorio-btn');
    if (cupomTypeReportButtons) {
        cupomTypeReportButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const cupomTipo = button.dataset.value;

                cupomTypeReportButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                updateCuponsListSection(cupomTipo);
            });
        });
    }

    const cupomTipoButtons = document.querySelectorAll('.cupom-tipo-btn');
    cupomTipoButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            cupomTipoButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    const cupomValorMinimoInput = document.getElementById('cupom-valor-minimo');
    if (cupomValorMinimoInput) {
        cupomValorMinimoInput.addEventListener('input', function () {
            formatarValorMinimo(this);
        });
    }

    // gráfico com o uso do chart js 
    function createUsageChart() {
        const cuponsChartCanvas = document.getElementById('cuponsChart');

        const cuponsUsageData = getCuponsUsageData();

        new Chart(cuponsChartCanvas, {
            type: 'doughnut',
            data: {
                labels: cuponsUsageData.labels,
                datasets: [{
                    label: 'Quantidade de Usos por Tipo de Cupom',
                    data: cuponsUsageData.data,
                    backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                    borderWidth: 1
                }],
            },
            options: {
                scales: {
                    x: {
                        display: false, 
                    },
                    y: {
                        beginAtZero: true,
                        max: Math.max(...cuponsUsageData.data) + 1, 
                    },
                },
                plugins: {
                    legend: {
                        display: true, 
                    },
                },
                layout: {
                    padding: {
                        right: 100, 
                    },
                },
                responsive: true,
                maintainAspectRatio: false, 
            },

        });
    }

    // obtenção dos dados para o gráfico
    function getCuponsUsageData() {
        const cuponsTipoData = {
            'geral': 0,
            'unico': 0,
        };

        cuponDatabase.cupons.forEach((cupom) => {
            const tipo = cupom.cupomTipo || 'geral'; 
            const usos = cupom.usos || 0; // 


            cuponsTipoData[tipo] += usos;
        });

        return {
            labels: Object.keys(cuponsTipoData),
            data: Object.values(cuponsTipoData),
        };
    }

    createUsageChart();

    // função de faturamento
    function calcularFaturamento() {
        const faturamentoContainer = document.querySelector('.Faturamentos-container');

        let faturamentoGeral = 0;
        let faturamentoUnico = 0;

        cuponDatabase.cupons.forEach((cupom) => {
            const tipo = cupom.cupomTipo || 'geral'; 
            const usos = cupom.usos || 0;
            const valor = cupom.valor || 0;

            const valorTotal = usos * valor;

            if (tipo === 'geral') {
                faturamentoGeral += valorTotal;
            } else if (tipo === 'unico') {
                faturamentoUnico += valorTotal;
            }
        });

        const faturamentoTotal = faturamentoGeral + faturamentoUnico;

        faturamentoContainer.innerHTML = `
        <h2>Faturamentos realizados com cupons</h2>
        <div class="col">
            <div class="cupom-item"><p>Faturamento GERAL: R$  ${faturamentoGeral.toFixed(2)}</p></div>
            <div class="cupom-item"><p>Faturamento ÚNICO: R$  ${faturamentoUnico.toFixed(2)}</p></div>
            <div class="cupom-item"><p><b>Faturamento TOTAL: R$  ${faturamentoTotal.toFixed(2)}</b></p></div>
        </div>
    `;
    }

    calcularFaturamento();

});