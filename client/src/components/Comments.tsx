import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useMember } from "@/hooks/useMember";
import { LoginPrompt, MemberLogin } from "@/components/MemberLogin";

interface CommentsProps {
  postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const utils = trpc.useUtils();
  const { member, isAuthenticated, isLoading: memberLoading, refetch: refetchMember } = useMember();
  
  const { data: comments = [], isLoading } = trpc.comments.listByPost.useQuery(
    { postId },
    { enabled: !!postId }
  );

  const createComment = trpc.comments.create.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setNewComment("");
      utils.comments.listByPost.invalidate({ postId });
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Senden des Kommentars.");
    }
  });

  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !member) return;

    createComment.mutate({
      postId,
      authorName: member.name || member.email.split('@')[0],
      authorEmail: member.email,
      content: newComment
    });
  };

  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mt-12">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-orange-500" />
        Kommentare ({comments.length})
      </h3>

      {/* Comment Form - Only for logged-in members */}
      {memberLoading ? (
        <div className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : isAuthenticated && member ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-10 w-10 border border-slate-200 bg-white">
              <AvatarFallback className="bg-orange-50 text-orange-600 font-medium text-sm">
                {getInitials(member.name || member.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{member.name || member.email.split('@')[0]}</p>
              <p className="text-xs text-slate-500">{member.email}</p>
            </div>
          </div>
          <div className="grid gap-4">
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
            <p className="text-xs text-slate-500">
              Kommentare werden vor der Veröffentlichung geprüft.
            </p>
            <div className="flex justify-end">
              <Button type="submit" disabled={createComment.isPending || !newComment.trim()} className="bg-slate-900 hover:bg-slate-800 text-white">
                {createComment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gesendet...
                  </>
                ) : (
                  <>
                    Kommentar senden <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Melden Sie sich an, um einen Kommentar zu schreiben.</p>
            <MemberLogin 
              trigger={
                <Button>
                  Anmelden zum Kommentieren
                </Button>
              }
              onSuccess={() => refetchMember()}
            />
          </div>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Kommentare werden geladen...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Noch keine Kommentare. Seien Sie der Erste!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Avatar className="h-10 w-10 border border-slate-200 bg-white">
                <AvatarFallback className="bg-orange-50 text-orange-600 font-medium text-sm">
                  {getInitials(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900">{comment.authorName}</h4>
                  <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
