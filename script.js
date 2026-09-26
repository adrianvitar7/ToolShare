/* ============ STATE ============ */

const AVATARS = [
  '🙂','🧑‍🔧','👩‍🔧','🧑‍🌾','👨‍🔧',
  '🧔','👩','🧑','👷','👷‍♀️'
];

const TOOL_ICONS = [
  '🔧','🔨','🪚','🪛','🧰','🪜',
  '🧹','🧯','🚿','🛠️','⚙️','🪓'
];

const TABS = [
  {id:'browse', icon:'🔍', label:'Browse'},
  {id:'requests', icon:'📦', label:'My Requests'},
  {id:'lending', icon:'🧰', label:'My Tools'},
  {id:'returns', icon:'⭐', label:'Returns'},
  {id:'profile', icon:'👤', label:'Profile'}
];

let state = {
  user: null,
  myTools: [],
  browseTools: [],
  myRequests: [],
  incomingRequests: [],
  reviews: []
};


/* ============ SEED DATA ============ */

function seedIfEmpty(){

  if(state.browseTools.length) return;

  state.browseTools = [

    {
      id:'bt1',
      name:'Extension Ladder',
      category:'Ladders & Access',
      icon:'🪜',
      owner:'Mike T.',
      status:'available',
      notes:'24ft aluminum, two-person carry recommended.'
    },

    {
      id:'bt2',
      name:'Pressure Washer',
      category:'Cleaning',
      icon:'🚿',
      owner:'Dan O.',
      status:'available',
      notes:'Gas-powered, comes with 3 nozzle tips.'
    },

    {
      id:'bt3',
      name:'Circular Saw',
      category:'Power Tools',
      icon:'🪚',
      owner:'Priya K.',
      status:'available',
      notes:'Corded, new blade as of last month.'
    },

    {
      id:'bt4',
      name:'Hedge Trimmer',
      category:'Outdoor & Garden',
      icon:'✂️',
      owner:'Sarah M.',
      status:'available',
      notes:'Battery lasts ~40 min per charge.'
    },

    {
      id:'bt5',
      name:'Tile Cutter',
      category:'Hand Tools',
      icon:'🛠️',
      owner:'Mike T.',
      status:'available',
      notes:'Manual snap cutter, good for small jobs.'
    },

    {
      id:'bt6',
      name:'Shop Vac',
      category:'Cleaning',
      icon:'🧹',
      owner:'Priya K.',
      status:'available',
      notes:'Wet/dry, 10 gal.'
    }

  ];
}


function seedUserExtras(){

  if(state.myTools.length) return;

  state.myTools = [

    {
      id:'mt1',
      name:'Cordless Drill',
      category:'Power Tools',
      icon:'🔧',
      notes:'2 batteries included, drill bits in the case.',
      status:'requested'
    }

  ];

  state.incomingRequests = [

    {
      id:'ir1',
      toolId:'mt1',
      toolName:'Cordless Drill',
      borrower:'Sarah M.',
      dates:'Sep 29 – Oct 1',
      note:'Putting up shelves, promise to be careful!',
      status:'pending'
    }

  ];
}


/* ============ STORAGE ============ */

function save(){

  try{

    localStorage.setItem(
      'toolshare_state',
      JSON.stringify(state)
    );

  }catch(e){

    console.warn(
      'save failed',
      e
    );

  }

}


function load(){

  try{

    const raw =
      localStorage.getItem(
        'toolshare_state'
      );

    if(raw){

      state =
        JSON.parse(raw);

    }

  }catch(e){

    console.warn(
      'load failed',
      e
    );

  }

  seedIfEmpty();

  seedUserExtras();

  save();

}


/* ============ TOAST ============ */

function toast(msg){

  const wrap =
    document.getElementById(
      'toastWrap'
    );

  if(!wrap) return;

  const el =
    document.createElement(
      'div'
    );

  el.className =
    'toast';

  el.textContent =
    msg;

  wrap.appendChild(el);

  setTimeout(()=>{

    el.style.opacity =
      '0';

    el.style.transition =
      'opacity .3s';

    setTimeout(()=>{

      el.remove();

    },300);

  },3200);

}


