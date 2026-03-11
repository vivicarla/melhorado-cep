const formulario = document.getElementById('cepform');
const resultado = document.getElementById('resultado');
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('Por favor, insira um CEP válido com oito dígitos.');
        return;
    }
    resultado.innerHTML = 'Carregando...';
    try {
        const endereco = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await endereco.json();
        if (dados.erro) {
            resultado.innerHTML = 'CEP não encontrado. Verifique o número e tente novamente.';
        } else {
            //Mudar aqui
            resultado.innerHTML = "Rua: " + dados.logradouro + "<br>" +
                "Bairro: " + dados.bairro + "<br>" +
                "Cidade: " + dados.localidade + "<br>" +
                "Estado: " + dados.uf;
                const cidade = dados.localidade
            const dadosGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countrycode=BR`);
            const dadosGeoJson = await dadosGeo.json();
            console.log(dadosGeoJson);
            if (dadosGeoJson.results && dadosGeoJson.results.length > 0) {
                const { latitude, longitude } = dadosGeoJson.results[0];
                //console.log(latitude);
                //console.log(longitude);
                //https://api.open-meteo.com/v1/forecast?latitude=-27.2142&longitude=-49.6431&current_weather=true
                const clima = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const climaJson = await clima.json();
                console.log(climaJson);
            } else {
                console.log('Nenhum resultado de geocodificação encontrado para a cidade.');
            }
            //https://geocoding-api.open-meteo.com/v1/search?name=Rio+do+sul&count=1&language=pt&format=json&countrycode=BR
        }

    } catch (erro) {
        resultado.innerHTML = 'Erro ao buscar o CEP. Tente novamente mais tarde.';
    }
});