// variável que recebe a data e a quantidade de dias do mês
const mes = {};

//nome dos meses para impressão
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

//pessoas associadas aos dias da semana
const pessoasSemana = {
    domingo: [],
    quarta: [],
    sabado: []
};

//funções com os nomes associados
const funcoes = {
    mesa: [],
    projecao: [],
    transmissao: []
};

//backup de funções com os nomes associados
const funcoesBackup = {
    mesa: [],
    projecao: [],
    transmissao: []
};

function pessoas(funcoes, diasSemana, diasMes, maxVezes) {
    this.funcoes = funcoes;
    this.diasSemana = diasSemana;
    this.diasMes = diasMes;
    this.maxVezes = maxVezes;
}

//variável que recebe a escala
let escala;

//quantidade de vezes que um nome pode aparecer na escala
let nomeVezes;

//pessoas que não podem num dia específico daquele mês
let diasExcluidos;

let excluirRodadas = {};

document.getElementById("mes_ano").addEventListener("change", inserirMes);
document.getElementById("inserir_nomes").addEventListener("click", inserirNomes);
document.getElementById("nome_vezes").addEventListener("change", mudarVezes);
document.getElementById("criar_escala").addEventListener("click", criarEscala);
document.getElementById("nomes").addEventListener("change", inserirMes)

document.getElementById("nomes").innerHTML = `Jean
Adriano
Rian
Daniel
Matheus
Ismael
Jonatas
Samuel
Kaliane
Felipe
Julia
Noemi
Gutinho`;

function inserirMes() {
    document.getElementsByClassName("divisao_nomes")[0].removeAttribute("hidden");

    document.getElementsByClassName("divisao_nomes_inseridos")[0].setAttribute("hidden", "hidden");
    document.getElementsByClassName("divisao_nomes_inseridos")[1].setAttribute("hidden", "hidden");
    document.getElementById("lista_nomes").setAttribute("hidden", "hidden");
    document.getElementById("escala_editavel").setAttribute("hidden", "hidden");
    document.getElementById("escala").setAttribute("hidden", "hidden");
}

function inserirNomes() {
    pegarMes();
    zerarEscala();
    tabelaEditavel(pegarNomesTextarea());
    document.getElementById("escala_editavel").removeAttribute("hidden")
    inserirNomesTabela(pegarNomesTextarea());
    document.getElementsByClassName("divisao_nomes_inseridos")[0].removeAttribute("hidden");
    document.getElementsByClassName("divisao_nomes_inseridos")[1].removeAttribute("hidden");
}

function criarEscala() {
    pegarMes();
    zerarEscala();
    coletarTabelaEditavel();
    organizarDados();
    backupDados();

    nomeVezes = document.getElementById("nome_vezes").value;

    for (let i = 0; i < nomeVezes; nomeVezes--) {
        sortearNomes();
        construirEscala();
        recolocarNomes();
    }
}

function pegarMes() {
    let anoMes = document.getElementById("mes_ano").value.split("-");
    mes.data = new Date(anoMes[0], anoMes[1], 0);
    mes.quantDiasMes = mes.data.getDate();
    mes.data = new Date(`${anoMes[0]}-${anoMes[1]}-01T00:00:00-03:00`);
}

function zerarEscala() {
    escala = [];
    escala[0] = meses[mes.data.getMonth()] + " - " + mes.data.getFullYear();
    for (let i = 1; i <= mes.quantDiasMes; i++) {
        escala[i] = {
            mesa: null,
            projecao: null,
            transmissao: null
        };
    }
}

