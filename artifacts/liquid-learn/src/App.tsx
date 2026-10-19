import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Leaf, Mail, Menu, Search, Share2, X } from 'lucide-react';
import { articles, getArticle, getTopic, topics, type Article } from './content';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function usePageMeta(title: string, description: string) {
  const [location] = useLocation();
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${window.location.origin}${window.location.pathname}`);
    setMeta('property', 'og:type', window.location.pathname.includes('/articles/') ? 'article' : 'website');
    setMeta('property', 'og:image', `${window.location.origin}${import.meta.env.BASE_URL}og-image.svg`);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${window.location.origin}${import.meta.env.BASE_URL}og-image.svg`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;
  }, [description, location, title]);
}

function Brand() {
  return (
    <Link href="/" className="brand" data-testid="link-home-brand" aria-label="Liquid Learn Protocol home">
      <span className="brand-mark" aria-hidden="true">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path d="M3.8 13.2c3.7-7.8 7.2 7.8 11 0s6.4 0 6.4 0" stroke="#F5F2E8" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4.2 17.4c3.2-5.5 6.4 5.5 9.8 0s5.9 0 6.8 0" stroke="#E99A7A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-name">LIQUID LEARN<span>PROTOCOL · BY SELVARANI S</span></span>
    </Link>
  );
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/topics', label: 'Topics' },
    { href: '/articles', label: 'All lessons' },
    { href: '/publisher', label: 'About' },
  ];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Brand />
        <button className="mobile-menu" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link${location === item.href || (item.href === '/articles' && location.startsWith('/articles/')) || (item.href === '/topics' && location.startsWith('/topics/')) ? ' active' : ''}`} onClick={() => setOpen(false)} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/articles" className="nav-cta" onClick={() => setOpen(false)} data-testid="link-nav-start-reading">Start learning <ArrowRight size={14} /></Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="page-wrap">
        <div className="footer-main">
          <div><Brand /><p className="footer-note">A little more understanding, one useful idea at a time.</p></div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/topics" data-testid="link-footer-topics">Topics</Link>
            <Link href="/articles" data-testid="link-footer-articles">All lessons</Link>
            <Link href="/publisher" data-testid="link-footer-publisher">Publisher</Link>
            <Link href="/privacy" data-testid="link-footer-privacy">Privacy</Link>
          </nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Selvarani S · Liquid Learn Protocol</span><span>Independent learning publication</span></div>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header /><main>{children}</main><Footer /></div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

function ArticleCard({ article }: { article: Article }) {
  const topic = getTopic(article.topicSlug);
  return (
    <Link href={`/articles/${article.slug}`} className="article-card" data-testid={`card-article-${article.slug}`}>
      <div className="article-tag"><span>{topic?.name}</span><span>{article.level}</span></div>
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <div className="article-meta"><span>{article.readMinutes} min read</span><span>{new Date(`${article.publishedAt}T12:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
    </Link>
  );
}