/* =========================================================
   AUTH / GOOGLE FORM REGISTRATION
   ========================================================= */

let authMode =
  'register';


/*
  Your Google Form link.
*/
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeo23LyF77eywgYmdorKcgmIwO1_TRjMO1z77PLhRcoWv0Mlg/viewform?usp=pp_url&entry.670058573=Enter+your+full+name&entry.1924440408=Enter+your+email+address';


/*
  Google Forms uses /formResponse
  for submitting form data.

  The user does not see the Google Form.
*/
const GOOGLE_FORM_ACTION =
  GOOGLE_FORM_URL.replace(
    '/viewform?',
    '/formResponse?'
  );


function setAuthMode(mode){

  authMode =
    mode;

  const registerFields =
    document.getElementById(
      'registerFields'
    );

  const registerBtn =
    document.getElementById(
      'tabRegisterBtn'
    );

  const loginBtn =
    document.getElementById(
      'tabLoginBtn'
    );

  const submitBtn =
    document.getElementById(
      'authSubmitBtn'
    );

  const isRegister =
    mode === 'register';


  if(registerFields){

    registerFields.style.display =
      isRegister
        ? 'block'
        : 'none';

  }


  if(registerBtn){

    registerBtn.classList.toggle(
      'secondary',
      !isRegister
    );

  }


  if(loginBtn){

    loginBtn.classList.toggle(
      'secondary',
      isRegister
    );

  }


  if(submitBtn){

    submitBtn.textContent =
      isRegister
        ? 'Create account'
        : 'Log in';

  }


  const status =
    document.getElementById(
      'authStatus'
    );

  if(status){

    status.textContent =
      isRegister

        ? 'No password needed for this demo — your toolbox stays on this device.'

        : 'Enter your email to continue.';

  }

}


function showAuth(){

  document
    .querySelectorAll('.view')
    .forEach(v =>
      v.classList.remove(
        'active'
      )
    );


  const authView =
    document.getElementById(
      'view-auth'
    );


  if(authView){

    authView.classList.add(
      'active'
    );

  }


  currentView =
    'auth';


  buildNav();

  setAuthMode(
    'register'
  );

}


/* ============ SUBMIT REGISTRATION ============ */

function submitAuth(){

  const nameElement =
    document.getElementById(
      'regName'
    );

  const emailElement =
    document.getElementById(
      'authEmail'
    );

  const streetElement =
    document.getElementById(
      'regStreet'
    );


  const name =
    nameElement
      ? nameElement.value.trim()
      : '';


  const email =
    emailElement
      ? emailElement.value.trim()
      : '';


  const street =
    streetElement
      ? streetElement.value.trim()
      : '';


  /* Validate full name */

  if(
    authMode === 'register' &&
    !name
  ){

    toast(
      'Please enter your full name.'
    );

    if(nameElement){

      nameElement.focus();

    }

    return;

  }


  /* Validate email */

  if(
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ){

    toast(
      'Please enter a valid email address.'
    );

    if(emailElement){

      emailElement.focus();

    }

    return;

  }


  const finalName =
    name ||
    email.split('@')[0];


  /*
    Save the registered user locally.
  */

  state.user = {

    name:
      finalName,

    email:
      email,

    street:
      street ||
      'Not specified',

    avatar:
      state.user?.avatar ||
      '🙂'

  };


  save();


  /*
    REGISTRATION

    Send Full Name and Email
    to Google Forms without
    opening the Google Form page.
  */

  if(
    authMode === 'register'
  ){

    const form =
      document.createElement(
        'form'
      );


    form.method =
      'POST';


    form.action =
      GOOGLE_FORM_ACTION;


    form.target =
      'googleFormTarget';


    form.style.display =
      'none';


    /*
      Full Name
      Google Form field:
      entry.670058573
    */

    const nameInput =
      document.createElement(
        'input'
      );

    nameInput.type =
      'hidden';

    nameInput.name =
      'entry.670058573';

    nameInput.value =
      finalName;


    /*
      Email
      Google Form field:
      entry.1924440408
    */

    const emailInput =
      document.createElement(
        'input'
      );

    emailInput.type =
      'hidden';

    emailInput.name =
      'entry.1924440408';

    emailInput.value =
      email;


    form.appendChild(
      nameInput
    );

    form.appendChild(
      emailInput
    );


    document.body.appendChild(
      form
    );


    const status =
      document.getElementById(
        'authStatus'
      );

    const submitBtn =
      document.getElementById(
        'authSubmitBtn'
      );


    if(status){

      status.textContent =
        'Creating your account…';

    }


    if(submitBtn){

      submitBtn.disabled =
        true;

    }


    /*
      Submit to Google Forms.
    */

    form.submit();


    /*
      After submission,
      return to index.html.
    */

    setTimeout(()=>{

      form.remove();

      window.location.href =
        'index.html';

    },900);


    return;

  }


  /*
    Login mode.
  */

  window.location.href =
    'index.html';

}


