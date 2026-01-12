import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  avatar?: string;
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Michael Schmidt",
      date: "21. Januar 2026",
      content: "Sehr hilfreicher Artikel! Besonders der Punkt mit dem AVV wird oft vergessen. Haben Sie dazu vielleicht eine Vorlage?",
      avatar: "MS"
    },
    {
      id: 2,
      author: "Sarah Weber",
      date: "22. Januar 2026",
      content: "Danke für die Zusammenfassung. Wir nutzen aktuell Langdock und sind sehr zufrieden mit den Datenschutz-Features.",
      avatar: "SW"
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const comment: Comment = {
      id: Date.now(),
      author: authorName,
      date: new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
      content: newComment,
      avatar: authorName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setAuthorName("");
    setIsSubmitting(false);
    toast.success("Kommentar erfolgreich veröffentlicht!");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mt-12">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-orange-500" />
        Kommentare ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <div className="grid gap-4">
          <div>
            <label htmlFor="author" className="text-sm font-medium text-slate-700 mb-1 block">Ihr Name</label>
            <Input
              id="author"
              placeholder="Max Mustermann"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label htmlFor="comment" className="text-sm font-medium text-slate-700 mb-1 block">Ihre Frage oder Anmerkung</label>
            <Textarea
              id="comment"
              placeholder="Schreiben Sie einen Kommentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="bg-white min-h-[100px]"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
              {isSubmitting ? "Wird gesendet..." : (
                <>
                  Kommentar senden <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Avatar className="h-10 w-10 border border-slate-200 bg-white">
              <AvatarFallback className="bg-orange-50 text-orange-600 font-medium text-sm">
                {comment.avatar || <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-slate-900">{comment.author}</h4>
                <span className="text-xs text-slate-500">{comment.date}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
