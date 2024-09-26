function GuardarCalificacion(boton, u_persona, action, ispredictivo, nombreAgente, telefono, idCliente, idProducto, solicitud, u_telefono) {
    let calificacion = Calificaciones.value;
    var time = $('#hora_marcacion').val();
    if (calificacion == null || calificacion == "") {
        swal("Cuidado", "Tienes que Calificar Esta Solicitud", "error");
    } else {

        swal({
            title: "Estas Seguro?",
            text: `La solicitud que estas Calificando es: ${customer_id}`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Calificar!",
            cancelButtonText: "No, Cancelar!"
        },
            function (isConfirm) {
                if (isConfirm) {

                    Tipificacion(telefono, idCliente, nombreAgente,Calificaciones.value, idProducto, solicitud, u_telefono, document.getElementById("SelectPermiso").value, time);
                    bloquea_registros(solicitud, ispredictivo);//funcion que bloquea los registros                
                    document.getElementById("CloseArticulo").click();
                    if (ispredictivo == 1) {
                        $(function () {
                            $("#dialog-proceso").dialog({
                                autoOpen: true,
                                height: 100,
                                width: 500,
                                modal: true,
                                closeOnEscape: false,
                                open: function (event, ui) {
                                    jQuery('.ui-dialog-titlebar-close').hide();
                                }
                            });
                        });
                    }

                    document.SurveyResponse.action = 'modules.php?mod=agentes&op=process_data&act=Nw==';
                    document.SurveyResponse.submit();
                    return false;
                } else {
                    swal("Cancelado", "Revisa Correctamente los datos", "error");
                }
            });
    }
}