/* =========================================================
   NAVIGATION
   ========================================================= */

let currentView =
  'browse';


function buildNav(){

  const drawers =
    document.getElementById(
      'drawers'
    );

  const bottom =
    document.getElementById(
      'bottom-tabs'
    );


  if(!drawers || !bottom){

    return;

  }


  drawers.innerHTML =
    '';

  bottom.innerHTML =
    '';


  TABS.forEach(t=>{

    const count =
      badgeCount(
        t.id
      );


    /*
      Sidebar button
    */

    const b =
      document.createElement(
        'button'
      );


    b.className =
      'drawer-btn' +
      (
        currentView === t.id
          ? ' active'
          : ''
      );


    b.onclick =
      () => go(t.id);


    b.innerHTML =
      `<span class="ic">${t.icon}</span>
       <span>${t.label}</span>` +

      (
        count

          ? `<span class="drawer-count">${count}</span>`

          : ''
      );


    drawers.appendChild(
      b
    );


    /*
      Bottom navigation
    */

    const bt =
      document.createElement(
        'button'
      );


    bt.className =
      'bt' +
      (
        currentView === t.id
          ? ' active'
          : ''
      );


    bt.onclick =
      () => go(t.id);


    bt.innerHTML =
      `<span class="ic">${t.icon}</span>
       <span>${t.label}</span>` +

      (
        count

          ? `<span class="dot"></span>`

          : ''
      );


    bottom.appendChild(
      bt
    );

  });


  /*
    Add Log Out button
    to the sidebar.
  */

  if(state.user){

    const logoutButton =
      document.createElement(
        'button'
      );


    logoutButton.className =
      'drawer-btn logout-btn';


    logoutButton.onclick =
      logout;


    logoutButton.innerHTML =
      `
        <span class="ic">🚪</span>
        <span>Log Out</span>
      `;


    drawers.appendChild(
      logoutButton
    );

  }

}


function badgeCount(tabId){

  if(
    tabId === 'lending'
  ){

    return state.incomingRequests
      .filter(
        r =>
          r.status === 'pending'
      )
      .length || 0;

  }


  if(
    tabId === 'requests'
  ){

    return state.myRequests
      .filter(
        r =>
          r.status === 'approved'
      )
      .length || 0;

  }


  return 0;

}


/* ============ CHANGE VIEW ============ */

function go(view){

  /*
    If no user is logged in,
    always return to registration.
  */

  if(
    !state.user &&
    view !== 'auth'
  ){

    showAuth();

    return;

  }


  currentView =
    view;


  document
    .querySelectorAll('.view')
    .forEach(v =>
      v.classList.remove(
        'active'
      )
    );


  const target =
    document.getElementById(
      'view-' + view
    );


  if(target){

    target.classList.add(
      'active'
    );

  }


  buildNav();

  renderAll();


  window.scrollTo({
    top:0,
    behavior:'instant'
  });

}


/* =========================================================
   LOG OUT
   ========================================================= */