function criarCalendarioPequeno() {

    let calendarioPequeno = '<table class="pequeno_calendario"> <tr> <th>Dom</th> <th hidden>Seg</th> <th hidden>Ter</th> <th>Qua</th> <th hidden>Qui</th> <th hidden>Sex</th> <th>Sáb</th> </tr> <tr>';

    //dias da semana
    for (let i = 1; i <= mes.data.getDay(); i++) {
        if (i == 1 || i == 4 || i == 7) {
            calendarioPequeno += '<td style="background-color: white;"></td>';
        } else {
            calendarioPequeno += '<td hidden style="background-color: white;"></td>';
        }
    }
    //dias do mês
    for (let i = 1; i <= mes.quantDiasMes; i++) {
        mes.data.setDate(i);
        mes.data.getDay();
        if (mes.data.getDay() == 0 || mes.data.getDay() == 3 || mes.data.getDay() == 6) {
            calendarioPequeno += `<td> <input type="checkbox" name="dia${i}" value="dia${i}" class="dia${i}" checked="true">
            <label for="dia">${i}</label> </td>`;
        } else {
            calendarioPequeno += `<td hidden> <input type="checkbox" name="dia${i}" value="dia${i}" class="dia${i}" checked="true">
            <label for="dia">${i}</label> </td>`;
        }
        mes.data.setDate(1);
        if ((i + mes.data.getDay()) % 7 == 0) calendarioPequeno += '</tr> <tr>';
    }

    calendarioPequeno += '</tr> </table>';

    return calendarioPequeno;
}

function pegarNomesTextarea() {
    return document.getElementById("nomes").value.split("\n");
}

function tabelaEditavel(nomes) {

    let escalaEditavel = `<table class="tabela_editavel"> <tr><th colspan="4">Atrirbuição manual - ${escala[0]}</th></tr>`;
    escalaEditavel += "<tr> <th>Dias</th> <th>Mesa</th> <th>Projeção</th> <th>Transmissão</th> </tr>";

    for (let i = 1; i < escala.length; i++) {
        mes.data.setDate(i);
        switch (mes.data.getDay()) {
            case 0:

                escalaEditavel += `<tr class="domingo"><td>Domingo - ${i}</td>`;

                escalaEditavel += `<td> <select id="mesa_dia${i}" name="mesa_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="projecao_dia${i}" name="projecao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="transmissao_dia${i}" name="transmissao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td> </tr>`;

                break;

            case 3:

                escalaEditavel += `<tr class="quarta"><td>Quarta - ${i}</td>`;

                escalaEditavel += `<td> <select id="mesa_dia${i}" name="mesa_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="projecao_dia${i}" name="projecao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="transmissao_dia${i}" name="transmissao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td> </tr>`;

                break;

            case 6:

                escalaEditavel += `<tr class="sabado"><td>Sábado - ${i}</td>`;

                escalaEditavel += `<td> <select id="mesa_dia${i}" name="mesa_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="projecao_dia${i}" name="projecao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td>`;

                escalaEditavel += `<td> <select id="transmissao_dia${i}" name="transmissao_dia${i}">
                <option value="____">____</option>`;
                for (let x of nomes) {
                    escalaEditavel += `<option value="${x}">${x}</option>`;
                }
                escalaEditavel += `</select> </td> </tr>`;

                break;
        }
    }
    escalaEditavel += "</table>"
    mes.data.setDate(1);
    document.getElementById("escala_editavel").innerHTML = escalaEditavel;
}

function inserirNomesTabela(nomes) {
    //coloca os nomes numa tabela

    let calendarioPequeno = criarCalendarioPequeno();

    let listaNomes = "";
    listaNomes += `<table class="tabela_editavel"> 
    <tr> 
        <th>Nomes</th> 
        <th>Funções</th> 
        <th>Dias</th> 
        <th>Disponibilidade</th> 
        <th>Max vezes</th>
    </tr>`;

    for (let i = 0; i < nomes.length; i++) {
        listaNomes += `
        <tr>
            <td id="nome${i}">${nomes[i]}</td> 
            <td id="funcoes${i}">

                <fieldset>
  
                    <input type="checkbox" name="mesa" value="mesa" class="mesa" checked="true">
                    <label for="mesa"> Mesa</label></br>

                    <input type="checkbox" name="projecao" value="projecao" class="projecao" checked="true">
                    <label for="projecao"> Projeção</label></br>

                    <input type="checkbox" name="transmissao" value="transmissao" class="transmissao" checked="true">
                    <label for="transmissao"> Transmissão</label></br>

                </fieldset>

            </td>

            <td id="dias_semana${i}">

                <fieldset>
        
                    <input type="checkbox" name="domingo" value="domingo" class="domingo" checked="true">
                    <label for="domingo"> Domingo</label></br>

                    <input type="checkbox" name="quarta" value="quarta" class="quarta" checked="true">
                    <label for="projecao"> Quarta</label></br>

                    <input type="checkbox" name="sabado" value="sabado" class="sabado" checked="true">
                    <label for="sabado"> Sábado</label></br>

                </fieldset>

            </td">

            <td id="dias_incluidos${i}">
                ${calendarioPequeno}
            </td>

            <td id="rodada_fora${i}" class="max_vezes">
                <input type="number" name="nome_rodada" min="0" max="5" value="3">
            </td>
       
        </tr>`;
    }
    listaNomes += "</table>"
    document.getElementById("lista_nomes").removeAttribute("hidden");
    document.getElementById("lista_nomes").innerHTML = listaNomes;
}

