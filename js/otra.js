function calcularPresupuesto(){
    let invitados = Number(document.getElementById("numero-inv").value);
    let costoComida = Number(document.getElementById("cost-comida").value);
    let costoBebida = Number(document.getElementById("cost-bebida").value);
    let decoracion = Number(document.getElementById("cost-decor").value);
    let musica = Number(document.getElementById("cost-musica").value);
    let porcentajePropina = Number(document.getElementById("propina-porc").value);

    if(invitados <= 0){
        alert("Ingresa un número de invitados mayor a 0");
        return;
    }

    let comidaTotal = invitados*costoComida;
    let bebidaTotal = invitados*costoBebida;
    let subtotal = comidaTotal+bebidaTotal+decoracion+musica;
    let propina = subtotal*(porcentajePropina/100);
    let totalGeneral = subtotal+propina;
    let costoPorInvitado = totalGeneral/invitados;

    document.getElementById("comida-total-s").textContent = comidaTotal.toLocaleString("es-CO");
    document.getElementById("bebida-total-s").textContent = bebidaTotal.toLocaleString("es-CO");
    document.getElementById("decoracion").textContent = decoracion.toLocaleString("es-CO");
    document.getElementById("musica").textContent = musica.toLocaleString("es-CO");
    document.getElementById("subtotal").textContent = subtotal.toLocaleString("es-CO");
    document.getElementById("propina").textContent = propina.toLocaleString("es-CO");
    document.getElementById("total-general").textContent = totalGeneral.toLocaleString("es-CO");
    document.getElementById("costo-inv").textContent = costoPorInvitado.toLocaleString("es-CO");
}