function logout(){

  /*
    Remove the logged-in user.
    Other ToolShare data stays
    on the device.
  */

  state.user =
    null;


  save();


  /*
    Close all open modals.
  */

  document
    .querySelectorAll(
      '.overlay.open'
    )
    .forEach(
      el =>
        el.classList.remove(
          'open'
        )
    );


  /*
    Clear registration fields.
  */

  const name =
    document.getElementById(
      'regName'
    );

  const email =
    document.getElementById(
      'authEmail'
    );

  const street =
    document.getElementById(
      'regStreet'
    );


  if(name){

    name.value =
      '';

  }


  if(email){

    email.value =
      '';

  }


  if(street){

    street.value =
      '';

  }


  /*
    Show registration page.
  */

  showAuth();

  setAuthMode(
    'register'
  );


  toast(
    'You have been logged out.'
  );

}


/* ============ RESET DEMO ============ */

function resetDemo(){

  try{

    localStorage.removeItem(
      'toolshare_state'
    );

  }catch(e){}


  state = {

    user:null,

    myTools:[],

    browseTools:[],

    myRequests:[],

    incomingRequests:[],

    reviews:[]

  };


  load();


  toast(
    'Demo data reset.'
  );


  if(state.user){

    go('browse');

  }else{

    showAuth();

  }

}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id){

  const modal =
    document.getElementById(
      id
    );

  if(modal){

    modal.classList.add(
      'open'
    );

  }

}


function closeModal(id){

  const modal =
    document.getElementById(
      id
    );

  if(modal){

    modal.classList.remove(
      'open'
    );

  }

}


/* =========================================================
   BROWSE
   ========================================================= */

function renderBrowse(){

  const q =
    (
      document.getElementById(
        'browseSearch'
      )?.value ||
      ''
    ).toLowerCase();


  const grid =
    document.getElementById(
      'browseGrid'
    );


  if(!grid) return;


  const items =
    state.browseTools.filter(
      t =>
        (
          t.name +
          t.category
        )
        .toLowerCase()
        .includes(q)
    );


  grid.innerHTML =
    items.map(
      t => `

        <div class="tag">

          <span class="tag-icon">
            ${t.icon}
          </span>

          <p class="tag-title">
            ${t.name}
          </p>

          <p class="tag-owner">
            Lent by ${t.owner}
          </p>

          <div class="tag-meta">

            <span class="chip cat">
              ${t.category}
            </span>

            <span class="chip status-${t.status}">
              ${labelForStatus(t.status)}
            </span>

          </div>

          <button
            class="btn small block"
            ${t.status !== 'available' ? 'disabled' : ''}
            onclick="openSelect('${t.id}')"
          >
            Select & request
          </button>

        </div>

      `
    ).join('')

    ||

    `
      <div class="empty">

        <span class="ic">
          🔍
        </span>

        No tools match “${q}”.

      </div>
    `;

}


function labelForStatus(status){

  return {

    available:'Available',

    requested:'Requested',

    approved:'Approved',

    confirmed:'Confirmed',

    returned:'Returned',

    declined:'Declined'

  }[status] || status;

}


/* =========================================================
   REQUEST TOOL
   ========================================================= */

let selectingToolId =
  null;


function openSelect(toolId){

  const t =
    state.browseTools.find(
      x =>
        x.id === toolId
    );


  if(!t) return;


  selectingToolId =
    toolId;


  const title =
    document.getElementById(
      'selectTitle'
    );

  const owner =
    document.getElementById(
      'selectOwner'
    );

  const body =
    document.getElementById(
      'selectBody'
    );

  const dates =
    document.getElementById(
      'selectDates'
    );

  const note =
    document.getElementById(
      'selectNote'
    );

  const confirm =
    document.getElementById(
      'selectConfirmBtn'
    );


  if(title){

    title.textContent =
      `${t.icon}  ${t.name}`;

  }


  if(owner){

    owner.textContent =
      `Lent by ${t.owner} · ${t.category}`;

  }


  if(body){

    body.innerHTML =
      `
        <p style="color:#C9BF9F;font-size:13.5px;line-height:1.5;">
          ${t.notes}
        </p>
      `;

  }


  if(dates){

    dates.value =
      '';

  }


  if(note){

    note.value =
      '';

  }


  if(confirm){

    confirm.onclick =
      () =>
        sendRequest(
          toolId
        );

  }


  openModal(
    'overlaySelect'
  );

}