function Home() {
  usePageMeta(
    'Beginner AI Lessons, Plainly Explained | Liquid Learn',
    'Free, plain-language AI lessons for complete beginners. Understand the basics, try everyday tools, write clearer prompts, and use AI safely in daily life.',
  );
  const featured = articles[0];
  const latest = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).filter((article) => article.slug !== featured.slug).slice(0, 4);
  return (
    <Layout>
      <section className="hero-home">
        <div className="page-wrap hero-grid">
          <div className="fade-up">
            <Eyebrow>A calmer way to meet AI</Eyebrow>
            <h1 className="hero-title">A little less mystery.<br /><em>A lot more useful.</em></h1>
            <p className="hero-copy">Plainspoken lessons for people who want to understand AI—and decide how it fits into real life. No jargon. No hype. Just a good place to begin.</p>
            <div className="hero-actions">
              <Link href="/topics" className="button-primary" data-testid="link-explore-topics">Explore the topics <ArrowRight size={15} /></Link>
              <Link href="/articles" className="button-outline" data-testid="link-browse-lessons">Browse all lessons</Link>
            </div>
            <div className="hero-note"><span className="note-dot"><Leaf size={13} /></span>Independent, free to read, and made for curious beginners.</div>
          </div>
          <div className="hero-art fade-up delay-2" aria-label="Abstract illustration of flowing ideas">
            <div className="orbit-art">
              <div className="orbit-ring" /><div className="orbit-ring inner" />
              <span className="art-label label-one">people + patterns</span>
              <span className="art-label label-two">curiosity</span>
              <span className="art-label label-three">everyday life</span>
              <div className="art-core"><span className="art-center">AI</span></div>
            </div>
            <div className="hero-small-card"><small>Start here</small><strong>One useful idea<br />at a time.</strong></div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="page-wrap">
          <div className="section-heading">
            <div><Eyebrow>Your first good question</Eyebrow><h2 className="section-title">Begin with the basics.</h2></div>
            <p className="section-lead">AI is easier to live with when you know what it can do, where it can stumble, and how to ask for help.</p>
          </div>
          <div className="featured-grid">
            <Link href={`/articles/${featured.slug}`} className="feature-card" data-testid={`link-featured-${featured.slug}`}>
              <div className="feature-overline"><span />Featured lesson · {getTopic(featured.topicSlug)?.name}</div>
              <div><h3>{featured.title}</h3><p>{featured.excerpt}</p></div>
              <div className="feature-meta"><span>{featured.readMinutes} minute read · Beginner</span><span className="feature-link"><ArrowRight size={15} /></span></div>
            </Link>
            <div className="latest-list" aria-label="Latest lessons">
              {latest.map((article, index) => (
                <Link key={article.slug} className="latest-row" href={`/articles/${article.slug}`} data-testid={`link-latest-${article.slug}`}>
                  <span className="row-index">0{index + 1}</span>
                  <span><strong>{article.title}</strong><small>{getTopic(article.topicSlug)?.name} · {article.readMinutes} min read</small></span>
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wrap">
          <div className="section-heading">
            <div><Eyebrow>Choose your own starting point</Eyebrow><h2 className="section-title">Four paths into AI.</h2></div>
            <Link href="/topics" className="button-outline" data-testid="link-all-topics">See all topics <ArrowRight size={14} /></Link>
          </div>
          <div className="category-grid">
            {topics.map((topic, index) => (
              <Link key={topic.slug} href={`/topics/${topic.slug}`} className="category-card" data-testid={`card-topic-${topic.slug}`}>
                <span className="category-num">0{index + 1} / TOPIC</span>
                <strong>{topic.name}</strong><p>{topic.summary}</p><ArrowRight className="category-arrow" size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="page-wrap trust-inner"><div className="trust-quote">“Understanding is a better starting point than either fear or hype.”</div><span className="trust-meta">A publication by Selvarani S</span></div>
      </div>
    </Layout>
  );
}

function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <div className="page-wrap page-hero"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{children}</p></div>;
}

function TopicsPage() {
  usePageMeta(
    'AI Learning Topics for Beginners | Liquid Learn',
    'Explore beginner AI topics, from how artificial intelligence works to everyday tools, prompt writing, safety, and common myths. Start with the question that brought you here.',
  );
  return (
    <Layout>
      <PageIntro eyebrow="The learning map" title="Topics, not tech-speak.">Four friendly paths through the questions people actually have about AI. Start anywhere; each lesson is written for a first-time reader.</PageIntro>
      <section className="page-wrap topics-grid">
        {topics.map((topic, index) => {
          const count = articles.filter((article) => article.topicSlug === topic.slug).length;
          return <Link href={`/topics/${topic.slug}`} key={topic.slug} className="topic-large" data-testid={`card-topic-index-${topic.slug}`}>
            <div className="topic-number"><span>0{index + 1} — Learning path</span><span>{count} lessons</span></div>
            <h2>{topic.name}</h2><p>{topic.summary}</p>
            <div className="topic-bottom"><span>Start with the essentials</span><ArrowRight size={17} /></div>
          </Link>;
        })}
      </section>
    </Layout>
  );
}

function TopicPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const topic = getTopic(slug);
  usePageMeta(
    topic ? `${topic.name}: Beginner Lessons | Liquid Learn` : 'AI Topic Not Found | Liquid Learn',
    topic ? `${topic.summary} Read free, practical guides for beginners and explore the topic at your own pace.` : 'This AI topic could not be found. Browse the full Liquid Learn Protocol library for free beginner lessons.',
  );
  const topicArticles = articles.filter((article) => article.topicSlug === slug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (!topic) return <NotFound />;
  return (
    <Layout>
      <PageIntro eyebrow="Learning path" title={topic.name}>{topic.summary}</PageIntro>
      <section className="page-wrap">
        <p className="result-count">{topicArticles.length} lessons · Written for a curious beginner</p>
        {topicArticles.length ? <div className="article-grid">{topicArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <EmptyState title="A new lesson is on its way" text="There are no lessons in this topic just yet. Browse the full library to keep exploring." />}
      </section>
    </Layout>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><BookOpen size={22} color="#d17c60" /><h2>{title}</h2><p>{text}</p><Link href="/articles" className="button-outline" data-testid="link-empty-browse">Browse all lessons <ArrowRight size={14} /></Link></div>;
}

function LibraryPage() {
  usePageMeta(
    'Free AI Lessons for Beginners | Liquid Learn Protocol',
    'Search practical, free AI guides for beginners. Filter by topic or level and find clear answers on tools, prompts, AI basics, and safety.',
  );
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).filter((article) => {
      const matchesQuery = !query || `${article.title} ${article.excerpt} ${getTopic(article.topicSlug)?.name}`.toLowerCase().includes(query);
      return matchesQuery && (selectedTopic === 'all' || article.topicSlug === selectedTopic) && (selectedLevel === 'all' || article.level === selectedLevel);
    });
  }, [search, selectedTopic, selectedLevel]);
  const clearFilters = () => { setSearch(''); setSelectedTopic('all'); setSelectedLevel('all'); };
  return (
    <Layout>
      <PageIntro eyebrow="The lesson library" title="Find a place to begin.">Search the library, choose a topic, or take a short detour into something new. Every lesson is free to read.</PageIntro>
      <section className="page-wrap">
        <div className="library-tools">
          <label className="search-box"><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search lessons or ideas…" aria-label="Search lessons" data-testid="input-search-articles" /></label>
          <select className="filter-select" value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} aria-label="Filter by topic" data-testid="select-filter-topic">
            <option value="all">Every topic</option>{topics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.name}</option>)}
          </select>
          <select className="filter-select" value={selectedLevel} onChange={(event) => setSelectedLevel(event.target.value)} aria-label="Filter by level" data-testid="select-filter-level">
            <option value="all">Every level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
        </div>
        <p className="result-count" data-testid="text-result-count">{results.length} {results.length === 1 ? 'lesson' : 'lessons'} to explore</p>
        {results.length ? <div className="article-grid">{results.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <div data-testid="status-no-results"><EmptyState title="No lessons found—yet." text="Try another search, or clear your filters to see the whole library." /><div style={{ textAlign: 'center', marginTop: '-76px', paddingBottom: '70px' }}><button onClick={clearFilters} className="button-primary" type="button" data-testid="button-clear-filters">Clear filters <X size={14} /></button></div></div>}
      </section>
    </Layout>
  );
}

function ArticleContent({ body }: { body: string }) {
  const blocks = body.split('\n\n');
  return <div className="article-body">{blocks.map((block, index) => {
    if (block.startsWith('## ')) return <h2 key={index}>{block.slice(3)}</h2>;
    if (block.startsWith('> ')) return <blockquote key={index}>{block.slice(2)}</blockquote>;
    if (block.split('\n').every((line) => line.startsWith('- '))) return <ul key={index}>{block.split('\n').map((line, itemIndex) => <li key={itemIndex}>{line.slice(2)}</li>)}</ul>;
    return <p key={index}>{block.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => part.startsWith('**') && part.endsWith('**') ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : part)}</p>;
  })}</div>;
}

function ArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = getArticle(slug);
  usePageMeta(
    article ? `${article.title} | Liquid Learn Protocol` : 'AI Lesson Not Found | Liquid Learn Protocol',
    article ? article.excerpt : 'This lesson could not be found. Browse the Liquid Learn Protocol library for free, plain-language AI guides.',
  );
  const [copied, setCopied] = useState(false);
  if (!article) return <NotFound />;
  const topic = getTopic(article.topicSlug);
  const related = articles.filter((item) => item.topicSlug === article.topicSlug && item.slug !== article.slug).slice(0, 2);
  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  const formattedDate = new Date(`${article.publishedAt}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <Layout>
      <div className="page-wrap article-page">
        <article className="article-main">
          <Link href={`/topics/${article.topicSlug}`} className="back-link" data-testid="link-back-topic"><ArrowLeft size={14} /> Back to {topic?.name}</Link>
          <div className="article-kicker">{topic?.name} <span style={{ color: '#a5b0a8' }}> / </span> {article.level}</div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-deck">{article.excerpt}</p>
          <div className="article-byline"><span className="author-avatar">S</span><span><span className="byline-name">Selvarani S</span>Published {formattedDate}</span><span><Clock3 size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />{article.readMinutes} min read</span></div>
          <ArticleContent body={article.body} />
          <div className="related-block"><h3>Keep following your curiosity.</h3>{related.map((item) => <Link className="related-link" key={item.slug} href={`/articles/${item.slug}`} data-testid={`link-related-${item.slug}`}>{item.title} <ArrowRight size={14} /></Link>)}</div>
        </article>
        <aside className="article-sidebar">
          <div className="sidebar-note"><span className="small-label">A note for the reader</span><strong>Take what helps. Check what matters.</strong>This is a learning resource, not professional advice. Use your own judgment, especially when the stakes are high.</div>
          <button className="button-outline share-button" type="button" onClick={share} data-testid="button-share-article">{copied ? <Check size={14} /> : <Share2 size={14} />}{copied ? 'Link copied' : 'Copy article link'}</button>
        </aside>
      </div>
    </Layout>
  );
}

function PublisherPage() {
  usePageMeta(
    'About the Publisher | Liquid Learn Protocol',
    'Meet Selvarani S, publisher of Liquid Learn Protocol, an independent and free AI learning publication for curious beginners.',
  );
  return (
    <Layout>
      <PageIntro eyebrow="The person behind the pages" title="Curiosity, made practical.">Liquid Learn Protocol is an independent publication for people meeting AI on their own terms: with questions, common sense, and no technical background required.</PageIntro>
      <section className="page-wrap publisher-layout">
        <div className="publisher-text">
          <p>AI is arriving in ordinary places: in the tools we use to write, plan, search, and learn. The explanations around it can make it feel either intimidating or impossibly capable. Neither is a useful place to start.</p>
          <p>Liquid Learn Protocol exists to make the subject easier to approach. Lessons use plain language, everyday examples, and a healthy respect for what we still need to check.</p>
          <h2>Published by Selvarani S</h2>
          <p>This is a small, reader-first learning publication. Its aim is not to sell a tool or convince you to adopt AI. It is to help you understand enough to make your own choices.</p>
          <p>Every lesson is written to welcome a beginner. If a term is unfamiliar, the explanation should meet you where you are—not make you feel behind.</p>
          <h2>Get in touch</h2>
          <p>Questions, thoughtful corrections, or a topic you would like to see explained? A note is always welcome.</p>
        </div>
        <aside className="publisher-card">
          <Eyebrow>A note from the publisher</Eyebrow>
          <div className="serif">“A little understanding can make a new tool feel a lot more human.”</div>
          <p>Written and published by Selvarani S. Independent, open to everyone, and always free to read.</p>
          <a className="email-link" href="mailto:Celeste.Celonix@gmail.com" data-testid="link-contact-email"><Mail size={14} /> Celeste.Celonix@gmail.com</a>
        </aside>
      </section>
    </Layout>
  );
}

function PrivacyPage() {
  usePageMeta(
    'Privacy Policy | Liquid Learn Protocol',
    'Read how Liquid Learn Protocol handles privacy, cookies, analytics, third-party services, content rights, and reader contact information.',
  );
  return (
    <Layout>
      <PageIntro eyebrow="Clear and simple" title="Privacy, in plain language.">This policy explains what happens when you visit Liquid Learn Protocol. The short version: this is a public, read-only publication, and it does not ask you to make an account.</PageIntro>
      <article className="page-wrap policy">
        <p className="policy-intro"><strong>Last updated: October 2026.</strong> This policy is written for readers, not lawyers. It describes the publication as it is currently provided. If anything changes in a meaningful way, this page should be updated.</p>
        <section className="policy-section"><h2>1. Information this site collects</h2><p>You can read the lessons without registering, signing in, or submitting a form. The site does not ask for your name, email address, payment details, or profile information. It has no comments, member area, or newsletter sign-up.</p><p>Like most websites, the service that hosts the site may process basic technical information when a page is requested—for example, an IP address, browser type, or the time of a request. This information is handled by the hosting provider to deliver and protect the site. The publisher does not use it to identify readers or build reader profiles.</p></section>
        <section className="policy-section"><h2>2. Information this site does not collect</h2><p>This publication does not operate an account system, collect submitted prompts, or store personal reading histories. Search and topic filters work in your browser against the bundled lesson content. Your search terms are not sent to a publication database.</p><p>The site does not sell personal information, run advertising profiles, or use your visit to make decisions about you.</p></section>
        <section className="policy-section"><h2>3. Cookies and analytics</h2><p>The publication does not intentionally set advertising or tracking cookies and does not currently use a third-party analytics product to follow individual readers. Your browser or the hosting infrastructure may use essential technical mechanisms needed to serve the pages securely and reliably.</p><p>You can manage cookies through your browser settings. Blocking essential browser storage or network features may affect how some websites work, but this publication has no sign-in or saved preferences that depend on cookies.</p></section>
        <section className="policy-section"><h2>4. Third-party services</h2><p>The pages are delivered through a hosting provider, which necessarily receives requests when you open the site. The site may load typefaces from Google Fonts; if it does, your browser requests those font files from Google. That request may include ordinary network information such as your IP address. You can review the provider’s own privacy information for details of its handling.</p><p>Links to external websites are provided for convenience. Once you follow one, that site’s privacy policy and practices apply. Liquid Learn Protocol does not control third-party websites or services.</p></section>
        <section className="policy-section"><h2>5. Content rights and sharing</h2><p>Unless a page says otherwise, original writing on Liquid Learn Protocol is published by Selvarani S. You are welcome to share links to lessons. Please do not republish substantial portions of the writing as your own or imply that the publisher endorses a product or service without permission.</p><p>Short quotations for commentary or educational reference should identify the publication and link to the original lesson where practical. Contact the publisher if you have a question about reuse.</p></section>
        <section className="policy-section"><h2>6. Children and young readers</h2><p>This site is a general educational publication and does not ask readers to provide personal information. Young readers should avoid sharing private information with any online AI service and ask a trusted adult for help when something feels unclear or uncomfortable.</p></section>
        <section className="policy-section"><h2>7. Changes to this policy</h2><p>The policy may be revised if the site or its services change. The date at the top will be updated when a new version is published. The current version applies to use of the publication from that date onward.</p></section>
        <section className="policy-section"><h2>8. Questions or contact</h2><p>If you have a privacy question or would like to contact the publisher about this policy, write to <a href="mailto:Celeste.Celonix@gmail.com" data-testid="link-privacy-contact">Celeste.Celonix@gmail.com</a>.</p></section>
      </article>
    </Layout>
  );
}

function NotFound() {
  usePageMeta(
    'Page Not Found | Liquid Learn Protocol',
    'This page could not be found. Visit the Liquid Learn Protocol library for free, plain-language AI lessons.',
  );
  return <Layout><div className="page-wrap not-found"><Eyebrow>Page not found</Eyebrow><h1>Not this path.</h1><p className="hero-copy" style={{ marginInline: 'auto' }}>The page may have moved, or the address may not be quite right. The learning library is still here.</p><Link href="/articles" className="button-primary" data-testid="link-not-found-library">Visit the lesson library <ArrowRight size={14} /></Link></div></Layout>;
}

function AppRoutes() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/topics" component={TopicsPage} />
    <Route path="/topics/:slug" component={TopicPage} />
    <Route path="/articles" component={LibraryPage} />
    <Route path="/articles/:slug" component={ArticlePage} />
    <Route path="/publisher" component={PublisherPage} />
    <Route path="/privacy" component={PrivacyPage} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppRoutes /></WouterRouter>;
}

export default App;
