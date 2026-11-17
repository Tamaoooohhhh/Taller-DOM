let temas = [
    {id: "violeta", icono: "✦"},
    {id: "rosa", icono: "❀"},
    {id: "cyber", icono: "◈"},
    {id: "rojo", icono: "✠"},
    {id: "celeste", icono: "☁\uFE0E"},
    {id: "claro", icono: "☀\uFE0E"}
];

let guardado = null;
try {
    guardado = localStorage.getItem("tema");
} catch (e) {}

let actual = temas.some(function(t){ return t.id === guardado; }) ? guardado : "violeta";
document.documentElement.setAttribute("data-tema", actual);

let retrasos = [0, .12, .05, .2, .1, .28];
let alturas = [8, 28, 48, 68, 88, 50];
let finales = [190, 215, 200, 230, 195, 210];
let empuje = .25;

function crearMancha(){
    let puntos = 10;
    let lista = [];
    for(let i = 0; i < puntos; i++){
        let angulo = (i/puntos)*Math.PI*2;
        let radio = 32 + Math.random()*16;
        lista.push([50 + Math.cos(angulo)*radio, 50 + Math.sin(angulo)*radio]);
    }

    let medio = function(a, b){
        return [(a[0] + b[0])/2, (a[1] + b[1])/2];
    };

    let inicio = medio(lista[puntos - 1], lista[0]);
    let d = "M" + inicio[0].toFixed(1) + "," + inicio[1].toFixed(1);
    for(let i = 0; i < puntos; i++){
        let p = lista[i];
        let m = medio(p, lista[(i + 1) % puntos]);
        d += " Q" + p[0].toFixed(1) + "," + p[1].toFixed(1) + " " + m[0].toFixed(1) + "," + m[1].toFixed(1);
    }
    d += "Z";

    let svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='" + d + "'/></svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
}

function tamano(i, t){
    let u = Math.max(0, (t - retrasos[i])/(1 - retrasos[i]));
    return finales[i]*u*u*(3 - 2*u);
}

function tamanos(t){
    return finales.map(function(f, i){
        let s = tamano(i, t).toFixed(1) + "vmax";
        return s + " " + s;
    }).join(",");
}

function posiciones(t){
    return finales.map(function(f, i){
        let corrido = (tamano(i, t)*empuje).toFixed(1);
        return "calc(100% + " + corrido + "vmax) " + alturas[i] + "%";
    }).join(",");
}

function lanzarMancha(){
    let imagenes = finales.map(function(){ return crearMancha(); }).join(",");
    let repeticion = finales.map(function(){ return "no-repeat"; }).join(",");

    let cuadros = [];
    for(let i = 0; i <= 20; i++){
        let t = i/20;
        cuadros.push({
            offset: t,
            maskImage: imagenes,
            maskRepeat: repeticion,
            maskPosition: posiciones(t),
            maskSize: tamanos(t)
        });
    }

    document.documentElement.animate(cuadros, {
        duration: 1500,
        easing: "linear",
        fill: "both",
        pseudoElement: "::view-transition-new(root)"
    });
}

function aplicarTema(id){
    document.documentElement.setAttribute("data-tema", id);
    try {
        localStorage.setItem("tema", id);
    } catch (e) {}
    document.querySelectorAll(".temas button").forEach(function(boton){
        boton.setAttribute("aria-pressed", boton.dataset.tema === id);
    });
}

function cambiarTema(id){
    let sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(!document.startViewTransition || sinMovimiento){
        aplicarTema(id);
        return;
    }

    let transicion = document.startViewTransition(function(){
        aplicarTema(id);
    });
    transicion.ready.then(lanzarMancha).catch(function(){});
}

function crearSelector(){
    let caja = document.createElement("div");
    caja.className = "temas";

    temas.forEach(function(t){
        let boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.tema = t.id;
        boton.textContent = t.icono;
        boton.addEventListener("click", function(){
            cambiarTema(t.id);
        });
        caja.appendChild(boton);
    });

    document.body.appendChild(caja);
    aplicarTema(actual);
}

document.addEventListener("DOMContentLoaded", crearSelector);