function sendRequest(toolId){

  const t =
    state.browseTools.find(
      x =>
        x.id === toolId
    );


  if(!t) return;


  const dates =
    document
      .getElementById(
        'selectDates'
      )
      ?.value.trim() ||
    '';


  const note =
    document
      .getElementById(
        'selectNote'
      )
      ?.value.trim() ||
    '';


  if(!dates){

    toast(
      'Please choose your borrowing dates.'
    );

    return;

  }


  state.myRequests.push({

    id:
      'rq' +
      Date.now(),

    toolId:
      toolId,

    toolName:
      t.name,

    icon:
      t.icon,

    owner:
      t.owner,

    dates:
      dates,

    note:
      note,

    status:
      'requested'

  });


  t.status =
    'requested';


  closeModal(
    'overlaySelect'
  );


  toast(
    `Request sent for ${t.name}.`
  );


  save();

  renderAll();

}


/* =========================================================
   REQUESTS
   ========================================================= */

function renderRequests(){

  const list =
    document.getElementById(
      'requestsList'
    );


  if(!list) return;


  if(!state.myRequests.length){

    list.innerHTML =
      `
        <div class="empty">

          <span class="ic">
            📦
          </span>

          You haven't requested any tools yet.

        </div>
      `;

    return;

  }


  list.innerHTML =
    state.myRequests
      .slice()
      .reverse()
      .map(
        r => {

          let actions =
            '';


          if(
            r.status === 'approved'
          ){

            actions =
              `
                <button
                  class="btn small"
                  onclick="confirmPickup('${r.id}')">
                  Confirm pickup
                </button>
              `;

          }

          else if(
            r.status === 'confirmed'
          ){

            actions =
              `
                <button
                  class="btn small steel"
                  onclick="openReturn('${r.id}')">
                  Mark returned
                </button>
              `;

          }

          else if(
            r.status === 'returned'
          ){

            actions =
              `
                <span class="chip status-returned">
                  Done
                </span>
              `;

          }

          else{

            actions =
              `
                <span class="chip status-requested">
                  Awaiting owner
                </span>
              `;

          }


          return `

            <div class="row-card">

              <div class="row-ic">
                ${r.icon}
              </div>

              <div class="row-main">

                <p class="row-title">

                  ${r.toolName}

                  <span
                    style="font-weight:400;color:var(--ink-soft);">
                    · ${r.owner}
                  </span>

                </p>

                <p class="row-sub">

                  ${r.dates}

                  ${
                    r.note
                      ? ' · “' +
                        r.note +
                        '”'
                      : ''
                  }

                </p>

              </div>

              <span
                class="chip status-${r.status}"
                style="margin-right:2px;">

                ${labelForStatus(r.status)}

              </span>

              <div class="row-actions">

                ${actions}

              </div>

            </div>

          `;

        }
      )
      .join('');

}


function confirmPickup(reqId){

  const r =
    state.myRequests.find(
      x =>
        x.id === reqId
    );


  if(!r) return;


  r.status =
    'confirmed';


  const t =
    state.browseTools.find(
      x =>
        x.id === r.toolId
    );


  if(t){

    t.status =
      'confirmed';

  }


  toast(
    `Pickup confirmed for ${r.toolName}.`
  );


  save();

  renderAll();

}


/* =========================================================
   RETURNS / REVIEWS
   ========================================================= */

let returningReqId =
  null;


function openReturn(reqId){

  returningReqId =
    reqId;


  const r =
    state.myRequests.find(
      x =>
        x.id === reqId
    );


  if(!r) return;


  const sub =
    document.getElementById(
      'reviewSub'
    );


  const comment =
    document.getElementById(
      'reviewComment'
    );


  if(sub){

    sub.textContent =
      `Rate your experience borrowing “${r.toolName}” from ${r.owner}.`;

  }


  if(comment){

    comment.value =
      '';

  }


  setStars(
    0
  );


  const submit =
    document.getElementById(
      'reviewSubmitBtn'
    );


  if(submit){

    submit.onclick =
      submitReturnReview;

  }


  openModal(
    'overlayReview'
  );

}


let currentStarValue =
  0;


function setStars(v){

  currentStarValue =
    v;


  document
    .querySelectorAll(
      '#reviewStars .star'
    )
    .forEach(
      s => {

        s.classList.toggle(
          'on',
          Number(
            s.dataset.v
          ) <= v
        );

      }
    );

}


