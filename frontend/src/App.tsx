import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

// Public pages
import Home from './app/page';
import About from './app/about/page';
import Login from './app/login/page';
import Register from './app/register/page';
import Logout from './app/logout/page';
import NewsList from './app/news/page';
import NewsDetail from './app/news/[id]/page';
import ShopList from './app/shop/page';
import ShopDetail from './app/shop/[id]/page';
import EventList from './app/event/page';
import EventDetail from './app/event/[id]/page';
import AccessPage from './app/information/access/page';
import CautionPage from './app/information/caution/page';
import GuidePage from './app/information/guide/page';
import RecyclePage from './app/information/recycle/page';
import InspectionPage from './app/inspection/page';
import NotFound from './app/not-found';

// Organization pages
import OrganizationList from './app/organization/page';
import OrganizationNew from './app/organization/new/page';
import OrganizationDetail from './app/organization/[id]/page';
import OrganizationEdit from './app/organization/[id]/edit/page';
import OrganizationDelete from './app/organization/[id]/delete/page';
import OrganizationMember from './app/organization/[id]/member/page';
import OrganizationMemberNew from './app/organization/[id]/member/new/page';
import OrganizationMemberDetail from './app/organization/[id]/member/[user_id]/page';
import OrganizationMemberDelete from './app/organization/[id]/member/[user_id]/delete/page';
import OrganizationMemberChangeOwner from './app/organization/[id]/member/[user_id]/change_owner/page';
import OrganizationNews from './app/organization/[id]/news/page';
import OrganizationNewsNew from './app/organization/[id]/news/new/page';
import OrganizationNewsDetail from './app/organization/[id]/news/[news_id]/page';
import OrganizationNewsDelete from './app/organization/[id]/news/[news_id]/delete/page';
import OrganizationShop from './app/organization/[id]/shop/page';
import OrganizationShopNew from './app/organization/[id]/shop/new/page';
import OrganizationShopDetail from './app/organization/[id]/shop/[shop_id]/page';
import OrganizationShopDelete from './app/organization/[id]/shop/[shop_id]/delete/page';
import OrganizationEvent from './app/organization/[id]/event/page';
import OrganizationEventNew from './app/organization/[id]/event/new/page';
import OrganizationEventDetail from './app/organization/[id]/event/[event_id]/page';
import OrganizationEventDelete from './app/organization/[id]/event/[event_id]/delete/page';
import OrganizationPermission from './app/organization/[id]/permission/page';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/shop" element={<ShopList />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/information/access" element={<AccessPage />} />
        <Route path="/information/caution" element={<CautionPage />} />
        <Route path="/information/guide" element={<GuidePage />} />
        <Route path="/information/recycle" element={<RecyclePage />} />
        <Route path="/inspection" element={<InspectionPage />} />

        {/* Organization routes */}
        <Route path="/organization" element={<OrganizationList />} />
        <Route path="/organization/new" element={<OrganizationNew />} />
        <Route path="/organization/:id" element={<OrganizationDetail />} />
        <Route path="/organization/:id/edit" element={<OrganizationEdit />} />
        <Route path="/organization/:id/delete" element={<OrganizationDelete />} />
        <Route path="/organization/:id/member" element={<OrganizationMember />} />
        <Route path="/organization/:id/member/new" element={<OrganizationMemberNew />} />
        <Route path="/organization/:id/member/:user_id" element={<OrganizationMemberDetail />} />
        <Route path="/organization/:id/member/:user_id/delete" element={<OrganizationMemberDelete />} />
        <Route path="/organization/:id/member/:user_id/change_owner" element={<OrganizationMemberChangeOwner />} />
        <Route path="/organization/:id/news" element={<OrganizationNews />} />
        <Route path="/organization/:id/news/new" element={<OrganizationNewsNew />} />
        <Route path="/organization/:id/news/:news_id" element={<OrganizationNewsDetail />} />
        <Route path="/organization/:id/news/:news_id/delete" element={<OrganizationNewsDelete />} />
        <Route path="/organization/:id/shop" element={<OrganizationShop />} />
        <Route path="/organization/:id/shop/new" element={<OrganizationShopNew />} />
        <Route path="/organization/:id/shop/:shop_id" element={<OrganizationShopDetail />} />
        <Route path="/organization/:id/shop/:shop_id/delete" element={<OrganizationShopDelete />} />
        <Route path="/organization/:id/event" element={<OrganizationEvent />} />
        <Route path="/organization/:id/event/new" element={<OrganizationEventNew />} />
        <Route path="/organization/:id/event/:event_id" element={<OrganizationEventDetail />} />
        <Route path="/organization/:id/event/:event_id/delete" element={<OrganizationEventDelete />} />
        <Route path="/organization/:id/permission" element={<OrganizationPermission />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
