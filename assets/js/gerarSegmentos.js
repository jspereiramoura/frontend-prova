import TempEngine from "./template-engine.js";

const templatePath = "./templates/segmentos.html";

export default function gerarSegmentos(number, cor) {
    cor = setColor(cor);
    return setNumber(number, cor);
}

//Função que será utilizada para escolher a cor dos segmentos acesos
function setColor(cor) {
    switch (cor) {
        case 'success':
            return '#32BF00';
        case 'error':
            return '#CC3300';
        case 'normal':
            return '#262A34';
    }
}

//
async function setNumber(number, cor) {
    number = ('' + number).split('');
    var html = await TempEngine(templatePath, { cor: cor, quantidade: number.length});
    var svg =  $($.parseHTML(html)).children('svg')['prevObject'];
    for (let count = 0, numberCount = 0; count < svg.length; count++) {
        const paths = $(svg[count]).children();
        const numberLeds = switchLeds(parseInt(number[numberCount++]));
        for (let elCount = 0; elCount < paths.length; elCount++) {
            const path = paths[elCount];
            if(numberLeds[elCount] == '1') {
                $(path).attr('fill', cor)
            }
        }
    }
    html = svg;
    return html;
}

function switchLeds(number) {
    switch (number) {
        case 0:
            return '1111110';
        case 1:
            return '0110000';
        case 2:
            return '1101101';
        case 3:
            return '1111001'
        case 4:
            return '0110011'
        case 5:
            return '1011011'
        case 6:
            return '1011111'
        case 7:
            return '1110000'
        case 8:
            return '1111111'
        case 9:
            return '1111011'
    }
}