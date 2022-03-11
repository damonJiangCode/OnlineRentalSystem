


(function () {
  class Menu {
    init = () => {
      this.getMenuElementsAndAddEvents()
      this.getMenuElementsAndAddEventsByDataAttrs()
      return this;
    };

    getMenuElementsAndAddEventsByDataAttrs = () => {
      const allHeaders = teleport.getAllElementsByDataAttribute('role', 'Header')

      if (!allHeaders.length) {
        teleport.log("No teleport Headers found in your project")
      }

      allHeaders.forEach(header => {
        const burgerBtn = teleport.getElByDataAttribute('type', 'BurgerMenu', header)
        const mobileMenu = teleport.getElByDataAttribute('type', 'MobileMenu', header)
        const closeBtn = teleport.getElByDataAttribute('type', 'CloseMobileMenu', header)

        burgerBtn.addEventListener('click', () => {
          mobileMenu.classList.add('teleport-show')
        })

        closeBtn.addEventListener('click', () => {
          mobileMenu.classList.remove('teleport-show')
        })
      })

    }

    getMenuElementsAndAddEvents = () => {
      const menuElements = teleport.getAllElByClass(
        "teleport-menu-burger"
      )

      if (!menuElements.length) {
        teleport.log("No teleport-menu-burger items found");
        return;
      }

      menuElements.forEach((burgerMenuElement) => {
        const mobileMenuElement =
          burgerMenuElement.nextElementSibling?.className.includes(
            "teleport-menu-mobile"
          )
            ? (burgerMenuElement.nextElementSibling)
            : null;
        if (!mobileMenuElement) {
          teleport.error(
            `${burgerMenuElement} has no corresponding element with class 'teleport-menu-mobile' as the next sibling.`
          );
          return;
        }

        const closeMenuElement = mobileMenuElement.querySelector(
          '*[class*="teleport-menu-close"]'
        );
        if (!closeMenuElement) {
          teleport.error(
            `${mobileMenuElement} has no child element with class 'teleport-menu-close'`
          );
          return;
        }

        burgerMenuElement.addEventListener("click", () => {
          mobileMenuElement.classList.add("teleport-show");
        });
        closeMenuElement.addEventListener("click", () => {
          mobileMenuElement.classList.remove("teleport-show");
        });
      });
    };
  }

  class Accordion {
    init = () => {
      this.getAccordionElementsAndAddEvents()
    }

    getAccordionElementsAndAddEvents = () => {
      const allAccordions = teleport.getAllElementsByDataAttribute('role', 'Accordion')

      if (!allAccordions.length) {
        teleport.log("No teleport Accordions found in project")
      }

      allAccordions.forEach(accordion => {
        const accordionHeader = teleport.getElByDataAttribute('type', 'AccordionHeader', accordion)
        const accordionContent = teleport.getElByDataAttribute('type', 'AccordionContent', accordion)

        accordionHeader.addEventListener('click', () => {
          accordionContent.style.maxHeight ?
            accordionContent.style.maxHeight = "" :
            accordionContent.style.maxHeight = `${accordionContent.scrollHeight}px`
        })
      })
    }
  }

  const listenForUrlChanges = () => {
    let url = location.href;
    document.body.addEventListener('click', () => {
      requestAnimationFrame(() => {
        if (url !== location.href) {
          new Menu().init()
          new Accordion().init()
          url = location.href
        }
      });
    }, true);
  }

  const teleport = {
    debug: false,
    log: (msg, obj) => {
      if (teleport.debug) {
        console.log("teleport: " + msg, obj || "");
      }
    },
    error: (msg, object) => {
      console.error("teleport-error: " + msg, object);
    },
    getElByClass: (className) => {
      const el = document.querySelector(`*[class*="${className}"]`);
      if (!el) {
        teleport.log(`did not find element with "${className}" class`);
      }
      return el;
    },
    getElByDataAttribute: (attribute, value, scope = document) => {
      const el = scope.querySelector(`[data-${attribute}="${value}"]`)
      if (!el) {
        teleport.log(`did not find element with "data-${attribute}=${value}"`)
      }
      return el
    },
    getAllElByClass: (className) => {
      const elements = document.querySelectorAll(`*[class*="${className}"]`);
      if (!elements) {
        teleport.log(`did not find any elements with "${className}" class`);
      }
      return elements;
    },
    getAllElementsByDataAttribute: (attribute, value, scope = document) => {
      const elements = scope.querySelectorAll(`[data-${attribute}="${value}"]`)
      if (!elements) {
        teleport.log(`did not find any elements with "data-${attribute}=${value}"`);
      }
      return elements
    },
    Menu,
    Accordion,
  }

  listenForUrlChanges()

  new Menu().init()
  new Accordion().init()
})()


// insert into table --  function
function postRoom() {
  var http = new XMLHttpRequest();
  var post_url = '/postRoom';
  var params = 'name=' + document.getElementById('room_name').value +
          '&desc=' + document.getElementById('room_desc').value + 
          '&address=' + document.getElementsById('room_address').value +
          '&image=' + document.getElementById('myFile').value +
          '&price=' + document.getElementsById('room_price').value +
          '&pet=' + document.getElementById('pet').checked +
          '&disableAccess=' + document.getElementById('Disable').checked +
          '&wifi=' + document.getElementById('Wifi').checked +
          '&pool=' + document.getElementById('Pool').checked +
          '&spa=' + document.getElementById('Spa').checked +
          '&parking=' + document.getElementById('Parking').checked +
          '&gym=' + document.getElementById('Gym').checked +
          '&ac=' + document.getElementById('AC').checked +
          '&food=' + document.getElementById('Food').checked +
          '&bar=' + document.getElementById('Bar').checked +
          '&laundry=' + document.getElementById('Laundry').checked;
  http.open('POST', post_url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.send(params);
  console.log("params");
}
