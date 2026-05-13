
/* ═══════════════════════════════════
   FIREBASE
═══════════════════════════════════ */
let FB = false;
const ADMIN_CODE = 'BENGKELAJA2026'; // Kode rahasia untuk daftar admin — ganti sesuai keinginan
try {
  if (FIREBASE_CONFIG.apiKey !== 'GANTI_API_KEY') {
    firebase.initializeApp(FIREBASE_CONFIG);
    FB = true;
  } else {
    document.getElementById('cfg-banner').classList.add('show');
  }
} catch(e) { document.getElementById('cfg-banner').classList.add('show'); }

const auth = FB ? firebase.auth()      : null;
const db   = FB ? firebase.firestore() : null;

/* ═══════════════════════════════════
   STATE
═══════════════════════════════════ */
let CU         = null;   // Firebase user
let UP         = {};     // Firestore user profile
let isAdmin    = false;
let userBooks  = [];     // current user's bookings
let allBooks   = [];     // all bookings (admin)
let allLayanan = [];     // layanan from DB
let allMekanik = [];     // mekanik from DB
let editMode   = false;
let cfmCb      = null;

/* default layanan */
const DEF_LAYANAN = [
  {nama:'Ganti Oli Mesin',       desc:'Penggantian oli mesin berkala untuk performa optimal',    tags:['Servis Umum','Ganti Oli'],  harga:'Rp 50.000 – Rp 150.000',   estimasi:'30–45 Menit', icon:'🛢️', hargaVal:100000, order:0},
  {nama:'Tune Up Mesin',         desc:'Penyetelan mesin untuk performa maksimal',                tags:['Servis Umum'],              harga:'Rp 150.000 – Rp 400.000',  estimasi:'1–2 Jam',     icon:'🔩', hargaVal:300000, order:1},
  {nama:'Servis AC Mobil',       desc:'Perbaikan dan perawatan sistem AC kendaraan',             tags:['Servis Umum','AC'],         harga:'Rp 175.000 – Rp 750.000',  estimasi:'2–3 Jam',     icon:'❄️', hargaVal:150000, order:2},
  {nama:'Perbaikan Kelistrikan', desc:'Diagnosa dan perbaikan sistem kelistrikan kendaraan',     tags:['Kelistrikan'],              harga:'Rp 100.000 – Rp 500.000',  estimasi:'1–3 Jam',     icon:'⚡', hargaVal:200000, order:3},
  {nama:'Cat & Body Repair',     desc:'Pengecatan dan perbaikan body kendaraan',                 tags:['Body Repair'],              harga:'Rp 300.000 – Rp 3.000.000',estimasi:'1–3 Hari',    icon:'🎨', hargaVal:500000, order:4},
  {nama:'Ganti Ban',             desc:'Penggantian ban dengan berbagai merk tersedia',           tags:['Servis Rutin','Ban'],       harga:'Rp 200.000 – Rp 800.000',  estimasi:'1–3 Hari',    icon:'🔵', hargaVal:250000, order:5},
  {nama:'Ganti Kampas Rem',      desc:'Penggantian kampas rem depan dan/atau belakang',          tags:['Servis Rutin','Rem'],       harga:'Rp 90.000 – Rp 450.000',   estimasi:'1–3 Hari',    icon:'🛑', hargaVal:150000, order:6},
];

const DEF_MEKANIK = [
  {nama:'Budiono Siregar', spek:'Tambal Ban', harga:150000, waktu:'15–20 menit', exp:'8 Tahun', rating:'4.9', job:500},
  {nama:'Ahmad Hidayat',   spek:'Mekanik Umum', harga:175000, waktu:'25–30 menit', exp:'6 Tahun', rating:'4.7', job:320},
  {nama:'Rizky Pratama',   spek:'AC & Kelistrikan', harga:200000, waktu:'20–35 menit', exp:'5 Tahun', rating:'4.8', job:210},
];

/* ═══════════════════════════════════
   AUTH STATE
═══════════════════════════════════ */
if (auth) {
  showLoad('Mengecek sesi...');
  auth.onAuthStateChanged(async user => {
    if (user) {
      CU = user;
      await loadProfile();
      await loadLayanan();
      await loadMekanik();
      if (isAdmin) {
        await loadAllBooks();
        goAdminDash();
      } else {
        await loadUserBooks();
        goUserDash();
      }
    } else {
      CU = null; UP = {}; isAdmin = false;
      goto('page-login');
    }
    hideLoad();
  });
} else { hideLoad(); }

