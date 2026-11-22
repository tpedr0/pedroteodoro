// EDITOR'S DESK: Customize these arrays to publish the next edition.
const ISSUE = '001';
const questions = [
  {id:'week', type:'text', title:'What was the best little part of your week?', hint:'The mundane answers count, too.', placeholder:'Your answer…'},
  {id:'afternoon', type:'choice', title:'Pick a completely free afternoon.', hint:'No obligations. Just excellent taste.', options:['A bookstore and coffee','A museum and somewhere good to eat','A day at home with absolutely no plans']},
  {id:'next-issue', type:'text', title:'What do you want to see in the next issue?', hint:'Consider this your editorial influence.', placeholder:'A request, a topic, a complaint about the font…'}
];
const products = [
  {id:'cup', category:'01 / The home edit', title:'The coffee ritual', desc:'A very pretty cup for a very ordinary cup of coffee.', question:'Would this be your style?', image:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=850&q=80', alt:'Minimal ceramic cup with coffee'},
  {id:'tote', category:'02 / The accessories edit', title:'The everyday bag', desc:'The kind of bag that makes an ordinary outfit feel put together.', question:'Would you carry something like this?', image:'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=850&q=80', alt:'Fashion handbag in an editorial still life'},
  {id:'flowers', category:'03 / The flowers edit', title:'A little flower moment', desc:'Fresh flowers might be obvious, but not necessarily a bad idea.', question:'Is this the right direction?', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=850&q=80', alt:'Softly colored flowers in editorial light'}
];
const storageKey = 'teodoro-edit-' + ISSUE;
let answers = {};
try { answers = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { answers = {}; }
const escapeHTML = (text) => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(answers)); } catch {} };
function toast(message) { const t=document.getElementById('toast'); t.textContent=message; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),2600); }
function renderQuestions() {
  const parent=document.getElementById('question-list');
  questions.forEach((q,i)=>{
    const container=document.createElement('article'); container.className='question';
    const key='question-'+q.id;
    const control=q.type==='text'
      ? `<textarea data-value="${escapeHTML(q.id)}" aria-label="Answer question ${i+1}" placeholder="${escapeHTML(q.placeholder)}"></textarea>`
      : `<div class="options">${q.options.map((option,j)=>`<button class="option" type="button" data-question="${escapeHTML(q.id)}" data-index="${j}" aria-pressed="${String(answers[key]===option)}">${escapeHTML(option)}</button>`).join('')}</div>`;
    container.innerHTML=`<span class="question-num">0${i+1}</span><div><h3>${escapeHTML(q.title)}</h3><p class="hint">${escapeHTML(q.hint)}</p></div><div class="answer">${control}<div class="qstatus"><span>${q.type==='text'?'Write as much or as little as you like':'Choose one'}</span><span class="save-state">${answers[key]?'Saved on this device':'Optional'}</span></div></div>`;
    parent.appendChild(container);
    if(q.type==='text'){
      const textarea=container.querySelector('textarea'); textarea.value=answers[key]||'';
      textarea.addEventListener('input',()=>{answers[key]=textarea.value;persist();container.querySelector('.save-state').textContent=textarea.value?'Saved on this device':'Optional';});
    } else {
      container.querySelectorAll('.option').forEach(button=>button.addEventListener('click',()=>{
        answers[key]=q.options[Number(button.dataset.index)]; persist();
        container.querySelectorAll('.option').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
        container.querySelector('.save-state').textContent='Saved on this device';
      }));
    }
  });
}
function renderProducts() {
  const parent=document.getElementById('product-list');
  const labels=['Yes','Maybe','Pass'];
  products.forEach(p=>{
    const key='product-'+p.id;
    const article=document.createElement('article'); article.className='product';
    article.innerHTML=`<span class="eyebrow" style="color:var(--plum)">${escapeHTML(p.category)}</span><div class="product-photo"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.alt)}" loading="lazy" onerror="this.style.display='none'"></div><h3>${escapeHTML(p.title)}</h3><p class="product-desc">${escapeHTML(p.desc)}</p><p class="vote-title">${escapeHTML(p.question)}</p><div class="votes">${labels.map((label,i)=>`<button class="vote" type="button" data-index="${i}" aria-pressed="${String(answers[key]===label)}">${label}</button>`).join('')}</div><p class="vote-confirm" role="status">${answers[key]?'Vote saved on this device':''}</p>`;
    parent.appendChild(article);
    article.querySelectorAll('.vote').forEach(button=>button.addEventListener('click',()=>{
      answers[key]=labels[Number(button.dataset.index)]; persist();
      article.querySelectorAll('.vote').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      article.querySelector('.vote-confirm').textContent='Vote saved on this device';
    }));
  });
}
function makeResponseText() {
  let message='THE TEODORO EDIT · ISSUE '+ISSUE+'\n\nTHE INTERVIEW\n';
  questions.forEach((q,i)=>message+=`\n${i+1}. ${q.title}\n${answers['question-'+q.id]||'(skipped)'}\n`);
  message+='\nTHE SHOPPING EDIT\n';
  products.forEach(p=>message+=`${p.title}: ${answers['product-'+p.id]||'(no vote)'}\n`);
  return message;
}
async function copyText(){
  const text=makeResponseText();
  try { await navigator.clipboard.writeText(text); toast('Copied. Paste it into a message when you want.'); }
  catch {
    const temp=document.createElement('textarea'); temp.value=text; temp.style.position='fixed'; temp.style.opacity='0'; document.body.appendChild(temp);temp.select();
    let copied=false;try{copied=document.execCommand('copy');}catch{} temp.remove();
    if(copied)toast('Copied. Paste it into a message when you want.');
    else window.prompt('Copy your answers:',text);
  }
}
function downloadText(){
  const blob=new Blob([makeResponseText()],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`teodoro-edit-${ISSUE}-replies.txt`;
  document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  toast('Saved as a text file.');
}
renderQuestions();renderProducts();
document.getElementById('copy-answers').addEventListener('click',copyText);
document.getElementById('download-answers').addEventListener('click',downloadText);
const progress=document.getElementById('progress-track');
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';}
window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
