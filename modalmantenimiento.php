
<div class="modal fade" id="modalmantenimiento" tabindex="-1" aria-labelledby="nuevoProyecto" aria-hidden="true">
  <div class="modal-dialog" style="min-width: 85%;">
    <!--Con el min-width manejo el ancho del modal -->
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title" id="nuevoProyecto">Registro de Nuevo Servidor</h2>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span>&times;</span>
                </button>
      </div>

      <div class="modal-body">
        <div class="container-fluid">
          <form>
            <div class="row">
              <div class="form-group col-md-4">
                <label for="nombre">Nombre</label>
                <input type="text" class="form-control" id="nombre" required>
              </div>
              <div class="form-group col-md-4">
                <label for="descripcion">Descripción</label>
                <input type="text" class="form-control" id="descripcion" required>
              </div>
              <div class="form-group col-md-4">
                <label for="descripcion2">Descripción</label>
                <input type="text" class="form-control" id="descripcion2" required>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="observaciones">Observaciones</label>
                <input type="text" class="form-control" id="observaciones">
              </div>
              <div class="form-group col-md-3">
                <label for="fecha_ini">Fecha Inicio</label>
                <input type="date" class="form-control" id="fecha_ini" required>
              </div>
              <div class="form-group col-md-3">
                <label for="fecha_fin">Fecha Fin</label>
                <input type="date" class="form-control" id="fecha_fin">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-2">
                <label for="site">Site</label>
                <select class="custom-select mr-sm-2" id="site" required>
                  <option selected>Elegir Site...</option>
                  <option value=""></option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!--.modal-body-->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Agregar</button>
      </div>
    </div>
    <!--.modal-content-->
  </div>
  <!--.modal-dialog-->
</div>


<!--
<div id="modalmantenimiento" class="modal fade bd-example-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" id="producto_form">
                <div class="modal-header">
                    <h4 class="modal-title" id="mdltitulo"></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="prod_id" name="prod_id">

                    <div class="form-group">
                        <label class="form-label" for="prod_nom">Nombre</label>
                        <input type="text" class="form-control" id="prod_nom" name="prod_nom" placeholder="Ingrese Nombre" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-rounded btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="submit" name="action" id="#" value="add" class="btn btn-rounded btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>-->