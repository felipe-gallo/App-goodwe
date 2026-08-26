import type {Charger} from '../types';
const fallback = require('../../assets/logo-goodwe.png');
export const mockChargers: Charger[] = [
 {id:'goodwe-01',name:'Carregador Goodwe 01',address:'Avenida Paulista, São Paulo',image:fallback,latitude:-23.5613,longitude:-46.6565,status:'available',chargingType:'Carga AC',connectorType:'Tipo 2',powerKw:22,chargerBatteryLevel:92,distanceKm:1.2,description:'Ponto demonstrativo próximo à Avenida Paulista.'},
 {id:'goodwe-02',name:'Carregador Goodwe 02',address:'Parque Ibirapuera, São Paulo',image:fallback,latitude:-23.5874,longitude:-46.6576,status:'in_use',chargingType:'Carga rápida DC',connectorType:'CCS 2',powerKw:60,chargerBatteryLevel:67,distanceKm:3.8,description:'Estação fictícia em uso para demonstração.'},
 {id:'goodwe-03',name:'Carregador Goodwe 03',address:'Vila Madalena, São Paulo',image:fallback,latitude:-23.5502,longitude:-46.6918,status:'offline',chargingType:'Carga AC',connectorType:'Tipo 2',powerKw:11,chargerBatteryLevel:18,distanceKm:5.4,description:'Estação fictícia temporariamente offline.'},
];
export const findCharger=(id:string)=>mockChargers.find(c=>c.id===id);
export const searchChargers=(term:string)=>{const q=term.trim().toLocaleLowerCase('pt-BR');return q?mockChargers.filter(c=>(c.name+' '+c.address).toLocaleLowerCase('pt-BR').includes(q)):mockChargers;};
