 const paramMedia = queryParam('m')

  function queryParam(key) {
    const parsedUrl = new URL(window.location.href);
    return parsedUrl.searchParams.get(key) ?? '';
  }

  let form = document.querySelectorAll('form');

  for (var i = 0; i < form.length; i++) {

    let notification = form[i].getAttribute('data-notification')

    form[i].addEventListener('submit', function (event) {
      event.preventDefault();

      formData = new FormData(event.target);
      formData.append('media', paramMedia);

      let urlLeads = 'https://api.amp.reweb.io/api/lead/register';
      let modalSuccess = new bootstrap.Modal(document.getElementById('modalSuccess'))

      request('POST', urlLeads, formData, (response) => {
        event.target.reset()
        if(notification === 'true' || notification === null) {
          modalSuccess.show()
        }

        let inputRedirectTo = formData.get('redirect_to') ?? null
        let inputRedirectCondition = formData.get('redirect_condition') ?? null
        let isRedirectCondition = true

        if(inputRedirectCondition){
          inputRedirectCondition = inputRedirectCondition.split('[');

          let redirectConditionField = inputRedirectCondition[0] ?? null
          let redirectConditionValue = inputRedirectCondition[1] ? inputRedirectCondition[1].replace("]", "") : null

          if(formData.get(redirectConditionField) === redirectConditionValue){
            isRedirectCondition = true
          } else {
            isRedirectCondition = false
          }
        }

        const requestQueryString = new URLSearchParams(formData).toString()

        let meioCaptacao = formData.get('meio_captacao').split('_')
        let link = ""

        if(meioCaptacao[2] === "WHATSAPP") {
          link = document.getElementById("linkWhats");
          link.href = inputRedirectTo
        } else if(meioCaptacao[2] === "LIGAMOS") {
          link = document.getElementById("phone");
        }

        if (inputRedirectTo && isRedirectCondition) {
          if(link !== "") {
            window.location.assign(link.href)
            formData.reset()
          } else {
            window.open(inputRedirectTo + '?' + requestQueryString, '_blank')
            formData.reset()
          }
        } else if(link !== "") {
          link.click();
          formData.reset()
        }
      });

    })
  }

  function switchUrlWhats(element) {
    let option = element.options[element.selectedIndex];
    let redirectTo = option.getAttribute('data-redirect-to')
    let elementredirectTo = document.getElementsByName('redirect_to')[0] ?? null;
    if (elementredirectTo) {
      elementredirectTo.value = redirectTo
    }

  }

  function switchUrlPhone(element) {
    let option = element.options[element.selectedIndex];
    let redirectTo = option.getAttribute('data-redirect-to')
    let elementredirectTo = document.getElementById('redirect-phone') ?? null;
    if (elementredirectTo) {
      elementredirectTo.value = redirectTo
    }
  }

  // Configuração para SWITCH dos campos radio com os outros campos
  function switchRadio() {
    let fieldsRadio = document.querySelectorAll('[type="radio"]')

    if (fieldsRadio !== "") {
      for (const i of Object.keys(fieldsRadio)) {
        let fieldSwitched = document.querySelectorAll("."+fieldsRadio[i].value)

        for (const count of Object.keys(fieldSwitched)) {
          if (fieldsRadio[i].checked == false) {
            fieldSwitched[count].classList.add("d-none")
            fieldSwitched[count].removeAttribute("required")
          } else {
            fieldSwitched[count].classList.remove("d-none")
            fieldSwitched[count].setAttribute("required", "required")
          }
        }
      }
    }
  }
  switchRadio()

 /* Configuração para troca de iframe no mapa */
  const enableMaps = "";
  if (enableMaps !== "0") {
    let optInfosMap = document.getElementById("infosMap")
    let optInfosMapClass = optInfosMap.getElementsByClassName("maps-01__carousel__location__container");
    let optIframeMap = document.getElementById("iframeMap")
    let optIframeMapClass = optIframeMap.getElementsByClassName("maps-01__carousel__map__items");

    for (let i = 0; i < optInfosMapClass.length; i++) {
      optInfosMapClass[i].addEventListener("click", function() {

        let currentInfos = optInfosMap.getElementsByClassName("active");
        let currentIframe = optIframeMap.getElementsByClassName("active");

        currentIframe[0].className = currentIframe[0].className.replace(" active", "");

        if (currentInfos.length > 0) {
          currentInfos[0].className = currentInfos[0].className.replace(" active", "");

          let infoID = this.id.replace("info-", "");
          let mapID = optIframeMapClass[i].id.replace("map-", "");

          if (infoID == mapID) {
            optIframeMapClass[i].className += " active";
          }
        }
        this.className += " active";
      });
    }
  }

  const swiperBanner01 = new Swiper('.swiperBanner01', {
    direction: 'horizontal',
    slidesPerView: 1,
    loop: false,

    navigation: {
      nextEl: '.button-next-banner01',
      prevEl: '.button-prev-banner01',
    },
  });

  const swiperLeadPhone = new Swiper('.swiperLeadPhone', {
    direction: 'horizontal',
    slidesPerView: 1,
    loop: false,
    spaceBetween: 0,
    breakpoints: {
      969: {
        slidesPerView: 3,
        spaceBetween: 0
      }
    },
    navigation: {
      nextEl: '.button-next-leadphone',
      prevEl: '.button-prev-leadphone',
    },
  });

  const swiperCarVersion = new Swiper(".swiperCarVersion", {
    slidesPerView: 1,
    spaceBetween: 10,
    slidesPerGroup: 1,
    breakpoints: {
      969: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30
      }
    },
    loop: true,
    loopFillGroupWithBlank: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  function request(method, url, data = null, callback) {
    let xhr = new XMLHttpRequest();
    let sourceOrigin = `${window.location.protocol}//${window.location.host}`;
    let params = null;

    if (method == 'POST') {
      params = new URLSearchParams(data).toString()
    }

    let separator = url.indexOf('?') !== -1 ? '&' : '?';

    url = url + separator + '__amp_source_origin=' + sourceOrigin

    xhr.open(method, url, true);

    if (method == 'POST') {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    }
    xhr.send(params);
  }

  let urlLeadphones = 'https://api.amp.reweb.io/api/leadphones?domain_id=2853&media='+paramMedia;

  request('GET', urlLeadphones, null, (response) => {
    let items = response.items ?? false;
    let leadphones = items.results ?? false;
    let target = document.querySelector('.leadphones');
    let element = "";

    let formWhats = document.getElementById('formWhats');
    let roulette = "";
    let modalPhone = "";
    let lang = "lang=&";
    let countLead = 0;
    let countPhoneRoulette = 0; // Variável de contagem para os telefones de whatsapp setados como "Formulário" no CRM - FUNÇÃO ROLETA

    for (const i of Object.keys(leadphones)) {
      let targetPhoneOurStores = document.querySelector(`.phone-map-store-${leadphones[i].id}`);
      let targetWhatsappOurStores = document.querySelectorAll(`.whatsapp-map-store-${leadphones[i].id}`);
      let targetPhoneContactUs = document.querySelector(`.phone-contact-us-store-${leadphones[i].id}`);
      let targetWhatsappContactUs = document.querySelectorAll(`.whatsapp-contact-us-store-${leadphones[i].id}`);

      // >>> CONFIGURAÇÃO DA FUNÇÃO ROLETA
      if((roulette === "1" || roulette === "true") && (countPhoneRoulette < 1 && leadphones[i].whatsapp !== "")) {
        let fieldsHidden = {
          "input": [
            {
              "type": "hidden",
              "name": "id_unidade_roleta",
              "value": `${leadphones[i].id}`
            },
            {
              "type": "hidden",
              "name": "redirect_to",
              "value": `https://api.whatsapp.com/send?phone=${leadphones[i].whatsapp_clean}&text=${leadphones[i].whatsapp_text}&${lang}`
            },
            {
              "type": "hidden",
              "name": "roulete",
              "value": "1"
            }
          ]
        }

        let element = []
        for (const fldHdn of Object.keys(fieldsHidden)) {
          for (const a of fieldsHidden[fldHdn]) {
            let inputs = fldHdn
            element = document.createElement(fldHdn)
            element.type = a.type;
            element.name = a.name;
            element.value = a.value;
            formWhats.appendChild(element);
          }
        }
        countPhoneRoulette ++
      }

      let phoneOurStores = `<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7667 9.54194L10.4363 8.65498L9.25372 7.86672C9.02549 7.71487 8.71877 7.76465 8.55028 7.98093L7.81849 8.92167C7.6613 9.12581 7.37853 9.18448 7.15311 9.05967C6.65657 8.78347 6.0694 8.52341 4.77383 7.22618C3.47827 5.92895 3.21654 5.34344 2.94033 4.8469C2.81553 4.62148 2.87419 4.33871 3.07833 4.18154L4.01908 3.44975C4.23534 3.28129 4.28514 2.97456 4.13329 2.74631L3.36924 1.60011L2.45806 0.233342C2.30298 0.000703603 1.99253 -0.0691395 1.75277 0.0746481L0.701935 0.705064C0.417945 0.872382 0.20919 1.14257 0.118909 1.4596C-0.168455 2.50732 -0.226392 4.81854 3.47763 8.52256C7.18166 12.2266 9.49266 12.1685 10.5404 11.8811C10.8574 11.7908 11.1276 11.5821 11.2949 11.298L11.9253 10.2472C12.0691 10.0075 11.9993 9.69703 11.7667 9.54194Z" fill="currentColor"/><path d="M6.82724 1.86203C8.76883 1.86418 10.3423 3.43762 10.3444 5.37923C10.3444 5.49349 10.4371 5.58614 10.5514 5.58614C10.6656 5.58614 10.7583 5.49351 10.7583 5.37923C10.7559 3.2092 8.9973 1.45063 6.82727 1.44824C6.71301 1.44824 6.62036 1.54087 6.62036 1.65515C6.62034 1.76938 6.71296 1.86203 6.82724 1.86203Z" fill="currentColor"/><path d="M6.82727 3.10326C8.08357 3.10474 9.10162 4.12281 9.10309 5.37909C9.10309 5.49335 9.19572 5.58599 9.31 5.58599C9.42425 5.58599 9.5169 5.49337 9.5169 5.37909C9.51519 3.89436 8.31202 2.69116 6.82727 2.68945C6.71301 2.68945 6.62036 2.78208 6.62036 2.89636C6.62036 3.01064 6.71299 3.10326 6.82727 3.10326Z" fill="currentColor"/><path d="M6.82724 4.34469C7.39829 4.34537 7.86104 4.80812 7.86172 5.37917C7.86172 5.49342 7.95434 5.58607 8.06862 5.58607C8.18288 5.58607 8.27552 5.49345 8.27552 5.37917C8.27461 4.5797 7.62673 3.93182 6.82727 3.93091C6.71301 3.93091 6.62036 4.02353 6.62036 4.13781C6.62034 4.25207 6.71296 4.34469 6.82724 4.34469Z" fill="currentColor"/></svg>      <p>
        ${leadphones[i].phone}
      </p>`

      let whatsappOurStores = `<svg viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.3754 0.912913C4.5669 1.21143 -0.0157434 6.39329 4.06511e-05 12.6172C0.00530201 14.5153 0.431472 16.3064 1.18911 17.8835L0.0316088 23.9046C-0.0315275 24.2313 0.242063 24.5129 0.547222 24.4397L6.05586 23.0428C7.47117 23.7976 9.0601 24.2313 10.7437 24.2594C16.6838 24.3552 21.6347 19.3085 21.8189 12.9551C22.0136 6.14546 16.7627 0.591863 10.3754 0.912913ZM16.9521 19.0494C15.3369 20.7786 13.1955 21.7305 10.9121 21.7305C9.57571 21.7305 8.2972 21.4094 7.10813 20.7786L6.33998 20.3674L2.96218 21.2236L3.67247 17.5287L3.29365 16.7345C2.67807 15.4447 2.36765 14.0478 2.36765 12.5834C2.36765 10.1389 3.25682 7.84647 4.87206 6.1173C6.46625 4.40504 8.64971 3.43625 10.9121 3.43625C13.1955 3.43625 15.3369 4.38814 16.9521 6.1173C18.5674 7.84647 19.4565 10.1389 19.4565 12.5834C19.4513 15.0053 18.5516 17.3372 16.9521 19.0494Z" fill="currentColor"/><path d="M16.2054 15.1179L14.0903 14.4702C13.8115 14.3857 13.5116 14.4702 13.3116 14.6899L12.796 15.2531C12.5803 15.4897 12.2488 15.5685 11.9595 15.4446C10.9598 15.0109 8.85526 13.0114 8.3186 12.0088C8.16602 11.7215 8.18706 11.3611 8.38173 11.0963L8.83421 10.4711C9.0131 10.2289 9.04993 9.89663 8.92892 9.61501L8.03975 7.46341C7.82929 6.94522 7.21371 6.79878 6.80859 7.15926C6.21932 7.69434 5.51956 8.50542 5.43537 9.40661C5.28279 10.9893 5.91942 12.9889 8.32386 15.3883C11.0966 18.1594 13.3221 18.5256 14.7638 18.1538C15.5845 17.9398 16.2422 17.0893 16.6526 16.3909C16.9367 15.9008 16.7105 15.27 16.2054 15.1179Z" fill="currentColor"/></svg>      <p>
        ${leadphones[i].whatsapp}
      </p>`

      if (leadphones[i].show.indexOf("header") !== -1 && leadphones[i].phone != "" && modalPhone != true ) {
        element = `<div class="item swiper-slide">
            <a class="conversion" href="tel:${leadphones[i].phone}">
              <p class="m-0"> ${leadphones[i].name} </p>
              <p class="uni__phone m-0">${leadphones[i].phone}</p>
            </a>
          </div>`;
        countLead ++
        target.innerHTML += element;
      } else if (leadphones[i].show.indexOf("header") !== -1 && leadphones[i].phone != "" && modalPhone == true) {
        element = `<div class="item swiper-slide">
            <button type="button" data-bs-toggle="modal" data-bs-target="#modalPhone" id="leadphone-${leadphones[i].id}" data-leadphone="${leadphones[i].phone}" data-leadphone-id="${leadphones[i].crm_id}">
              <p class="m-0"> ${leadphones[i].name} </p>
              <p class="uni__phone m-0">${leadphones[i].phone}</p>
            </button>
          </div>`;
        countLead ++
        target.innerHTML += element;
      }

      if (leadphones[i].show.indexOf("map") !== -1 && targetPhoneOurStores != null) {
        if (leadphones[i].phone != '') {
          targetPhoneOurStores.innerHTML = phoneOurStores;
        }
        for (let iwhats = 0; iwhats < targetWhatsappOurStores.length; iwhats++) {
          targetWhatsappOurStores[iwhats].innerHTML = whatsappOurStores;
        }
      }

      let phoneContactUs = `<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7667 9.54194L10.4363 8.65498L9.25372 7.86672C9.02549 7.71487 8.71877 7.76465 8.55028 7.98093L7.81849 8.92167C7.6613 9.12581 7.37853 9.18448 7.15311 9.05967C6.65657 8.78347 6.0694 8.52341 4.77383 7.22618C3.47827 5.92895 3.21654 5.34344 2.94033 4.8469C2.81553 4.62148 2.87419 4.33871 3.07833 4.18154L4.01908 3.44975C4.23534 3.28129 4.28514 2.97456 4.13329 2.74631L3.36924 1.60011L2.45806 0.233342C2.30298 0.000703603 1.99253 -0.0691395 1.75277 0.0746481L0.701935 0.705064C0.417945 0.872382 0.20919 1.14257 0.118909 1.4596C-0.168455 2.50732 -0.226392 4.81854 3.47763 8.52256C7.18166 12.2266 9.49266 12.1685 10.5404 11.8811C10.8574 11.7908 11.1276 11.5821 11.2949 11.298L11.9253 10.2472C12.0691 10.0075 11.9993 9.69703 11.7667 9.54194Z" fill="currentColor"/><path d="M6.82724 1.86203C8.76883 1.86418 10.3423 3.43762 10.3444 5.37923C10.3444 5.49349 10.4371 5.58614 10.5514 5.58614C10.6656 5.58614 10.7583 5.49351 10.7583 5.37923C10.7559 3.2092 8.9973 1.45063 6.82727 1.44824C6.71301 1.44824 6.62036 1.54087 6.62036 1.65515C6.62034 1.76938 6.71296 1.86203 6.82724 1.86203Z" fill="currentColor"/><path d="M6.82727 3.10326C8.08357 3.10474 9.10162 4.12281 9.10309 5.37909C9.10309 5.49335 9.19572 5.58599 9.31 5.58599C9.42425 5.58599 9.5169 5.49337 9.5169 5.37909C9.51519 3.89436 8.31202 2.69116 6.82727 2.68945C6.71301 2.68945 6.62036 2.78208 6.62036 2.89636C6.62036 3.01064 6.71299 3.10326 6.82727 3.10326Z" fill="currentColor"/><path d="M6.82724 4.34469C7.39829 4.34537 7.86104 4.80812 7.86172 5.37917C7.86172 5.49342 7.95434 5.58607 8.06862 5.58607C8.18288 5.58607 8.27552 5.49345 8.27552 5.37917C8.27461 4.5797 7.62673 3.93182 6.82727 3.93091C6.71301 3.93091 6.62036 4.02353 6.62036 4.13781C6.62034 4.25207 6.71296 4.34469 6.82724 4.34469Z" fill="currentColor"/></svg>        <a class="conversion" href="tel:${leadphones[i].phone}">
          ${leadphones[i].phone}
        </a>`

      let whatsappContactUs = `<svg viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.3754 0.912913C4.5669 1.21143 -0.0157434 6.39329 4.06511e-05 12.6172C0.00530201 14.5153 0.431472 16.3064 1.18911 17.8835L0.0316088 23.9046C-0.0315275 24.2313 0.242063 24.5129 0.547222 24.4397L6.05586 23.0428C7.47117 23.7976 9.0601 24.2313 10.7437 24.2594C16.6838 24.3552 21.6347 19.3085 21.8189 12.9551C22.0136 6.14546 16.7627 0.591863 10.3754 0.912913ZM16.9521 19.0494C15.3369 20.7786 13.1955 21.7305 10.9121 21.7305C9.57571 21.7305 8.2972 21.4094 7.10813 20.7786L6.33998 20.3674L2.96218 21.2236L3.67247 17.5287L3.29365 16.7345C2.67807 15.4447 2.36765 14.0478 2.36765 12.5834C2.36765 10.1389 3.25682 7.84647 4.87206 6.1173C6.46625 4.40504 8.64971 3.43625 10.9121 3.43625C13.1955 3.43625 15.3369 4.38814 16.9521 6.1173C18.5674 7.84647 19.4565 10.1389 19.4565 12.5834C19.4513 15.0053 18.5516 17.3372 16.9521 19.0494Z" fill="currentColor"/><path d="M16.2054 15.1179L14.0903 14.4702C13.8115 14.3857 13.5116 14.4702 13.3116 14.6899L12.796 15.2531C12.5803 15.4897 12.2488 15.5685 11.9595 15.4446C10.9598 15.0109 8.85526 13.0114 8.3186 12.0088C8.16602 11.7215 8.18706 11.3611 8.38173 11.0963L8.83421 10.4711C9.0131 10.2289 9.04993 9.89663 8.92892 9.61501L8.03975 7.46341C7.82929 6.94522 7.21371 6.79878 6.80859 7.15926C6.21932 7.69434 5.51956 8.50542 5.43537 9.40661C5.28279 10.9893 5.91942 12.9889 8.32386 15.3883C11.0966 18.1594 13.3221 18.5256 14.7638 18.1538C15.5845 17.9398 16.2422 17.0893 16.6526 16.3909C16.9367 15.9008 16.7105 15.27 16.2054 15.1179Z" fill="currentColor"/></svg>        <p class="our-stores__content__info__column__whatsapp" data-bs-toggle="modal" data-bs-target="#modalWhatsapp">
          ${leadphones[i].whatsapp}
        </p>`

      if(targetPhoneContactUs) {
        targetPhoneContactUs.innerHTML = phoneContactUs;
      }

      for (let iwhatsContactUs = 0; iwhatsContactUs < targetWhatsappContactUs.length; iwhatsContactUs++) {
        targetWhatsappContactUs[iwhatsContactUs].innerHTML = whatsappContactUs;
      }
    }
  });

  const lightbox = new GLightbox('.glightbox', {
    touchNavigation: true,
    loop: true
  });

  function switchList(element) {
    let listCard = document.getElementById("listCard");
    let listRow = document.getElementById("listRow");
    let iconCard = document.querySelector('.used-list-01__content__results__top__buttons__card');
    let iconList = document.querySelector('.used-list-01__content__results__top__buttons__list');

    if (listCard.offsetLeft > 0) {
      listCard.style.display = "none";
      listRow.style.display = "flex";
      iconCard.style.display = "flex";
      iconList.style.display = "none";
    } else if(listRow.offsetLeft > 0) {
      listCard.style.display = "flex";
      listRow.style.display = "none";
      iconCard.style.display = "none";
      iconList.style.display = "flex";
    }
  }

  let inputElem = document.querySelectorAll('[name="simular_financiamento"]');
  let cpfElement = document.querySelector('[name="cpf"]');
  let button = document.querySelector('.common__button')

  for (let i = 0; i < inputElem.length; i++) {
    inputElem[i].addEventListener('change', () => {

      let textbutton = inputElem[i].getAttribute('data-button')
      button.innerHTML = textbutton

      if (inputElem[i].value === 'Sim') {
        cpfElement.classList.remove("d-none");
      } else {
        cpfElement.classList.add("d-none");
      }

    });
  }

  let elementsMask = document.querySelectorAll('[mask]');

  for (let i = 0; i < elementsMask.length; i++) {
  let elementAttributeValueMask = elementsMask[i].getAttribute('mask')

  IMask(elementsMask[i], {
    mask: elementAttributeValueMask.replace('_', ' ')
  });
  }

  // pop-up de aviso de cookies
  const cookieStorage = {
    getItem: (item) => {
        const cookies = document.cookie
            .split(';')
            .map(cookie => cookie.split('='))
            .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});
        return cookies[item];
    },
    setItem: (item, value) => {
        document.cookie = `${item}=${value};`
    }
  }

  window.onload = () => {
    const consentPopup = document.getElementById('consent-popup');
    const acceptBtn = document.getElementById('accept');
    const storageType = cookieStorage;
    const consentPropertyName = 'cookie_consent';
    const shouldShowPopup = () => !storageType.getItem(consentPropertyName);
    const saveToStorage = () => storageType.setItem(consentPropertyName, true);
    const acceptFn = event => {
        saveToStorage(storageType);
        consentPopup.classList.add('hidden');
    }
    acceptBtn.addEventListener('click', acceptFn);

    if (shouldShowPopup(storageType)) {
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 2000);
    }
  };

  let showModalPhone = "";
  if(showModalPhone == true) {
    document.getElementById('modalPhone').addEventListener('show.bs.modal', function(event) {
      let buttonElement = document.getElementById(event.relatedTarget.id);
      let form = document.getElementById('formPhone');
      let phone = buttonElement.getAttribute('data-leadphone');
      let leadphoneId = buttonElement.getAttribute('data-leadphone-id');
      let formChildrens = form.elements;
      let link = document.getElementById("phone");

      for (var i = 0; i < formChildrens.length; i++) {
        let element = formChildrens[i];
        let name = element.getAttribute('name')

        link.href = 'tel:' + phone

        if (name === 'unidade') {
          element.value = leadphoneId
        }

      }
    });
  }
  // Parte para setar todos os links com o parametros passados pela url
  const funcMediasLinks = () => {
    const paramsFixed = ['m', 'ad', 'kw', 'mt', 'nw', 'dev', 'pm', 'tg', 'ap'];
    let params = location.search.substring(1) ||'';
    if (params == '=&') {
      params = '';
    }
    const objs = params.split('&') || '';
    if (objs[0] == '') objs.pop()
    const links = document.querySelectorAll('a[data-amp-replace]');
    const inputsMedia = document.querySelectorAll('input[name=media]');
    if (objs.length != 0 && links.length != 0){
      let response = '?'
      let count = 0;
      for (const obj of objs) {
        const key = obj.split('=')[0];
        const value = obj.split('=')[1];
        for (const pfKey of paramsFixed) {
          if (key === pfKey) {
              response += key+'='+value;
            if (count !== objs.length -1) {
              response+='&';
            }
            if (key === 'm') {
              for (const input of inputsMedia) {
                input.setAttribute('value',value)
              }
            }
          }
        }
        count++
      }

      for (const link of links ) {
        const responseClear = response.replace('?','&');

        const hashtagLink = link.href.split('#')[1];
        const hashtag = '#'+hashtagLink;
        const hashtagShow = (hashtagLink ? hashtag : '');

        const paramHref = link.href.split('?')[1];

        const linkClear = link.href.replace(hashtag,'')

        if (paramHref != '' && paramHref != undefined) {
          if (linkClear == window.location.href) {
            link.href = linkClear.replace(response,'') + response + hashtagShow;
          } else {
            link.href = linkClear + responseClear + hashtagShow;
          }
        } else {
          link.href = linkClear + response + hashtagShow;
        }
      }
    }
  }
  funcMediasLinks();