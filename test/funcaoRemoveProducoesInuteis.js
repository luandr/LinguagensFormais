function removerEstadosInuteis(producoes){
	var estadoInicial;

	// Mostra no console as produções antes de eliminar inúteis
	console.log('Produções antes de eliminar os inúteis: ');
	imprimeFuncInuteis(producoes);

	// Procura pelo estado inicial
	for (var i = 0; i < producoes.length; i++){
		if (producoes[i].isInicial){
			estadoInicial = producoes[i].estado;
			break;
		}
	}

	var geramTerminais = [];
	// Armazenar todos os Estados que geram terminais diretamente
	for(var i = 0; i < producoes.length; i++){
		var gera = true;

		externo: for (var j = 0; j < producoes[i].prod.length; j++){			
			for (var k = 0; k < nTerminais.length; k++){
				if (producoes[i].prod[j] === nTerminais[k]){
					gera = false;
					break externo;
				}
			}
		}

		if (gera){
			geramTerminais.push(producoes[i].estado);
		}
	}

	// Limpa o array de estados que geram terminais diretamente para não possuir estados repetidos
	for (var i = 0; i < geramTerminais.length; i++){
		for (var j = i + 1; j < geramTerminais.length; j++){
			if (geramTerminais[i] === geramTerminais[j]){
				geramTerminais.splice(j, 1);
			}
		}
	}

	console.log('termeinais diretamente');
	for (var i = 0; i < geramTerminais.length; i++){
		console.log(geramTerminais[i]);			
	}

	// Armazenar todos os Estados que acessam terminais indiretamente
	for(var i = 0; i < producoes.length; i++){
		// Somente vai validar os estados que não geram diretamente
		var geraDir = false;
		for (var j = 0; j < geramTerminais.length; j++){
			if (producoes[i].estado === geramTerminais[j]){
				geraDir = true;
				break;
			}
		}

		if(!geraDir){					
			if (verificaGeraIndiretamente(criaArrayComProducoesDoEstadoX(producoes[i].estado, producoes), producoes, nTerminais, geramTerminais)){
			geramTerminais.push(producoes[i].estado);
			}
		}
	}

	console.log('terminais diretamente + indiretamente');
	for (var i = 0; i < geramTerminais.length; i++){
		console.log(geramTerminais[i]);			
	}

	// Elimina os estados que não geram terminais direta ou indiretamente
	for(var i = 0; i < nTerminais.length; i++){				
		var remove = true;
		for (var j = 0; j < geramTerminais.length; j++){
			if (nTerminais[i] == geramTerminais[j]){
				remove = false;
				break;
			}
		}

		if(remove){
			// Elimina as produções que contém os terminal a ser eliminado
			for(var j = 0; j < producoes.length; j++){
				for(var k = 0; k < producoes[j].prod.length; k++){
					if(nTerminais[i] === producoes[j].prod[k]){
						producoes.splice(j, 1);
						j--;
					}
				}
			}

		}
	}

	// Mostra resultando após 1ª parte
	console.log('Produções após 1ª parte: ');
	imprimeFuncInuteis(producoes);

	var estadosAcessiveis = [];
	estadosAcessiveis[0] = estadoInicial;
	// Estados acessíveis a partir do estado inicial
	verificaAcessiveis(criaArrayComProducoesDoEstadoX(estadoInicial, producoes), producoes, nTerminais, estadosAcessiveis);

	console.log("Estados acessíveis a partir do inicial: ");
	for (var i = 0; i < estadosAcessiveis.length; i++){
		console.log(estadosAcessiveis[i]);
	}

	// Remove repetiçõs no array de estados acessíveis
	for (var i = 0; i < estadosAcessiveis.length; i++){
		for (var j = i + 1; j < estadosAcessiveis.length; j++){
			if (estadosAcessiveis[i] === estadosAcessiveis[j]){
				estadosAcessiveis.splice(j,	 1);
				//j--;
			}
		}
	}
	// Remove os estados que não são acessíveis a partir do simbolo inicial
	for(var i = 0; i < producoes.length; i++){				
		var remove = true;
		for (var j = 0; j < estadosAcessiveis.length; j++){
			if (producoes[i].estado == estadosAcessiveis[j]){
				remove = false;
				break;
			}
		}

		if(remove){
			var estadoRemover = producoes[i].estado;
			for (var k = 0; k < producoes.length; k++){
				if (estadoRemover === producoes[k].estado){
					producoes.splice(k, 1);
					k--;
					i--;
				}
			}
		}
	}

	// Mostra resultando após 2ª parte
	console.log('Produções após 2ª parte: ');
	imprimeFuncInuteis(producoes);
}

function verificaAcessiveis(prodEstado, producoes, nTerminais, estadosAcessiveis){
	for(var i = 0; i < prodEstado.length; i++){
		for(var j = 0; j < prodEstado[i].prod.length; j++){
			extern: for(var k = 0; k < nTerminais.length; k++){
				if (prodEstado[i].prod[j] === nTerminais[k]){
					if (prodEstado[i].estado === nTerminais[k]){
						break;
					} else {
						// verifica se o estado já é acessível
						for (var l = 0; l < estadosAcessiveis.length; l++){
							if(nTerminais[k] === estadosAcessiveis[l]){
								break extern;
							}
						}
						estadosAcessiveis.push(nTerminais[k]);
						verificaAcessiveis(criaArrayComProducoesDoEstadoX(nTerminais[k], producoes), producoes, nTerminais, estadosAcessiveis);
						break;
					}
				}
			}
		}
	}
}

function verificaGeraIndiretamente(prodEstado, producoes, nTerminais, geramTerminais){
	for (var i = 0; i < prodEstado.length; i++) {
		for(var j = 0; j < prodEstado[i].prod.length; j++){
			for (var k = 0; k < nTerminais.length; k++){
				if(prodEstado[i].prod[j] === nTerminais[k]){
					// Se entrou no IF achou um terminal na produção
					if (prodEstado[i].estado === nTerminais[k]){
						return;
					} else {
						for (var l = 0; l < geramTerminais.length; l++){
							if (nTerminais[k] === geramTerminais[l]){
								return true;
							}
						}
						return verificaGeraIndiretamente(criaArrayComProducoesDoEstadoX(nTerminais[k], producoes), producoes, nTerminais, geramTerminais);
					}
				} 
			}
		}
	}
	return false;
}

function criaArrayComProducoesDoEstadoX(estado, producoes){
	var array = [];
	for (var i = 0; i < producoes.length;i++){
		if(producoes[i].estado === estado){
			array.push(producoes[i]);
		}
	}
	return array;
}

function imprimeFuncInuteis(producoes){
	for (var i = 0; i < producoes.length; i++){
		console.log(producoes[i].estado + ' ' + producoes[i].prod + ' ' + producoes[i].isInicial);			
	}
}