function recolocarNomes() {
    funcoes.mesa = funcoesBackup.mesa.map(x => x);
    funcoes.projecao = funcoesBackup.projecao.map(x => x);
    funcoes.transmissao = funcoesBackup.transmissao.map(x => x);
}

function organizarDados() {

    diasExcluidos = {};

    funcoes.mesa = [];
    funcoes.projecao = [];
    funcoes.transmissao = [];

    for (let j = 0; ; j++) {
        try {
            let nomeBruto = document.getElementById(`nome${j}`).innerHTML;
            if (document.getElementById(`funcoes${j}`).getElementsByClassName("mesa")[0].checked) {
                funcoes.mesa.push(nomeBruto);
            }
            if (document.getElementById(`funcoes${j}`).getElementsByClassName("projecao")[0].checked) {
                funcoes.projecao.push(nomeBruto);
            }
            if (document.getElementById(`funcoes${j}`).getElementsByClassName("transmissao")[0].checked) {
                funcoes.transmissao.push(nomeBruto);
            }
            if (document.getElementById(`dias_semana${j}`).getElementsByClassName("domingo")[0].checked) {
                pessoasSemana.domingo.push(nomeBruto);
            }
            if (document.getElementById(`dias_semana${j}`).getElementsByClassName("quarta")[0].checked) {
                pessoasSemana.quarta.push(nomeBruto);
            }
            if (document.getElementById(`dias_semana${j}`).getElementsByClassName("sabado")[0].checked) {
                pessoasSemana.sabado.push(nomeBruto);
            }

            for (let i = 1; i <= mes.quantDiasMes; i++) {
                if (!document.getElementById(`dias_incluidos${j}`).getElementsByClassName(`dia${i}`)[0].checked) {
                    if (diasExcluidos[i]) {
                        diasExcluidos[i].push(nomeBruto);
                    } else {
                        diasExcluidos[i] = [nomeBruto];
                    }
                }
            }

            let numeroRodadas = document.getElementById(`rodada_fora${j}`).getElementsByTagName("input")[0].value;
            excluirRodadas[nomeBruto] = numeroRodadas;

        } catch (error) {
            break;
        }
    }

}

function backupDados() {
    funcoesBackup.mesa = funcoes.mesa.map(x => x);
    funcoesBackup.projecao = funcoes.projecao.map(x => x);
    funcoesBackup.transmissao = funcoes.transmissao.map(x => x);
}

function coletarTabelaEditavel() {

    let selectMesa;
    let selectProjecao;
    let selectTransmissao;
    let select;

    for (let i = 1; i < escala.length; i++) {
        mes.data.setDate(i);
        if (mes.data.getDay() == 0 || mes.data.getDay() == 3 || mes.data.getDay() == 6) {

            select = document.getElementById(`mesa_dia${i}`);
            selectMesa = select.options[select.selectedIndex].value;
            select = document.getElementById(`projecao_dia${i}`);
            selectProjecao = select.options[select.selectedIndex].value;
            select = document.getElementById(`transmissao_dia${i}`);
            selectTransmissao = select.options[select.selectedIndex].value;

            if (selectMesa == "____") selectMesa = null;
            if (selectProjecao == "____") selectProjecao = null;
            if (selectTransmissao == "____") selectTransmissao = null;
            escala[i] = { mesa: selectMesa, projecao: selectProjecao, transmissao: selectTransmissao };
        }

    }
    mes.data.setDate(1);
}

