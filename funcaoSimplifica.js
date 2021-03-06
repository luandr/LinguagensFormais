function simplifica(producoes){
	removeVazias(producoes);
	removeUnitaria(producoes);
	removerInuteis(producoes);
}

function removeVazias(producoes){
	// Mostra no console as produções antes de eliminar vazios
	console.log('Produções antes de eliminar os vazios: ');
	impFuncVazias(producoes);

	var estadosComVazio = [];
	// Armazena os estados com vazio em um array auxiliar
	for(var i = 0, j = 0; i < producoes.length; i++){
		if (producoes[i].prod === '&') {
        	estadosComVazio[j] = producoes[i].estado;
        	producoes.splice(i, 1);
        	j++;
		}
	}

	//impFuncVazias estados que contém vazios
	console.log("Estados com vazio:");
	for (var i = 0; i < estadosComVazio.length; i++){
		console.log(estadosComVazio[i]);
	}

	var producoesAux = [];
	// Gera novas produções onde contém vazio, e armazena no array de produções auxiliares
	for(var i = 0; i < producoes.length; i++){
		var novaProd = '';
		if (contaOcorrenciasVazias(producoes[i].prod, estadosComVazio) > 1){
			// Cria uma produção eliminando cada estado que possuir vazio
			for (var j = 0; j < producoes[i].prod.length; j++){
				for (var k = 0; k < estadosComVazio.length; k++){
					if (producoes[i].prod[j] === estadosComVazio[k]){
						// Quando entra nesse if achou a posição do estado, então vai criar uma produção sem o caractere dessa posição
						for (var l = 0; l < producoes[i].prod.length; l++){
							if (j === l){
								continue;
							}
							novaProd += producoes[i].prod[l];
						}
						producoesAux.push(new Producao(producoes[i].estado, novaProd, producoes[i].isInicial));
						novaProd = '';    						
					}
				}
			}
			// Cria uma produção sem TODOS os estados que contém vazio
			novaProd = producoes[i].prod;
			for (var j = 0; j < estadosComVazio.length; j++){
				novaProd = novaProd.replace(estadosComVazio[j], '');
			}
			producoesAux.push(new Producao(producoes[i].estado, novaProd, producoes[i].isInicial));
		} else {
			//Trata apenas estados com apenas um único vazio
			for (var j = 0 ; j < estadosComVazio.length; j++) {
				//Verifica se há algum estado vazio na produção
				if (producoes[i].prod.indexOf(estadosComVazio[j]) > -1) {				
					novaProd = '';
					for (var k = 0; k < producoes[i].prod.length; k++){
	    				if (producoes[i].prod[k] !== estadosComVazio[j]){
	    					novaProd += producoes[i].prod[k];
	    				}
					}
					producoesAux.push(new Producao(producoes[i].estado, novaProd, producoes[i].isInicial));    			
    			}
        	}
		}
	}

	console.log("producoes criadas: ");
	impFuncVazias(producoesAux);

	// Coloca as novas produções criada no array auxiliar, passando para o array principal.			
	if (producoesAux.length > 0){
		for (var i = 0; i < producoesAux.length; i++){
			producoes.push(producoesAux[i]);
		}
		// Limpa o array auxiliar
		producoesAux.splice(0, producoesAux.length - 1);
	}

	// Remove possíveis produções que ficarão repetidas
	for (var i = 0; i < producoes.length; i++){
		for (var j = i + 1; j < producoes.length; j++){
			if (producoes[i].estado === producoes[j].estado && producoes[i].prod === producoes[j].prod){
				producoes.splice(j, 1);
				j--;
			}
		}
	}

	// Mostra no console as produções após eliminar vazios
	console.log('Produções após eliminar os vazios: ');
	impFuncVazias(producoes);

}

function contaOcorrenciasVazias(prod, estadosComVazio){
	var novaProd = prod;
	for (var i = 0; i < estadosComVazio.length; i++){
		novaProd = novaProd.replace(estadosComVazio[i], '');
	}
	return (prod.length - novaProd.length);
}

