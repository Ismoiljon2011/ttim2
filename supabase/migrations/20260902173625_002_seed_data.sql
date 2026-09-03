/*
# TTIM.UZ — Seed Data

## Overview
Populates all tables with initial placeholder content for the public website.
Also inserts default navigation, footer links, site settings, and sample content.

## Notes
- Uses ON CONFLICT to be idempotent
- All content is editable via admin panel
- Images use Pexels stock URLs for placeholder photography
*/

-- ============ SITE SETTINGS ============
INSERT INTO site_settings (id, school_name, school_short_name, logo_url, description, address, phone, email, seo_title, seo_description, announcement_bar_text, announcement_bar_link, announcement_bar_visible, announcement_start_date, footer_description, telegram_url, instagram_url, facebook_url, youtube_url, working_hours)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi',
  'TTIM',
  NULL,
  'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi — bilim, ma''naviyat va taraqqiyot maskani. Iqtidorli o''quvchilar uchun zamonaviy ta''lim muhiti.',
  'To''raqo''rg''on tumani, Samarqand viloyati, O''zbekiston',
  '+998 66 233 40 47',
  'info@ttim.uz',
  'TTIM — Ixtisoslashtirilgan Maktab',
  'To''raqo''rg''on tuman ixtisoslashtirilgan maktabining rasmiy web sayti. Yangiliklar, galereya, kutubxona, o''qituvchilar va leadership.',
  'Yangi o''quv yili muborak!',
  '/news',
  true,
  CURRENT_DATE,
  'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi — bilim, ma''naviyat va taraqqiyot maskani.',
  'https://t.me/ttim_uz',
  'https://instagram.com/ttim_uz',
  'https://facebook.com/ttim.uz',
  'https://youtube.com/@ttim_uz',
  'Dushanba–Shanba, 08:00–17:00'
)
ON CONFLICT (id) DO NOTHING;

-- ============ NAVIGATION ITEMS ============
INSERT INTO navigation_items (label, url, sort_order) VALUES
  ('Bosh sahifa', '/', 0),
  ('Maktab haqida', '/about', 1),
  ('Ta''lim', '/programs', 2),
  ('Yangiliklar', '/news', 3),
  ('Galereya', '/gallery', 4),
  ('Raqamli ma''naviyat', '/spirituality', 5),
  ('Kutubxona', '/library', 6),
  ('Rahbariyat', '/leadership', 7),
  ('O''qituvchilar', '/teachers', 8),
  ('Yutuqlar', '/achievements', 9),
  ('Tadbirlar', '/events', 10),
  ('Hujjatlar', '/documents', 11),
  ('Qabul', '/admission', 12),
  ('Bog''lanish', '/contact', 13)
ON CONFLICT DO NOTHING;

-- ============ FOOTER LINKS ============
INSERT INTO footer_links (section, label, url, sort_order) VALUES
  ('main', 'Bosh sahifa', '/', 0),
  ('main', 'Maktab haqida', '/about', 1),
  ('main', 'Ta''lim', '/programs', 2),
  ('main', 'Yangiliklar', '/news', 3),
  ('main', 'Galereya', '/gallery', 4),
  ('resources', 'Kutubxona', '/library', 0),
  ('resources', 'Raqamli ma''naviyat', '/spirituality', 1),
  ('resources', 'Tavsiyalar', '/recommendations', 2),
  ('resources', 'Hujjatlar', '/documents', 3),
  ('resources', 'Yutuqlar', '/achievements', 4),
  ('school', 'Rahbariyat', '/leadership', 0),
  ('school', 'O''qituvchilar', '/teachers', 1),
  ('school', 'Tadbirlar', '/events', 2),
  ('school', 'E''lonlar', '/announcements', 3),
  ('school', 'Qabul', '/admission', 4),
  ('school', 'Bog''lanish', '/contact', 5)
ON CONFLICT DO NOTHING;

