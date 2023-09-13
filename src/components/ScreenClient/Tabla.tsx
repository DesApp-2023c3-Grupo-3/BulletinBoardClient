import Filas from "./Filas";

function Tabla() {
  return (
        <main>
            <table>
                <thead>
                    <tr>
                        <th scope="col">
                            Materia
                        </th>
                        <th scope="col">
                            Comision
                        </th>
                        <th scope="col">
                            Aula
                        </th>
                        <th scope="col">
                            Horario
                        </th>
                    </tr>
                </thead>
                <Filas />
            </table>
        </main>
  );
}


export default Tabla