function sortearNomes() {

    const quantNomes = [[0, pessoasSemana.domingo.length], [3, pessoasSemana.quarta.length], [6, pessoasSemana.sabado.length]];

    while (quantNomes.length) {

        quantNomes.sort((a, b) => a[1] - b[1]);
        const diaDaSemana = quantNomes[0][0];

        for (let i = 1; i <= mes.quantDiasMes; i++) {
            mes.data.setDate(i);

            if (mes.data.getDay() == diaDaSemana) {

                let sorteadoMesa;
                let sorteadoTransmissao;
                let sorteadoProjecao;

                sorteadoMesa = escala[i].mesa == null ? sortear(funcoes.mesa, mes.data.getDay(), escala[i], i) : escala[i].mesa;
                sorteadoTransmissao = escala[i].transmissao == null ? sortear(funcoes.transmissao, mes.data.getDay(), escala[i], i) : escala[i].transmissao;

                if (mes.data.getDay() == 6) {
                    sorteadoProjecao = escala[i].projecao == null ?
                        sortear(funcoes.projecao, mes.data.getDay(), escala[i], i) : escala[i].projecao;
                }

                else if (!escala[i].projecao) {

                    if ((sorteadoMesa && sorteadoTransmissao) &&
                        (funcoesBackup.projecao.includes(sorteadoMesa) &&
                            funcoesBackup.projecao.includes(sorteadoTransmissao))) {
                        sorteadoProjecao = sorteadoMesa + "/" + sorteadoTransmissao;
                    }

                    else if ((sorteadoMesa && !sorteadoTransmissao) &&
                        funcoesBackup.projecao.includes(sorteadoMesa)) {
                        sorteadoProjecao = sorteadoMesa;
                    }

                    else if ((!sorteadoMesa && sorteadoTransmissao) &&
                        funcoesBackup.projecao.includes(sorteadoTransmissao)) {
                        sorteadoProjecao = sorteadoTransmissao;
                    }

                    else if (sorteadoTransmissao) {
                        sorteadoProjecao = sorteadoTransmissao;
                    }

                    else {
                        sorteadoProjecao = null
                    }

                }

                else if (escala[i].projecao) {

                    if ((sorteadoMesa == escala[i].projecao) &&
                        (sorteadoTransmissao && (sorteadoTransmissao != escala[i].projecao) &&
                            funcoesBackup.projecao.includes(sorteadoTransmissao))) {
                        sorteadoProjecao = escala[i].projecao + "/" + sorteadoTransmissao;
                    }

                    else if ((sorteadoTransmissao == escala[i].projecao) &&
                        (sorteadoMesa && (sorteadoMesa != escala[i].projecao) &&
                            funcoesBackup.projecao.includes(sorteadoMesa))) {
                        sorteadoProjecao = sorteadoMesa + "/" + escala[i].projecao;
                    }

                    else {
                        sorteadoProjecao = escala[i].projecao;
                    }
                }

                else {
                    sorteadoProjecao = null;
                }

                if (!sorteadoProjecao) sorteadoProjecao = null;

                escala[i] = { mesa: sorteadoMesa, projecao: sorteadoProjecao, transmissao: sorteadoTransmissao };

                console.log(i, escala[i]);

            } else if (escala[i] == undefined) escala[i] = null;

        }

        quantNomes.splice(0, 1);

    }
}

