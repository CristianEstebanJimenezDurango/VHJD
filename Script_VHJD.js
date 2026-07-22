function openProjectModal(title, abstract, results, linkUrl = null, instagramUrl = null, twitterUrl = null, downloadUrl = null) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalAbstract = document.getElementById('modalAbstract');
    const modalResults = document.getElementById('modalResults');

    modalTitle.innerText = title;
    modalAbstract.innerText = abstract;
    modalResults.innerText = results;

    // Handle optional buttons
    const linkBtn = document.getElementById('modalLinkBtn');
    const instagramBtn = document.getElementById('modalInstagramBtn');
    const twitterBtn = document.getElementById('modalTwitterBtn');
    const downloadBtn = document.getElementById('modalDownloadBtn');

    // Show/hide and set URLs for each button
    if (linkUrl) {
        linkBtn.href = linkUrl;
        linkBtn.style.display = 'inline-flex';
    } else {
        linkBtn.style.display = 'none';
    }

    if (instagramUrl) {
        instagramBtn.href = instagramUrl;
        instagramBtn.style.display = 'inline-flex';
    } else {
        instagramBtn.style.display = 'none';
    }

    if (twitterUrl) {
        twitterBtn.href = twitterUrl;
        twitterBtn.style.display = 'inline-flex';
    } else {
        twitterBtn.style.display = 'none';
    }

    if (downloadUrl) {
        downloadBtn.href = downloadUrl;
        downloadBtn.style.display = 'inline-flex';
    } else {
        downloadBtn.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openAcademicModal(title, thesis, abstract, link, multimedia) {
    const modal = document.getElementById('academicModal');
    const modalTitle = document.getElementById('academicModalTitle');
    const modalThesis = document.getElementById('academicModalThesis');
    const modalAbstract = document.getElementById('academicModalAbstract');
    const modalLink = document.getElementById('academicModalLink');
    const modalMedia = document.getElementById('academicModalMedia');

    modalTitle.innerText = title;
    modalThesis.innerText = thesis;
    modalAbstract.innerText = abstract;

    if (link) {
        modalLink.href = link;
        modalLink.style.display = 'inline-block';
    } else {
        modalLink.style.display = 'none';
    }

    if (multimedia) {
        modalMedia.innerHTML = multimedia;
        modalMedia.style.display = 'block';
    } else {
        modalMedia.innerHTML = '';
        modalMedia.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAcademicModal() {
    document.getElementById('academicModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openVideoModal(videoUrl, title) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('videoModalTitle');
    const modalVideo = document.getElementById('modalVideoFrame');

    modalTitle.innerText = title;
    // For auto-play, add autoplay=1 to URL if needed
    modalVideo.src = videoUrl + (videoUrl.includes('?') ? '&' : '?') + "autoplay=1";

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideoFrame');
    
    modal.style.display = 'none';
    modalVideo.src = ""; // Stop the video
    document.body.style.overflow = 'auto';
}

window.onclick = function (event) {
    const pModal = document.getElementById('projectModal');
    const aModal = document.getElementById('academicModal');
    const vModal = document.getElementById('videoModal');
    if (event.target == pModal) closeProjectModal();
    if (event.target == aModal) closeAcademicModal();
    if (event.target == vModal) closeVideoModal();
}

// Callback function for JSONP to handle blog data
window.renderBlogData = function (data) {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    const entries = data.feed.entry || [];
    container.innerHTML = ''; // Clear loading state

    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No se encontraron entradas recientes.</p>';
        return;
    }

    entries.forEach(entry => {
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const published = new Date(entry.published.$t).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const summary = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : '');

        // Clean up html tags from summary and format naturally
        const cleanSummary = summary.replace(/<[^>]*>/g, '').substring(0, 200).trim() + '...';

        const article = document.createElement('article');
        article.className = 'blog-entry';
        article.innerHTML = `
            <span class="blog-date">${published}</span>
            <h2>${title}</h2>
            <p>${cleanSummary}</p>
            <a href="${link}" target="_blank" class="blog-link">Leer más <i class="fa-solid fa-arrow-right"></i></a>
        `;
        container.appendChild(article);
    });
};

function loadLatestBlogPosts() {
    const blogUrl = 'https://utopiasyheterotopiasurbanas.blogspot.com/feeds/posts/default?alt=json-in-script&callback=renderBlogData&max-results=5';

    // Create script element for JSONP to bypass CORS
    const script = document.createElement('script');
    script.src = blogUrl;
    script.onerror = function () {
        const container = document.getElementById('blog-posts-container');
        if (container) {
            container.innerHTML = '<p style="text-align:center; color:red;">Error al cargar las entradas del blog. Por favor, intenta más tarde.</p>';
        }
    };
    document.body.appendChild(script);
}

// Ensure the menu toggle works as well
function toggleMenu() {
    var links = document.getElementById("nav-links");
    if (links) links.classList.toggle("active");
}

// Auto-load if on blog page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog-posts-container')) {
        loadLatestBlogPosts();
    }
});

