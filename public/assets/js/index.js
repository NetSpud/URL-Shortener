document.getElementById("createForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      slug: document.getElementById("slug").value.trim(),
      url: document.getElementById("url").value.trim(),
    }),
  };
  fetch("/create", options)
    .then((d) => d.json())
    .then((d) => {
      console.log(d);
      if (d.success) {
        const btn = document.getElementById("createBtn");
        if (btn.classList.contains("bg-blue-500")) {
          btn.classList.remove("bg-blue-500");
          if (!btn.classList.contains("bg-green-500")) {
            btn.classList.add("bg-green-500");
          }
        }
        btn.innerHTML = "URL Created Successfully!";
        setTimeout(() => {
          if (btn.classList.contains("bg-green-500")) {
            btn.classList.remove("bg-green-500");
            if (!btn.classList.contains("bg-blue-500")) {
              btn.classList.add("bg-blue-500");
            }
          }
          btn.innerHTML = "Create";
        }, 3000);
        document.getElementById("createForm").reset();
      }
    });
});
document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const options = {
    method: "DELETE",
    body: JSON.stringify({
      secret: document.getElementById("secret").value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch("/delete", options)
    .then((d) => d.json())
    .then((d) => {
      console.log(d);
      if (d.err) {
        document.getElementById("delResult").innerHTML = d.err;
      } else {
        document.getElementById("delResult").innerHTML = d.success;
      }
    });
});
