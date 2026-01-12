import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const { data: blogPosts = [], isLoading } = trpc.blog.list.useQuery();

  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
            </Button>
          </Link>
          <div className="font-bold text-lg">Blog & Ratgeber</div>
        </div>
      </header>

      <main className="container py-12 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Wissen für Entscheider</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Aktuelle Einblicke, Strategien und Compliance-Tipps rund um den Einsatz von KI im Unternehmen.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-8">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white/20">
                        <span className="text-6xl font-bold opacity-20">Blog</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-slate-900 hover:bg-white">
                        {post.category || 'Artikel'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {formatDate(post.publishedAt)}</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {post.readTime || '5 Min.'}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-500 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-600 mb-6 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                      <div className="flex items-center text-sm font-medium text-slate-900">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-slate-500">
                          <User className="h-4 w-4" />
                        </div>
                        {post.author}
                      </div>
                      <span className="text-orange-500 font-medium flex items-center text-sm group-hover:translate-x-1 transition-transform">
                        Artikel lesen <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && blogPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">Noch keine Blog-Artikel vorhanden.</p>
          </div>
        )}
      </main>
    </div>
  );
}