document.addEventListener(
  'DOMContentLoaded',
  () => {

    document
      .querySelectorAll(
        '#reviewStars .star'
      )
      .forEach(
        s => {

          s.addEventListener(
            'click',
            () =>
              setStars(
                Number(
                  s.dataset.v
                )
              )
          );

        }
      );

  }
);


function submitReturnReview(){

  if(!currentStarValue){

    toast(
      'Pick a star rating first.'
    );

    return;

  }


  const r =
    state.myRequests.find(
      x =>
        x.id ===
        returningReqId
    );


  if(!r) return;


  r.status =
    'returned';


  const t =
    state.browseTools.find(
      x =>
        x.id === r.toolId
    );


  if(t){

    t.status =
      'available';

  }


  state.reviews.push({

    id:
      'rev' +
      Date.now(),

    toolName:
      r.toolName,

    from:
      state.user.name,

    to:
      r.owner,

    rating:
      currentStarValue,

    comment:
      document
        .getElementById(
          'reviewComment'
        )
        ?.value.trim() ||
      '',

    type:
      'tool'

  });


  closeModal(
    'overlayReview'
  );


  toast(
    `${r.toolName} marked returned. Thanks for the review!`
  );


  save();

  renderAll();

}


/* =========================================================
   LENDING
   ========================================================= */

function renderLending(){

  const inc =
    document.getElementById(
      'incomingList'
    );

  const grid =
    document.getElementById(
      'myToolsGrid'
    );


  if(!inc || !grid) return;


  const pending =
    state.incomingRequests.filter(
      r =>
        r.status === 'pending'
    );


  inc.innerHTML =
    pending.length

      ? pending
          .map(
            r => `

              <div class="row-card">

                <div class="row-ic">
                  📥
                </div>

                <div class="row-main">

                  <p class="row-title">

                    ${r.borrower} wants

                    <span
                      style="color:var(--ink-soft);font-weight:400;">

                      “${r.toolName}”

                    </span>

                  </p>

                  <p class="row-sub">

                    ${r.dates}

                    ${
                      r.note
                        ? ' · “' +
                          r.note +
                          '”'
                        : ''
                    }

                  </p>

                </div>

                <div class="row-actions">

                  <button
                    class="btn small"
                    onclick="processRequest('${r.id}','approved')">

                    Approve

                  </button>

                  <button
                    class="btn small danger"
                    onclick="processRequest('${r.id}','declined')">

                    Decline

                  </button>

                </div>

              </div>

            `
          )
          .join('')

      : `
          <div
            class="empty"
            style="padding:24px;">

            <span class="ic">
              ✅
            </span>

            No pending requests right now.

          </div>
        `;


  grid.innerHTML =
    state.myTools
      .map(
        t => `

          <div class="tag">

            <span class="tag-icon">
              ${t.icon}
            </span>

            <p class="tag-title">
              ${t.name}
            </p>

            <p class="tag-owner">
              ${t.category}
            </p>

            <div class="tag-meta">

              <span
                class="chip status-${t.status}">

                ${labelForStatus(t.status)}

              </span>

            </div>

            <p
              style="font-size:12px;color:var(--ink-soft);margin:0;">

              ${t.notes || ''}

            </p>

            ${
              t.status === 'confirmed'

                ? `
                    <button
                      class="btn small block"
                      style="margin-top:10px;"
                      onclick="ownerMarkReturned('${t.id}')">

                      Mark returned

                    </button>
                  `

                : ''
            }

          </div>

        `
      )
      .join('')

      ||

      `
        <div class="empty">

          <span class="ic">
            🧰
          </span>

          You haven't listed any tools yet.

        </div>
      `;

}


function processRequest(
  reqId,
  decision
){

  const r =
    state.incomingRequests.find(
      x =>
        x.id === reqId
    );


  if(!r) return;


  r.status =
    decision;


  const t =
    state.myTools.find(
      x =>
        x.id === r.toolId
    );


  if(decision === 'approved'){

    if(t){

      t.status =
        'confirmed';

    }


    toast(
      `Approved ${r.borrower}'s request for ${r.toolName}.`
    );

  }

  else{

    if(t){

      t.status =
        'available';

    }


    toast(
      `Declined ${r.borrower}'s request.`
    );

  }


  save();

  renderAll();

}


