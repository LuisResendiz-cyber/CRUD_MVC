setTimeout(() => {
    var PlazoPrestamo = document.getElementById("PlazoPrestamo");
    var ValorPlazoPrestamo = document.getElementById("ValorPlazoPrestamo");
    var TasaAnual = document.querySelectorAll('input[name="TasaAnual"]');
    var InteresPeriodo = document.getElementById("InteresPeriodo");
    var MontoPrestamo = document.getElementById("MontoPrestamo");
    var MontoPago = document.getElementById("MontoPago");
    var Cotizar = document.getElementById("Cotizar");
    var textInformation = document.getElementById("textInformation");
    var btnCerrar = document.getElementById("btnCerrar");


    function GetMontoPago(MontoPrestamo, InteresPeriodo, TasaAnual) {
        let numerador = MontoPrestamo * InteresPeriodo * Math.pow((1 + InteresPeriodo), TasaAnual);
        let denominador = Math.pow((1 + InteresPeriodo), TasaAnual) - 1;
        let valor = numerador / denominador;
        return valor;
    }


    TasaAnual.forEach(radio => {
        radio.addEventListener('change', function () {
            if (radio.checked) {
                radioValue = parseFloat(radio.value);
                sessionStorage.setItem("Mes", radioValue);

                let Prestamo = parseFloat(MontoPrestamo.value);
                let Interes = parseFloat(InteresPeriodo.value);
                MontoPago.value = GetMontoPago(Prestamo, Interes, radioValue);
            }
        });
    });


    MontoPrestamo.addEventListener('keypress', function (event) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    });


    MontoPrestamo.addEventListener('input', function () {
        let Prestamo = parseFloat(this.value);
        let Interes = parseFloat(InteresPeriodo.value);
        let data = parseFloat(sessionStorage.getItem("Mes"));
        MontoPago.value = GetMontoPago(Prestamo, Interes, data);

        textInformation.innerHTML = ''
        textInformation.innerHTML = 'Minimo $10,000 MXN- Maximo $750,000 MXN';
        textInformation.style.color = '#525558';

        let value = parseFloat(this.value);
        if (isNaN(value) || value > 10000 || value < 750000) {
            Cotizar.disabled = false;
        }

    });



    MontoPrestamo.addEventListener('blur', function () {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < 10000 || value > 750000) {
            textInformation.innerHTML = 'El dato Ingresado es Incorrecto';
            textInformation.style.color = 'red';
            Cotizar.disabled = true;
        } else {
            textInformation.innerHTML = '';
            Cotizar.disabled = false;
        }
    });



    //CAMBIAR EL VALOR DEL PLAZO DE PRESTAMO
    ValorPlazoPrestamo.value = 0;
    PlazoPrestamo.oninput = function () {
        ValorPlazoPrestamo.value = this.value;
        InteresPeriodo.value = (this.value / 100) / 12;

        let Prestamo = parseFloat(MontoPrestamo.value);
        let Interes = parseFloat(InteresPeriodo.value);
        let data = parseFloat(sessionStorage.getItem("Mes"));

        MontoPago.value = GetMontoPago(Prestamo, Interes, data);
    };

    Cotizar.addEventListener("click", function (e) {
        e.preventDefault();

        var val = ValorPlazoPrestamo.value;
        var val2 = parseFloat(sessionStorage.getItem("Mes"));
        var val3 = InteresPeriodo.value;
        var val4 = MontoPrestamo.value;
        var val5 = MontoPago.value;

        if (val4 == '' || val2 == '' || val == '' || val == 0) {
            swal("Cuidado", "Tienes que Agregar Todos valores que se Requieren", "warning");
        } else {
            var tbCotizador = document.getElementById("tbCotizador");
            tbCotizador.innerHTML = '';

            for (let i = 1; i <= val2; i++) {
                let newRow = document.createElement("tr");

                // MES
                let mes = document.createElement("td");
                mes.textContent = i;
                mes.id = "ColumnaA_" + i;
                newRow.appendChild(mes);

                // SALDOCAPITAL
                let saldoCapital = document.createElement("td");
                saldoCapital.id = "ColumnaB_" + i;
                newRow.appendChild(saldoCapital);

                // PAGOCAPITAL
                let PagoCapital = document.createElement("td");
                PagoCapital.textContent = i;
                PagoCapital.id = "ColumnaC_" + i;
                newRow.appendChild(PagoCapital);

                // PAGOINTERESORDINARIO
                let PagoInteres = document.createElement("td");
                PagoInteres.id = "ColumnaD_" + i;
                newRow.appendChild(PagoInteres);


                // PAGOFIJOMENSUAL
                let PagoFijoMensual = document.createElement("td");
                PagoFijoMensual.textContent = parseFloat(val5).toFixed(2);
                PagoFijoMensual.id = "ColumnaE_" + i;
                newRow.appendChild(PagoFijoMensual);

                // SALDO
                let saldoInicial = document.createElement("td");
                saldoInicial.id = "ColumnaF_" + i;
                newRow.appendChild(saldoInicial);


                // PAGOIVAINTERES
                let PagoIvaInteres = document.createElement("td");
                PagoIvaInteres.textContent = i;
                PagoIvaInteres.id = "ColumnaG_" + i;
                newRow.appendChild(PagoIvaInteres);

                // PAGOMENSUALTOTAL
                let PagoMensualTotal = document.createElement("td");
                PagoMensualTotal.id = "ColumnaH_" + i;
                newRow.appendChild(PagoMensualTotal);

                // Agregar la fila completa a la tabla
                tbCotizador.appendChild(newRow);
            }

            // Luego de crear todas las filas:
            var ColumnaB = document.querySelectorAll('td[id^="ColumnaB_"]');
            var ColumnaD = document.querySelectorAll('td[id^="ColumnaD_"]');
            var ColumnaC = document.querySelectorAll('td[id^="ColumnaC_"]');
            var ColumnaE = document.querySelectorAll('td[id^="ColumnaE_"]');
            var ColumnaG = document.querySelectorAll('td[id^="ColumnaG_"]');
            var ColumnaH = document.querySelectorAll('td[id^="ColumnaH_"]');
            var ColumnaF = document.querySelectorAll('td[id^="ColumnaF_"]');

            for (let i = 0; i < ColumnaB.length; i++) {

                if (ColumnaB.length > 0) {
                    ColumnaB[0].textContent = parseFloat(val4);
                }

                let saldoCapital = parseFloat(ColumnaB[i].textContent);
                ColumnaD[i].textContent = (val3 * saldoCapital).toFixed(2);

                let PagoIva = parseFloat(ColumnaD[i].textContent);
                ColumnaG[i].textContent = (PagoIva * 0.16).toFixed(2);

                let valorE = parseFloat(ColumnaE[i].textContent);
                let valorG = parseFloat(ColumnaG[i].textContent);
                ColumnaH[i].textContent = (valorE + valorG).toFixed(2);

                let valorD = parseFloat(ColumnaD[i].textContent);
                ColumnaC[i].textContent = parseFloat(valorE - valorD).toFixed(2);

                let valorB = parseFloat(ColumnaB[i].textContent);
                let valorC = parseFloat(ColumnaC[i].textContent);

                ColumnaF[i].textContent = parseFloat(valorB - valorC).toFixed(2);

                let valorF = parseFloat(ColumnaF[i].textContent);
                console.log(valorF);
                ColumnaB[i + 1].textContent = valorF;

            }
        }
    });


    btnCerrar.addEventListener("click", function(e) {
        e.preventDefault();
        PlazoPrestamo.value = 0;
        ValorPlazoPrestamo.value = 0;
        TasaAnual.checked = false;
        InteresPeriodo.value = '';
        MontoPrestamo.value = '';
        MontoPago.value = '';
        tbCotizador.innerHTML = '';
    });
    
}, 2000);