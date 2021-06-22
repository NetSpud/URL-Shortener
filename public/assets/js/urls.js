// eslint-disable-next-line no-undef
new gridjs.Grid({
  columns: [
    {
      name: "URL",
      // eslint-disable-next-line no-undef
      formatter: (cell) => gridjs.html(`${cell}`),
    },
    {
      name: "Slug",
      // eslint-disable-next-line no-undef
      formatter: (cell) => gridjs.html(`${cell}`),
    },
    {
      name: "Secret",
      // eslint-disable-next-line no-undef
      formatter: (cell) => gridjs.html(`${cell}`),
    },
  ],
  server: {
    url: "/all",
    then: (data) =>
      data.map((d) => [
        `<a href='${d.URL}' class='text-blue-500'>${d.URL}</a>`,
        `<a href='/url/${d.slug}' class='text-blue-500' target='_blank'>${d.slug}</a>`,
        `<span class="text-red-600">${d.secret}</span>`,
      ]),
  },
}).render(document.getElementById("table"));