/* ═══════════════════════════════════
   NAVIGATION
═══════════════════════════════════ */
function goto(id) {
  document.querySelectorAll('.page,.admin-page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goUserDash()  { goto('page-user-dash'); refreshSidebar(); refreshUserStats(); renderRecentUser(); renderLayanan(allLayanan,''); }
function goAdminDash() { goto('page-admin-dash'); refreshAdminDrawer(); renderAdminBookings(); renderAdminLayanan(); renderAdminMekanik(); }

/* USER TABS */
const UTAB_INFO = {
  beranda: ['Beranda','Solusi cepat untuk kendaraan Anda'],
  layanan: ['Cari Layanan','Temukan layanan yang Anda butuhkan'],
  panggil: ['Panggil Mekanik','Bantuan darurat 24 jam'],
  profil:  ['Profil Akun','Kelola informasi Anda'],
  riwayat: ['Riwayat Booking','Semua booking Anda'],
};
function switchUTab(tab) {
  document.querySelectorAll('.utab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.sb-item[id^="si-"]').forEach(n=>n.classList.remove('active'));
  document.getElementById('utab-'+tab).classList.add('active');
  const el=document.getElementById('si-'+tab);
  if(el) el.classList.add('active');
  const [ti,su]=UTAB_INFO[tab]||['',''];
  document.getElementById('u-tb-title').textContent=ti;
  document.getElementById('u-tb-sub').textContent=su;
  document.getElementById('user-sidebar').classList.remove('open');
  if(tab==='profil')  refreshProfil();
  if(tab==='riwayat'){document.getElementById('q-rwyt').value='';filterRiwayat('');}
  if(tab==='layanan'){document.getElementById('cari-input').value='';renderLayanan(allLayanan,'');}
  if(tab==='beranda'){refreshUserStats();renderRecentUser();}
}

/* ADMIN TABS */
function switchATab(tab) {
  document.querySelectorAll('.atab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('atab-'+tab).classList.add('active');
  document.getElementById('atab-btn-'+tab).classList.add('active');
  if(tab==='booking') renderAdminBookings();
  if(tab==='layanan') renderAdminLayanan();
  if(tab==='mekanik') renderAdminMekanik();
}

/* MENU DRAWER */
function openMenuDrawer(){document.getElementById('menu-drawer').classList.add('open');document.getElementById('menu-drawer-ovl').classList.add('open');}
function closeMenuDrawer(){document.getElementById('menu-drawer').classList.remove('open');document.getElementById('menu-drawer-ovl').classList.remove('open');}
function openAdminProfil(){
  document.getElementById('ap-name').textContent=document.getElementById('ap-nama').textContent=UP?.nama||'—';
  document.getElementById('ap-email').textContent=document.getElementById('ap-email2').textContent=CU?.email||'—';
  openModal('modal-admin-profil');
}
function openAdminRiwayat(){
  const el=document.getElementById('admin-rwyt-list');
  const myBooks=allBooks.filter(b=>b.uid===CU?.uid);
  if(!myBooks.length){el.innerHTML='<div class="empty-state"><span class="empty-ico">🕐</span><p>Belum ada riwayat</p></div>';openModal('modal-admin-rwyt');return;}
  el.innerHTML=myBooks.map(b=>`<div class="booking-card" style="margin-bottom:10px;"><div class="bc-top"><div class="bc-ico">${b.icon||'📋'}</div><div class="bc-name">${b.nama}</div>${bBadge(b.status)}</div><div class="bc-meta">${b.tanggal||'—'} · ${b.harga}</div></div>`).join('');
  openModal('modal-admin-rwyt');
}

/* ═══════════════════════════════════
   FIRESTORE HELPERS
═══════════════════════════════════ */
async function loadProfile(){
  if(!db||!CU)return;
  const s=await db.collection('users').doc(CU.uid).get();
  UP=s.exists?s.data():{};
  isAdmin=UP.role==='admin';
}
async function saveProfile(data){
  if(!db||!CU)return;
  await db.collection('users').doc(CU.uid).set(data,{merge:true});
  UP={...UP,...data};
}
async function loadLayanan(){
  if(!db)return;
  const s=await db.collection('layanan').orderBy('order','asc').get();
  if(s.empty){
    const b=db.batch();
    DEF_LAYANAN.forEach(l=>{b.set(db.collection('layanan').doc(),l);});
    await b.commit();
    const s2=await db.collection('layanan').orderBy('order','asc').get();
    allLayanan=s2.docs.map(d=>({id:d.id,...d.data()}));
  } else {
    allLayanan=s.docs.map(d=>({id:d.id,...d.data()}));
  }
}
async function loadMekanik(){
  if(!db)return;
  const s=await db.collection('mekanik').get();
  if(s.empty){
    const b=db.batch();
    DEF_MEKANIK.forEach(m=>{b.set(db.collection('mekanik').doc(),m);});
    await b.commit();
    const s2=await db.collection('mekanik').get();
    allMekanik=s2.docs.map(d=>({id:d.id,...d.data()}));
  } else {
    allMekanik=s.docs.map(d=>({id:d.id,...d.data()}));
  }
}
async function loadUserBooks(){
  if(!db||!CU)return;
  const s=await db.collection('bookings').where('uid','==',CU.uid).orderBy('ts','desc').get();
  userBooks=s.docs.map(d=>({id:d.id,...d.data()}));
}
async function loadAllBooks(){
  if(!db)return;
  const s=await db.collection('bookings').orderBy('ts','desc').get();
  allBooks=s.docs.map(d=>({id:d.id,...d.data()}));
}

/* ═══════════════════════════════════
   AUTH: REGISTER (USER)
═══════════════════════════════════ */
async function doRegister(){
  const nama=V('r-nama'),user=V('r-user'),email=V('r-email'),telp=V('r-telp'),
        gender=document.getElementById('r-gender').value,
        alamat=V('r-alamat'),pass=V('r-pass'),confirm=V('r-confirm');
  clearMsg(['reg-err','reg-ok']);
  if(!nama||!user||!email||!pass||!confirm){showErr('reg-err','Semua kolom wajib diisi.');return;}
  if(pass.length<6){showErr('reg-err','Password minimal 6 karakter.');return;}
  if(pass!==confirm){showErr('reg-err','Konfirmasi password tidak cocok.');return;}
  if(!auth){showErr('reg-err','Firebase belum dikonfigurasi.');return;}
  showLoad('Membuat akun...');
  try{
    await auth.createUserWithEmailAndPassword(email,pass);
    await saveProfile({nama,username:user,email,telp,gender,alamat,role:'user',createdAt:new Date().toISOString()});
    clearFields(['r-nama','r-user','r-email','r-telp','r-pass','r-confirm']);
    document.getElementById('r-gender').value='';
    document.getElementById('r-alamat').value='';
    showOk('reg-ok','✓ Akun berhasil dibuat!');
  }catch(e){showErr('reg-err',fbE(e));}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   AUTH: LOGIN (USER)
═══════════════════════════════════ */
async function doLogin(){
  const email=V('l-email'),pass=V('l-pass');
  clearMsg(['login-err','login-ok']);
  if(!email||!pass){showErr('login-err','Email dan password wajib diisi.');return;}
  if(!auth){showErr('login-err','Firebase belum dikonfigurasi.');return;}
  showLoad('Masuk...');
  try{await auth.signInWithEmailAndPassword(email,pass);}
  catch(e){showErr('login-err',fbE(e));hideLoad();}
}

async function loginDemo(){
  // Demo login — bisa diubah ke akun demo Firebase yang sudah dibuat
  showErr('login-err','Demo: gunakan akun yang sudah terdaftar, atau daftar terlebih dahulu.');
}

/* ═══════════════════════════════════
   AUTH: ADMIN LOGIN
═══════════════════════════════════ */
async function doAdminLogin(){
  const email=V('al-email'),pass=V('al-pass');
  clearMsg(['admin-login-err','admin-login-ok']);
  if(!email||!pass){showErr('admin-login-err','Email dan password wajib diisi.');return;}
  if(!auth){showErr('admin-login-err','Firebase belum dikonfigurasi.');return;}
  showLoad('Masuk sebagai Admin...');
  try{
    await auth.signInWithEmailAndPassword(email,pass);
    // Auth state listener will handle routing — if not admin, it'll go to user dash
  }catch(e){showErr('admin-login-err',fbE(e));hideLoad();}
}

/* ═══════════════════════════════════
   AUTH: ADMIN REGISTER
═══════════════════════════════════ */
async function doAdminRegister(){
  const nama=V('ar-nama'),email=V('ar-email'),pass=V('ar-pass'),code=V('ar-code');
  clearMsg(['admin-login-err','admin-login-ok']);
  if(!nama||!email||!pass||!code){showErr('admin-login-err','Semua kolom pendaftaran wajib diisi.');return;}
  if(code!==ADMIN_CODE){showErr('admin-login-err','Kode admin salah. Hubungi pemilik sistem.');return;}
  if(pass.length<6){showErr('admin-login-err','Password minimal 6 karakter.');return;}
  if(!auth){showErr('admin-login-err','Firebase belum dikonfigurasi.');return;}
  showLoad('Membuat akun admin...');
  try{
    await auth.createUserWithEmailAndPassword(email,pass);
    await saveProfile({nama,email,role:'admin',createdAt:new Date().toISOString()});
    showOk('admin-login-ok','✓ Akun admin berhasil dibuat!');
  }catch(e){showErr('admin-login-err',fbE(e));}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   AUTH: LOGOUT
═══════════════════════════════════ */
async function doLogout(){
  const ok=await confirm2('Keluar?','Anda akan diarahkan ke halaman login.','Keluar','btn-red');
  if(!ok)return;
  await auth.signOut();
}

/* ═══════════════════════════════════
   FORGOT PASSWORD
═══════════════════════════════════ */
function openForgotPass(){clearMsg(['forgot-err','forgot-ok']);document.getElementById('forgot-email').value='';openModal('modal-forgot');}
async function doForgotPass(){
  const email=V('forgot-email');
  clearMsg(['forgot-err','forgot-ok']);
  if(!email){showErr('forgot-err','Masukkan email Anda.');return;}
  if(!auth){showErr('forgot-err','Firebase belum dikonfigurasi.');return;}
  showLoad('Mengirim email reset...');
  try{
    await auth.sendPasswordResetEmail(email);
    showOk('forgot-ok','✓ Link reset password telah dikirim ke '+email);
  }catch(e){showErr('forgot-err',fbE(e));}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   UBAH PASSWORD
═══════════════════════════════════ */
async function doUbahPass(){
  const old=V('p-old'),nw=V('p-new'),cfm=V('p-cfm');
  clearMsg(['pass-err','pass-ok']);
  if(!old||!nw||!cfm){showErr('pass-err','Semua kolom wajib diisi.');return;}
  if(nw.length<6){showErr('pass-err','Password baru minimal 6 karakter.');return;}
  if(nw!==cfm){showErr('pass-err','Konfirmasi tidak cocok.');return;}
  showLoad('Memperbarui password...');
  try{
    const cred=firebase.auth.EmailAuthProvider.credential(CU.email,old);
    await CU.reauthenticateWithCredential(cred);
    await CU.updatePassword(nw);
    showOk('pass-ok','✓ Password berhasil diperbarui!');
    clearFields(['p-old','p-new','p-cfm']);
    setTimeout(()=>closeModal('modal-pass'),1400);
  }catch(e){showErr('pass-err',fbE(e));}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   USER PROFIL
═══════════════════════════════════ */
function refreshSidebar(){
  document.getElementById('sb-name').textContent  =UP?.nama||CU?.email||'—';
  document.getElementById('sb-email').textContent =CU?.email||'—';
  document.getElementById('u-tb-user').textContent=UP?.nama||'';
}
function refreshAdminDrawer(){
  document.getElementById('md-name').textContent  =UP?.nama||CU?.email||'—';
  document.getElementById('md-email').textContent =CU?.email||'—';
}
function refreshProfil(){
  document.getElementById('p-name').textContent   =UP?.nama||'—';
  document.getElementById('p-email-d').textContent=CU?.email||'—';
  document.getElementById('p-nama').textContent   =UP?.nama||'—';
  document.getElementById('p-email').textContent  =CU?.email||'—';
  document.getElementById('p-telp').textContent   =UP?.telp||'—';
  document.getElementById('p-gender').textContent =UP?.gender||'—';
  document.getElementById('p-alamat').textContent =UP?.alamat||'—';
}
function toggleEdit(){
  editMode=!editMode;
  document.getElementById('profil-view').style.display=editMode?'none':'block';
  document.getElementById('profil-edit').style.display=editMode?'block':'none';
  document.getElementById('edit-btn').textContent=editMode?'✕ Batal':'✏️ Edit';
  if(editMode){
    document.getElementById('e-nama').value  =UP?.nama||'';
    document.getElementById('e-telp').value  =UP?.telp||'';
    document.getElementById('e-gender').value=UP?.gender||'';
    document.getElementById('e-alamat').value=UP?.alamat||'';
    clearMsg(['edit-err','edit-ok']);
  }
}
async function saveEdit(){
  const nama=V('e-nama');
  clearMsg(['edit-err','edit-ok']);
  if(!nama){showErr('edit-err','Nama wajib diisi.');return;}
  showLoad('Menyimpan...');
  try{
    await saveProfile({nama,telp:V('e-telp'),gender:document.getElementById('e-gender').value,alamat:V('e-alamat')});
    showOk('edit-ok','✓ Profil berhasil diperbarui!');
    editMode=false;
    document.getElementById('profil-view').style.display='block';
    document.getElementById('profil-edit').style.display='none';
    document.getElementById('edit-btn').textContent='✏️ Edit';
    refreshProfil();refreshSidebar();toast('Profil diperbarui ✓');
  }catch(e){showErr('edit-err','Gagal: '+e.message);}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   USER: STATS & RECENT
═══════════════════════════════════ */
function refreshUserStats(){
  document.getElementById('s-total').textContent=userBooks.length;
  document.getElementById('s-ok').textContent   =userBooks.filter(b=>b.status==='Dikonfirmasi').length;
  document.getElementById('s-wait').textContent =userBooks.filter(b=>b.status==='Menunggu').length;
  document.getElementById('recent-badge').textContent=userBooks.length?`(${userBooks.length} total)`:'';
}
function renderRecentUser(){
  const el=document.getElementById('u-recent-list');
  const list=userBooks.slice(0,5);
  if(!list.length){el.innerHTML='<div class="empty-state"><span class="empty-ico">📋</span><p>Belum ada riwayat booking</p></div>';return;}
  el.innerHTML=list.map(b=>`
    <div class="booking-card">
      <div class="bc-top"><div class="bc-ico">${b.icon||'📋'}</div><div class="bc-name">${b.nama}</div>${bBadge(b.status)}</div>
      <div class="bc-meta">Layanan: <strong>${b.nama}</strong></div>
      <div class="bc-meta">Tanggal: ${b.tanggal||'—'}</div>
      <div class="bc-meta">Harga: ${b.harga}</div>
    </div>`).join('');
}
function filterRiwayat(q){
  const grid=document.getElementById('rwyt-grid');
  const t=q.trim().toLowerCase();
  const list=t?userBooks.filter(b=>b.nama.toLowerCase().includes(t)||(b.tanggal||'').includes(t)):userBooks;
  if(!list.length){grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1;"><span class="empty-ico">🕐</span><p>${userBooks.length?'Tidak ada hasil.':'Belum ada riwayat.'}</p></div>`;return;}
  grid.innerHTML=list.map(b=>`
    <div class="rwyt-card">
      <div class="rw-top"><div class="rw-ico">${b.icon||'📋'}</div><div class="rw-name">${b.nama}</div>${bBadge(b.status)}</div>
      <div class="rw-meta">${b.tanggal||'—'} · ${b.harga}</div>
    </div>`).join('');
}

/* ═══════════════════════════════════
   USER: LAYANAN
═══════════════════════════════════ */
function renderLayanan(list,q){
  const grid=document.getElementById('lay-grid');
  if(!grid)return;
  const t=q.trim().toLowerCase();
  const fl=t?list.filter(l=>l.nama.toLowerCase().includes(t)||l.desc.toLowerCase().includes(t)||(l.tags||[]).some(tg=>tg.toLowerCase().includes(t))):list;
  document.getElementById('cari-lbl').textContent=t?'Hasil Pencarian':'Semua Layanan';
  document.getElementById('cari-cnt').textContent=`(${fl.length})`;
  if(!fl.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-light);font-weight:700;">🔍<br><br>Layanan tidak ditemukan.</div>';return;}
  grid.innerHTML=fl.map(l=>`
    <div class="lay-card">
      <div class="lay-body">
        <div class="lay-img">${l.icon||'🔧'}</div>
        <div class="lay-info">
          <div class="lay-name">${l.nama}</div>
          <div class="lay-desc">${l.desc}</div>
          <div class="lay-tags">${(l.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="lay-price">${l.harga} · ${l.estimasi}</div>
        </div>
      </div>
      <div class="lay-foot"><button class="btn-book" onclick="doBooking('${l.id}')">Booking</button></div>
    </div>`).join('');
}
function filterLayanan(q){renderLayanan(allLayanan,q);}

/* ═══════════════════════════════════
   USER: BOOKING & PANGGIL
═══════════════════════════════════ */
async function doBooking(layId){
  if(!CU){toast('Silakan login terlebih dahulu.');return;}
  const l=allLayanan.find(x=>x.id===layId);if(!l)return;
  const today=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
  const now=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  showLoad('Memproses booking...');
  try{
    const ref=await db.collection('bookings').add({
      uid:CU.uid,userName:UP?.nama||CU.email,userEmail:CU.email,
      nama:l.nama,icon:l.icon||'🔧',tanggal:today+' • '+now,
      harga:'Rp '+(l.hargaVal||0).toLocaleString('id-ID'),
      status:'Menunggu',ts:firebase.firestore.FieldValue.serverTimestamp()
    });
    const newBook={id:ref.id,uid:CU.uid,userName:UP?.nama||CU.email,userEmail:CU.email,nama:l.nama,icon:l.icon||'🔧',tanggal:today+' • '+now,harga:'Rp '+(l.hargaVal||0).toLocaleString('id-ID'),status:'Menunggu'};
    userBooks.unshift(newBook);
    refreshUserStats();renderRecentUser();
    openModal('modal-ok');
  }catch(e){toast('Gagal booking: '+e.message);}
  finally{hideLoad();}
}
async function doPanggil(nama,harga){
  if(!CU){toast('Silakan login terlebih dahulu.');return;}
  const today=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
  const now=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  showLoad('Memanggil mekanik...');
  try{
    const ref=await db.collection('bookings').add({
      uid:CU.uid,userName:UP?.nama||CU.email,userEmail:CU.email,
      nama:'Panggil Mekanik – '+nama,icon:'📞',tanggal:today+' • '+now,
      harga:'Rp '+harga.toLocaleString('id-ID'),
      status:'Menunggu',ts:firebase.firestore.FieldValue.serverTimestamp()
    });
    userBooks.unshift({id:ref.id,uid:CU.uid,userName:UP?.nama||CU.email,nama:'Panggil Mekanik – '+nama,icon:'📞',tanggal:today+' • '+now,harga:'Rp '+harga.toLocaleString('id-ID'),status:'Menunggu'});
    refreshUserStats();renderRecentUser();
    openModal('modal-ok');
  }catch(e){toast('Gagal: '+e.message);}
  finally{hideLoad();}
}
function pilihMasalah(el){document.querySelectorAll('.masalah-btn').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');}

/* ═══════════════════════════════════
   ADMIN: BOOKING
═══════════════════════════════════ */
function renderAdminBookings(){
  const el=document.getElementById('admin-booking-list');
  const q=(document.getElementById('q-abooking')?.value||'').trim().toLowerCase();
  const fs=document.getElementById('admin-filter-status')?.value||'';
  let list=allBooks;
  if(fs)list=list.filter(b=>b.status===fs);
  if(q)list=list.filter(b=>b.nama.toLowerCase().includes(q)||(b.userName||'').toLowerCase().includes(q)||(b.userEmail||'').toLowerCase().includes(q));
  if(!list.length){el.innerHTML='<div class="empty-state"><span class="empty-ico">📋</span><p>Tidak ada booking ditemukan</p></div>';return;}
  el.innerHTML=list.map(b=>`
    <div class="admin-bcard">
      <div class="abc-left">
        <div class="abc-name-row">
          <span class="abc-uname">${b.userName||b.userEmail||'—'}</span>
          ${bBadge(b.status)}
        </div>
        <div class="abc-info">Layanan: <strong>${b.icon||''} ${b.nama}</strong></div>
        <div class="abc-info">Tanggal: <strong>${b.tanggal||'—'}</strong></div>
        <div class="abc-info">Harga: <strong>${b.harga}</strong></div>
      </div>
      <div class="abc-actions">
        ${b.status==='Menunggu'?`
          <button class="btn-konfirmasi" onclick="updateStatus('${b.id}','Dikonfirmasi')">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Konfirmasi
          </button>
          <button class="btn-tolak" onclick="updateStatus('${b.id}','Dibatalkan')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            Tolak
          </button>
        `:''}
        ${b.status==='Dikonfirmasi'?`<button class="btn-konfirmasi" onclick="updateStatus('${b.id}','Selesai')" style="background:var(--green);">✓ Selesai</button>`:''}
      </div>
    </div>`).join('');
}

async function updateStatus(bookId, newStatus){
  const ok=await confirm2(
    newStatus==='Dikonfirmasi'?'Konfirmasi booking ini?':newStatus==='Dibatalkan'?'Tolak booking ini?':'Tandai sebagai selesai?',
    newStatus==='Dikonfirmasi'?'Status booking akan berubah menjadi Dikonfirmasi.':newStatus==='Dibatalkan'?'Booking akan ditandai sebagai dibatalkan.':'Booking akan ditandai sebagai selesai.',
    newStatus==='Dibatalkan'?'Tolak':'Konfirmasi',
    newStatus==='Dibatalkan'?'btn-red':'btn-green'
  );
  if(!ok)return;
  showLoad('Memperbarui status...');
  try{
    await db.collection('bookings').doc(bookId).update({status:newStatus});
    allBooks=allBooks.map(b=>b.id===bookId?{...b,status:newStatus}:b);
    userBooks=userBooks.map(b=>b.id===bookId?{...b,status:newStatus}:b);
    toast(`Booking ${newStatus} ✓`);
    renderAdminBookings();
    refreshUserStats();
    renderRecentUser();
  }catch(e){toast('Gagal: '+e.message);}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   ADMIN: LAYANAN
═══════════════════════════════════ */
function renderAdminLayanan(){
  const el=document.getElementById('admin-lay-list');
  if(!allLayanan.length){el.innerHTML='<div class="empty-state"><span class="empty-ico">🔧</span><p>Belum ada layanan. Klik Tambah Layanan untuk menambahkan.</p></div>';return;}
  el.innerHTML=allLayanan.map(l=>`
    <div class="admin-lay-card">
      <div class="alc-body">
        <div class="alc-name-row">
          <span class="alc-name">${l.nama}</span>
          <span class="alc-cat">${l.kategori||((l.tags&&l.tags[0])||'Umum')}</span>
        </div>
        <div class="alc-info">${l.desc}</div>
        <div class="alc-info">Harga: <strong>${l.harga}</strong></div>
        <div class="alc-info">Estimasi: <strong>${l.estimasi}</strong></div>
      </div>
      <div class="alc-icon-btns">
        <button class="icon-btn" onclick="openLayananModal('${l.id}')" title="Edit">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button class="icon-btn del" onclick="deleteLayanan('${l.id}')" title="Hapus">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>`).join('');
}
function openLayananModal(editId){
  clearMsg(['lay-err']);
  const isEdit = !!editId;
  document.getElementById('lay-modal-title').textContent = isEdit ? 'Edit Layanan' : 'Tambah Layanan';
  document.getElementById('lay-modal-sub').textContent   = isEdit ? 'Perbarui informasi layanan' : 'Tambahkan layanan baru';
  document.getElementById('lay-save-btn').textContent    = isEdit ? 'Perbarui' : 'Tambah';
  document.getElementById('lay-edit-id').value = editId||'';
  if(isEdit){
    const l=allLayanan.find(x=>x.id===editId);
    if(l){
      document.getElementById('lay-nama').value     = l.nama||'';
      document.getElementById('lay-kategori').value = l.kategori||(l.tags&&l.tags[0])||'';
      document.getElementById('lay-harga').value    = l.harga||'';
      document.getElementById('lay-est').value      = l.estimasi||'';
      document.getElementById('lay-desc').value     = l.desc||'';
      document.getElementById('lay-icon').value     = l.icon||'🔧';
      document.getElementById('lay-hval').value     = l.hargaVal||'';
      document.getElementById('lay-tags').value     = (l.tags||[]).join(', ');
    }
  } else {
    clearFields(['lay-nama','lay-desc','lay-harga','lay-est','lay-hval','lay-tags']);
    document.getElementById('lay-kategori').value='';
    document.getElementById('lay-icon').value='🔧';
  }
  openModal('modal-layanan');
}
async function saveLayanan(){
  const id       = document.getElementById('lay-edit-id').value;
  const nama     = V('lay-nama');
  const kategori = document.getElementById('lay-kategori').value;
  const harga    = V('lay-harga');
  const estimasi = V('lay-est');
  const desc     = V('lay-desc');
  const icon     = V('lay-icon')||'🔧';
  const hargaVal = parseInt(document.getElementById('lay-hval').value)||0;
  const tagsRaw  = V('lay-tags');
  const tags     = kategori ? [kategori] : (tagsRaw ? tagsRaw.split(',').map(t=>t.trim()).filter(Boolean) : []);
  clearMsg(['lay-err']);
  if(!nama){showErr('lay-err','Nama layanan wajib diisi.');return;}
  if(!harga){showErr('lay-err','Range harga wajib diisi.');return;}
  if(!estimasi){showErr('lay-err','Estimasi waktu wajib diisi.');return;}
  const data={nama,kategori,icon,desc,harga,hargaVal,estimasi,tags};
  showLoad('Menyimpan layanan...');
  try{
    if(id){
      await db.collection('layanan').doc(id).update(data);
      allLayanan=allLayanan.map(l=>l.id===id?{...l,...data}:l);
      toast('Layanan berhasil diperbarui ✓');
    }else{
      data.order=allLayanan.length;
      const ref=await db.collection('layanan').add(data);
      allLayanan.push({id:ref.id,...data});
      toast('Layanan berhasil ditambahkan ✓');
    }
    closeModal('modal-layanan');
    renderAdminLayanan();
    renderLayanan(allLayanan,'');
  }catch(e){showErr('lay-err','Gagal menyimpan: '+e.message);}
  finally{hideLoad();}
}
async function deleteLayanan(id){
  const ok=await confirm2('Hapus layanan ini?','Layanan yang dihapus tidak bisa dikembalikan.','Hapus','btn-red');
  if(!ok)return;
  showLoad('Menghapus...');
  try{
    await db.collection('layanan').doc(id).delete();
    allLayanan=allLayanan.filter(l=>l.id!==id);
    toast('Layanan dihapus');
    renderAdminLayanan();renderLayanan(allLayanan,'');
  }catch(e){toast('Gagal: '+e.message);}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   ADMIN: MEKANIK
═══════════════════════════════════ */
function renderAdminMekanik(){
  const el=document.getElementById('admin-mek-list');
  if(!allMekanik.length){el.innerHTML='<div class="empty-state"><span class="empty-ico">👷</span><p>Belum ada mekanik. Klik Tambah Mekanik untuk menambahkan.</p></div>';return;}
  el.innerHTML=allMekanik.map(m=>`
    <div class="admin-mek-card">
      <div class="amc-body">
        <div class="amc-name-row">
          <span class="amc-name">${m.nama}</span>
          <span class="bdg-tersedia">Tersedia</span>
        </div>
        <div class="amc-info">Spesialisasi: <strong>${m.spek||'—'}</strong></div>
        <div class="amc-info">Pengalaman: <strong>${m.exp||'—'}</strong></div>
        <div class="amc-info">Rating: <strong>${m.rating||'—'}</strong> <span class="amc-star">★</span></div>
        <div class="amc-info">Harga Panggil: <strong>Rp ${(m.harga||0).toLocaleString('id-ID')}</strong></div>
        <div class="amc-info">Waktu Respons: <strong>${m.waktu||'—'}</strong></div>
      </div>
      <div class="alc-icon-btns">
        <button class="icon-btn" onclick="openMekanikModal('${m.id}')" title="Edit">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button class="icon-btn del" onclick="deleteMekanik('${m.id}')" title="Hapus">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>`).join('');
}
function openMekanikModal(editId){
  clearMsg(['mek-err']);
  const isEdit=!!editId;
  document.getElementById('mek-modal-title').textContent = isEdit ? 'Edit Mekanik' : 'Tambah Mekanik';
  document.getElementById('mek-modal-sub').textContent   = isEdit ? 'Perbarui informasi mekanik' : 'Tambahkan mekanik baru';
  document.getElementById('mek-save-btn').textContent    = isEdit ? 'Perbarui' : 'Tambah';
  document.getElementById('mek-edit-id').value=editId||'';
  if(isEdit){
    const m=allMekanik.find(x=>x.id===editId);
    if(m){
      document.getElementById('mek-nama').value  =m.nama||'';
      document.getElementById('mek-spek').value  =m.spek||'';
      document.getElementById('mek-exp').value   =m.exp||'';
      document.getElementById('mek-rating').value=m.rating||'';
      document.getElementById('mek-harga').value =m.harga||'';
      document.getElementById('mek-waktu').value =m.waktu||'';
    }
  }else{
    clearFields(['mek-nama','mek-exp','mek-rating','mek-harga','mek-waktu']);
    document.getElementById('mek-spek').value='';
  }
  openModal('modal-mekanik');
}
async function saveMekanik(){
  const id     = document.getElementById('mek-edit-id').value;
  const nama   = V('mek-nama');
  const spek   = document.getElementById('mek-spek').value;
  const exp    = V('mek-exp');
  const rating = V('mek-rating');
  const harga  = parseInt(document.getElementById('mek-harga').value)||0;
  const waktu  = V('mek-waktu');
  clearMsg(['mek-err']);
  if(!nama){showErr('mek-err','Nama mekanik wajib diisi.');return;}
  if(!spek){showErr('mek-err','Spesialisasi wajib dipilih.');return;}
  const updateData={nama,spek,exp,rating,harga,waktu};
  const fullData={...updateData,job:0,status:'Tersedia'};
  showLoad('Menyimpan mekanik...');
  try{
    if(id){
      await db.collection('mekanik').doc(id).update(updateData);
      allMekanik=allMekanik.map(m=>m.id===id?{...m,...updateData}:m);
      toast('Mekanik berhasil diperbarui ✓');
    }else{
      const ref=await db.collection('mekanik').add(fullData);
      allMekanik.push({id:ref.id,...fullData});
      toast('Mekanik berhasil ditambahkan ✓');
    }
    closeModal('modal-mekanik');
    renderAdminMekanik();
  }catch(e){showErr('mek-err','Gagal menyimpan: '+e.message);}
  finally{hideLoad();}
}
async function deleteMekanik(id){
  const ok=await confirm2('Hapus mekanik ini?','Data mekanik yang dihapus tidak bisa dikembalikan.','Hapus','btn-red');
  if(!ok)return;
  showLoad('Menghapus...');
  try{
    await db.collection('mekanik').doc(id).delete();
    allMekanik=allMekanik.filter(m=>m.id!==id);
    toast('Mekanik dihapus');
    renderAdminMekanik();
  }catch(e){toast('Gagal: '+e.message);}
  finally{hideLoad();}
}

/* ═══════════════════════════════════
   MODAL / CONFIRM
═══════════════════════════════════ */
function openModal(id){document.getElementById(id).classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}
document.querySelectorAll('.overlay').forEach(ov=>{ov.addEventListener('click',e=>{if(e.target===ov)ov.classList.remove('show');});});

function confirm2(title,msg,okLabel='Lanjutkan',okClass='btn-red'){
  return new Promise(resolve=>{
    cfmCb=resolve;
    document.getElementById('cfm-title').textContent=title;
    document.getElementById('cfm-msg').textContent=msg;
    const btn=document.getElementById('cfm-ok');
    btn.textContent=okLabel;
    btn.className='btn '+okClass;
    document.getElementById('confirm-ovl').classList.add('show');
  });
}
function cfmResolve(val){document.getElementById('confirm-ovl').classList.remove('show');if(cfmCb){cfmCb(val);cfmCb=null;}}

/* ═══════════════════════════════════
   LOADING / TOAST
═══════════════════════════════════ */
function showLoad(txt='Memuat...'){document.getElementById('load-txt').textContent=txt;document.getElementById('app-loading').classList.add('show');}
function hideLoad(){document.getElementById('app-loading').classList.remove('show');}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800);}

/* ═══════════════════════════════════
   HELPERS
═══════════════════════════════════ */
function V(id){return(document.getElementById(id)?.value||'').trim();}
function clearFields(ids){ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});}
function clearMsg(ids){ids.forEach(id=>{const el=document.getElementById(id);if(el){el.classList.remove('show');el.textContent='';}});}
function showErr(id,msg){const el=document.getElementById(id);if(el){el.textContent=msg;el.classList.add('show');}}
function showOk(id,msg){const el=document.getElementById(id);if(el){el.textContent=msg;el.classList.add('show');}}
function toggleEye(inputId,btn){const el=document.getElementById(inputId);el.type=el.type==='password'?'text':'password';btn.textContent=el.type==='password'?'👁':'🙈';}

function bBadge(status){
  const m={'Menunggu':'bdg-wait','Dikonfirmasi':'bdg-ok','Selesai':'bdg-done','Dibatalkan':'bdg-cancel'};
  return `<span class="badge ${m[status]||'bdg-wait'}">${status||'—'}</span>`;
}
function fbE(e){
  const m={'auth/email-already-in-use':'Email sudah digunakan.','auth/invalid-email':'Format email tidak valid.','auth/weak-password':'Password terlalu lemah (min. 6 karakter).','auth/user-not-found':'Akun tidak ditemukan.','auth/wrong-password':'Password salah.','auth/invalid-credential':'Email atau password salah.','auth/too-many-requests':'Terlalu banyak percobaan.','auth/network-request-failed':'Koneksi bermasalah.','auth/popup-closed-by-user':'Login dibatalkan.','auth/requires-recent-login':'Harap login ulang sebelum mengubah password.'};
  return m[e.code]||e.message;
}