function sortear(funcao, diaDaSemana, naoRepetirEsses, diaDoMes) {

    if (funcao.length == 0) return null;

    // remove nomes que não podem no dia
    let nomesQuePodem;
    switch (diaDaSemana) {
        case 0:
            nomesQuePodem = funcao.filter(x => pessoasSemana.domingo.includes(x));
            break;
        case 3:
            nomesQuePodem = funcao.filter(x => pessoasSemana.quarta.includes(x));
            break;
        case 6:
            nomesQuePodem = funcao.filter(x => pessoasSemana.sabado.includes(x));
            break;
    }

    //remove pessoas que não podem em um dia específico
    if (diasExcluidos[diaDoMes]) {
        nomesQuePodem = nomesQuePodem.filter(x => {
            if (diasExcluidos[diaDoMes].includes(x)) return false;
            return true;
        });
    }

    //remove nomes repetidos no dia
    nomesQuePodem = nomesQuePodem.filter(x => {
        if (x == naoRepetirEsses.mesa) return false;
        else if (x == naoRepetirEsses.projecao) return false;
        else if (x == naoRepetirEsses.transmissao) return false;

        return true;
    });

    //remove nomes de x rodada(s)
    for (let x in excluirRodadas) {
        if (!(excluirRodadas[x] >= nomeVezes)) {
            nomesQuePodem = nomesQuePodem.filter(y => y != x);
        }
    }

    //sorteia um nome
    let numero = Math.floor(Math.random() * nomesQuePodem.length);
    let nome = nomesQuePodem.splice(numero, 1)[0];

    if (nome === undefined) return null;

    let posicao = funcoes.mesa.indexOf(nome);
    if (posicao !== -1) funcoes.mesa.splice(posicao, 1);

    posicao = funcoes.projecao.indexOf(nome);
    if (posicao !== -1) funcoes.projecao.splice(posicao, 1);

    posicao = funcoes.transmissao.indexOf(nome);
    if (posicao !== -1) funcoes.transmissao.splice(posicao, 1);

    return nome;
}

function construirEscala() {
    let escalaHtml = `<table class="tabela"> <tr><th colspan="4">${escala[0]}</th></tr>`;
    let escalaConsole = escala[0];

    escalaHtml += "<tr> <th>Dias</th> <th>Mesa</th> <th>Projeção</th> <th>Transmissão</th> </tr>";
    for (let i = 1; i < escala.length; i++) {
        mes.data.setDate(i);

        switch (mes.data.getDay()) {
            case 0:
                escalaHtml += `<tr class="domingo"><td>Domingo - ${i}</td> <td>${escala[i].mesa}</td> <td>${escala[i].projecao}</td> <td>${escala[i].transmissao}</td></tr>`;
                escalaConsole += `\nDomingo ${i} - Mesa: ${escala[i].mesa} - Projeção: ${escala[i].projecao} - Transmissão: ${escala[i].transmissao}`;
                break;
            case 3:
                escalaHtml += `<tr class="quarta"><td>Quarta - ${i}</td> <td>${escala[i].mesa}</td> <td>${escala[i].projecao}</td> <td>${escala[i].transmissao}</td></tr>`;
                escalaConsole += `\nQuarta ${i} - Mesa: ${escala[i].mesa} - Projeção: ${escala[i].projecao} - Transmissão: ${escala[i].transmissao}`;
                break;
            case 6:
                escalaHtml += `<tr class="sabado"><td>Sábado - ${i}</td> <td>${escala[i].mesa}</td> <td>${escala[i].projecao}</td> <td>${escala[i].transmissao}</td></tr>`;
                escalaConsole += `\nSábado ${i} - Mesa: ${escala[i].mesa} - Projeção: ${escala[i].projecao} - Transmissão: ${escala[i].transmissao}`;
                break;
        }
    }
    escalaHtml += "</table>";
    document.getElementById("escala").removeAttribute("hidden");
    document.getElementById("escala").innerHTML = escalaHtml.replace(/null/g, "____");
    
    console.log('Mesa:', funcoes.mesa, 'Projeção:', funcoes.projecao, 'Transmissão:', funcoes.transmissao);
    console.log(escala);
}

function mudarVezes() {
    let names = document.getElementById("nomes").value.split("\n");
    for (let i = 0; i < names.length; i++) {
        let temp = document.getElementById("nome_vezes").value;
        document.getElementById(`rodada_fora${i}`).getElementsByTagName("input")[0].setAttribute("value", temp);
    }
}