import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Trophy } from 'lucide-react';
import { supabase, HeroSlide, Statistic, NewsArticle, Program, GalleryAlbum, Achievement } from '@/lib/supabase';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionTitle from '@/components/SectionTitle';
import { getLucideIcon } from '@/lib/iconResolver';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomePage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    (async () => {
      const [slidesRes, statsRes, newsRes, programsRes, albumsRes, achievementsRes] = await Promise.all([
        supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('statistics').select('*').order('sort_order'),
        supabase.from('news_articles').select('*, category:news_categories(*)').eq('status', 'published').order('published_at', { ascending: false }).limit(6),
        supabase.from('programs').select('*').eq('is_published', true).order('sort_order').limit(6),
        supabase.from('gallery_albums').select('*').eq('is_published', true).order('sort_order').limit(6),
        supabase.from('achievements').select('*').eq('is_published', true).order('sort_order').limit(4),
      ]);
      if (slidesRes.data) setSlides(slidesRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (newsRes.data) setNews(newsRes.data as NewsArticle[]);
      if (programsRes.data) setPrograms(programsRes.data);
      if (albumsRes.data) setAlbums(albumsRes.data);
      if (achievementsRes.data) setAchievements(achievementsRes.data);
    })();
  }, []);

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % Math.max(slides.length, 1)), [slides.length]);
  const prevSlide = useCallback(() => setCurrentSlide((p) => (p - 1 + slides.length) % Math.max(slides.length, 1)), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  return (
    <div>
      {/* Hero Slider */}
      {slides.length > 0 && (
        <section className="relative h-[600px] lg:h-[680px] overflow-hidden bg-slate-900">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="mt-4 text-xl text-primary-300 font-medium animate-slide-up">{slide.subtitle}</p>
                    )}
                    {slide.description && (
                      <p className="mt-4 text-lg text-slate-300 leading-relaxed animate-slide-up">{slide.description}</p>
                    )}
                    <div className="mt-8 flex flex-wrap gap-4 animate-slide-up">
                      {slide.primary_cta_label && slide.primary_cta_link && (
                        <Link
                          to={slide.primary_cta_link}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        >
                          {slide.primary_cta_label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                      {slide.secondary_cta_label && slide.secondary_cta_link && (
                        <Link
                          to={slide.secondary_cta_link}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-semibold border border-white/20 hover:bg-white/20 transition-all"
                        >
                          {slide.secondary_cta_label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {slides.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors z-10" aria-label="Previous">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors z-10" aria-label="Next">
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Statistics */}
      {stats.length > 0 && (
        <section className="bg-primary-700 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="grid gap-6 sm:gap-8"
              style={{ gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))` }}
            >
              {stats.map((stat) => {
                const Icon = getLucideIcon(stat.icon);
                return (
                  <div key={stat.id} className="flex flex-col items-center text-center text-white">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-sm text-primary-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      {programs.length > 0 && (
        <section className="py-14 lg:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Ta'lim dasturlari" subtitle="Chuqurlashtirilgan fan dasturlari" linkTo="/programs" linkLabel="Barcha dasturlar" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div key={program.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {program.image_url ? (
                      <img src={program.image_url} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{program.title}</h3>
                    {program.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{program.description}</p>}
                    {program.teacher_name && <p className="mt-4 text-xs text-primary-700 dark:text-primary-400 font-medium">{program.teacher_name}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="py-14 lg:py-20 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title="So'nggi yangiliklar" subtitle="Maktab hayotidan eng so'nggi xabarlar" linkTo="/news" linkLabel="Barcha yangiliklar" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-2">{article.category.name}</span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{article.title}</h3>
                    {article.excerpt && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>}
                    <div className="mt-auto pt-3 text-xs text-slate-400">{formatDate(article.published_at)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery preview */}
      {albums.length > 0 && (
        <section className="py-14 lg:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Galereya" subtitle="Maktab hayotidan lavhalar" linkTo="/gallery" linkLabel="To'liq galereya" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {albums.slice(0, 6).map((album) => (
                <Link key={album.id} to={`/gallery/${album.id}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-sm text-white font-medium line-clamp-2">{album.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="py-14 lg:py-20 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Yutuqlar" subtitle="O'quvchilarimizning erishgan natijalari" linkTo="/achievements" linkLabel="Barcha yutuqlar" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex flex-col bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 hover:shadow-lg transition-all">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-900/20">
                    <Trophy className="h-5 w-5 text-accent-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{ach.title}</h3>
                  {ach.result && <p className="mt-1.5 text-lg font-bold text-primary-700 dark:text-primary-400">{ach.result}</p>}
                  {ach.student_or_team && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{ach.student_or_team}</p>}
                  {ach.year && <p className="mt-auto pt-3 text-xs text-slate-400">{ach.year}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.pexels.com/photos/37811241/pexels-photo-37811241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Kelajak sari birgalikda</h2>
          <p className="mt-3 text-lg text-primary-200 max-w-xl">Ixtisoslashtirilgan maktabimizda o'qishga intilishingiz biz uchun sharaf</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/admission" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-800 font-semibold hover:bg-primary-50 transition-colors">
              Qabul haqida <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold border border-primary-500 hover:bg-primary-700 transition-colors">
              Bog'lanish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
