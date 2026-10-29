"use strict";
const $=id=>document.getElementById(id);const currency=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const rates={branco:1200,amadeirado:1400,ripado:1200,provencal:1820};let lastFurnitureValue=null;
function openTab(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>openTab(b.dataset.tab)));
$('formMoveis').addEventListener('submit',event=>{event.preventDefault();const h=Number($('altura').value),w=Number($('largura').value);if(!(h>0&&w>0))return;const value=h*w*rates[$('material').value]/1000000;lastFurnitureValue=value;$('resultadoMoveis').innerHTML=`<span>VALOR ESTIMADO</span><strong>${currency(value)}</strong><small>Medidas: ${h} × ${w} mm</small>`;$('usarNoPdf').disabled=false;});
$('usarNoPdf').addEventListener('click',()=>{if(lastFurnitureValue===null)return;$('avista').value=lastFurnitureValue.toFixed(2).replace('.',',');updateQuote();openTab('pdf');});
$('formCorte').addEventListener('submit',event=>{event.preventDefault();const len=Number($('comprimento').value),speed=Number($('velocidade').value);if(!(len>0&&speed>0))return;const min=len/speed/60,cost=min*5;$('resultadoCorte').innerHTML=`<span>CUSTO DO CORTE</span><strong>${currency(cost)}</strong><small>Tempo estimado: ${min.toFixed(1).replace('.',',')} min</small>`;});
function parseBRL(s){s=String(s).trim().replace(/\s/g,'').replace(/R\$/g,'');if(!s)return NaN;if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');return Number(s);}
function updateQuote(){const cash=parseBRL($('avista').value);const valid=Number.isFinite(cash)&&cash>0;const credit=valid?Math.round(cash*115)/100:0;const instalment=Math.round(credit/12*100)/100;$('mostraAvista').textContent=valid?currency(cash):'—';$('mostraPrazo').textContent=valid?currency(credit):'—';$('mostraParcelas').textContent=valid?currency(instalment):'—';return valid?{cash,credit,instalment}:null;}
$('avista').addEventListener('input',updateQuote);
function dateBR(d){return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});}
$('formPdf').addEventListener('submit',event=>{event.preventDefault();const q=updateQuote();if(!q){alert('Preencha um valor à vista válido.');return;}const now=new Date();const until=new Date(now.getFullYear(),now.getMonth(),now.getDate()+7);$('docData').textContent=dateBR(now);$('docValidade').textContent=dateBR(until);$('docCliente').textContent=$('cliente').value.trim();$('docProjeto').textContent=$('projeto').value.trim();$('docDescricao').textContent=$('descricao').value.trim();$('docPrazo').textContent=$('prazo').value+' dias úteis';$('docAvista').textContent=currency(q.cash);$('docPrazoTotal').textContent=currency(q.credit);$('docParcela').textContent=currency(q.instalment);window.print();});
// Ao preparar a impressão, reduz proporcionalmente a proposta para uma folha A4.
function fitPrintA4(){const el=$("printArea");el.style.setProperty("--mp-print-zoom","1");const mmPx=96/25.4;const usableHeight=282*mmPx;const h=el.getBoundingClientRect().height;let scale=h>usableHeight? Math.max(0.45,usableHeight/h*0.95):1;el.style.setProperty("--mp-print-zoom",String(scale));}
window.addEventListener("beforeprint",fitPrintA4);
window.addEventListener("afterprint",()=>$("printArea").style.removeProperty("--mp-print-zoom"));
updateQuote();
