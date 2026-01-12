import { useRoute, Link } from "wouter";
import { blogPosts } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotFound from "./NotFound";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:id");
  
  if (!match) return <NotFound />;

  const post = blogPosts.find(p => p.id === params.id);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/blog">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zum Blog
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Teilen
          </Button>
        </div>
      </header>

      <article className="container py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1 text-sm">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8">
            <span className="flex items-center font-medium text-slate-900">
              <User className="h-4 w-4 mr-2 text-slate-400" /> {post.author}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" /> {post.readTime} Lesezeit
            </span>
          </div>
        </div>

        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-orange-500 hover:prose-a:text-orange-600">
          <p className="lead text-xl text-slate-600 mb-8 font-medium">
            {post.excerpt}
          </p>
          <Streamdown>
            {post.content}
          </Streamdown>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Hat Ihnen dieser Artikel geholfen?</h3>
            <p className="text-slate-600 mb-6">
              Abonnieren Sie unseren Newsletter für weitere Updates.
            </p>
            <Link href="/">
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                Zum Newsletter anmelden
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
