import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import PublicLayout from '@/components/PublicLayout';
import AdminLayout, { PermissionGuard } from '@/pages/admin/AdminLayout';
import { PermissionAction } from '@/lib/permissions';

import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import ProgramsPage from '@/pages/public/ProgramsPage';
import { NewsListPage, NewsDetailPage } from '@/pages/public/NewsPages';
import { GalleryListPage, GalleryDetailPage } from '@/pages/public/GalleryPages';
import { SpiritualityListPage, SpiritualityDetailPage } from '@/pages/public/SpiritualityPages';
import RecommendationsPage from '@/pages/public/RecommendationsPage';
import LibraryPage from '@/pages/public/LibraryPage';
import LeadershipPage from '@/pages/public/LeadershipPage';
import TeachersPage from '@/pages/public/TeachersPage';
import AchievementsPage from '@/pages/public/AchievementsPage';
import EventsPage from '@/pages/public/EventsPage';
import AnnouncementsPage from '@/pages/public/AnnouncementsPage';
import DocumentsPage from '@/pages/public/DocumentsPage';
import AdmissionPage from '@/pages/public/AdmissionPage';
import ContactPage from '@/pages/public/ContactPage';
import SearchPage from '@/pages/public/SearchPage';
import ErrorPage from '@/pages/public/ErrorPage';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminNews, { AdminCategories } from '@/pages/admin/AdminNews';
import { AdminAnnouncements, AdminEvents } from '@/pages/admin/AdminAnnouncements';
import { AdminLeadership, AdminTeachers } from '@/pages/admin/AdminPeople';
import { AdminGallery, AdminLibrary, AdminDocuments } from '@/pages/admin/AdminMedia';
import { AdminPrograms, AdminAchievements, AdminAdmission } from '@/pages/admin/AdminSchool';
import { AdminSpirituality, AdminRecommendations, AdminAbout } from '@/pages/admin/AdminContent';
import { AdminHero, AdminStatistics, AdminNavigation } from '@/pages/admin/AdminSettings';
import AdminSettingsForm from '@/pages/admin/AdminSettingsForm';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminAdmins from '@/pages/admin/AdminAdmins';
import AdminRoles from '@/pages/admin/AdminRoles';
import AdminLogs from '@/pages/admin/AdminLogs';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/news" element={<NewsListPage />} />
              <Route path="/news/:slug" element={<NewsDetailPage />} />
              <Route path="/gallery" element={<GalleryListPage />} />
              <Route path="/gallery/:id" element={<GalleryDetailPage />} />
              <Route path="/spirituality" element={<SpiritualityListPage />} />
              <Route path="/spirituality/:slug" element={<SpiritualityDetailPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/admission" element={<AdmissionPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/404" element={<ErrorPage code={404} />} />
              <Route path="*" element={<ErrorPage code={404} />} />
            </Route>

            {/* Admin routes - non-obvious path */}
            <Route path="/manage/login" element={<AdminLogin />} />
            <Route path="/manage" element={<AdminLayout />}>
              <Route index element={<PermissionGuard permission="view_dashboard"><AdminDashboard /></PermissionGuard>} />
              <Route path="news" element={<PermissionGuard permission="manage_news"><AdminNews /></PermissionGuard>} />
              <Route path="categories" element={<PermissionGuard permission="manage_categories"><AdminCategories /></PermissionGuard>} />
              <Route path="announcements" element={<PermissionGuard permission="manage_announcements"><AdminAnnouncements /></PermissionGuard>} />
              <Route path="events" element={<PermissionGuard permission="manage_events"><AdminEvents /></PermissionGuard>} />
              <Route path="leadership" element={<PermissionGuard permission="manage_leadership"><AdminLeadership /></PermissionGuard>} />
              <Route path="teachers" element={<PermissionGuard permission="manage_teachers"><AdminTeachers /></PermissionGuard>} />
              <Route path="gallery" element={<PermissionGuard permission="manage_gallery"><AdminGallery /></PermissionGuard>} />
              <Route path="library" element={<PermissionGuard permission="manage_library"><AdminLibrary /></PermissionGuard>} />
              <Route path="documents" element={<PermissionGuard permission="manage_documents"><AdminDocuments /></PermissionGuard>} />
              <Route path="programs" element={<PermissionGuard permission="manage_programs"><AdminPrograms /></PermissionGuard>} />
              <Route path="achievements" element={<PermissionGuard permission="manage_achievements"><AdminAchievements /></PermissionGuard>} />
              <Route path="admission" element={<PermissionGuard permission="manage_admission"><AdminAdmission /></PermissionGuard>} />
              <Route path="spirituality" element={<PermissionGuard permission="manage_spirituality"><AdminSpirituality /></PermissionGuard>} />
              <Route path="recommendations" element={<PermissionGuard permission="manage_recommendations"><AdminRecommendations /></PermissionGuard>} />
              <Route path="about" element={<PermissionGuard permission="manage_about"><AdminAbout /></PermissionGuard>} />
              <Route path="settings" element={<PermissionGuard permission="manage_settings"><AdminSettingsForm /></PermissionGuard>} />
              <Route path="hero" element={<PermissionGuard permission="manage_hero"><AdminHero /></PermissionGuard>} />
              <Route path="statistics" element={<PermissionGuard permission="manage_statistics"><AdminStatistics /></PermissionGuard>} />
              <Route path="navigation" element={<PermissionGuard permission="manage_navigation"><AdminNavigation /></PermissionGuard>} />
              <Route path="messages" element={<PermissionGuard permission="manage_messages"><AdminMessages /></PermissionGuard>} />
              <Route path="admins" element={<PermissionGuard permission="manage_admins"><AdminAdmins /></PermissionGuard>} />
              <Route path="roles" element={<PermissionGuard permission="manage_roles"><AdminRoles /></PermissionGuard>} />
              <Route path="logs" element={<PermissionGuard permission="manage_logs"><AdminLogs /></PermissionGuard>} />
            </Route>

            {/* Legacy redirect */}
            <Route path="/admin/*" element={<Navigate to="/manage/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
