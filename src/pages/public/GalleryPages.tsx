import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase, GalleryAlbum, GalleryImage } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GalleryListPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('gallery_albums').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setAlbums(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(albums.map((a) => a.category))];
  const filtered = activeCategory ? albums.filter((a) => a.category === activeCategory) : albums;

  return (
    <div>
      <PageHero
        title="Galereya"
        subtitle="Maktab hayotidan fotolavhalar"
        image="https://images.pexels.com/photos/7567353/pexels-photo-7567353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Barchasi</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{cat}</button>
            ))}
          </div>
        )}
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState variant="gallery" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((album) => (
              <Link key={album.id} to={`/gallery/${album.id}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-sm hover:shadow-xl transition-all">
                {album.cover_image_url ? (
                  <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xs text-primary-300 font-medium">{album.category}</span>
                  <h3 className="text-lg font-bold text-white">{album.title}</h3>
                  <span className="text-xs text-slate-300 flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" /> {formatDate(album.album_date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryDetailPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: albumData } = await supabase.from('gallery_albums').select('*').eq('id', id).maybeSingle();
      if (albumData) setAlbum(albumData);
      const { data: imgData } = await supabase.from('gallery_images').select('*').eq('album_id', id).order('sort_order');
      if (imgData) setImages(imgData);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((p) => p !== null ? (p + 1) % images.length : null);
      if (e.key === 'ArrowLeft') setLightboxIdx((p) => p !== null ? (p - 1 + images.length) % images.length : null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, images.length]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!album) return <EmptyState variant="gallery" title="Album topilmadi" />;

  return (
    <div>
      <PageHero title={album.title} subtitle={album.description || undefined} breadcrumb={<Link to="/gallery" className="hover:text-white">Galereya</Link>} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {images.length === 0 ? <EmptyState variant="gallery" title="Bu albumda rasm yo'q" /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIdx(i)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 hover:shadow-lg transition-all"
              >
                <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white line-clamp-2">{img.caption}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIdx !== null && images[lightboxIdx] && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxIdx(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full" onClick={() => setLightboxIdx(null)}><X className="h-6 w-6" /></button>
          <button className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full" onClick={(e) => { e.stopPropagation(); setLightboxIdx((p) => p !== null ? (p - 1 + images.length) % images.length : null); }}><ChevronLeft className="h-8 w-8" /></button>
          <img src={images[lightboxIdx].image_url} alt={images[lightboxIdx].caption || ''} className="max-w-full max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full" onClick={(e) => { e.stopPropagation(); setLightboxIdx((p) => p !== null ? (p + 1) % images.length : null); }}><ChevronRight className="h-8 w-8" /></button>
          {images[lightboxIdx].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">{images[lightboxIdx].caption}</div>
          )}
          <div className="absolute top-4 left-4 text-white text-sm">{lightboxIdx + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