function impFuncVazias(producoes){
	for (var i = 0; i < producoes.length; i++){
		console.log(producoes[i].estado + ' ' + producoes[i].prod + ' ' + producoes[i].isInicial);			
	}
}

function removeUnitarias(producoes){

	// Mostra no console as produções antes de remover unitárias
	console.log('Produções antes de remover os unitárias: ');
	impFuncUnitarias(producoes);

	// Verifica se existe estados inválidos para eliminar. Ex: J -> H e H -> J
	removeInvalidos(producoes);

	// Remove produções unitárias
	removeU(producoes);	
	
	// Mostra no console as produções após remover unitárias
	console.log('Produções após remover os unitárias: ');
	impFuncUnitarias(producoes);
}

function removeInvalidos(producoes){
	for(var i = 0; i < producoes.length; i++){
		for(var j = 0; j < nterm.length; j++){
			if (producoes[i].prod === nterm[j]){
				var arrayProds = criaArrayComProducoesDoEstadoY(nterm[j], producoes);				
				for(var k = 0; k < arrayProds.length; k++){
					if (arrayProds[k].prod === producoes[i].estado){
						// Encontrou loop, irá eliminar os estados e todos as produções que os contém
						var excluir = [arrayProds[k].estado, producoes[i].estado];
 						for (var l = 0; l < producoes.length; l++){
 							for (var m = 0; m < excluir.length; m++){
 								if (producoes[l].prod.indexOf(excluir[m]) > -1){
 									producoes.splice(l, 1);
 									l--;
 								}
 							}
 						}
					}
				}
			}
		}
	}
}

function removeU(producoes){
	var producoesAux = [];
	var existeUnitaria = false;
	// Gera novas produções e elimina a unitária
	for(var i = 0; i < producoes.length; i++){
		for (var j = 0; j < nterm.length; j++){
			if(producoes[i].prod === nterm[j]){
				// Cria novas produções de acordo com a unitária
				for(var k = 0; k < producoes.length; k++){
					if (producoes[k].estado === nterm[j]){
						var novaProdObj = new Producao(producoes[i].estado, producoes[k].prod, producoes[i].isInicial);
						producoesAux.push(novaProdObj);
					}
				}
				// Elimina a produção unitária
				producoes.splice(i, 1);
				i--;
			}
		}
	}

	// Coloca as novas produções criada no array principal.			
	if (producoesAux.length > 0){
		// Transfere para o array principal
		for (var i = 0; i < producoesAux.length; i++){
			producoes.push(producoesAux[i]);
		}
		// Limpa o array auxiliar
		producoesAux.splice(0, producoesAux.length - 1);
	}

	// Depois de ajustar tudo, verificar se ainda existe produção unitária
	externo: for(var i = 0; i < producoes.length; i++){
		for (var j = 0; j < nterm.length; j++){
			if(producoes[i].prod === nterm[j]){
				// Ainda existe unitária
				existeUnitaria = true;
				break externo;
			}
		}
	}

	// Remove possíveis produções que ficarão repetidas
	for (var i = 0; i < producoes.length; i++){
		for (var j = i + 1; j < producoes.length; j++){
			if (producoes[i].estado === producoes[j].estado && producoes[i].prod === producoes[j].prod){
				producoes.splice(j, 1);
			}
		}
	}
	
	if (existeUnitaria){
		removeU(producoes);
	}
}

function impFuncUnitarias(producoes){
	for (var i = 0; i < producoes.length; i++){
		console.log(producoes[i].estado + ' ' + producoes[i].prod + ' ' + producoes[i].isInicial);			
	}
}

