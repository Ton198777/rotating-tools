
function toggleNav(){
  const nav = document.querySelector('.nav-links');
  if(nav) nav.classList.toggle('show');
}
function setActiveLinks(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(a=>{
    if(a.getAttribute('href') === page){
      a.classList.add('active');
    }
  });
}
function num(id){ return parseFloat(document.getElementById(id).value); }
function setText(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
function setError(id, msg){ const el = document.getElementById(id); if(el) el.textContent = msg || ''; }
function round(value, digits=2){
  const p = Math.pow(10, digits);
  return Math.round(value * p) / p;
}
function format(value, digits=2, suffix=''){
  if(!isFinite(value)) return '-';
  return `${round(value, digits)}${suffix}`;
}

function calcBarToPsi(){
  const bar = num('bar');
  if(!(bar >= 0)) return setError('notice','Enter a valid bar value.');
  setError('notice','');
  const psi = bar * 14.5037738;
  setText('res1', format(psi,3,' psi'));
  setText('res2', format(bar*100,2,' kPa'));
  setText('res3', format(bar*0.1,4,' MPa'));
}
function calcPsiToBar(){
  const psi = num('psi');
  if(!(psi >= 0)) return setError('notice','Enter a valid psi value.');
  setError('notice','');
  const bar = psi / 14.5037738;
  setText('res1', format(bar,4,' bar'));
  setText('res2', format(bar*100,2,' kPa'));
  setText('res3', format(bar*0.1,5,' MPa'));
}
function calcMHeadToBar(){
  const head = num('head');
  const sg = num('sg');
  if(!(head >= 0) || !(sg > 0)) return setError('notice','Enter valid head and specific gravity.');
  setError('notice','');
  const bar = (head * sg * 9.80665)/100000;
  setText('res1', format(bar,5,' bar'));
  setText('res2', format(bar*14.5037738,3,' psi'));
  setText('res3', format(bar*100,2,' kPa'));
}
function calcCfmToM3hr(){
  const cfm = num('cfm');
  if(!(cfm >= 0)) return setError('notice','Enter a valid CFM value.');
  setError('notice','');
  const m3hr = cfm * 1.6990108;
  setText('res1', format(m3hr,3,' m³/hr'));
  setText('res2', format(m3hr/60,4,' m³/min'));
  setText('res3', format(cfm*0.00047194745,5,' m³/s'));
}
function suggestMotor(shaft){
  const ratings=[0.37,0.55,0.75,1.1,1.5,2.2,3,4,5.5,7.5,11,15,18.5,22,30,37,45,55,75,90,110,132,160,200,250,315];
  const required = shaft * 1.1;
  for(const r of ratings){ if(r >= required) return r; }
  return Math.ceil(required/10)*10;
}
function calcPumpPower(){
  const flow = num('flow');
  const head = num('head');
  const sg = num('sg');
  const eff = num('eff');
  if(!(flow > 0) || !(head > 0) || !(sg > 0) || !(eff > 0 && eff <= 100)) return setError('notice','Enter valid positive values. Efficiency must be 0–100%.');
  setError('notice','');
  const hydraulic = (flow * head * sg * 9.81)/3600;
  const shaft = hydraulic / (eff/100);
  const motor = suggestMotor(shaft);
  setText('res1', format(hydraulic,2,' kW'));
  setText('res2', format(shaft,2,' kW'));
  setText('res3', format(motor,2,' kW'));
}
function calcHeadToPressure(){
  const head = num('head');
  const sg = num('sg');
  if(!(head >= 0) || !(sg > 0)) return setError('notice','Enter valid head and specific gravity.');
  setError('notice','');
  const kpa = head * sg * 9.80665;
  const bar = kpa / 100;
  setText('res1', format(bar,4,' bar'));
  setText('res2', format(kpa,2,' kPa'));
  setText('res3', format(bar*14.5037738,3,' psi'));
}
function calcNPSH(){
  const pAbs = num('pabs');
  const pVapor = num('pvapor');
  const z = num('z');
  const hf = num('hf');
  const sg = num('sg');
  if(!(pAbs >= 0) || !(pVapor >= 0) || !isFinite(z) || !(hf >= 0) || !(sg > 0)) return setError('notice','Enter valid values in all fields.');
  setError('notice','');
  const npsha = ((pAbs - pVapor) * 100000) / (sg * 1000 * 9.80665) + z - hf;
  setText('res1', format(npsha,3,' m'));
  setText('res2', npsha > 0 ? 'Available' : 'Not available');
  setText('res3', format((npsha*sg*9.80665)/100,3,' kPa eq.'));
}
function calcPressureDrop(){
  const f = num('f');
  const l = num('l');
  const d = num('d');
  const rho = num('rho');
  const v = num('v');
  if(!(f > 0) || !(l > 0) || !(d > 0) || !(rho > 0) || !(v >= 0)) return setError('notice','Enter valid positive values.');
  setError('notice','');
  const dpPa = f * (l/d) * (rho * v * v / 2);
  const kpa = dpPa / 1000;
  const bar = dpPa / 100000;
  setText('res1', format(dpPa,2,' Pa'));
  setText('res2', format(kpa,3,' kPa'));
  setText('res3', format(bar,5,' bar'));
}
function calcReynolds(){
  const rho = num('rho');
  const v = num('v');
  const d = num('d');
  const mu = num('mu');
  if(!(rho > 0) || !(v >= 0) || !(d > 0) || !(mu > 0)) return setError('notice','Enter valid positive values.');
  setError('notice','');
  const re = (rho*v*d)/mu;
  let regime = 'Laminar';
  if(re >= 4000) regime = 'Turbulent';
  else if(re >= 2300) regime = 'Transitional';
  setText('res1', format(re,0,''));
  setText('res2', regime);
  setText('res3', re < 2300 ? 'f ≈ 64/Re' : 'Use Moody / Colebrook');
}
function calcTorque(){
  const power = num('power');
  const rpm = num('rpm');
  if(!(power > 0) || !(rpm > 0)) return setError('notice','Enter valid power and speed.');
  setError('notice','');
  const torque = 9550 * power / rpm;
  setText('res1', format(torque,3,' N·m'));
  setText('res2', format(power*1.34102,3,' hp'));
  setText('res3', format((2*Math.PI*rpm/60),3,' rad/s'));
}
document.addEventListener('DOMContentLoaded', setActiveLinks);
