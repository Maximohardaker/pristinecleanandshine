// Mobile menu
var toggle = document.querySelector(".nav-toggle");
var nav = document.querySelector(".site-nav");

if (toggle && nav) {
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
}

// Quote form: GitHub Pages cannot process forms, so post to Formspree if the form has an ID in
// data-formspree-id. Otherwise open the visitor's email app with the enquiry filled in.
var form = document.querySelector(".quote-form");

if (form) {
  var formspreeId = form.getAttribute("data-formspree-id");
  var note = document.querySelector(".form-note");
  var sent = document.querySelector(".form-sent");
  var failed = document.querySelector(".form-failed");
  var submit = form.querySelector("button[type='submit']");

  if (formspreeId) {
    note.hidden = true;
  }

  function show(message) {
    sent.hidden = message !== sent;
    failed.hidden = message !== failed;
    message.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(form);

    if (formspreeId) {
      submit.disabled = true;
      fetch("https://formspree.io/f/" + formspreeId, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("Formspree returned " + response.status);
        }
        form.reset();
        show(sent);
      }).catch(function () {
        show(failed);
      }).then(function () {
        submit.disabled = false;
      });
      return;
    }

    var value = function (name) {
      return String(data.get(name) || "").trim() || "Not given";
    };

    var body = [
      "Name: " + value("name"),
      "Organisation: " + value("organisation"),
      "Email: " + value("email"),
      "Phone: " + value("phone"),
      "Type of premises: " + value("premises"),
      "Location: " + value("location"),
      "How often: " + value("frequency"),
      "",
      "Message:",
      value("message")
    ].join("\r\n");

    var who = data.get("organisation") ? value("organisation") : value("name");
    var subject = "Quote request from " + who;

    window.location.href =
      "mailto:info@pristinecleanandshine.co.uk" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    // Not every visitor has an email app set up, so always show them the address as a fallback.
    var status = document.querySelector(".form-opened");
    status.hidden = false;
    status.focus();
  });
}
