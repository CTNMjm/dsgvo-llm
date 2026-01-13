import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CookieConsent } from "./components/CookieConsent";
import { ScrollToTop } from "./components/ScrollToTop";

// Lazy-loaded pages für Code-Splitting
const Home = lazy(() => import("./pages/Home"));
const PlatformDetail = lazy(() => import("./pages/PlatformDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Profil = lazy(() => import("./pages/Profil"));
const ApiPricing = lazy(() => import("./pages/ApiPricing"));
const Vergleich = lazy(() => import("./pages/Vergleich"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading-Komponente für Suspense
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 text-sm">Laden...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/platform/:id"} component={PlatformDetail} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:id"} component={BlogPost} />
        <Route path={"/datenschutz"} component={Datenschutz} />
        <Route path={"/impressum"} component={Impressum} />
        <Route path={"/profil"} component={Profil} />
        <Route path={"/api-preise"} component={ApiPricing} />
        <Route path={"/vergleich"} component={Vergleich} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
          <ScrollToTop />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
