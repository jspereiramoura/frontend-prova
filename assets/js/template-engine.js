export default async function TempEngine(tpl, params) {
    var jscode = 'var r=[];\n';
    tpl = await getTemplateFile(tpl);
    tpl.forEach(el => {
        var aux;
        var phrase;
        if (phrase = (/({{this.)([^}]*)(}})/gi).exec(el)) {
            aux = [...phrase['input'].matchAll(/({{this.)([^}]*)(}})/gi)];
            aux.forEach(element => {
                el = el.replace(element[0], params[element[2]]);
            });
        }
        if (phrase = (/(::count)/gi).exec(el)) {
            aux = [...phrase['input'].matchAll(/(::count)/gi)];
            aux.forEach(element => {
                el = el.replace(element[0], 'count');
            });
        }
        if (aux = /^(for::)(.*)(=>)/.exec(el)) {
            var exp = aux[2].split(' ');
            var sinal;
            var cursor;
            if (parseInt(exp[1]) > parseInt(exp[3])) {
                sinal = ' >= ';
                cursor = ' count-- ';
            } else {
                sinal = ' <= ';
                cursor = ' count++ ';
            }
            el = 'for (var count = ' + exp[1] + '; count' + sinal + exp[3] + ';' + cursor + ') {';
        } else if (aux = /(case=>)(.*)/.exec(el.replace(/[\t\n\r]*/, ''))) {
            el = 'case(' + aux[2] + '):';
        } else if (aux = /(.*)(break::)/.exec(el.replace(/[\t\n\r]*/, ''))) {
            el = 'break ;';
        } else if (aux = /^(.*)(::)(.*)(=>)/.exec(el)) {
            el = aux[1] + '(' + aux[3] + ') {';
        } else if (aux = /^(::end-)(.*)]*/.exec(el)) {
            el = '}';
        }

        el = el.replaceAll('\"', '\\\"').replaceAll('\'', '\\\'');
        jscode += (el.match(/(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g)) ? el.replace(/[\n\r\t]/) : "r.push(\"" + el.replace(/[\n\r\t]/, '') + "\");\n";
    });
    jscode = (jscode + " return r.join(\'\'); ");
    return new Function(jscode).apply(params);
}

async function getTemplateFile(html) {
    var template;
    if (new RegExp(/\.html$/).exec(html)) {
        await $.get(html, (data) => {
            template = [];
            data = data.split('\n');
            data.forEach(line => {
                template.push(line);
            });
        });
    } else {
        template = html;
    }
    return template;
}