(function() {
  const screen = document.getElementById('screen');
  const history = document.getElementById('history');
  const keys = document.querySelector('.keys');

  let current = '0', prev = null, op = null, justEval = false;

  function format(n) {
    if (typeof n !== 'number' || !isFinite(n)) return 'Erro';
    return Number(n.toPrecision(12)).toString();
  }
  function setScreen(txt) { screen.textContent = txt; }
  function setHistory(txt) { history.textContent = txt; }

  function inputDigit(d) {
    if (justEval) { current = '0'; justEval = false; }
    if (d === '.' && !current.includes('.')) current += '.';
    else if (current === '0') current = d;
    else if (d !== '.') current += d;
    setScreen(current);
  }

  function clearAll() { current='0'; prev=null; op=null; justEval=false; setScreen('0'); setHistory(''); }
  function backspace() { if (!justEval) { current = current.length>1 ? current.slice(0,-1) : '0'; setScreen(current); } }
  function toggleSign() { if (current!=='0') { current = current.startsWith('-')?current.slice(1):'-'+current; setScreen(current);} }
  function applyPercent() { let c=parseFloat(current); if(!isNaN(c)){ current= format(prev!==null&&(op==='+'||op==='-')? prev*(c/100):c/100); setScreen(current);} }

  function compute(a,b,o){ return { '+':a+b, '-':a-b, '*':a*b, '/': b===0?NaN:a/b }[o]; }
  function symbolFor(o){ return { '+':'+','-':'−','*':'×','/':'÷' }[o]; }

  function setOperator(nextOp){
    const c=parseFloat(current);
    if(prev===null) prev=isNaN(c)?0:c;
    else if(!justEval){ prev=compute(prev,isNaN(c)?0:c,op||nextOp); setScreen(format(prev)); }
    op=nextOp; setHistory(`${format(prev)} ${symbolFor(op)}`); current='0'; justEval=false;
  }

  function equals(){
    if(op===null) return;
    const c=parseFloat(current);
    const result=compute(prev??0,isNaN(c)?0:c,op);
    setHistory(`${format(prev??0)} ${symbolFor(op)} ${format(c)} =`);
    setScreen(format(result));
    prev=result; current=format(result); op=null; justEval=true;
  }

  keys.addEventListener('click', e=>{
    const btn=e.target.closest('button.key'); if(!btn)return;
    if(btn.dataset.num!==undefined) inputDigit(btn.dataset.num);
    else if(btn.dataset.op) setOperator(btn.dataset.op);
    else switch(btn.dataset.action){ case'clear':clearAll();break;case'backspace':backspace();break;case'toggle-sign':toggleSign();break;case'percent':applyPercent();break;case'equals':equals();break;}
  });

  window.addEventListener('keydown', ev=>{
    const {key}=ev;
    if(/^[0-9]$/.test(key)) inputDigit(key);
    else if(key==='.'){ inputDigit('.'); }
    else if(['+','-','*','/'].includes(key)) setOperator(key);
    else if(key==='Enter'||key==='='){ ev.preventDefault(); equals(); }
    else if(key==='Backspace') backspace();
    else if(key==='Escape') clearAll();
    else if(key==='%') applyPercent();
  });

  setScreen('0');
})();
