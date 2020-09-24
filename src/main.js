import Vue from 'vue'
import {Time} from './time';
import _ from 'lodash';

require('style-loader!css-loader!bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

let meuVue = new Vue({
    el: '#app',
    data: {
        order: {
            keys: ['pontos', 'gm', 'gs'],
            sort: ['desc', 'desc', 'asc']
        },        
        filter: '',
        mesmoTimeMsg: '',
        mesmoTimeCasa: '',
        mesmoTimeFora:'',
        tipoClasseAlerta:'',
        sorteioRepetido: false,
        ckeckCaseSentitive: false,
        colunas: ['nome', 'pontos', 'gm', 'gs', 'saldo'],
        times: [
            new Time('Palmeiras', require('./assets/palmeiras_60x60.png')),
            new Time('Flamengo', require('./assets/flamengo_60x60.png')),
            new Time('Atlético-MG', require('./assets/atletico_mg_60x60.png')),
            new Time('Santos', require('./assets/santos_60x60.png')),
            new Time('Botafogo', require('./assets/botafogo_60x60.png')),
            new Time('Atlético-PR', require('./assets/atletico-pr_60x60.png')),
            new Time('Corinthians', require('./assets/corinthians_60x60.png')),
            new Time('Grêmio', require('./assets/gremio_60x60.png')),
            new Time('Fluminense', require('./assets/fluminense_60x60.png')),
            new Time('Ponte Preta', require('./assets/ponte_preta_60x60.png')),
            new Time('Chapecoense', require('./assets/chapecoense_60x60.png')),
            new Time('São Paulo', require('./assets/sao_paulo_60x60.png')),
            new Time('Cruzeiro', require('./assets/cruzeiro_60x60.png')),
            new Time('Sport', require('./assets/sport_60x60.png')),
            new Time('Coritiba', require('./assets/coritiba_60x60.png')),
            new Time('Internacional', require('./assets/internacional_60x60.png')),
            new Time('Vitória', require('./assets/vitoria_60x60.png')),
            new Time('Figueirense', require('./assets/figueirense_60x60.png')),
            new Time('Santa Cruz', require('./assets/santa_cruz_60x60.png')),
            new Time('América-MG', require('./assets/america_mg_60x60.png')),
        ],
        novoJogo: {
            casa: {
                time: null,
                gols: 0
            },
            fora: {
                time: null,
                gols: 0
            }
        },
        view: 'tabela'
    },
    methods: {
        fimJogo(){
            let timeAdversario = this.novoJogo.fora.time;
            let gols = +this.novoJogo.casa.gols;
            let golsAdversario = +this.novoJogo.fora.gols;
            this.novoJogo.casa.time.fimJogo(timeAdversario, gols, golsAdversario);
            this.showView('tabela');
        },
        createNovoJogo(){
            
            let indexCasa = Math.floor(Math.random() * 20),
                indexFora = Math.floor(Math.random() * 20);
            
            if (indexCasa === indexFora){
                this.sorteioRepetido = true;
                this.mesmoTimeMsg = 'OPA!!! Os times estavam iguais. Um novo sorteio foi realizado. Vamos ao placar.'; 
                this.mesmoTimeCasa = this.times[indexCasa];
                this.mesmoTimeFora = this.times[indexFora];                                  
                this.tipoClasseAlerta = 'alert alert-danger';
                while (indexCasa === indexFora) {
                    indexFora = Math.floor(Math.random() * 20);
                }                 
            }else{
                this.sorteioRepetido = false;
                this.mesmoTimeMsg = 'Times Diferentes. Ok! Vamos ao placar.';
                this.tipoClasseAlerta = 'alert alert-success';
            }

            this.novoJogo.casa.time = this.times[indexCasa];
            this.novoJogo.casa.gols = 0;
            this.novoJogo.fora.time = this.times[indexFora];
            this.novoJogo.fora.gols = 0;
            this.showView('novojogo');
        },
        showView(view){
            this.view = view;
        },
        sortBy(coluna){
            this.order.keys = coluna;
            this.order.sort = this.order.sort == 'desc' ? 'asc': 'desc';
        },
        removerAcentos( newStringComAcento ) {
            var string = newStringComAcento;

            var mapaAcentosHex = {
                a : /[\xE0-\xE6]/g,
                A : /[\xC0-\xC6]/g,
                e : /[\xE8-\xEB]/g,
                E : /[\xC8-\xCB]/g,
                i : /[\xEC-\xEF]/g,
                I : /[\xCC-\xCF]/g,
                o : /[\xF2-\xF6]/g,
                O : /[\xD2-\xD6]/g,
                u : /[\xF9-\xFC]/g,
                U : /[\xD9-\xDC]/g,
                c : /\xE7/g,
                C : /\xC7/g,
                n : /\xF1/g,
                N : /\xD1/g,
            };

            for ( var letra in mapaAcentosHex ) {
                var expressaoRegular = mapaAcentosHex[letra];
                string = string.replace( expressaoRegular, letra );
            }

            return string;
        }
    },
    computed: {
        timesFiltered(){
            let colecao = _.orderBy(this.times, this.order.keys, this.order.sort);

            if (this.ckeckCaseSentitive){
                return _.filter(colecao, item => {
                    return item.nome.indexOf(this.filter) >=0;
                });
            }else{
                return _.filter(colecao, item => {
                    return this.removerAcentos(item.nome.toLowerCase()).indexOf(this.removerAcentos(this.filter.toLowerCase())) >=0;
                });
            }                                 
        }
    },
    filters: {
        saldo(time){
            return time.gm - time.gs;
        },
        ucwords(value){
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
});