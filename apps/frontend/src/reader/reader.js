const urlParams = new URLSearchParams(window.location.search);
const bookFilename = urlParams.get('book');

if (!bookFilename) {
  document.body.innerHTML = '<h1>Error: No book specified.</h1>';
} else {
  const bookPath = `/api/read-book?file_key=${bookFilename}`;
  const book = ePub(bookPath, { 
    openAs: 'epub', // Ensure epub.js knows it's an EPUB
    // Add headers for authentication if needed, e.g.:
    // headers: { 'Authorization': `Bearer ${YOUR_AUTH_TOKEN}` }
  });
  const rendition = book.renderTo("viewer", {
    width: "100%",
    height: "100%",
  });
  rendition.display();

  // Existing code for font size, theme, navigation, and page info
  let fontSize = 100;
  document.getElementById("font-larger").onclick = () => {
    fontSize += 10;
    rendition.themes.fontSize(fontSize + "%");
  };
  document.getElementById("font-smaller").onclick = () => {
    fontSize -= 10;
    rendition.themes.fontSize(fontSize + "%");
  };

  let darkMode = false;
  document.getElementById("theme-toggle").onclick = () => {
    darkMode = !darkMode;
    rendition.themes.default({
      body: {
        background: darkMode ? "#111" : "#fdf6e3",
        color: darkMode ? "#eee" : "#333",
      },
    });
  };

  document.getElementById("next").onclick = () => rendition.next();
  document.getElementById("prev").onclick = () => rendition.prev();

  rendition.on("relocated", (location) => {
    const currentPage = location.start.displayed.page;
    const totalPages = location.start.displayed.total;
    document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    // Save current CFI to localStorage
    localStorage.setItem(`epub_reader_cfi_${bookFilename}`, location.start.cfi);
  });

  book.loaded.metadata.then(function(metadata) {
    document.getElementById("book-title").textContent = metadata.title;
  });

  // Table of Contents
  const tocToggle = document.getElementById("toc-toggle");
  const tocContainer = document.getElementById("toc-container");
  const tocList = document.getElementById("toc");

  tocToggle.onclick = () => {
    tocContainer.classList.toggle("open");
  };

  book.loaded.navigation.then(function(navigation) {
    navigation.toc.forEach(chapter => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = chapter.label;
      link.href = "#";
      link.onclick = (event) => {
        event.preventDefault();
        rendition.display(chapter.href);
        tocContainer.classList.remove("open"); // Close TOC after selection
      };
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
  });
}