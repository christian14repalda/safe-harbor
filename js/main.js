/* Safe Harbor — shared scripts.
   Nothing on this site saves or sends anything the visitor does. */
(function () {
  "use strict";

  /* ---------- Quick exit ---------- */
  var EXIT_URL = "https://www.google.com/";

  function leaveSite() {
    // replace() swaps this page out of the tab's history so Back does not return here
    window.location.replace(EXIT_URL);
  }

  var leaveButtons = document.querySelectorAll("[data-leave]");
  for (var i = 0; i < leaveButtons.length; i++) {
    leaveButtons[i].addEventListener("click", leaveSite);
  }

  // Press Escape twice quickly to leave
  var lastEsc = 0;
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var now = Date.now();
      if (now - lastEsc < 800) { leaveSite(); }
      lastEsc = now;
    }
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Tabs (Legal Protection page) ---------- */
  var tabGroups = document.querySelectorAll(".tabs");
  Array.prototype.forEach.call(tabGroups, function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    var panels = group.querySelectorAll('[role="tabpanel"]');

    function select(index, focus) {
      Array.prototype.forEach.call(tabs, function (t, n) {
        var on = n === index;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        panels[n].hidden = !on;
        if (on && focus) { t.focus(); }
      });
    }

    Array.prototype.forEach.call(tabs, function (t, n) {
      t.addEventListener("click", function () { select(n, false); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { select((n + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft") { select((n - 1 + tabs.length) % tabs.length, true); }
      });
    });
    select(0, false);
  });

  /* ---------- Directory filter (Get Help page) ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var entries = document.querySelectorAll(".directory li[data-type]");
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      Array.prototype.forEach.call(chips, function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      Array.prototype.forEach.call(entries, function (li) {
        var types = li.getAttribute("data-type").split(" ");
        li.hidden = !(f === "all" || types.indexOf(f) !== -1);
      });
    });
  });

  /* ---------- Warning-signs self-check (nothing is stored) ---------- */
  var form = document.getElementById("signs-form");
  var result = document.getElementById("result");
  if (form && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var boxes = form.querySelectorAll('input[type="checkbox"]:checked');
      var total = boxes.length;
      var danger = form.querySelectorAll('input[data-danger]:checked').length;
      var html = "";

      if (total === 0) {
        html = '<div class="note calm"><h3>You did not select anything.</h3>' +
          "<p>This list is short, and it cannot cover every situation. If something in your relationship still feels wrong, " +
          "that feeling is worth listening to. You can read about the different forms of abuse on the " +
          '<a href="understanding.html">Understanding VAWC</a> page, or talk to someone you trust.</p></div>';
      } else {
        html = '<div class="note calm"><h3>You selected ' + total + (total === 1 ? " sign." : " signs.") + "</h3>" +
          "<p>This is not a diagnosis, and no tool can tell you what is happening in your life. But these are behaviors that the " +
          "law and support workers treat as serious. What you are feeling is real, and none of it is your fault.</p>" +
          '<p>Next steps you can take: read <a href="get-help.html">Where to Get Help</a>, ' +
          'or learn about <a href="legal-protection.html">protection orders</a>.</p></div>';
        if (danger > 0) {
          html += '<div class="note alert"><h3>Some of these signs involve physical danger.</h3>' +
            "<p>If you or your children are in immediate danger, call <strong>911</strong> (National Emergency Hotline). " +
            "If it is not safe to talk, you can still stay on the line.</p></div>";
        }
      }
      result.innerHTML = html;
      result.setAttribute("tabindex", "-1");
      result.focus();
    });

    form.addEventListener("reset", function () {
      result.innerHTML = "";
    });
  }
})();