-- ============ HERO SLIDES ============
INSERT INTO hero_slides (title, subtitle, description, image_url, primary_cta_label, primary_cta_link, secondary_cta_label, secondary_cta_link, sort_order) VALUES
  ('Bilim, ma''naviyat va taraqqiyot maskani', 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi', 'Iqtidorli o''quvchilar uchun zamonaviy ta''lim muhiti va chuqur ilm manbai.', 'https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Maktab haqida', '/about', 'Yangiliklar', '/news', 0),
  ('Yangi o''quv yili — yangi marralar', 'Birinchi qo''ng''iroq — yangi marralar sari ilk qadam', 'O''quvchilarimiz yangi o''quv yilini quvonch va ilhom bilan boshladilar.', 'https://images.pexels.com/photos/8617515/pexels-photo-8617515.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tadbirlar', '/events', 'Galereya', '/gallery', 1),
  ('Ilm — eng buyuk sharaf', 'Ixtisoslashtirilgan ta''lim bilan kelajakka', 'Matematika, fizika, kimyo, biologiya va ingliz tilida chuqurlashtirilgan dasturlar.', 'https://images.pexels.com/photos/37811241/pexels-photo-37811241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ta''lim dasturlari', '/programs', 'Qabul', '/admission', 2)
ON CONFLICT DO NOTHING;

-- ============ STATISTICS ============
INSERT INTO statistics (label, value, suffix, icon, sort_order) VALUES
  ('O''quvchilar', 850, '+', 'users', 0),
  ('O''qituvchilar', 65, '', 'graduation-cap', 1),
  ('Ta''lim dasturlari', 12, '', 'book-open', 2),
  ('Yutuqlar', 120, '+', 'trophy', 3),
  ('Bitiruvchilar', 320, '+', 'award', 4)
ON CONFLICT DO NOTHING;

-- ============ ABOUT SECTIONS ============
INSERT INTO about_sections (section_key, title, content, image_url, sort_order) VALUES
  ('history', 'Maktab tarixi', 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi iqtidorli o''quvchilarni chuqur va sifatli ta''lim bilan ta''minlash maqsadida tashkil etilgan. Maktabimiz yillar davomida ko''plab iqtidorli bitiruvchilarni yetishtirib, respublika miqyosidagi olimpiada va tanlovlarda muvaffaqiyat qozongan.', 'https://images.pexels.com/photos/35314982/pexels-photo-35314982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 0),
  ('mission', 'Missiya', 'Iqtidorli o''quvchilarning ilmiy salohiyatini ro''yobga chiqarish, ularni xalqaro standartlar darajasida ta''lim berish va Vatanga sadoqatli, ma''naviyati yuksak shaxslarni shakllantirish.', NULL, 1),
  ('vision', 'Vizyon', 'O''zbekistonning eng nufuzli ixtisoslashtirilgan maktablaridan biriga aylanish — har bir o''quvchi o''z salohiyatini to''liq ro''yobga chiqara oladigan maktab.', NULL, 2),
  ('values', 'Qadriyatlar', 'Bilim va ilm, ma''naviyat va axloq, vatanparvarlik, ijodkorlik, halollik va mehnatsevarlik — maktabimiz asosiy qadriyatlari.', NULL, 3),
  ('philosophy', 'Ta''lim falsafasi', 'Har bir o''quvchi o''ziga xos iqtidor egasi. Bizning vazifamiz — bu iqtidorni kashf etish, rivojlantirish va kelajakka yo''naltirishdir.', NULL, 4),
  ('facilities', 'Zamonaviy imkoniyatlar', 'Maktabimiz zamonaviy laboratoriyalar, raqamli kutubxona, sport zallari va kompyuter xonalari bilan jihozlangan. O''quvchilarimiz nazariy bilim va amaliy ko''nikmalarni birga egallaydilar.', 'https://images.pexels.com/photos/5147366/pexels-photo-5147366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5)
ON CONFLICT DO NOTHING;

-- ============ NEWS CATEGORIES ============
INSERT INTO news_categories (name, slug) VALUES
  ('Maktab yangiliklari', 'maktab-yangiliklari'),
  ('Tadbirlar', 'tadbirlar'),
  ('Olimpiadalar', 'olimpiadalar'),
  ('Tanlovlar', 'tanlovlar'),
  ('Ma''naviyat', 'manaviyat')
ON CONFLICT DO NOTHING;

-- ============ NEWS ARTICLES ============
INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  'Birinchi qo''ng''iroq — yangi marralar sari ilk qadam',
  'birinchi-qongiroq-yangi-marralar-sari-ilk-qadam',
  'https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Yangi o''quv yili boshlanishi munosabati bilan maktabimizda ''Birinchi qo''ng''iroq'' tadbiri yuqori saviyada o''tkazildi.',
  'Yangi o''quv yili boshlanishi munosabati bilan To''raqo''rg''on tuman ixtisoslashtirilgan maktabida ''Birinchi qo''ng''iroq'' tadbiri bo''lib o''tdi. Tadbirdan maqsad — o''quvchilarni yangi o''quv yiliga ilhom bilan kirishishga undash. O''qituvchilar va o''quvchilar uchun qiziqarli dastur tashkil etildi.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'tadbirlar'),
  ARRAY['qongiroq', 'yangi-yil', 'tadbir'],
  'published',
  true,
  now() - interval '1 day'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'birinchi-qongiroq-yangi-marralar-sari-ilk-qadam');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  '''Ma''naviyat yetakchisi'' respublika tanlovida 3-o''rin',
  'manaviyat-yetakchisi-respublika-tanlovida-3-orin',
  'https://images.pexels.com/photos/7567353/pexels-photo-7567353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Maktabimiz o''quvchisi ''Ma''naviyat yetakchisi'' respublika tanlovida 3-o''rinni egalladi.',
  'Maktabimiz o''quvchisi ''Ma''naviyat yetakchisi'' respublika tanlovida munofaqiyatli ishtirok etib, 3-o''rinni qo''lga kiritdi. Bu yutuq maktabimiz ma''naviy tarbiya sohasidagi salmoqli ishlarning natijasidir.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'tanlovlar'),
  ARRAY['tanlov', 'manaviyat', 'respublika'],
  'published',
  true,
  now() - interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'manaviyat-yetakchisi-respublika-tanlovida-3-orin');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  'RMA — Raqamli ma''naviyat akademiyasi',
  'rma-raqamli-manaviyat-akademiyasi',
  'https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Raqamli ma''naviyat akademiyasi loyihasi doirasida maktabimizda yangi tashabbuslar amalga oshirilmoqda.',
  'Raqamli ma''naviyat akademiyasi loyihasi doirasida maktabimiz o''quvchilari uchun raqamli savodxonlik va ma''naviy tarbiyani birlashtiruvchi yangi dasturlar yo''lga qo''yildi.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'manaviyat'),
  ARRAY['rma', 'raqamli', 'manaviyat'],
  'published',
  false,
  now() - interval '5 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'rma-raqamli-manaviyat-akademiyasi');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  '''So''nggi qo''ng''iroq'' tadbiri yuqori saviyada tashkil etildi',
  'songgi-qongiroq-tadbiri-yukori-saviyada-tashkil-etildi',
  'https://images.pexels.com/photos/32632176/pexels-photo-32632176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Bitiruvchilar uchun ''So''nggi qo''ng''iroq'' tadbiri tantanali ravishda o''tkazildi.',
  'Maktabimiz bitiruvchilari uchun ''So''nggi qo''ng''iroq'' tadbiri xotiralar va quvonchlar ichida o''tkazildi. Bitiruvchilarga yangi hayot yo''lida omad tilandi.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'tadbirlar'),
  ARRAY['bitiruv', 'qongiroq', 'tadbir'],
  'published',
  false,
  now() - interval '7 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'songgi-qongiroq-tadbiri-yukori-saviyada-tashkil-etildi');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  '''Hokim olimpiadasi'' yuqori saviyada o''tkazildi',
  'hokim-olimpiadasi-yukori-saviyada-o-tkazildi',
  'https://images.pexels.com/photos/22690752/pexels-photo-22690752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Hokim olimpiadasi doirasida iqtidorli o''quvchilar o''z bilimlarini namoyish etdilar.',
  'Hokim olimpiadasi yuqori saviyada o''tkazildi. Maktabimiz o''quvchilari matematika, fizika va ingliz tilidan alohida natijalar ko''rsatdilar.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'olimpiadalar'),
  ARRAY['olimpiada', 'hokim', 'bilim'],
  'published',
  false,
  now() - interval '10 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'hokim-olimpiadasi-yukori-saviyada-o-tkazildi');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  'Navro''z — yangilanish va ezgulik bayrami',
  'navroz-yangilanish-va-ezgulik-bayrami',
  'https://images.pexels.com/photos/33029121/pexels-photo-33029121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Navro''z bayrami munosabati bilan maktabimizda bayramona tadbir o''tkazildi.',
  'Navro''z — yangilanish, ezgulik va bahor bayrami. Maktabimizda o''quvchilar tomonidan qiziqarli dastur va madaniy chiqishlar tashkil etildi.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'tadbirlar'),
  ARRAY['navroz', 'bayram', 'madaniyat'],
  'published',
  false,
  now() - interval '20 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'navroz-yangilanish-va-ezgulik-bayrami');

INSERT INTO news_articles (title, slug, cover_image_url, excerpt, content, author_name, category_id, tags, status, is_featured, published_at)
SELECT
  'Ilm — eng buyuk sharaf',
  'ilm-eng-buyuk-sharaf',
  'https://images.pexels.com/photos/8978622/pexels-photo-8978622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Ixtisoslashtirilgan maktablarga iqtidorli o''quvchilarni jalb etish — ustuvor vazifa.',
  'Ixtisoslashtirilgan maktablarga iqtidorli o''quvchilarni jalb etish davlatning ustuvor vazifalaridan biridir. Maktabimiz bu sohada katta ishlarni amalga oshirmoqda.',
  'TTIM',
  (SELECT id FROM news_categories WHERE slug = 'maktab-yangiliklari'),
  ARRAY['ilm', 'iqtidor', 'maktab'],
  'published',
  false,
  now() - interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'ilm-eng-buyuk-sharaf');

-- ============ PROGRAMS ============
INSERT INTO programs (title, description, image_url, teacher_name, additional_info, sort_order) VALUES
  ('Matematika', 'Chuqurlashtirilgan matematika dasturi — algebra, geometriya va matematik analiz asoslari.', 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Matematika kafedrasi', 'Olimpiada tayyorgarligi bilan', 0),
  ('Fizika', 'Fizika fanini chuqur o''rganish — mexanika, elektr va optika bo''yicha amaliy laboratoriya ishlari.', 'https://images.pexels.com/photos/8533087/pexels-photo-8533087.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Fizika kafedrasi', 'Zamonaviy laboratoriya jihozlari', 1),
  ('Kimyo', 'Kimyo fanidan chuqurlashtirilgan ta''lim — organik va noorganik kimyo asoslari.', 'https://images.pexels.com/photos/32769363/pexels-photo-32769363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Kimyo kafedrasi', 'Laboratoriya tajribalari bilan', 2),
  ('Biologiya', 'Biologiya fanini chuqur o''rganish — anatomiya, genetika va ekologiya.', 'https://images.pexels.com/photos/11899950/pexels-photo-11899950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Biologiya kafedrasi', 'Mikroskopik tadqiqotlar bilan', 3),
  ('Ingliz tili', 'Ingliz tili chuqurlashtirilgan dasturi — grammatika, o''qish, yozish va gaplashish.', 'https://images.pexels.com/photos/37812834/pexels-photo-37812834.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ingliz tili kafedrasi', 'Xalqaro sertifikatga tayyorgarlik', 4),
  ('Informatika', 'Informatika va dasturlash asoslari — algoritmlar, dasturlash tillari va raqamli savodxonlik.', 'https://images.pexels.com/photos/5530437/pexels-photo-5530437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Informatika kafedrasi', 'Amaliy dasturlash loyihalari', 5)
ON CONFLICT DO NOTHING;

-- ============ GALLERY ALBUMS ============
INSERT INTO gallery_albums (title, description, cover_image_url, category, album_date, sort_order) VALUES
  ('Yangi o''quv yili — Birinchi qo''ng''iroq', 'Yangi o''quv yili boshlanishi munosabati bilan tashkil etilgan tadbir fotosuratlari.', 'https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'School Life', CURRENT_DATE, 0),
  ('Ma''naviyat yetakchisi tanlovi', 'Respublika tanlovidan lavhalar.', 'https://images.pexels.com/photos/7567353/pexels-photo-7567353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Competitions', CURRENT_DATE - 3, 1),
  ('So''nggi qo''ng''iroq — bitiruv', 'Bitiruvchilar uchun tashkil etilgan xayrlashuv tadbiri.', 'https://images.pexels.com/photos/32632176/pexels-photo-32632176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Events', CURRENT_DATE - 7, 2),
  ('Navro''z bayrami', 'Navro''z bayrami munosabati bilan o''tkazilgan madaniy tadbir.', 'https://images.pexels.com/photos/33029121/pexels-photo-33029121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Holidays', CURRENT_DATE - 20, 3),
  ('Hokim olimpiadasi', 'Hokim olimpiadasi davomidan lavhalar.', 'https://images.pexels.com/photos/22690752/pexels-photo-22690752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Olympiads', CURRENT_DATE - 10, 4),
  ('Sport musobaqalari', 'O''quvchilar o''rtasidagi sport musobaqalari.', 'https://images.pexels.com/photos/31003855/pexels-photo-31003855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Sports', CURRENT_DATE - 15, 5)
ON CONFLICT DO NOTHING;

-- ============ GALLERY IMAGES ============
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Birinchi qo''ng''iroq', 0 FROM gallery_albums WHERE title = 'Yangi o''quv yili — Birinchi qo''ng''iroq' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/8617515/pexels-photo-8617515.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'O''quvchilar maktabga', 1 FROM gallery_albums WHERE title = 'Yangi o''quv yili — Birinchi qo''ng''iroq' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/7972319/pexels-photo-7972319.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Maktab hovlisi', 2 FROM gallery_albums WHERE title = 'Yangi o''quv yili — Birinchi qo''ng''iroq' ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/7567353/pexels-photo-7567353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tanlov chiqishi', 0 FROM gallery_albums WHERE title = 'Ma''naviyat yetakchisi tanlovi' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/31762320/pexels-photo-31762320.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Musiqa ijrosi', 1 FROM gallery_albums WHERE title = 'Ma''naviyat yetakchisi tanlovi' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/33768221/pexels-photo-33768221.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bolalar chiqishi', 2 FROM gallery_albums WHERE title = 'Ma''naviyat yetakchisi tanlovi' ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/32632176/pexels-photo-32632176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitiruvchilar', 0 FROM gallery_albums WHERE title = 'So''nggi qo''ng''iroq — bitiruv' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/38846536/pexels-photo-38846536.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitiruv quvonchi', 1 FROM gallery_albums WHERE title = 'So''nggi qo''ng''iroq — bitiruv' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/39192319/pexels-photo-39192319.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitiruvchilar nishoni', 2 FROM gallery_albums WHERE title = 'So''nggi qo''ng''iroq — bitiruv' ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/33029121/pexels-photo-33029121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bayramona navroz', 0 FROM gallery_albums WHERE title = 'Navro''z bayrami' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/31155018/pexels-photo-31155018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'O''quvchilar chiqishi', 1 FROM gallery_albums WHERE title = 'Navro''z bayrami' ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/22690752/pexels-photo-22690752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Olimpiada davomi', 0 FROM gallery_albums WHERE title = 'Hokim olimpiadasi' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/6238068/pexels-photo-6238068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Matematika yechim', 1 FROM gallery_albums WHERE title = 'Hokim olimpiadasi' ON CONFLICT DO NOTHING;

INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/31003855/pexels-photo-31003855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Regbi musobaqasi', 0 FROM gallery_albums WHERE title = 'Sport musobaqalari' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/9714143/pexels-photo-9714143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Yugrish musobaqasi', 1 FROM gallery_albums WHERE title = 'Sport musobaqalari' ON CONFLICT DO NOTHING;
INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
SELECT id, 'https://images.pexels.com/photos/29329997/pexels-photo-29329997.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Arqon tortish', 2 FROM gallery_albums WHERE title = 'Sport musobaqalari' ON CONFLICT DO NOTHING;

-- ============ SPIRITUALITY ARTICLES ============
INSERT INTO spirituality_articles (title, slug, excerpt, content, category, cover_image_url, status, published_at)
VALUES
  ('Raqamli ma''naviyat — zamonaviy yondashuv', 'raqamli-manaviyat-zamonaviy-yondashuv', 'Raqamli dunyoda ma''naviyatni saqlash — bugungi kun muhim vazifasi.', 'Raqamli ma''naviyat akademiyasi loyihasi o''quvchilarning raqamli muhitda ma''naviy qadriyatlarini rivojlantirishga qaratilgan. Loyiha doirasida onlayn ma''ruzalar, vebinarlar va interaktiv darslar tashkil etiladi.', 'Ma''naviyat', 'https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'published', now() - interval '2 days'),
  ('5 tashabbus — amalda', '5-tashabbus-amalda', 'Yoshlarning 5 tashabbusi doirasida amalga oshirilgan ishlar.', 'Yoshlarning 5 tashabbusi doirasida maktabimiz o''quvchilari kitob o''qish, sport bilan shug''ullanish, xorijiy til o''rganish, qo''l san''ati va kompyuter savodxonligi bo''yicha faol ish olib bormoqda.', 'Tashabbuslar', 'https://images.pexels.com/photos/5530437/pexels-photo-5530437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'published', now() - interval '5 days'),
  ('Muhammad Yusuf tavalludi', 'muhammad-yusuf-tavalludi', 'Buyuk shoir Muhammad Yusuf tavallud kuni munosabati bilan tadbir.', 'Buyuk shoir Muhammad Yusuf tavallud kuni munosabati bilan maktabimizda adabiy kecha o''tkazildi. O''quvchilar shoirning hayoti va ijodi bilan yaqindan tanishdilar.', 'Adabiyot', 'https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'published', now() - interval '15 days')
ON CONFLICT DO NOTHING;

-- ============ RECOMMENDATIONS ============
INSERT INTO recommendations (title, description, image_url, external_link, category, sort_order) VALUES
  ('Khan Academy', 'Bepul onlayn ta''lim platformasi — matematika, fan va iqtisodiyot.', NULL, 'https://www.khanacademy.org', 'Educational Websites', 0),
  ('O''zbekcha Wikipedia', 'O''zbek tilidagi erkin entsiklopediya.', NULL, 'https://uz.wikipedia.org', 'Educational Websites', 1),
  ('Coursera', 'Dunyo yetakchi universitetlaridan onlayn kurslar.', NULL, 'https://www.coursera.org', 'Learning Resources', 2),
  ('Duolingo', 'Bepul til o''rganish platformasi.', NULL, 'https://www.duolingo.com', 'Useful Tools', 3),
  ('Geogebra', 'Interaktiv matematika dasturi — geometriya va algebra.', NULL, 'https://www.geogebra.org', 'Useful Tools', 4),
  ('Google Scholar', 'Ilmiy maqolalar va tadqiqotlar qidiruv tizimi.', NULL, 'https://scholar.google.com', 'Learning Resources', 5),
  ('PhET Interactive Simulations', 'Fizika, kimyo va matematikadan interaktiv simulyatsiyalar.', NULL, 'https://phet.colorado.edu', 'Learning Resources', 6)
ON CONFLICT DO NOTHING;

-- ============ LIBRARY ITEMS ============
INSERT INTO library_items (title, author, category, description, cover_image_url, file_url, published_date, sort_order) VALUES
  ('O''zbek adabiyoti antologiyasi', 'Turli mualliflar', 'Adabiyot', 'O''zbek adabiyotining namunaviy asarlari to''plami.', 'https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, CURRENT_DATE - 30, 0),
  ('Matematika olimpiada masalalari', 'A. Rasulov', 'Matematika', 'Xalqaro olimpiada masalari va yechimlar to''plami.', NULL, NULL, CURRENT_DATE - 20, 1),
  ('Fizika darsligi — 9-sinf', 'Sh. Yusupov', 'Fizika', 'Chuqurlashtirilgan fizika darsligi.', NULL, NULL, CURRENT_DATE - 15, 2),
  ('Ingliz tili grammatikasi', 'R. Murphy', 'Tillar', 'Essential Grammar in Use — ingliz tili grammatikasi qo''llanmasi.', NULL, NULL, CURRENT_DATE - 10, 3),
  ('O''zbekiston tarixi', 'M. Mahmudov', 'Tarix', 'O''zbekiston tarixi bo''yicha qo''llanma.', 'https://images.pexels.com/photos/276005/pexels-photo-276005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, CURRENT_DATE - 5, 4)
ON CONFLICT DO NOTHING;

-- ============ LEADERSHIP ============
INSERT INTO leadership (full_name, position, photo_url, biography, phone, email, sort_order) VALUES
  ('[Director Name]', 'Maktab direktori', 'https://images.pexels.com/photos/6981004/pexels-photo-6981004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Maktab direktori haqida ma''lumot. Biografiya admin panelidan tahrirlanishi mumkin.', '+998 00 000 00 00', 'director@ttim.uz', 0),
  ('[Deputy Director Name]', 'O''quv ishlari bo''yicha direktor o''rinbosari', 'https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'O''quv ishlari bo''yicha direktor o''rinbosari haqida ma''lumot.', '+998 00 000 00 01', 'deputy@ttim.uz', 1),
  ('[Deputy Director Name 2]', 'Ma''naviy-axloqiy tarbiya bo''yicha direktor o''rinbosari', 'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ma''naviy-axloqiy tarbiya bo''yicha direktor o''rinbosari.', '+998 00 000 00 02', 'manaviyat@ttim.uz', 2)
ON CONFLICT DO NOTHING;

-- ============ TEACHERS ============
INSERT INTO teachers (full_name, subject, position, photo_url, experience_years, biography, achievements, sort_order) VALUES
  ('[Teacher Name 1]', 'Matematika', 'Bosh o''qituvchi', 'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15, 'Matematika fani o''qituvchisi. Tajribali pedagog.', 'Respublika olimpiadasi g''olibi tayyorlagan', 0),
  ('[Teacher Name 2]', 'Fizika', 'Bosh o''qituvchi', 'https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 12, 'Fizika fani o''qituvchisi.', 'Xalqaro olimpiada tayyorlovchisi', 1),
  ('[Teacher Name 3]', 'Kimyo', 'O''qituvchi', 'https://images.pexels.com/photos/6981004/pexels-photo-6981004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 8, 'Kimyo fani o''qituvchisi.', 'Respublika tanlovi sovrindori tayyorlagan', 2),
  ('[Teacher Name 4]', 'Biologiya', 'O''qituvchi', 'https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 10, 'Biologiya fani o''qituvchisi.', 'Mehnat faxriyori', 3),
  ('[Teacher Name 5]', 'Ingliz tili', 'O''qituvchi', 'https://images.pexels.com/photos/6981004/pexels-photo-6981004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 7, 'Ingliz tili o''qituvchisi.', 'CEFR C1 sertifikati', 4),
  ('[Teacher Name 6]', 'Informatika', 'O''qituvchi', 'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6, 'Informatika o''qituvchisi.', 'Dasturlash tanlovi g''olibi', 5)
ON CONFLICT DO NOTHING;

-- ============ ACHIEVEMENTS ============
INSERT INTO achievements (title, student_or_team, year, result, category, image_url, description, sort_order) VALUES
  ('Respublika matematika olimpiadasi', 'O''quvchilar jamoasi', 2026, '1-o''rin', 'Olympiads', 'https://images.pexels.com/photos/10435675/pexels-photo-10435675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Respublika matematika olimpiadasida maktabimiz jamoasi 1-o''rinni egalladi.', 0),
  ('Ma''naviyat yetakchisi tanlovi', 'Individual', 2026, '3-o''rin', 'Competitions', 'https://images.pexels.com/photos/6345332/pexels-photo-6345332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Respublika tanlovida 3-o''rin.', 1),
  ('Hokim olimpiadasi', 'Jamoa', 2026, '2-o''rin', 'Olympiads', 'https://images.pexels.com/photos/34412340/pexels-photo-34412340.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Hokim olimpiadasida 2-o''rin.', 2),
  ('Xalqaro fizika olimpiadasi', 'Individual', 2025, 'Bronza medali', 'International', 'https://images.pexels.com/photos/8533087/pexels-photo-8533087.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Xalqaro fizika olimpiadasida bronza medali.', 3),
  ('Sport musobaqasi', 'Jamoa', 2025, '1-o''rin', 'Sports', 'https://images.pexels.com/photos/9714143/pexels-photo-9714143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tuman sport musobaqasida 1-o''rin.', 4),
  ('Ingliz tili tanlovi', 'Individual', 2025, 'Grand-pr', 'National', NULL, 'Respublika ingliz tili tanlovida Grand-pr.', 5)
ON CONFLICT DO NOTHING;

-- ============ EVENTS ============
INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES
  ('Birinchi qo''ng''iroq', 'Yangi o''quv yili boshlanishi munosabati bilan tadbir.', CURRENT_DATE + 0, '08:00', 'Maktab hovlisi', 'https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Olimpiada tayyorgarligi', 'Matematika olimpiadasiga tayyorgarlik mashg''uloti.', CURRENT_DATE + 7, '14:00', 'Matematika xonasi', NULL),
  ('Ota-onalar yig''ilishi', 'Yangi o''quv yili bo''yicha ota-onalar yig''ilishi.', CURRENT_DATE + 14, '16:00', 'Akt zal', NULL),
  ('Kitob haftligi', 'Kitob o''qish haftligi doirasida tadbirlar.', CURRENT_DATE + 21, '10:00', 'Kutubxona', 'https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sport musobaqasi', 'O''quvchilar o''rtasida sport musobaqasi.', CURRENT_DATE + 30, '09:00', 'Sport maydon', 'https://images.pexels.com/photos/31003855/pexels-photo-31003855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT DO NOTHING;

-- ============ ANNOUNCEMENTS ============
INSERT INTO announcements (title, content, priority, link, is_published, start_date, end_date) VALUES
  ('Yangi o''quv yili muborak!', 'Yangi o''quv yili boshlanishi munosabati bilan barcha o''quvchilar va o''qituvchilarni tabriklaymiz.', 'important', '/news', true, CURRENT_DATE, CURRENT_DATE + 30),
  ('Qabul 2026-2027 o''quv yili uchun ochiq', 'Ixtisoslashtirilgan maktabga qabul hujjatlari qabul qilinmoqda.', 'urgent', '/admission', true, CURRENT_DATE, CURRENT_DATE + 60)
ON CONFLICT DO NOTHING;

-- ============ DOCUMENTS ============
INSERT INTO documents (title, category, description, file_url, document_date, sort_order) VALUES
  ('Maktab nizomi', 'Nizomlar', 'Maktabning rasmiy nizomi.', '#', CURRENT_DATE - 30, 0),
  ('Ta''lim dasturi', 'Dasturlar', '2026-2027 o''quv yili ta''lim dasturi.', '#', CURRENT_DATE - 20, 1),
  ('Qabul qoidalari', 'Qoidalar', 'Ixtisoslashtirilgan maktabga qabul qoidalari.', '#', CURRENT_DATE - 10, 2),
  ('Ichki tartib qoidalari', 'Qoidalar', 'Maktab ichki tartib qoidalari.', '#', CURRENT_DATE - 5, 3)
ON CONFLICT DO NOTHING;

-- ============ ADMISSION INFO ============
INSERT INTO admission_info (section_key, title, content, sort_order) VALUES
  ('info', 'Qabul haqida umumiy ma''lumot', 'Ixtisoslashtirilgan maktabga qabul har o''quv yili boshida o''tkaziladi. Qabul iqtidorli o''quvchilar uchun mo''ljallangan bo''lib, maxsus imtihonlar asosida amalga oshiriladi.', 0),
  ('requirements', 'Talablar', 'Qabul uchun asosiy talablar: yuqori akademik ko''rsatkichlar, fan olimpiadalarida ishtirok, imtihon natijalari.', 1),
  ('documents', 'Kerakli hujjatlar', '1. Ariza 2. Tug''ilganlik guvohnomasi nusxasi 3. O''quvchining attestati/tab证asi 4. 3x4 rasm (3 dona) 5. Tibbiy ma''lumotnoma', 2),
  ('dates', 'Muhim sanalar', 'Hujjatlarni qabul qilish: 1-iyundan 1-avgustgacha. Imtihonlar: avgust oyining birinchi haftasi. Natijalar: avgust oyining ikkinchi haftasi.', 3),
  ('faq', 'Tez-tez beriladigan savollar', 'S: Qabul qanday o''tkaziladi? J: Maxsus imtihon va akademik natijalar asosida. S: Yashash joyidan kelib chiqib cheklov bormi? J: Yo''q, barcha iqtidorli o''quvchilar qabul qilinadi.', 4),
  ('contact', 'Bog''lanish', 'Qabul bo''yicha savollar uchun: +998 66 233 40 47, info@ttim.uz', 5)
ON CONFLICT DO NOTHING;
