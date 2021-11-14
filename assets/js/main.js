import gerarSegmentos from "./gerarSegmentos.js";

const input = $("#user_resp");
const btn = $("#btn_enviar");

$(window).ready(callGerarSegmentos(0, 'normal'), gerarPartida())

async function callGerarSegmentos(number, cor) {
    $("#seg").empty();
    input.val('');
    $("#seg").append(await gerarSegmentos(number, cor));
}

$(document).on('keypress', (key) => {
    if (key.which == 13)
        $('#btn_enviar').click();
});

$("#btn_nova_partida").on('click', () => {
    desbloquearInputs();
    gerarPartida();
});

$('#btn_enviar').on('click', () => {
    if (input.val() == '') return;
    if (localStorage.getItem('number') == input.val()) {
        bloquearInputs(input.val(), 'success');
        gerarMensagem('Você acertou!!!!', '#32BF00');
    } else if (parseInt(localStorage.getItem('number')) < input.val()){
        callGerarSegmentos(input.val(), 'normal');
        gerarMensagem('É menor', '#FF6600');
    } else {
        callGerarSegmentos(input.val(), 'normal');
        gerarMensagem('É maior', '#FF6600');
    }
});

function gerarPartida() {
    $.ajax({
        method: "GET",
        url: "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300"
    }).done((data) => {
        localStorage.setItem('number', data.value)
    }).catch((data) => {
        bloquearInputs(JSON.parse(data.responseText).StatusCode, 'error');
        gerarMensagem('Erro', '#CC3300');
    });
}

function bloquearInputs(number, cor) {
    $("#seg").append(callGerarSegmentos(number, cor));
    input.attr('disabled', 'true');
    input.addClass('disabled_input');
    btn.attr('disabled', 'true');
    btn.addClass('disabled_btn');
    $("#btn_nova_partida").css('display', 'flex')
}

function desbloquearInputs() {
    $("#seg").append(callGerarSegmentos(0, 'normal'));
    input.val('')
    $("#mensagem").css('display', 'none');
    input.removeAttr('disabled');
    input.removeClass('disabled_input');
    btn.removeAttr('disabled');
    btn.removeClass('disabled_btn');
    $("#btn_nova_partida").css('display', 'none')
}

function gerarMensagem(msg, color) {
    $("#mensagem").text(msg)
    $("#mensagem").css('display', 'flex');
    $("#mensagem").css('color', color);
}