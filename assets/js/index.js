const contenedor = document.querySelector('.contenedor')
const selectTypes = document.querySelector('#typeOptions')

const cargarpokemones = (selctValue) => {
    const pokemones = fetch('https://pokeapi.co/api/v2/pokemon')
    let pokes = []
    let habilidadesTexto = ''
    let columnas = ''
    let contador = 0
    let filas = ''
    pokemones
        .then((response) => response.json())
        .then((data) => {
            pokes = data.results
            pokes.forEach(pokemon => {
                let habilidades = fetch(pokemon.url)
                habilidades.then((respuesta) => respuesta.json())
                    .then((miniData) => {
                        let abilities = miniData.abilities
                        let abilitiesimg = miniData.sprites.other['official-artwork'].front_default
                        let abilitiesgif = miniData.sprites.other.showdown.front_default
                        abilities.forEach((item) => {
                            habilidadesTexto += item.ability.name + ", "
                        })
                        habilidadesTexto = habilidadesTexto.slice(0, habilidadesTexto.length - 2)
                        contador = contador + 1

                        if (miniData.types.find((item) => item.type.name == selctValue) || selctValue == undefined) {
                            columnas += `
                <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                    <div class="card mb-4 fondo" style="min-height: 300px; max-height: 300px;">
                        <div class="card-body">
                            <p id="pokemon">Nombre del pokemon:${pokemon.name}</p>
                            <p id="texto">Habilidades:${habilidadesTexto}</p>
                            <img src="${abilitiesimg}" alt="" style="width: 140px; height: 150px;">
                            <img src="${abilitiesgif}">
                            <a href="${pokemon.url}" class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover link">Detalles</a>
                        </div>
                    </div>
                </div>`
                        } else if (contador == 20 && columnas == '') {
                            columnas = "<div class='col-12'><h1 id='color'>No hay Datos</h1></div>"
                        } else {
                            contenedor.insertAdjacentHTML('afterbegin', columnas)
                        }
                        habilidadesTexto = ''
                        if (contador == pokes.length) {
                            filas = ` 
                <div class="row">
                ${columnas}
                </div>`
                            contenedor.replaceChildren('')
                            contenedor.insertAdjacentHTML('afterbegin', filas)
                        }
                    })
            });
        })
        .catch((error) => console.log(error))
}

const types = fetch('https://pokeapi.co/api/v2/type/')

types.then((response) => response.json())
    .then((data) => {
        let tipos = data.results
        tipos.forEach((tipo) => {
            selectTypes.insertAdjacentHTML('afterbegin', `<option value=${tipo.name}>${tipo.name}</option>`)
        })
    })

selectTypes.addEventListener('change', (e) => {
    contenedor.replaceChildren('')
    if (e.target.value == 'filtrar') {
        cargarpokemones()
    } else {
        cargarpokemones(e.target.value)
    }
})
cargarpokemones()