document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;

    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // --- Routing & Content Logic ---
    const contentArea = document.getElementById('content-area');
    const disqusContainer = document.getElementById('disqus_container');
    const navLinks = document.querySelectorAll('#main-nav a, .contact-link, header h1 a');

    const routes = {
        'home': {
            title: '익하이브',
            description: '사장남천동 팬들을 위한 커뮤니티 공간입니다. 원하는 게시판을 선택해 보세요!',
            showDisqus: false
        },
        'free-board': { title: '자유게시판', description: '자유롭게 이야기를 나누는 공간입니다.', showDisqus: true },
        'map': { title: '익현이지도', description: '사장남천동의 발자취를 따라가는 지도 게시판입니다.', showDisqus: true },
        'archive': { title: '자료실', description: '다양한 자료를 공유하는 공간입니다.', showDisqus: true },
        'president': { title: '미래대통령', description: '미래를 논하는 진지한 토론장입니다.', showDisqus: true },
        'hellmouth': { title: '헬마우스', description: '뜨거운 이슈를 다루는 게시판입니다.', showDisqus: true },
        'general': { title: '묘장군', description: '묘장군님과 관련된 이야기를 나누는 곳입니다.', showDisqus: true },
        'nothing': { title: '거없', description: '거없님과 관련된 게시판입니다.', showDisqus: true },
        'contact': {
            title: '제휴 문의',
            description: '익하이브와 함께할 파트너를 찾습니다.',
            showDisqus: false,
            template: `
                <section id="contact">
                    <form id="contact-form" action="https://formspree.io/f/mvzwkpza" method="POST">
                        <div class="form-group">
                            <label for="name">이름/기업명</label>
                            <input type="text" id="name" name="name" required placeholder="홍길동">
                        </div>
                        <div class="form-group">
                            <label for="email">이메일 주소</label>
                            <input type="email" id="email" name="email" required placeholder="example@email.com">
                        </div>
                        <div class="form-group">
                            <label for="message">문의 내용</label>
                            <textarea id="message" name="message" required placeholder="제휴 제안 내용을 상세히 입력해 주세요."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">문의하기</button>
                    </form>
                </section>
            `
        }
    };

    function handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const route = routes[hash] || routes['home'];

        // Update Nav Active State
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
        });

        // Update Content
        contentArea.innerHTML = `
            <div class="board-header">
                <h2>${route.title}</h2>
                <p>${route.description}</p>
            </div>
            ${route.template || ''}
        `;

        // Handle Disqus
        if (route.showDisqus) {
            disqusContainer.style.display = 'block';
            resetDisqus(hash, route.title);
        } else {
            disqusContainer.style.display = 'none';
        }

        window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial call

    // --- Disqus Integration ---
    function resetDisqus(identifier, title) {
        const disqus_shortname = 'ikhive'; // 본인의 Disqus shortname으로 변경하세요.
        
        if (typeof DISQUS !== 'undefined') {
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = identifier;
                    this.page.url = window.location.origin + '/#!' + identifier;
                    this.page.title = title;
                    this.language = 'ko';
                }
            });
        } else {
            // Initial Load
            window.disqus_config = function () {
                this.page.identifier = identifier;
                this.page.url = window.location.origin + '/#!' + identifier;
                this.page.title = title;
                this.language = 'ko';
            };
            const d = document, s = d.createElement('script');
            s.src = `https://${disqus_shortname}.disqus.com/embed.js`;
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    }
});