function ownerMarkReturned(
  toolId
){

  const t =
    state.myTools.find(
      x =>
        x.id === toolId
    );


  if(!t) return;


  const r =
    state.incomingRequests.find(
      x =>
        x.toolId === toolId &&
        x.status === 'approved'
    );


  t.status =
    'available';


  if(r){

    r.status =
      'returned';


    state.reviews.push({

      id:
        'rev' +
        Date.now(),

      toolName:
        t.name,

      from:
        state.user.name,

      to:
        r.borrower,

      rating:
        5,

      comment:
        'Returned on time, in good shape.',

      type:
        'borrower'

    });

  }


  toast(
    `${t.name} marked returned.`
  );


  save();

  renderAll();

}


/* =========================================================
   ADD TOOLS
   ========================================================= */

let pickedToolIcon =
  TOOL_ICONS[0];


function openAddTool(){

  const name =
    document.getElementById(
      'newToolName'
    );

  const notes =
    document.getElementById(
      'newToolNotes'
    );

  const pick =
    document.getElementById(
      'toolIconPick'
    );


  if(name){

    name.value =
      '';

  }


  if(notes){

    notes.value =
      '';

  }


  if(pick){

    pick.innerHTML =
      TOOL_ICONS
        .map(
          ic =>
            `
              <button
                class="avatar-opt${ic === pickedToolIcon ? ' sel' : ''}"
                onclick="pickToolIcon('${ic}')">

                ${ic}

              </button>
            `
        )
        .join('');

  }


  openModal(
    'overlayAddTool'
  );

}


function pickToolIcon(ic){

  pickedToolIcon =
    ic;


  document
    .querySelectorAll(
      '#toolIconPick .avatar-opt'
    )
    .forEach(
      b =>
        b.classList.toggle(
          'sel',
          b.textContent.trim() === ic
        )
    );

}


function addTool(){

  const name =
    document
      .getElementById(
        'newToolName'
      )
      ?.value.trim() ||
    '';


  if(!name){

    toast(
      'Give the tool a name.'
    );

    return;

  }


  state.myTools.push({

    id:
      'mt' +
      Date.now(),

    name:
      name,

    category:
      document
        .getElementById(
          'newToolCat'
        )
        ?.value ||
      'Other',

    icon:
      pickedToolIcon,

    notes:
      document
        .getElementById(
          'newToolNotes'
        )
        ?.value.trim() ||
      '',

    status:
      'available'

  });


  closeModal(
    'overlayAddTool'
  );


  toast(
    `${name} added to your crib.`
  );


  save();

  renderAll();

}


/* =========================================================
   RETURNS
   ========================================================= */

function renderReturns(){

  const returnedList =
    document.getElementById(
      'returnedList'
    );

  const reviewsList =
    document.getElementById(
      'reviewsList'
    );


  if(!returnedList) return;


  const returned =
    state.myRequests.filter(
      r =>
        r.status === 'returned'
    );


  returnedList.innerHTML =
    returned.length

      ? returned
          .map(
            r => `

              <div class="row-card">

                <div class="row-ic">
                  ${r.icon}
                </div>

                <div class="row-main">

                  <p class="row-title">
                    ${r.toolName}
                  </p>

                  <p class="row-sub">
                    Borrowed from ${r.owner} · ${r.dates}
                  </p>

                </div>

                <span class="chip status-returned">
                  Returned
                </span>

              </div>

            `
          )
          .join('')

      : `
          <div
            class="empty"
            style="padding:22px;">

            <span class="ic">
              📭
            </span>

            Nothing returned yet.

          </div>
        `;


  if(!reviewsList) return;


  reviewsList.innerHTML =
    state.reviews.length

      ? state.reviews
          .slice()
          .reverse()
          .map(
            rv => `

              <div class="review-card">

                <div class="review-stars">

                  ${'★'.repeat(rv.rating)}
                  ${'☆'.repeat(5-rv.rating)}

                </div>

                <p
                  style="margin:4px 0 2px;font-weight:600;">

                  ${
                    rv.type === 'tool'

                      ? rv.toolName +
                        ' — from ' +
                        rv.from

                      : 'Review of ' +
                        rv.to +
                        ' by ' +
                        rv.from
                  }

                </p>

                <p
                  style="margin:0;font-size:13px;color:var(--ink-soft);">

                  ${rv.comment || 'No comment left.'}

                </p>

              </div>

            `
          )
          .join('')

      : `
          <div
            class="empty"
            style="padding:22px;">

            <span class="ic">
              ⭐
            </span>

            No reviews yet.

          </div>
        `;

}


