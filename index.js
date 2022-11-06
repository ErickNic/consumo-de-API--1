const URL__RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const URL__FAVORITOS = 'https://api.thecatapi.com/v1/favourites?api_key=ba18bbf4-9fe0-4567-9125-dd3b8a656c98';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=ba18bbf4-9fe0-4567-9125-dd3b8a656c98`;
const URL_SUBIR = 'https://api.thecatapi.com/v1/images/upload';
const boton = document.querySelector('#Recargar');
const i1 = document.querySelector('#img1');
const i2 = document.querySelector('#img2');
const btns1 = document.querySelector('#btn1');
const btns2 = document.querySelector('#btn2');
const spanError = document.querySelector('span');

const api = axios.create({
    baseURL:'https://api.thecatapi.com/v1/'
});
api.defaults.headers.common['X-API-KEY']= 'ba18bbf4-9fe0-4567-9125-dd3b8a656c98'


boton.addEventListener('click', generarGato);

async function generarGato(){
    try {
        const response = await fetch(URL__RANDOM);
        const data = await response.json();
        if(response.status !== 200){
            spanError.innerHTML = `Hubo un error ${res.status} ${data.message}`
        }else{
            i1.src = data[0].url;
            i2.src = data[1].url;
            btns1.onclick= ()=> salvarGatosFavoritos(data[0].id);
            btns2.onclick= ()=> salvarGatosFavoritos(data[1].id);
        }
        
    } catch (error) {
        console.error(error);
    }
}
async function salvarGatosFavoritos(id){
/*     const res = await fetch(URL__FAVORITOS,{
        method:'POST',
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            image_id:id
        })
    });
    const data = await res.json(); */
    const {data,status} = await api.post('favourites',{
        image_id:id
    });
    console.log('Salvar');
    if(status !== 200){
        spanError.innerHTML = `Hubo un error: ${status} ${data.message}`;
        console.log(`Hubo un error: ${status} ${data.message}`)
    }
}
async function loadFavouriteMichis() {
    const res = await fetch(URL__FAVORITOS);
    const data = await res.json();
    console.log(data)
  
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      data.forEach(michi => {
        const section = document.getElementById('favoriteMichis')
        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Sacar al michi de favoritos');

        
        img.src = michi.image.url;
        img.width = 150;
        btn.appendChild(btnText);
        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);
        btn.className = 'card_button'; 
        btn.onclick = () => removeFromFavorites(michi.id);
      });
    }
}
async function removeFromFavorites(id){
    const response = await fetch(API_URL_FAVORITES_DELETE(id),{
        method: 'DELETE'
    });
    let data = await response.json();
    if(response.status !== 200){
        spanError.innerHTML = 'Hubo un error '+response.status + data.mesange;
    }else{
        console.log('Eliminado');
        loadFavouriteMichis();
    }
}
async function subirFotoMichi(){
    const form = document.getElementById('uploadingMichi');
    const formData = new FormData(form);
    console.log(formData.get('file'));
    /* const res = await fetch(URL_SUBIR,{
        method:'POST',
        headers:{
            'content-Type': 'multipart/form-data',
            'X-API-KEY': 'ba18bbf4-9fe0-4567-9125-dd3b8a656c98',

        },
        body:formData
    }); */
    
    const subir = await api.post('/images/upload',{
        body:formData
    });
}
generarGato();
loadFavouriteMichis();