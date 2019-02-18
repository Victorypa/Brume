let nav = document.getElementById('navigation')

let menu = document.getElementById('menu')

                    menu.addEventListener('click', () => {
                    nav.classList.toggle("show");
                    menu.classList.toggle("show");
                  })


function openTab(evt, TabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("portfolio__link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(TabName).style.display = "block";
  evt.currentTarget.className += " active";
}


document.getElementById("defaultOpen").click();