/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile(){

  if(!state.user) return;


  const avatar =
    document.getElementById(
      'profileAvatarBig'
    );

  const name =
    document.getElementById(
      'profileNameBig'
    );

  const street =
    document.getElementById(
      'profileStreetBig'
    );

  const editName =
    document.getElementById(
      'editName'
    );

  const editStreet =
    document.getElementById(
      'editStreet'
    );


  if(avatar){

    avatar.textContent =
      state.user.avatar;

  }


  if(name){

    name.textContent =
      state.user.name;

  }


  if(street){

    street.textContent =
      state.user.street;

  }


  if(editName){

    editName.value =
      state.user.name;

  }


  if(editStreet){

    editStreet.value =
      state.user.street;

  }


  const pick =
    document.getElementById(
      'avatarPick'
    );


  if(pick){

    pick.innerHTML =
      AVATARS
        .map(
          a =>
            `
              <button
                class="avatar-opt${a === state.user.avatar ? ' sel' : ''}"
                onclick="pickAvatar('${a}')">

                ${a}

              </button>
            `
        )
        .join('');

  }


  const lent =
    document.getElementById(
      'statLent'
    );


  if(lent){

    lent.textContent =
      state.myTools.length;

  }


  const borrowedCount =
    state.myRequests.filter(
      r =>
        r.status === 'confirmed' ||
        r.status === 'returned'
    ).length;


  const borrowed =
    document.getElementById(
      'statBorrowed'
    );


  if(borrowed){

    borrowed.textContent =
      borrowedCount;

  }


  const relevant =
    state.reviews.filter(
      r =>
        r.type === 'borrower'
    );


  const avgSrc =
    relevant.length
      ? relevant
      : state.reviews;


  const avg =
    avgSrc.length

      ? (
          avgSrc.reduce(
            (a,b) =>
              a + b.rating,
            0
          ) /
          avgSrc.length
        ).toFixed(1)

      : '–';


  const rating =
    document.getElementById(
      'statRating'
    );


  if(rating){

    rating.textContent =
      avg;

  }

}


function pickAvatar(a){

  if(!state.user) return;


  state.user.avatar =
    a;


  save();

  renderProfile();

  renderSidebar();

}


function saveProfile(){

  if(!state.user) return;


  const name =
    document
      .getElementById(
        'editName'
      )
      ?.value.trim() ||
    '';


  const street =
    document
      .getElementById(
        'editStreet'
      )
      ?.value.trim() ||
    '';


  if(name){

    state.user.name =
      name;

  }


  if(street){

    state.user.street =
      street;

  }


  save();


  toast(
    'Profile saved.'
  );


  renderProfile();

  renderSidebar();

}


/* =========================================================
   SIDEBAR / GLOBAL RENDER
   ========================================================= */

function renderSidebar(){

  const avatar =
    document.getElementById(
      'sidebarAvatar'
    );

  const name =
    document.getElementById(
      'sidebarName'
    );


  if(state.user){

    if(avatar){

      avatar.textContent =
        state.user.avatar;

    }


    if(name){

      name.textContent =
        state.user.name;

    }

  }

  else{

    if(avatar){

      avatar.textContent =
        '🙂';

    }


    if(name){

      name.textContent =
        'Guest';

    }

  }

}


function renderAll(){

  renderSidebar();

  buildNav();

  renderBrowse();

  renderRequests();

  renderLending();

  renderReturns();

  renderProfile();

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

load();


if(state.user){

  go('browse');

}

else{

  showAuth();

}