function removerInuteis(producoes){
	var estadoInicial;

	// Mostra no console as produções antes de eliminar inúteis
	console.log('Produções antes de eliminar os inúteis: ');
	impFuncInuteis(producoes);

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
			for (var k = 0; k < nterm.length; k++){
				if (producoes[i].prod[j] === nterm[k]){
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
			if (verificaGeraInd(criaArrayComProducoesDoEstadoY(producoes[i].estado, producoes), producoes, geramTerminais)){
			geramTerminais.push(producoes[i].estado);
			}
		}
	}

	console.log('terminais diretamente + indiretamente');
	for (var i = 0; i < geramTerminais.length; i++){
		console.log(geramTerminais[i]);			
	}

	// Elimina os estados que não geram terminais direta ou indiretamente
	for(var i = 0; i < nterm.length; i++){				
		var remove = true;
		for (var j = 0; j < geramTerminais.length; j++){
			if (nterm[i] == geramTerminais[j]){
				remove = false;
				break;
			}
		}

		if(remove){
			// Elimina as produções que contém os terminal a ser eliminado
			for(var j = 0; j < producoes.length; j++){
				for(var k = 0; k < producoes[j].prod.length; k++){
					if(nterm[i] === producoes[j].prod[k]){
						producoes.splice(j, 1);
						j--;
					}
				}
			}

		}
	}

	// Mostra resultando após 1ª parte
	console.log('Produções após 1ª parte: ');
	impFuncInuteis(producoes);

	var estadosAcessiveis = [];
	estadosAcessiveis[0] = estadoInicial;
	// Estados acessíveis a partir do estado inicial
	verificaAcessivel(criaArrayComProducoesDoEstadoY(estadoInicial, producoes), producoes, estadosAcessiveis);

	console.log("Estados acessíveis a partir do inicial: ");
	for (var i = 0; i < estadosAcessiveis.length; i++){
		console.log(estadosAcessiveis[i]);
	}

	// Remove repetiçõs no array de estados acessíveis
	for (var i = 0; i < estadosAcessiveis.length; i++){
		for (var j = i + 1; j < estadosAcessiveis.length; j++){
			if (estadosAcessiveis[i] === estadosAcessiveis[j]){
				estadosAcessiveis.splice(j,	 1);
				j--;
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
	impFuncInuteis(producoes);
}

function verificaAcessivel(prodEstado, producoes, estadosAcessiveis){
	for(var i = 0; i < prodEstado.length; i++){
		for(var j = 0; j < prodEstado[i].prod.length; j++){
			extern: for(var k = 0; k < nterm.length; k++){
				if (prodEstado[i].prod[j] === nterm[k]){
					if (prodEstado[i].estado === nterm[k]){
						break;
					} else {
						// verifica se o estado já é acessível
						for (var l = 0; l < estadosAcessiveis.length; l++){
							if(nterm[k] === estadosAcessiveis[l]){
								break extern;
							}
						}
						estadosAcessiveis.push(nterm[k]);
						verificaAcessivel(criaArrayComProducoesDoEstadoY(nterm[k], producoes), producoes, estadosAcessiveis);
						break;
					}
				}
			}
		}
	}
}

function verificaGeraInd(prodEstado, producoes, geramTerminais){
	for (var i = 0; i < prodEstado.length; i++) {
		for(var j = 0; j < prodEstado[i].prod.length; j++){
			for (var k = 0; k < nterm.length; k++){
				if(prodEstado[i].prod[j] === nterm[k]){
					// Se entrou no IF achou um terminal na produção
					if (prodEstado[i].estado === nterm[k]){
						return;
					} else {
						for (var l = 0; l < geramTerminais.length; l++){
							if (nterm[k] === geramTerminais[l]){
								return true;
							}
						}
						return verificaGeraInd(criaArrayComProducoesDoEstadoY(nterm[k], producoes), producoes, geramTerminais);
					}
				} 
			}
		}
	}
	return false;
}

function criaArrayComProducoesDoEstadoY(estado, producoes){
	var array = [];
	for (var i = 0; i < producoes.length;i++){
		if(producoes[i].estado === estado){
			array.push(producoes[i]);
		}
	}
	return array;
}

function impFuncInuteis(producoes){
	for (var i = 0; i < producoes.length; i++){
		console.log(producoes[i].estado + ' ' + producoes[i].prod + ' ' + producoes[i].isInicial);			
	}
}
